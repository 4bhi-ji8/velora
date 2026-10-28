import crypto from 'crypto';
import razorpay from '../config/razorpay.js';
import Cart from '../models/cart.models.js';
import Address from '../models/address.models.js';
import { createOrderService } from '../services/order.service.js';

export const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.body;

    // validate addressId

    if (!addressId) {
      return res.status(400).json({
        status: 'Error',
        message: 'Address ID is required',
      });
    }

    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    });
    if (!address) {
      return res.status(404).json({
        status: 'Error',
        message: 'Address not found',
      });
    }

    // get users cart

    const cart = await Cart.findOne({
      user: userId,
    }).populate('items.product');

    if (!cart) {
      return res.status(404).json({
        status: 'Error',
        message: 'Cart not found',
      });
    }

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        status: 'Error',
        message: 'Cart is empty',
      });
    }

    // make sure all items exists
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({
          status: 'Error',
          message: 'One or more items in the cart are no longer available',
        });
      }
    }

    // calculate total from database prices

    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // razorpay expects amount in paise
    const amountInpaise = Math.round(totalAmount * 100);
    const options = {
      amount: amountInpaise,
      currency: 'INR',
      notes: {
        userId: userId.toString(),
        addressId: addressId.toString(),
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return res.status(201).json({
      status: 'OK',
      message: 'Razorpay order created successfully',
      order: razorpayOrder,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

// verify payment
export const verifypayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // verify fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        status: 'Error',
        message: 'Payment verification details are required',
      });
    }

    // fetch order from razorpay
    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);

    // fetch addressId from razorpay notes
    const addressId = razorpayOrder.notes.addressId;
    if (!addressId) {
      return res.status(400).json({
        status: 'Error',
        message: 'Address information not found in Razorpay order',
      });
    }

    // verify razorpay order belongs to the logged in user

    if (razorpayOrder.notes.userId !== userId.toString()) {
      return res.status(403).json({
        status: 'Error',
        message: 'Payment order does not belong to this user',
      });
    }

    // get current cart
    const cart = await Cart.findOne({
      user: userId,
    }).populate('items.product');

    if (!cart) {
      return res.status(404).json({
        status: 'Error',
        message: 'Cart not found',
      });
    }

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        status: 'Error',
        message: 'Cart is empty',
      });
    }

    // calculate the current cart amount
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({
          status: 'Error',
          message: 'One or more products in the cart are no longer available',
        });
      }
    }

    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    const amountInPaise = Math.round(totalAmount * 100);

    // compare the cart total amount with razorpay total
    if (razorpayOrder.amount !== amountInPaise) {
      return res.status(400).json({
        status: 'Error',
        message: 'Payment amount does not match the current cart total',
      });
    }

    // signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        status: 'Error',
        message: 'Invalid payment signature',
      });
    }

    const newOrder = await createOrderService(userId, addressId, {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    return res.status(200).json({
      status: 'OK',
      message: 'Payment verified and order created successfully',
      order: newOrder,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};
