const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  publishedAt: { type: Date, required: true, default: Date.now() },
});
module.exports = mongoose.model("Post", postSchema);
