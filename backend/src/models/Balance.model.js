
import { Schema, model } from "mongoose";
const balanceSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactorId: {
    type: Schema.Types.ObjectId,
    ref: 'Transactor',
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },

},{
    timestamps: true
});

// Create compound index to ensure one balance record per user-transactor pair
balanceSchema.index({ userId: 1, transactorId: 1 }, { unique: true });

const Balance = model('Balance', balanceSchema);

export default Balance;