import Product from '../models/product.models.js';
import Wishlist from '../models/wishlist.models.js';

// POST wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    // check the product exists or not
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: 'Error', message: 'Product not found' });
    }
    // find the wishlist already exists
    const wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
      // check if the existing wishlist already have the product
      const productExists = wishlist.products.some((id) => id.toString() === productId);
      if (productExists) {
        return res.status(409).json({
          status: 'Error',
          message: 'Product already exists in wishlist',
        });
      }
      // Add product to existing wishlist
      wishlist.products.push(productId);
      await wishlist.save();
      return res.status(200).json({
        status: 'OK',
        message: 'Product added to wishlist',
        wishlist,
      });
    }
    // create a new wishlist
    const newWishlist = new Wishlist({
      user: userId,
      products: [productId],
    });
    // save the new wishlist
    await newWishlist.save();

    return res
      .status(201)
      .json({ status: 'OK', message: 'wishlist created successfully', Wishlist: newWishlist });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
    });
  }
};

// GET wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    // find the wishlist belong to the logged-in user
    const wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: 'products',
      populate: {
        path: 'category',
      },
    });
    if (!wishlist) {
      return res.status(404).json({
        status: 'error',
        message: 'wishlist not found',
      });
    }

    return res
      .status(200)
      .json({ status: 'OK', message: 'wishlist fetched successfully', wishlist });
  } catch (error) {
    return res.status(500).json({ status: 'Error', message: 'Internal server error' });
  }
};

// DELETE from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    // find users wishlist
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({
        status: 'Error',
        message: 'Wishlist not found',
      });
    }
    // check if the product exists in wishlist
    const productExists = wishlist.products.some((id) => id.toString() === productId);
    if (!productExists) {
      return res.status(409).json({
        status: 'Error',
        message: 'Product not found in wishlist',
      });
    }
    // remove product from wishlist
    wishlist.products.pull(productId);

    // save updated wishlist
    await wishlist.save();

    return res
      .status(200)
      .json({ status: 'OK', message: 'product removed from wishlist', wishlist });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};
