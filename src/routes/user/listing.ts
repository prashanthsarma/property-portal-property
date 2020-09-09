import express, { Request, Response, NextFunction } from 'express';
import { validateRequest, NotAuthorizedError, IListingResponse, IPropertyAttrs, currentUser, requireAuth }
  from '@prashanthsarma/property-portal-common';
import { Property } from '../../models/property';
import { validateProperty } from '../../middleware/validateProperty';
import { S3ImageHandler } from '../../services/awsS3';

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
  validateRequest,
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
      const imgLink = await S3ImageHandler.WriteImage(property.id, img);
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
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const property = await Property.findOne({ _id: id })
    if (property?.userId === req.currentUser!.id) {
      const { images } = property;
      if (images && images.length > 0) {
        const imagesToDelete = [...property.images];
        const imageUrlPromises: Promise<void>[] = []
        imagesToDelete.forEach(img => {
          imageUrlPromises.push(S3ImageHandler.DeleteImage(img))
        });

        await Promise.all(imageUrlPromises);
      }
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
