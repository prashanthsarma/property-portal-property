import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
// import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import { errorHandler, NotFoundError, CustomError } from '@prashanthsarma/property-portal-common';

import { userListingRouter } from './routes/user/listing';
import { listingRouter } from './routes/listing';

const app = express();
app.set('trust proxy', true);
app.use(json({limit:'20mb'}));
app.use(mongoSanitize())
app.use(
  cookieSession({
    signed: false,
    secure: false, //process.env.NODE_ENV !== 'test',
  })
);

if(process.env.NODE_ENV === 'development'){
  app.use(cors({ credentials: true, origin: "http://app.test.com:3000" }))
  console.log("Enabled development cors")
}

app.use(userListingRouter);
app.use(listingRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});
// app.use(logger);
app.use(errorHandler);

export { app };
