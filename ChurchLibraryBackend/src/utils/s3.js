require('dotenv').config();
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

/**
 * Uploads a file to S3 and returns the S3 key.
 * @param {object} file - The file object from multer (req.file).
 * @returns {Promise<string>} The S3 key of the uploaded file.
 */
const uploadFileToS3 = async (file) => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    return fileName; // Return the key instead of the full URL
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to S3.");
  }
};

/**
 * Generates a pre-signed URL for an S3 object.
 * @param {string} key - The S3 key of the file.
 * @returns {Promise<string>} The pre-signed URL.
 */
const getSignedUrlForS3Key = async (key) => {
  if (!key) {
    return null;
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    // The URL will be valid for 1 hour (3600 seconds)
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
};

/**
 * Deletes a file from S3.
 * @param {string} key - The S3 key of the file to delete.
 * @returns {Promise<void>}
 */
const deleteFileFromS3 = async (key) => {
  if (!key) {
    return;
  }

  const deleteParams = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    console.error("Error deleting from S3:", error);
    // We don't throw an error here, just log it.
    // Deleting the DB entry is more important.
  }
};


module.exports = { uploadFileToS3, getSignedUrlForS3Key, deleteFileFromS3 };
