import express, { Request, Response, NextFunction } from 'express';
import { validateRequest, NotAuthorizedError, IListingResponse, IPropertyAttrs, currentUser, requireAuth }
  from '@prashanthsarma/property-portal-common';
import { Property } from '../../models/property';
import { validateProperty } from '../../middleware/validateProperty';
import { S3ImageHandler } from '../../services/S3ImageHandler';
import { listUserProperties, addUserProperty, removeUserProperty } from '../../controllers/userProperties';

const router = express.Router();

router.get('/api/property/user/listing', currentUser, requireAuth,
  listUserProperties
);

router.post('/api/property/user/listing', validateProperty, validateRequest,
  currentUser,
  requireAuth,
  addUserProperty
);

router.delete('/api/property/user/listing/:id', currentUser, requireAuth,
  removeUserProperty
);

export { router as userListingRouter };
