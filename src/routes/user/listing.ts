import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, NotAuthorizedError, currentUser, requireAuth, IListingResponse, IPropertyAttrs }
  from '@prashanthsarma/property-portal-common';
import { Property } from '../../models/property';
import { validateProperty } from '../../middleware/validateProperty';

// import { validateProperty } from '../../middleware/validateProperty';

const router = express.Router();

router.get(
  '/api/property/user/listing',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {

    const listing = await Property.find({
      userId: req.currentUser!.id,
    });
    res.status(200).send({ listing } as IListingResponse);
  }
);

router.post(
  '/api/property/user/listing',
  validateProperty(),
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const propertyListing = req.body as IPropertyAttrs
    propertyListing.userId = req.currentUser!.id;
    console.log(propertyListing);
    const property =  Property.build(propertyListing);
    
    await property.save();
    res.status(201).send();
  }
);

router.delete(
  '/api/property/user/listing/:id',
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const property = await Property.findOne({ _id: id })
    if (property?.userId === req.currentUser!.id) {
      await Property.deleteOne({ _id: id })
      const listing = await Property.find({
        userId: req.currentUser!.id,
      });
      res.status(200).send({ listing } as IListingResponse);
    } else {
      res.status(401).send(NotAuthorizedError);
    }
  }
);

export { router as userListingRouter };
