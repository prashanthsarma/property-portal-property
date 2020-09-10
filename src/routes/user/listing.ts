import express, { } from 'express';
import { currentUser, requireAuth }
  from '@prashanthsarma/property-portal-common';
import { listUserProperties } from '../../controllers/userProperties/listUserProperties';

const router = express.Router();

router.get('/api/property/user/listing', currentUser, requireAuth,
  listUserProperties
);

export { router as userListingRouter };
