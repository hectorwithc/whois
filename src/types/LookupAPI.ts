import { CityResponse } from "maxmind";

export type LookupInput = {
  query: string;
};

export type LookupOutput = {
  ip: string;
  domain?: string;
  entity: unknown;
  location: CityResponse | null;
  asn: unknown;
  country: unknown;
}