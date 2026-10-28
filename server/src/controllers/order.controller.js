import Address from '../models/address.models.js';
import Cart from '../models/cart.models.js';
import Order from '../models/order.models.js';
import { createOrderService } from '../services/order.service.js';

// create order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.body;

    // validate shipping address
    if (!addressId) {
      return res.status(404).json({
        status: 'Error',
        message: 'address id is required',
      });
    }

    // create order using service
    const newOrder = await createORderService(userId,addressId);
    return res.status(201).json({
      status: 'OK',
      message: 'Order placed successfully',
      order: newOrder,
    });
    
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

// get orders

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    // find all orders belonging to this user
    const orders = await Order.find({ user: userId });
    if (orders.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'orders not found',
      });
    }
    return res.status(200).json({ message: 'Orders fetched successfully', orders });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

// get all orders for admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    return res.status(200).json({
      status: 'OK',
      message: 'All orders fetched successfully',
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

// get a single order by orderId

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    // find the order
    const order = await Order.findOne({
      _id: id,
      user: userId,
    });
    if (!order) {
      return res.status(404).json({
        status: 'Error',
        message: 'order not found or unauthorized',
      });
    }

    return res.status(200).json({ message: 'Order fetched successfully', order });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

// cancell an order

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    // find order belonging to user
    const order = await Order.findOne({
      _id: id,
      user: userId,
    });
    if (!order) {
      return res.status(404).json({
        status: 'Error',
        message: 'order not found or unauthorized',
      });
    }

    // check whether the order can be cancelled
    if (order.status !== 'Pending') {
      return res.status(404).json({
        status: 'Error',
        message: 'order cannot be cancelled',
      });
    }
    // change the status to cancelled
    order.status = 'Cancelled';

    // save the order
    await order.save();

    return res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

// admin order status controller

export const adminConfirmation = async (req, res) => {
  try {
    const { id } = req.params;
    const { nextStatus } = req.body;

    // validate next status
    if (!nextStatus) {
      return res.status(400).json({
        status: 'Error',
        message: 'Next status is required',
      });
    }

    // find order 
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        status: 'Error',
        message: 'order not found ',
      });
    }

    const currentStatus = order.status;

    // validation mapping

    const validStatuses = {
      Pending: ['Confirmed', 'Cancelled'],
      Confirmed: ['Shipped', 'Cancelled'],
      Shipped: ['Delivered'],
      Delivered: [],
      Cancelled: [],
    };

    if (!validStatuses[currentStatus].includes(nextStatus)) {
      return res.status(400).json({
        message: `Invalid transition! An order in '${currentStatus}' status cannot jump to '${nextStatus}'.`,
      });
    }

    // update status
    order.status = nextStatus;

    await order.save();

    return res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};
