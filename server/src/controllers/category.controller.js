import Category from '../models/category.models.js';
import Product from '../models/product.models.js';

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // validate if the name exists
    if (!name || name.trim() === '') {
      return res.status(400).json({ status: 'Error', message: 'Category name is required' });
    }

    // check if the category already exists
    const categoryExists = await Category.findOne({ name: name.trim() });
    if (categoryExists) {
      return res.status(409).json({ status: 'Error', message: 'Category already exists' });
    }

    // create a new category
    const newCategory = new Category({
      name: name.trim(),
      description: description ? description.trim() : '',
    });
    // save category to the mongoose database
    await newCategory.save();

    // return the newly created category
    return res
      .status(201)
      .json({ status: 'OK', message: 'Category created successfully', category: newCategory });
  } catch (error) {
    return res.status(500).json({ status: 'Error', message: 'Internal server error' });
  }
};

// get all categories

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res
      .status(200)
      .json({ status: 'OK', message: 'Categories fetched successfully', categories });
  } catch (error) {
    return res.status(500).json({ status: 'Error', message: 'Failed to fetch categories' });
  }
};

// get category by id
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ status: 'Error', message: 'category not found' });
    }
    return res
      .status(200)
      .json({ status: 'OK', message: 'Category fetched successfully', category });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

// update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // validate name and description
    if (name === undefined && description === undefined) {
      return res.status(400).json({
        status: 'Error',
        message: 'At least name or description is required',
      });
    }

    // find category
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ status: 'Error', message: 'category not found' });
    }

    // check the new name already exists
    if (name !== undefined && name.trim() !== category.name) {
      const existing = await Category.findOne({
        name,
        _id: { $ne: id },
      });
      if (existing) {
        return res.status(409).json({
          status: 'Error',
          message: 'Category name already exists',
        });
      }
    }

    // update the category
    if (name !== undefined) {
      category.name = name.trim();
    }

    if (description !== undefined) {
      category.description = description.trim();
    }

    await category.save();
    return res.status(200).json({
      status: 'OK',
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

// delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // find category
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ status: 'Error', message: 'category not found' });
    }

    // check whether products use this category
    const productUsingCategory = await Product.findOne({ category: id });
    if (productUsingCategory) {
      return res.status(409).json({
        status: 'Error',
        message: 'product exists in this category',
      });
    }

    // delete the category
    await Category.findByIdAndDelete(id);

    return res.status(200).json({ status: 'OK', message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};
