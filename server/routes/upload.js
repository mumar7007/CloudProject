const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const auth = require('../middleware/auth');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload file to S3
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileExtension = req.file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();

    res.json({
      url: result.Location,
      key: result.Key
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// Delete file from S3
router.delete('/:key', auth, async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: req.params.key
    };

    await s3.deleteObject(params).promise();
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

module.exports = router; 