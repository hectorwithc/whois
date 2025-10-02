import { EntityGetResponse } from "cloudflare/resources/radar.mjs";
import { ASNIPResponse } from "cloudflare/resources/radar/entities.mjs";
import { LocationGetResponse } from "cloudflare/src/resources/radar/entities.js";
import { CityResponse } from "maxmind";

export type LookupInput = {
  query: string;
};

export type LookupOutput = {
  ip: string;
  domain?: string;
  entity: EntityGetResponse.IP;
  location: CityResponse | null;
  asn: ASNIPResponse.ASN;
  country: LocationGetResponse.Location;
}