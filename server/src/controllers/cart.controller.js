import Cart from '../models/cart.models.js';
import Product from '../models/product.models.js';

// add to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    // checks product exist or not
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'Error',
        message: 'Product not found ',
      });
    }
    // find user's cart
    const cart = await Cart.findOne({ user: userId });
    // if cart exists
    if (cart) {
      // check product already exist on cart
      const cartItem = cart.items.find((item) => item.product.toString() === productId);
      if (cartItem) {
        // increase quantity
        cartItem.quantity += 1;
      } else {
        // add new product to cart
        cart.items.push({
          product: productId,
          quantity: 1,
        });
      }
      await cart.save();
      return res.status(200).json({
        status: 'OK',
        message: 'Cart updated successfully',
        cart,
      });
    }
    // create a new cart
    const newCart = new Cart({
      user: userId,
      items: [
        {
          product: productId,
          quantity: 1,
        },
      ],
    });

    await newCart.save();

    return res
      .status(201)
      .json({ status: 'OK', message: 'cart created successfully', Cart: newCart });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

// get cart items

export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    // find the user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ status: 'Error', message: 'cart not found' });
    }

    return res.status(200).json({
      status: 'OK',
      message: 'Cart fetched successfully',
      cart,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

// update cart quantity

export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    // validate quantity
    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({
        status: 'Error',
        message: 'Quantity must be atleast 1',
      });
    }

    // find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        status: 'Error',
        message: 'Cart not found',
      });
    }
    const cartItem =  cart.items.find((item) => item.product.toString() === productId);
    if (!cartItem) {
      return res.status(404).json({ status: 'Error', message: 'item not found in cart' });
    }
    // update quantity
    cartItem.quantity = quantity;

    // save updated cart
    await cart.save();

    return res.status(200).json({
      status: 'OK',
      message: 'Cart updated successfully',
      cart
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

// remove an item from cart
export const removeFromCart = async (req,res) => {
  try {
    const userId = req.user.userId;
    const {productId} = req.params;

    // find user's cart
    const cart = await Cart.findOne({user : userId});
    if(!cart){
      return res.status(404).json({
        status: 'Error',
        message: 'Cart not found',
      })
    }
    // find the product inside cart
    const cartItem = cart.items.find(item => item.product.toString() === productId);
    if(!cartItem){
      return res.status(404).json({ status: 'Error', message: 'item not found in cart' });
    }
    // remove the product from cart
    cart.items.pull(cartItem._id)

    // save the updated cart
    await cart.save();

     return res.status(200).json({
      status: 'OK',
      message: 'product removed  successfully',
      cart
    });

  }catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
}
