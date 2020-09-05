import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@sgtickets/common';


import { Property } from '../models/property';

interface ICreateListingBody{
  header: string;
  propertyType: PropertyType;
  area: number;
  areaType: AreaType;
  price: number;
  priceType: PriceType;
  facilities: Facility[];
  address: string;
  city: string;
  lat: number;
  lon: number;
  userId: number;
}

const router = express.Router();

router.get(
  '/api/property/listing',
  async (req: Request, res: Response) => {
    res.status(200).send(["a","b","c","d"]);
  }
);

router.post(
  '/api/property/listing',
  [
    body('header').trim().notEmpty().withMessage('Header is required for listing a property'),
    body('propertyType').trim().notEmpty().withMessage('Type of property is required for listing'),
    body('area').trim().notEmpty().withMessage('Area of property is required for listing'),
    body('areaType').trim().notEmpty().withMessage('Room Type is required for listing a property'),
    body('price').trim().notEmpty().withMessage('Valid price is required for listing a property'),
    body('priceType').trim().notEmpty().withMessage('The kind of listing as Sale/Rent etc. is required'),
    body('address').trim().notEmpty().withMessage('The address of property is required'),
    body('city').trim().notEmpty().withMessage('The city where property is located is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

  }
);

export { router as listingRouter };
