import { PropertyDoc, Property } from "../models/property";
import { PropertyType, AreaType, PriceType, Facility } from "@prashanthsarma/property-portal-common";

export const seedPropertyData: PropertyDoc[] = [
  Property.build({
    header: "1BHK in Mahadevapura",
    propertyType: PropertyType.Apartment,
    area: 500,
    areaType: AreaType.HKB1,
    price: 14000,
    priceType: PriceType.Rent,
    facilities: [Facility.PowerBackUp],
    address: "Mahadevpura",
    city: "Bengaluru",
    lat: -1,
    lon: -1,
    userId: "5d7a514b5d2c12c7449be043",
//    _id : "5d7a514b5d2c12c7449be044"
  }),
  Property.build({
    header: "2BHK in CV Raman Nagar",
    propertyType: PropertyType.Apartment,
    area: 500,
    areaType: AreaType.HKB2,
    price: 16000,
    priceType: PriceType.Sale,
    facilities: [Facility.PowerBackUp, Facility.Lift, Facility.ServiceLift],
    address: "DRDO, CV Raman Nagar",
    city: "Bengaluru",
    lat: -1,
    lon: -1,
    userId: "5d7a514b5d2c12c7449be043",
//    _id : "5d7a514b5d2c12c7449be044"
  }),
  Property.build({
    header: "3BHK in a Good area",
    propertyType: PropertyType.Apartment,
    area: 1500,
    areaType: AreaType.HKB3,
    price: 25000,
    priceType: PriceType.Rent,
    facilities: [Facility.SwimmingPool],
    address: "203, 10 Cross, Indira Nagar",
    city: "Bengaluru",
    lat: -1,
    lon: -1,
    userId: "5d7a514b5d2c12c7449be043",
//    _id : "5d7a514b5d2c12c7449be044"
  }),
]