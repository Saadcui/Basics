import mongoose from 'mongoose';

const PasswordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',  
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Password = mongoose.models.Password || mongoose.model('Password', PasswordSchema);

export default Password;
