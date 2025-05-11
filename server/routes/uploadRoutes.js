const express = require('express');
const router = express.Router();
const { upload, uploadFile, uploadMultipleFiles } = require('../src/controllers/uploadController');

// Route for single file upload
router.post('/single', upload.single('file'), uploadFile);

// Route for multiple file upload
router.post('/multiple', upload.array('files', 5), uploadMultipleFiles);

module.exports = router; 