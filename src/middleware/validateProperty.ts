import { body } from 'express-validator';

export const validateProperty = [
    body('header').trim().notEmpty().withMessage('Header is required for listing a property'),
    body('propertyType').trim().notEmpty().withMessage('Type of property is required for listing'),
    body('area').isFloat({ gt: 0 }).withMessage('Area of property is required for listing'),
    body('areaType').trim().notEmpty().withMessage('Room Type is required for listing a property'),
    body('price').isFloat({ gt: 0 }).withMessage('Valid price is required for listing a property'),
    body('priceType').trim().notEmpty().withMessage('The kind of listing as Sale/Rent etc. is required'),
    body('address').trim().notEmpty().withMessage('The address of property is required'),
    body('city').trim().notEmpty().withMessage('The city where property is located is required'),
  ]
