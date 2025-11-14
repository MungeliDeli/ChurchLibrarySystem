const db = require('../../models');

// Create a new Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, parentCategoryId } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const newCategory = await db.Category.create({
      name,
      description,
      parentCategoryId,
    });

    res.status(201).json({
      message: 'Category created successfully.',
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category.', error: error.message });
  }
};

// Get all Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await db.Category.findAll({
      order: [['name', 'ASC']],
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories.', error: error.message });
  }
};

// Update a Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await db.Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const updatedCategory = await category.update(req.body);

    res.status(200).json({
      message: 'Category updated successfully.',
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category.', error: error.message });
  }
};

// Delete a Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await db.Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    // Check if any books are using this category
    const booksInCategory = await db.LibraryItem.count({ where: { categoryId: id } });

    if (booksInCategory > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category "${category.name}" because it is currently in use by ${booksInCategory} book(s).` 
      });
    }

    await category.destroy();

    res.status(200).json({ message: 'Category deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category.', error: error.message });
  }
};