const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDir = (dir) => {
  const fullPath = path.join(__dirname, '..', 'uploads', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  return fullPath;
};

// Resume upload config
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ensureDir('resumes'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `resume_${req.user._id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Submission file upload config
const submissionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ensureDir('submissions'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `submission_${req.user._id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported. Allowed: PDF, DOC, DOCX, JPG, PNG, GIF, TXT, ZIP'), false);
  }
};

const uploadResume = multer({
  storage: resumeStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadSubmission = multer({
  storage: submissionStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = { uploadResume, uploadSubmission };
