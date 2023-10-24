import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  url: String,
  slug: String,
  clicks: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UrlModel = mongoose.model('Url', urlSchema);

export { UrlModel };
