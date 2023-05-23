import { Schema, model } from "mongoose";

const usersCollection = "users";

const userSchema = new Schema({
  first_name: { type: String, require: true, minLength: 3, maxLength: 60 },
  last_name: { type: String, require: true, minLength: 3, maxLength: 60 },
  email: { type: String, require: true, unique: true, index: true },
  age: { type: Number, require: true, min: 18, max: 100 },
  password: { type: String, require: true },
});

export const userModel = model(usersCollection, userSchema);
