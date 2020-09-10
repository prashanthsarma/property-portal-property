import { Request, Response } from 'express';
import { IListingResponse, BadRequestError } from "@prashanthsarma/property-portal-common";
import { Property } from '../../models/property';

export const listPropertyById = async (req: Request, res: Response) => {
  const { id } = req.params
  const listing = await Property.findOne({ _id: id });
  if (listing) {
    res.status(200).send(listing);
  } else {
    throw new BadRequestError(`Could not find the property with id: ${id}`)
  }

}