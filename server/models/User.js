const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Post = require("./Post.js");

const userSchema = new Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 18,
    required: true,
    unique: true,
  },
  password: { type: String, minlength: 8, required: true },
  followers: [{ type: Schema.Types.ObjectId, ref: this }],
  following: [{ type: Schema.Types.ObjectId, ref: this }],
  posts: [{ type: Schema.Types.ObjectId, ref: Post }],
});
const User = mongoose.model("User", userSchema);

module.exports = User;
