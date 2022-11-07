import mongoose from 'mongoose';
const { Schema } = mongoose;

const clinicAdminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  nationalId: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const ClinicAdminModel = mongoose.model('ClinicAdmin', clinicAdminSchema);
export default ClinicAdminModel;
