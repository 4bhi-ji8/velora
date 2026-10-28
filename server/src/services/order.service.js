import Address from '../models/address.models.js';
import Cart from '../models/cart.models.js';
import Order from '../models/order.models.js';

export const createOrderService = async (userId, addressId, paymentDetails) => {
  const { razorpayOrderId, razorpayPaymentId } = paymentDetails;

  if (!razorpayOrderId || !razorpayPaymentId) {
    throw new Error('Payment details are required');
  }

  const existingOrder = await Order.findOne({
    $or: [{ razorpayOrderId }, { razorpayPaymentId }],
  });

  if (existingOrder) {
    throw new Error('This payment has already been processed');
  }

  const session = await Order.startSession();

  try {
    session.startTransaction();

    // find users selected address
    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    }).session(session);

    if (!address) {
      throw new Error('address not found');
    }

    // find users cart
    const cart = await Cart.findOne({
      user: userId,
    })
      .populate('items.product')
      .session(session);

    if (!cart) {
      throw new Error('cart not found');
    }

    // check if cart is empty

    if (!cart.items || cart.items.length === 0) {
      throw new Error('cart is empty');
    }

    // validate products and stock
    for (const item of cart.items) {
      if (!item.product) {
        throw new Error('one or more products in your cart is no longer exist');
      }
      if (item.quantity > item.product.stock) {
        throw new Error(`Not enough stock for ${item.product.name}`);
      }
    }

    // calculate total
    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // build order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    //create shipping address snapshot
    const shippingAddress = {
      fullName: address.fullName,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    };

    //Create order
    const newOrder = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,

      razorpayOrderId,
      razorpayPaymentId,
    });

    //Reduce product stock
    for (const item of cart.items) {
      item.product.stock -= item.quantity;
      await item.product.save({ session });
    }

    //Save order
    await newOrder.save({ session });

    //Clear cart
    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } }, { session });

    // Commit transaction
    await session.commitTransaction();

    return newOrder;
  } catch (error) {
    // Rollback everything if anything failed
    await session.abortTransaction();

    throw error;
  } finally {
    // Always close the session
    await session.endSession();
  }
};
