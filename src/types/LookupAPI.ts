/* eslint-disable @typescript-eslint/no-explicit-any */
import { CityResponse } from "maxmind";

export type LookupInput = {
  query: string;
};

export type LookupOutput = {
  ip: string;
  domain?: string;
  entity: any;
  location: CityResponse | null;
  asn: any;
  country: any;
}