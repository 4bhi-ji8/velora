import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
});

export default mongoose.model('User', userSchema);
