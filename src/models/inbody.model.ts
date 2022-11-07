import mongoose from 'mongoose';
const { Schema } = mongoose;

const inbodySchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  //   width
  //   height
  //   weight
  //   fat
});

const Inbody = mongoose.model('Inbody', inbodySchema);
export default Inbody;
