import mongoose from 'mongoose';
import 'dotenv/config';

const mongoURL = process.env.MONGO_URL;

async function dbConnect() {
  await mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export { dbConnect };
