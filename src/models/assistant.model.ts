import mongoose from 'mongoose';
const { Schema } = mongoose;

const assistantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  clinic: {
    type: Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true,
  },
  image: {
    type: String,
  },
});

const Assistant = mongoose.model('Assistant', assistantSchema);
export default Assistant;
