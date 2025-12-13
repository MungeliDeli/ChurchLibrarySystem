const db = require('../../models');
const { uploadFileToS3, getSignedUrlForS3Key, deleteFileFromS3 } = require('../utils/s3');
const { generateThumbnailFromPdf, generateThumbnailFromEpub } = require('../utils/thumbnail');
const fs = require('fs');
const path = require('path');

const { v4: uuidv4 } = require('uuid');

const sanitizeTitleForFilename = (title) => {
  if (!title) {
    return '';
  }
  return title.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-.]/g, '')
    .replace(/--+/g, '-');
};

// Create a new Library Item
exports.createItem = async (req, res) => {
  console.log("--- Create Book Request ---");
  try {
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    const { title, authors, description, publicationDate, format, categoryId } = req.body;

    // Basic validation
    if (!title || !format || !categoryId) {
      return res.status(400).json({ message: 'Title, format, and categoryId are required.' });
    }

    // Check if category exists
    const category = await db.Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const itemData = {
      title,
      authors: authors ? authors.split(',').map(s => s.trim()) : [], // Parse string to array
      description,
      publicationDate,
      format,
      categoryId,
    };

    // If a file is uploaded, send it to S3 and get the key
    if (req.file) {
      console.log("File found, attempting to upload to S3...");
      const sanitizedTitle = sanitizeTitleForFilename(title);
      const fileExtension = req.file.originalname.split('.').pop();
      const bookFileName = `${sanitizedTitle}.${fileExtension}`;

      const fileKey = await uploadFileToS3(req.file, bookFileName);
      itemData.fileUrl = fileKey; // Storing the key in fileUrl
      console.log("S3 Upload successful. Key:", fileKey);

      // --- Thumbnail Generation ---
      const tempDir = path.join(__dirname, '..', '..', 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      let tempFilePath;
      try {
        if (req.file.mimetype === 'application/pdf') {
          tempFilePath = path.join(tempDir, `${uuidv4()}.pdf`);
          fs.writeFileSync(tempFilePath, req.file.buffer);
          const thumbnailPath = await generateThumbnailFromPdf(tempFilePath, tempDir);
          const thumbnailFileName = `${sanitizedTitle}-thumbnail.jpg`;
          const thumbnailFile = {
            path: thumbnailPath,
            originalname: path.basename(thumbnailPath),
            mimetype: 'image/jpeg',
            buffer: fs.readFileSync(thumbnailPath)
          };
          const thumbnailKey = await uploadFileToS3(thumbnailFile, thumbnailFileName);
          itemData.coverImageUrl = thumbnailKey;
          console.log("PDF Thumbnail Upload successful. Key:", thumbnailKey);
          fs.unlinkSync(thumbnailPath);

        } else if (req.file.mimetype === 'application/epub+zip') {
          tempFilePath = path.join(tempDir, `${uuidv4()}.epub`);
          fs.writeFileSync(tempFilePath, req.file.buffer);
          const thumbnailPath = await generateThumbnailFromEpub(tempFilePath, tempDir);
          const thumbnailFileName = `${sanitizedTitle}-thumbnail${path.extname(thumbnailPath)}`;
          const thumbnailFile = {
            path: thumbnailPath,
            originalname: path.basename(thumbnailPath),
            mimetype: `image/${path.extname(thumbnailPath).substring(1)}`,
            buffer: fs.readFileSync(thumbnailPath)
          };
          const thumbnailKey = await uploadFileToS3(thumbnailFile, thumbnailFileName);
          itemData.coverImageUrl = thumbnailKey;
          console.log("EPUB Thumbnail Upload successful. Key:", thumbnailKey);
          fs.unlinkSync(thumbnailPath);
        }
      } catch (thumbError) {
        console.error("--- ERROR generating thumbnail ---", thumbError);
        // Proceed without a thumbnail
      } finally {
        if (tempFilePath && fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath); // Clean up the temporary file
        }
      }
    } else {
      console.log("No file found in request.");
    }

    const newItem = await db.LibraryItem.create(itemData);

    res.status(201).json({
      message: 'Library item created successfully.',
      item: newItem,
    });
  } catch (error) {
    console.error("--- ERROR in Create Book ---", error);
    res.status(500).json({ message: 'Error creating library item.', error: error.message });
  }
};

// Get all Library Items
exports.getAllItems = async (req, res) => {
  try {
    const items = await db.LibraryItem.findAll({
      include: [{
        model: db.Category,
        attributes: ['name', 'description'],
      }],
      order: [['createdAt', 'DESC']],
    });

    // Generate pre-signed URLs for each item
    const itemsWithUrls = await Promise.all(items.map(async (item) => {
      const plainItem = item.get({ plain: true });
      console.log('Item from DB:', plainItem.title, 'Cover Image Key:', plainItem.coverImageUrl);
      if (plainItem.fileUrl) {
        plainItem.downloadUrl = await getSignedUrlForS3Key(plainItem.fileUrl);
      }
      if (plainItem.coverImageUrl) {
        plainItem.coverImageUrl = await getSignedUrlForS3Key(plainItem.coverImageUrl);
      }
      console.log('Item after signing:', plainItem.title, 'Cover Image URL:', plainItem.coverImageUrl);
      return plainItem;
    }));

    res.status(200).json(itemsWithUrls);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving library items.', error: error.message });
  }
};

