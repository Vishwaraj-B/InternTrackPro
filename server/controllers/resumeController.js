const User = require('../models/User');
const Internship = require('../models/Internship');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { getGeminiModel } = require('../utils/ai');
const { AppError } = require('../middleware/errorHandler');

exports.analyzeResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.resumeUrl) {
      return next(new AppError('Please upload a resume first', 400));
    }

    const cleanUrl = user.resumeUrl.replace(/^\//, '');
    const filePath = path.join(__dirname, '..', cleanUrl);
    if (!fs.existsSync(filePath)) {
      return next(new AppError('Resume file not found on server', 404));
    }

    const dataBuffer = fs.readFileSync(filePath);
    let resumeText = '';
    try {
      const data = await pdfParse(dataBuffer);
      resumeText = data.text;
    } catch (parseErr) {
      console.error(parseErr);
      return next(new AppError('Unable to read PDF file', 400));
    }

    const model = getGeminiModel();
    const prompt = `Analyze this resume and provide:
1. Overall score out of 100
2. Key Strengths
3. Areas for Improvement
4. Suggested Keywords to Add
Format the response as a valid JSON object with the following keys:
{ "score": Number, "strengths": [String], "improvements": [String], "keywords": [String] }

Resume Text:
${resumeText}`;

    const result = await model.generateContent(prompt);
    let output = result.response.text();
    output = output.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(output);

    res.json({ success: true, analysis: parsedData });
  } catch (error) {
    console.error('Resume Analysis Error:', error);
    next(new AppError(error.message || 'Failed to analyze resume', 500));
  }
};

exports.scoreATS = async (req, res, next) => {
  try {
    const { internshipId } = req.body;
    if (!internshipId) return next(new AppError('Internship ID required', 400));

    const user = await User.findById(req.user._id);
    if (!user || !user.resumeUrl) {
      return next(new AppError('Please upload a resume first', 400));
    }

    const internship = await Internship.findById(internshipId);
    if (!internship) return next(new AppError('Internship not found', 404));

    const cleanUrl = user.resumeUrl.replace(/^\//, '');
    const filePath = path.join(__dirname, '..', cleanUrl);
    if (!fs.existsSync(filePath)) {
         return next(new AppError('Resume file not found on server', 404));
    }

    const dataBuffer = fs.readFileSync(filePath);
    let resumeText = '';
    try {
        const data = await pdfParse(dataBuffer);
        resumeText = data.text;
    } catch (parseErr) {
        return next(new AppError('Unable to read PDF file', 400));
    }

    const model = getGeminiModel();
    const prompt = `Act as an ATS (Applicant Tracking System). Compare this resume against the internship requirements and provide:
1. ATS Match Score (0 to 100 matching percentage)
2. Missing Keywords (keywords from the job description not found in resume)
3. Matching Keywords (keywords successfully found)
4. Brief Recommendation on whether the candidate is a good fit.
Format the response exactly as a JSON object:
{ "matchScore": Number, "missingKeywords": [String], "matchingKeywords": [String], "recommendation": String }

Job Details:
Title: ${internship.title}
Company: ${internship.company}
Description: ${internship.description}
Requirements: ${internship.requirements ? internship.requirements.join(', ') : ''}

Resume Text:
${resumeText}`;

    const result = await model.generateContent(prompt);
    let output = result.response.text();
    output = output.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(output);

    res.json({ success: true, atsResult: parsedData });
  } catch (error) {
    console.error('ATS Score Error:', error);
    next(new AppError(error.message || 'Failed to calculate ATS score', 500));
  }
};
