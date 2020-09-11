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

  const imagesToUpload = [...newPropertyAttrs.images];
  newPropertyAttrs.images = []
  const imageUrls: string[] = []
  const imageUrlPromises: Promise<void>[] = []

  const uploadMethod = async (img: string) => {
    if (img.startsWith("data")) {
      const imgLink = await S3ImageHandler.WriteImage(oldProperty.id, img);
      if (imgLink != null) {
        imageUrls.push(imgLink);
      }
    }
    else {
      imageUrls.push(img);
    }
  };

  imagesToUpload.forEach(img => {
    imageUrlPromises.push(uploadMethod(img))
  });


  newPropertyAttrs.userId = oldProperty.userId;
  // Removing images for old property
  const { images } = oldProperty;
  if (images && images.length > 0) {
    const imagesToDelete = [...images];
    const imageUrlPromises: Promise<void>[] = []
    imagesToDelete.filter(img => !imagesToUpload.includes(img)).forEach(img => {
      imageUrlPromises.push(S3ImageHandler.DeleteImage(img))
    });
    await Promise.all(imageUrlPromises);
  }



  await Promise.all(imageUrlPromises);


  const newProperty = Property.build({ _id: id, ...newPropertyAttrs } as IPropertyAttrs);
  newProperty.images = imageUrls;

  await Property.replaceOne({ _id: id }, newProperty);

  res.status(200).send(newProperty);
}