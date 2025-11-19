const db = require('../../models');
const { uploadFileToS3 } = require('../utils/s3');

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

    // If a file is uploaded, send it to S3 and get the URL
    if (req.file) {
      console.log("File found, attempting to upload to S3...");
      const fileUrl = await uploadFileToS3(req.file);
      itemData.fileUrl = fileUrl;
      console.log("S3 Upload successful. URL:", fileUrl);
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
    res.status(200).json(items);
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

    res.status(200).json(item);
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

    // If a new file is uploaded, send it to S3 and get the URL
    if (req.file) {
      console.log("File found, attempting to upload to S3...");
      const fileUrl = await uploadFileToS3(req.file);
      updateData.fileUrl = fileUrl;
      console.log("S3 Upload successful. URL:", fileUrl);
    } else {
      console.log("No file found in request.");
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
  try {
    const { id } = req.params;
    const item = await db.LibraryItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: 'Library item not found.' });
    }

    await item.destroy();

    res.status(200).json({ message: 'Library item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting library item.', error: error.message });
  }
};