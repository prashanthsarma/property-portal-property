import { Request, Response } from 'express';
import { Property } from "../models/property";
import { IListingResponse } from "@prashanthsarma/property-portal-common";

export const listAllProperties = async (req: Request, res: Response) => {
  const listing = await Property.find({});
  res.status(200).send({ listing } as IListingResponse);
}