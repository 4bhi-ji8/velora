import bcrypt from 'bcrypt';
import User from '../models/user.models.js';
import jwt from 'jsonwebtoken';

// register user

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ status: 'Error', message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ status: 'Error', message: 'User already exists' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ fullName, email, phone, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ status: 'OK', message: 'User registered successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ status: 'Error', message: 'An error occurred while registering the user' });
  }
};

// Login user

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'Error', message: 'All fields  are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '2h',
      },
    );
    res.status(200).json({ status: 'OK', message: 'User logged in successfully', token });
  } catch (error) {
    res
      .status(500)
      .json({ status: 'Error', message: 'An error occurred while logging in the user' });
  }
};

// logout
export const logoutUser = (req, res) => {
  try {
    res.status(200).json({
      status: 'OK',
      message: 'User logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Failed to logout',
    });
  }
};

// get profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // find the user details using that id
    const userProfile = await User.findById(userId).select('-password');

    if (!userProfile) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found',
      });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update profile

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, email, phone } = req.body;

    // find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found',
      });
    }
    // validate atleast one field
    if (fullName === undefined && email === undefined && phone === undefined) {
      return res.status(400).json({
        success: false,
        message: 'At least one field is required',
      });
    }

    // validate fullname
    if (fullName !== undefined && fullName.trim() === '') {
      return res.status(400).json({
        status: 'Error',
        message: 'Full name cannot be empty',
      });
    }

    // validate phone
    if (phone !== undefined && phone.trim() === '') {
      return res.status(400).json({
        status: 'Error',
        message: 'Phone cannot be empty',
      });
    }

    // validate email
    if (email !== undefined) {
      if (email.trim() === '') {
        return res.status(400).json({
          status: 'Error',
          message: 'Email cannot be empty',
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // check another user already has this email
      const emailExist = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: userId },
      });

      if (emailExist) {
        return res.status(409).json({
          status: 'Error',
          message: 'This email is already registered',
        });
      }

      user.email = normalizedEmail;
    }

    // update the user details
    if (fullName !== undefined) {
      user.fullName = fullName.trim();
    }
    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    // save the updated user
    await user.save();

    // get updated profile without password
    const updatedUser = await User.findById(userId).select('-password');
    return res.status(200).json({
      status: 'OK',
      message: 'user profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update password
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found',
      });
    }

    //  check fileds are provided
    if (currentPassword === undefined || newPassword === undefined || currentPassword.trim() === '' || newPassword.trim() === '') {
      return res.status(400).json({
        status: 'Error',
        message: 'Both current and new password are required',
      });
    }

    // validate the new password's length
    if (newPassword.length < 6) {
      return res.status(400).json({
        status: 'Error',
        message: 'New password must be at least 6 characters long',
      });
    }


    // check current password

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'Error',
        message: 'Current password is incorrect',
      });
    }

    // hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // update the password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
