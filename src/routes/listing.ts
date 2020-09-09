import express from 'express';
import { listAllProperties } from '../controllers/listAllProperties';

const router = express.Router();

router.get(
  '/api/property/listing',
  listAllProperties
);

export { router as listingRouter };
