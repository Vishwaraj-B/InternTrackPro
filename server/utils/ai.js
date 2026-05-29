const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } else {
    console.warn("⚠️ GEMINI_API_KEY is not set in .env. AI features will not work.");
  }
} catch (error) {
  console.error("AI Initialization Error:", error);
}

const getGeminiModel = () => {
  if (!genAI) {
    throw new Error('Google Generative AI is not initialized. Please configure GEMINI_API_KEY.');
  }
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

module.exports = {
  getGeminiModel
};
