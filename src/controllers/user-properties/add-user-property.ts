import { Request, Response } from 'express';
import { IPropertyAttrs } from "@prashanthsarma/property-portal-common";
import { Property } from "../../models/property";
import { S3ImageHandler } from "../../services/s3-image-handler";


export const addUserProperty = async (req: Request, res: Response) => {
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