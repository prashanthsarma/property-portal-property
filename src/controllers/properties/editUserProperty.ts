import { Request, Response } from 'express';
import { IPropertyAttrs, NotAuthorizedError, BadRequestError } from "@prashanthsarma/property-portal-common";
import { Property } from "../../models/property";
import { S3ImageHandler } from "../../services/S3ImageHandler";


export const editUserProperty = async (req: Request, res: Response) => {

  const { id } = req.params;


  const newPropertyAttrs = req.body as IPropertyAttrs
  const oldProperty = await Property.findOne({ _id: id });
  if (!oldProperty) {
    throw new BadRequestError('Cannot find the property to update')
  }

  if (oldProperty.userId != req.currentUser!.id) {
    throw new NotAuthorizedError;
  }

  newPropertyAttrs.userId = oldProperty.userId;
  // Removing images for old property
  const { images } = oldProperty;
  if (images && images.length > 0) {
    const imagesToDelete = [...images];
    const imageUrlPromises: Promise<void>[] = []
    imagesToDelete.forEach(img => {
      imageUrlPromises.push(S3ImageHandler.DeleteImage(img))
    });
    await Promise.all(imageUrlPromises);
  }

  const imagesToUpload = [...newPropertyAttrs.images];
  newPropertyAttrs.images = []
  const imageUrls: string[] = []
  const imageUrlPromises: Promise<void>[] = []

  const uploadMethod = async (img: string) => {
    const imgLink = await S3ImageHandler.WriteImage(newProperty.id, img);
    if (imgLink != null) {
      imageUrls.push(imgLink);
    }
  };

  imagesToUpload.forEach(img => {
    imageUrlPromises.push(uploadMethod(img))
  });

  await Promise.all(imageUrlPromises);

  const newProperty = Property.build(newPropertyAttrs);
  newProperty.images = imageUrls;

  await Property.findOneAndUpdate({_id: id}, newProperty);
  res.status(200).send(newProperty);
}