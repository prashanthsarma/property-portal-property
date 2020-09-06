import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import { seedPropertyData } from '../_data/seedPropertyData';
import { Property } from '../models/property';

const start = async () => {

  process.env.JWT_KEY = 'asdfasdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  try {
    const mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();
    console.log(mongoUri);

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDb');
    const seedSaving: Promise<any>[] = []
    seedPropertyData.forEach(p => {
      seedSaving.push(p.save());
    });
    await Promise.all(seedSaving);
    console.log('Imported seed property data to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(4001,'app.test.com', () => {
    console.log('Property Dev listening on port 4001!');
  });
};

start();
