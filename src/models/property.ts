import mongoose from 'mongoose';
import { IPropertyAttrs, PropertyType, AreaType, PriceType, Facility }
  from '@prashanthsarma/property-portal-common'

interface PropertyModel extends mongoose.Model<PropertyDoc> {
  build(attrs: IPropertyAttrs): PropertyDoc;
}

// An interface that describes the properties
// that a Property Document has
export interface PropertyDoc extends mongoose.Document {
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
  userId: string;
}

const propertySchema = new mongoose.Schema(
  {
    header: {
      type: String,
      required: true
    },
    propertyType: {
      type: String,
      required: true
    },
    area: {
      type: Number,
      required: true
    },
    areaType: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    priceType: {
      type: String,
      required: true
    },
    facilities: {
      type: [String],
      required: false
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    lat: {
      type: Number,
      required: false
    },
    lon: {
      type: Number,
      required: false
    },
    userId: {
      type: String,
      required: true
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);


propertySchema.statics.build = (attrs: IPropertyAttrs) => {
  return new Property(attrs);
};

const Property = mongoose.model<PropertyDoc, PropertyModel>('Property', propertySchema);

export { Property };
