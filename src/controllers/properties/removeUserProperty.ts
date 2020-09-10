import { Request, Response } from 'express';
import { Property } from "../../models/property";
import { S3ImageHandler } from "../../services/S3ImageHandler";
import { IListingResponse, NotAuthorizedError } from "@prashanthsarma/property-portal-common";


export const removeUserProperty = async (req: Request, res: Response) => {
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