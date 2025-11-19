const multer = require('multer');

// Configure multer to use memory storage.
// This is useful for processing files before uploading them to a cloud service like S3,
// as it avoids saving them to the local disk.
const storage = multer.memoryStorage();

// We can also add file type filters if needed.
const fileFilter = (req, file, cb) => {
  // For now, we'll accept all files, but this is where you could restrict file types.
  // Example:
  // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
  //   cb(null, true);
  // } else {
  //   cb(new Error('Invalid file type'), false);
  // }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // Limit file size to 100MB for example
    fileSize: 1024 * 1024 * 100,
  },
});

module.exports = upload;