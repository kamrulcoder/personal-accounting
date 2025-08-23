
import { Schema, model } from "mongoose";
const transactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'AccountCategory',
    required: true
  },
  transactorId: {
    type: Schema.Types.ObjectId,
    ref: 'Transactor'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense', 'transfer'],
    lowercase: true
  },
  category: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  isSettled: {
    type: Boolean,
    default: false
  },
  relatedTransaction: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction'
  },

}, {
  timestamps: true
});

// transactionSchema.post('save', async function(doc) {
//   if (doc.transactorId) {
//     const Balance = require('./Balance');
//     const balance = await Balance.findOneAndUpdate(
//       { userId: doc.userId, transactorId: doc.transactorId },
//       { $inc: { balance: doc.type === 'expense' ? doc.amount : -doc.amount } },
//       { upsert: true, new: true }
//     );
//   }
// });

const Transaction = model('Transaction', transactionSchema);

export default Transaction