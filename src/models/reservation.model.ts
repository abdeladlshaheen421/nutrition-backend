import mongoose from 'mongoose';
const { Schema } = mongoose;

export enum Status {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

const reservationSchema = new Schema({
  amount_paid: {
    type: Schema.Types.Number,
    required: true,
  },
  status: {
    type: Schema.Types.String,
    enum: [Status.PENDING, Status.APPROVED, Status.REJECTED],
    required: true,
  },
  date: {
    type: Schema.Types.Date,
    required: true,
  },
  clinic: {
    type: Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true,
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
});

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
