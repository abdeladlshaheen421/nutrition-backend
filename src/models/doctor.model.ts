import mongoose from 'mongoose';
import { Gender } from './client.model';
const { Schema } = mongoose;

const doctorSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  email: {
    type: Schema.Types.String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  phone: {
    type: Schema.Types.String,
    required: true,
  },
  startTime: {
    type: Schema.Types.Date,
    required: true,
  },
  endTime: {
    type: Schema.Types.Date,
    required: true,
  },
  gender: {
    type: Schema.Types.String,
    enum: Gender,
  },
  clinic: {
    type: Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true,
  },
  image: {
    type: Schema.Types.String,
  },
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
