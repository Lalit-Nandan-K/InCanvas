import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  email: { type: String, required: true },
  full_name: { type: String, required: true },
  username: { type: String, unique: true },
  bio: { type: String, default: "I am honoured one" },
  profile_picture: { type: String, default: "" },
  cover_photo: { type: String, default: "" },
  location: { type: String, default: "" },
  cover_photo: { type: String, default: "" },
  followers: [{ type: String, ref: "User" }],
  following: [{ type: String, ref: "User" }],
  connections: [{ type: String, ref: "User" }],
},{timestamps:true , minimize:false});
// Without [] means single value and with [] means array of values 
// timestamps: true automatically adds two field to every document : createdAt:Date , updatedAt:Date
// If minimise:true means mongoose keeps empty object exactly you define them not remove empty objects from your document before saving.

// Note: We are using Clerk so we dont need to encript password and check password. If we not use clerk then we have to change the password into hash and also have to check while signin.

const User = mongoose.model('User',userSchema)

export default User