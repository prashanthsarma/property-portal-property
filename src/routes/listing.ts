import express from 'express';
import { listAllProperties } from '../controllers/properties/listAllProperties';
import { listPropertyById } from '../controllers/properties/listPropertyById';
import { validateProperty } from '../middleware/validateProperty';
import { validateRequest, currentUser, requireAuth } from '@prashanthsarma/property-portal-common';
import { addUserProperty, removeUserProperty } from '../controllers/properties';
import { editUserProperty } from '../controllers/properties/editUserProperty';

const router = express.Router();

router.get('/api/property/listing',
  listAllProperties
);

router.post('/api/property/listing', validateProperty, validateRequest,
  currentUser,
  requireAuth,
  addUserProperty
);

router.get('/api/property/listing/:id',
  listPropertyById
);

router.delete('/api/property/listing/:id', currentUser, requireAuth,
  editUserProperty
);

router.delete('/api/property/listing/:id', currentUser, requireAuth,
  removeUserProperty
);

export { router as listingRouter };
