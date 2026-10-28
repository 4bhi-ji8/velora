import Address from '../models/address.models.js';

export const createAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, phone, addressLine, city, state, pincode } = req.body;

    // validate the fields
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !addressLine.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim()
    ) {
      return res.status(400).json({ status: 'Error', message: 'All fields are required' });
    }

    // check if the user already has an address
    const existingAddress = await Address.findOne({
      user: userId,
    });

    // first address will be default
    const isDefault = !existingAddress;

    // create the address
    const address = new Address({
      user: userId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressLine: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      isDefault,
    });

    // save
    await address.save();
    return res.status(201).json({ status: 'OK', message: 'Address created successfully', address });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
};

// get address

export const getAddress = async (req, res) => {
  try {
    const userId = req.user.userId;

    // find the address
    const addresses = await Address.find({
      user: userId,
    });
    if (!addresses || addresses.length === 0) {
      return res.status(404).json({ status: 'Error', message: 'no address found' });
    }
    return res.status(200).json({
      status: 'OK',
      message: 'Addresses fetched successfully',
      addresses,
    });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
};

// get address by id
export const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // find the address
    const address = await Address.findOne({
      user: userId,
      _id: id,
    });
    if (!address) {
      return res.status(404).json({ status: 'Error', message: 'address not found' });
    }
    return res.status(200).json({ status: 'OK', message: 'Address fetched successfully', address });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

// update address
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { fullName, phone, addressLine, city, state, pincode } = req.body;

    // validate the fields
    if (
      fullName === undefined &&
      phone === undefined &&
      addressLine === undefined &&
      city === undefined &&
      state === undefined &&
      pincode === undefined
    ) {
      return res.status(400).json({ status: 'Error', message: 'At least one field is required' });
    }
    // validate fullname
    if (fullName !== undefined && !fullName.trim()) {
      return res.status(400).json({ status: 'Error', message: 'Full name cannot be empty' });
    }
    // validate phone
    if (phone !== undefined && !phone.trim()) {
      return res.status(400).json({ status: 'Error', message: 'Phone cannot be empty' });
    }
    // validate addressLine
    if (addressLine !== undefined && !addressLine.trim()) {
      return res.status(400).json({ status: 'Error', message: 'Address line cannot be empty' });
    }
    // validate city
    if (city !== undefined && !city.trim()) {
      return res.status(400).json({ status: 'Error', message: 'City cannot be empty' });
    }
    // validate state
    if (state !== undefined && !state.trim()) {
      return res.status(400).json({ status: 'Error', message: 'State cannot be empty' });
    }
    // validate pincode
    if (pincode !== undefined && !pincode.trim()) {
      return res.status(400).json({ status: 'Error', message: 'Pincode cannot be empty' });
    }

    // find the address
    const address = await Address.findOne({
      user: userId,
      _id: id,
    });
    if (!address) {
      return res.status(404).json({ status: 'Error', message: 'address not found' });
    }

    // update the address
    if (fullName !== undefined) {
      address.fullName = fullName.trim();
    }
    if (phone !== undefined) {
      address.phone = phone.trim();
    }
    if (addressLine !== undefined) {
      address.addressLine = addressLine.trim();
    }
    if (city !== undefined) {
      address.city = city.trim();
    }
    if (state !== undefined) {
      address.state = state.trim();
    }
    if (pincode !== undefined) {
      address.pincode = pincode.trim();
    }

    // save the updated address
    await address.save();

    return res.status(200).json({ status: 'OK', message: 'Address updated successfully', address });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

// Delete address

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // find the adddress
    const address = await Address.findOne({
      user: userId,
      _id: id,
    });
    if (!address) {
      return res.status(404).json({ status: 'Error', message: 'address not found' });
    }

    // check if the address is default
    const wasDefault = address.isDefault;

    if (wasDefault) {
      // find another address to set as default
      const anotherAddress = await Address.findOne({
        user: userId,
        _id: { $ne: id },
      });
      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }
    // delete the address
    await Address.findByIdAndDelete(id);

    return res.status(200).json({ status: 'OK', message: 'Address deleted successfully' });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

// set default address

export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // find adddress of the user
    const address = await Address.findOne({
      user: userId,
      _id: id,
    });
    if (!address) {
      return res.status(404).json({ status: 'Error', message: 'address not found' });
    }
    // reset all address of the user
   
    await Address.updateMany({ user: userId }, { $set: { isDefault: false } });

    // set the selected address as default
    address.isDefault = true;
    await address.save();

    return res.status(200).json({ status: 'OK', message: 'Address set as default successfully', address });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};
