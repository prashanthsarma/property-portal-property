import {mongo as mongoose} from 'mongoose';
import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  const mongoUri = 'mongodb://property-mongo-srv:27017/auth'

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true
    });
    console.log('Connected to Property MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(4001, () => {
    console.log('Property Service listening on port 4001!');
  });
};

start();
