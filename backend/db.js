import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

import dotenv from "dotenv";

dotenv.config();

export const connectDb = async () => {
    try {
      await mongoose.connect(process.env.DB_CONNECTION_STRING);
      console.log(`MongoDB connect Successfully `);
    } catch (error) {
      console.log(error);
    }
  };

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
});

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: { type: String, require: true },
  price: Number,
  imageUrl: String,
  creatorId: ObjectId,
});

const purchaseSchema = new mongoose.Schema({
  userId: ObjectId,
  courseId: ObjectId,
});

export const User = mongoose.model("User", userSchema);
export const Admin = mongoose.model("Admin", adminSchema);
export const Course = mongoose.model("Course", courseSchema);
export const Purchase = mongoose.model("Purchase", purchaseSchema);
