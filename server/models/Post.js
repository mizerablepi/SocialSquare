const User = require("./User");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: User }],
  publishedAt: { type: Date, required: true, default: Date.now() },
});
module.exports = mongoose.model("Post", postSchema);
