const s3 = require('../config/s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Configure multer for S3 upload
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `${uniqueSuffix}-${file.originalname}`);
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images and documents
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.'));
        }
    }
});

// Upload single file
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        res.status(200).json({
            message: 'File uploaded successfully',
            fileUrl: req.file.location,
            fileName: req.file.key
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Error uploading file' });
    }
};

// Upload multiple files
const uploadMultipleFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const fileUrls = req.files.map(file => ({
            url: file.location,
            key: file.key
        }));

        res.status(200).json({
            message: 'Files uploaded successfully',
            files: fileUrls
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Error uploading files' });
    }
};

module.exports = {
    upload,
    uploadFile,
    uploadMultipleFiles
}; 