import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, NotAuthorizedError, IListingResponse, IPropertyAttrs, IUserAttrs }
  from '@prashanthsarma/property-portal-common';
import { Property } from '../../models/property';
import { validateProperty } from '../../middleware/validateProperty';
import { awsS3 } from '../../services/awsS3';

const router = express.Router();

declare global {
  namespace Express {
    interface Request {
      currentUser?: {id: string, email: string};
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as {id: string, email: string};
    req.currentUser = payload;
  } catch (err) {}

  next();
};


const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};

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
  // validateProperty(),
  // validateRequest,
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const propertyListing = req.body as IPropertyAttrs
    propertyListing.userId = req.currentUser!.id;

    const property = Property.build(propertyListing);

    const imagesToUpload = [...propertyListing.images];
    propertyListing.images = []
    const imageUrls: string[] = []
    const imageUrlPromises: Promise<void>[] = []

    const uploadMethod = async (img: string) => {
      const imgLink = await awsS3.WriteImage(property.id, img);
      if (imgLink != null) {
        imageUrls.push(imgLink);
      }
    };

    imagesToUpload.forEach(img => {
      imageUrlPromises.push(uploadMethod(img))
    });

    await Promise.all(imageUrlPromises);
    property.images = imageUrls;

    await property.save();
    res.status(201).send(property);
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