// Get a single Library Item by ID
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await db.LibraryItem.findByPk(id, {
      include: [{
        model: db.Category,
        attributes: ['name', 'description'],
      }],
    });

    if (!item) {
      return res.status(404).json({ message: 'Library item not found.' });
    }

    const plainItem = item.get({ plain: true });
    if (plainItem.fileUrl) {
      plainItem.downloadUrl = await getSignedUrlForS3Key(plainItem.fileUrl);
    }
    if (plainItem.coverImageUrl) {
      plainItem.coverImageUrl = await getSignedUrlForS3Key(plainItem.coverImageUrl);
    }

    res.status(200).json(plainItem);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving library item.', error: error.message });
  }
};

// Update a Library Item
exports.updateItem = async (req, res) => {
  console.log("--- Update Book Request ---");
  try {
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    const { id } = req.params;
    const item = await db.LibraryItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: 'Library item not found.' });
    }

    const updateData = req.body;

    // Parse authors string to array if it exists
    if (typeof updateData.authors === 'string') {
      updateData.authors = updateData.authors ? updateData.authors.split(',').map(s => s.trim()) : [];
    }

    // If a new file is uploaded, delete the old one and upload the new one
    if (req.file) {
      console.log("New file found, attempting to upload to S3...");
      // Delete the old file from S3 if it exists
      if (item.fileUrl) {
        await deleteFileFromS3(item.fileUrl);
      }
      // Delete the old cover image from S3 if it exists
      if (item.coverImageUrl) {
        await deleteFileFromS3(item.coverImageUrl);
      }

      const sanitizedTitle = sanitizeTitleForFilename(updateData.title || item.title);
      const fileExtension = req.file.originalname.split('.').pop();
      const bookFileName = `${sanitizedTitle}.${fileExtension}`;

      const fileKey = await uploadFileToS3(req.file, bookFileName);
      updateData.fileUrl = fileKey;
      console.log("S3 Upload successful. Key:", fileKey);

      // Generate thumbnail for PDF or EPUB
      const tempDir = path.join(__dirname, '..', '..', 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      let tempFilePath;
      try {
        if (req.file.mimetype === 'application/pdf') {
          tempFilePath = path.join(tempDir, `${uuidv4()}.pdf`);
          fs.writeFileSync(tempFilePath, req.file.buffer);

          const thumbnailPath = await generateThumbnailFromPdf(tempFilePath, tempDir);
          const thumbnailFileName = `${sanitizedTitle}-thumbnail.jpg`;
          const thumbnailFile = {
            path: thumbnailPath,
            originalname: path.basename(thumbnailPath),
            mimetype: 'image/jpeg',
            buffer: fs.readFileSync(thumbnailPath)
          };
          const thumbnailKey = await uploadFileToS3(thumbnailFile, thumbnailFileName);
          updateData.coverImageUrl = thumbnailKey;
          console.log("PDF Thumbnail Upload successful. Key:", thumbnailKey);
          fs.unlinkSync(thumbnailPath);

        } else if (req.file.mimetype === 'application/epub+zip') {
          tempFilePath = path.join(tempDir, `${uuidv4()}.epub`);
          fs.writeFileSync(tempFilePath, req.file.buffer);

          const thumbnailPath = await generateThumbnailFromEpub(tempFilePath, tempDir);
          const thumbnailFileName = `${sanitizedTitle}-thumbnail${path.extname(thumbnailPath)}`;
          const thumbnailFile = {
            path: thumbnailPath,
            originalname: path.basename(thumbnailPath),
            mimetype: `image/${path.extname(thumbnailPath).substring(1)}`,
            buffer: fs.readFileSync(thumbnailPath)
          };
          const thumbnailKey = await uploadFileToS3(thumbnailFile, thumbnailFileName);
          updateData.coverImageUrl = thumbnailKey;
          console.log("EPUB Thumbnail Upload successful. Key:", thumbnailKey);
          fs.unlinkSync(thumbnailPath);
        }
      } catch (thumbError) {
        console.error("--- ERROR generating thumbnail ---", thumbError);
        // Proceed without a thumbnail
      } finally {
        if (tempFilePath && fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath); // Clean up the temporary file
        }
      }
    } else {
      console.log("No new file found in request.");
    }

    // Update the item with data from request body
    const updatedItem = await item.update(updateData);

    res.status(200).json({
      message: 'Library item updated successfully.',
      item: updatedItem,
    });
  } catch (error) {
    console.error("--- ERROR in Update Book ---", error);
    res.status(500).json({ message: 'Error updating library item.', error: error.message });
  }
};

// Delete a Library Item
exports.deleteItem = async (req, res) => {
  console.log("--- Delete Book Request ---");
  try {
    const { id } = req.params;
    console.log("Attempting to delete item with ID:", id);

    const item = await db.LibraryItem.findByPk(id);

    if (!item) {
      console.log("Item not found with ID:", id);
      return res.status(404).json({ message: 'Library item not found.' });
    }
    console.log("Item found:", item.title);

    // Delete the file from S3 if it exists
    if (item.fileUrl) {
      console.log("Deleting file from S3:", item.fileUrl);
      await deleteFileFromS3(item.fileUrl);
    }
    // Delete the cover image from S3 if it exists
    if (item.coverImageUrl) {
      console.log("Deleting cover image from S3:", item.coverImageUrl);
      await deleteFileFromS3(item.coverImageUrl);
    }

    await item.destroy();
    console.log("Item destroyed successfully from database.");

    res.status(200).json({ message: 'Library item deleted successfully.' });
  } catch (error) {
    console.error("--- ERROR in Delete Book ---", error);
    res.status(500).json({ message: 'Error deleting library item.', error: error.message });
  }
};