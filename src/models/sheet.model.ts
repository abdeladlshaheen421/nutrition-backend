import mongoose from 'mongoose';
const { Schema } = mongoose;

const sheetSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
});

const Sheet = mongoose.model('Sheet', sheetSchema);
export default Sheet;
