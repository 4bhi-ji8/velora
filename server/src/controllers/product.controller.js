import Category from '../models/category.models.js';
import Product from '../models/product.models.js';

export const createProduct = async (req, res) => {
  try {
    // req body
    const { name, description, image, price, category, stock } = req.body;

    // validate required fields
    if (
      !name ||
      !description ||
      !image ||
      price === undefined ||
      !category ||
      stock === undefined
    ) {
      return res.status(400).json({ status: 'Error', message: 'All fields are required' });
    }
    // check if the category actually exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ status: 'Error', message: 'Category not found' });
    }
    // check if the product already exists
    const productExists = await Product.findOne({ name: name.trim() });
    if (productExists) {
      return res.status(409).json({ status: 'Error', message: 'Product already exists' });
    }
    // create a new product
    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      image: image.trim(),
      price,
      category,
      stock,
    });
    // save the product to the database
    await newProduct.save();

    // return the newly added product
    return res
      .status(201)
      .json({ status: 'OK', message: 'Product created successfully', product: newProduct });
  } catch (error) {
    return res.status(500).json({ status: 'Error', message: 'Internal server error' });
  }
};

// get all products
export const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page, limit } = req.query;

    let query = {};

    // search by name or description
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      };
    }

    // filter by category

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ status: 'Error', message: 'Category not found' });
      }
      query.category = category;
    }

    // filter by price range
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // ascending or descending order
    let sortOption = {};
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    }
    if (sort === 'price_dec') {
      sortOption = { price: -1 };
    }

    // pagination

    const currentPage = Number(page) || 1;
    const itemsPerPage = Number(limit) || 20;

    const skip = (currentPage - 1) * itemsPerPage;

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(itemsPerPage)
      .populate('category');

    return res.status(200).json({
      status: 'OK',
      message: 'Products fetched successfully',
      products,
      pagination: {
        currentPage,
        itemsPerPage,
        totalProducts,
        totalPages,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: 'Error', message: 'Internal server error' });
  }
};

// get product by id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // find the product
    const product = await Product.findById(id).populate('category');

    if (!product) {
      return res.status(404).json({ status: 'Error', message: 'Product not found' });
    }

    return res.status(200).json({ status: 'OK', message: 'Product fetched successfully', product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'Error', message: 'Internal server error' });
  }
};

// update a product by id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, price, category, stock } = req.body;

    // find the product if its exists or not
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ status: 'Error', message: 'Product not found' });
    }

    // update the product fields
    if (name) product.name = name.trim();
    if (description) product.description = description.trim();
    if (image !== undefined) {
      if (typeof image !== 'string' || !image.trim()) {
        return res.status(400).json({
          status: 'Error',
          message: 'Image URL cannot be empty',
        });
      }

      product.image = image.trim();
    }
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({ status: 'Error', message: 'Price cannot be negative' });
      }
      product.price = price;
    }
    if (category) {
      // check if category exists
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ status: 'Error', message: 'Category not found' });
      }
      product.category = category;
    }
    if (stock !== undefined) {
      if (typeof stock !== 'number' || !Number.isFinite(stock) || stock < 0) {
        return res.status(400).json({
          status: 'Error',
          message: 'Stock must be a non-negative number',
        });
      }

      product.stock = stock;
    }
    // save the updated product
    await product.save();
    return res
      .status(200)
      .json({ status: 'OK', message: 'Product updated successfully', product: product });
  } catch (error) {
    return res.status(500).json({ status: 'Error', message: 'Internal server error' });
  }
};

// delete a product by id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // delete the product
    const deleteProduct = await Product.findByIdAndDelete(id);

    return res.status(200).json({ status: 'OK', message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ status: 'Error', message: 'Internal server error' });
  }
};

// admin product stock update
export const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const numericStock = Number(stock);

    // validate stock value
    if (
      stock === null ||
      stock === undefined ||
      stock === '' ||
      isNaN(numericStock) ||
      numericStock < 0 ||
      !Number.isInteger(numericStock)
    ) {
      return res.status(400).json({
        status: 'Error',
        message: 'invalid stock value',
      });
    }

    // find the product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        status: 'Error',
        message: 'product not found',
      });
    }

    // update
    product.stock = numericStock;

    await product.save();
    return res.status(200).json({
      status: 'OK',
      message: 'Product stock updated successfully',
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};
