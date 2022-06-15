const Mongoose = require('mongoose');
const { ROLE_ADMIN, ROLE_MEMBER, ROLE_MERCHANT } = require('../constants');

const { Schema } = Mongoose;

const BrandDetailsSchema = new Schema({
  isActive: Boolean,
  name: String,
  slug: String,
  _id: String,
});

const ItemsSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: Number,
  description: String,
  imageKey: String,
  imageUrl: String,
  inventory: Number,
  isActive:Boolean,
  name:String,
  price: Number,
  sky: String,
  slug: String,
  taxable: Boolean,
  totalPrice:Number,
  brand: BrandDetailsSchema
});

// User Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: () => {
      return this.provider !== 'email' ? false : true;
    }
  },
  phoneNumber: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  password: {
    type: String
  },
  merchant: {
    type: Schema.Types.ObjectId,
    ref: 'Merchant',
    default: null
  },
  provider: {
    type: String,
    required: true,
    default: 'email'
  },
  googleId: {
    type: String
  },
  facebookId: {
    type: String
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    default: ROLE_MEMBER,
    enum: [ROLE_ADMIN, ROLE_MEMBER, ROLE_MERCHANT]
  },
  cartItems:[ItemsSchema],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('User', UserSchema);
