import { Schema, model } from "mongoose";

const accountTypeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  initialBalance: {
    type: Number,
    default: 0
  },
  currentBalance: {
    type: Number,
    default: 0
  }
  
},{
    timestamps: true
});

const AccountType = model('AccountType', accountTypeSchema);
export default AccountType;