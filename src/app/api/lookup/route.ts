import { LookupInput } from "@/types/LookupAPI";
import { domainRegex, ipRegex } from "@/utils/regex";
import dns from "node:dns";
import { cloudflare } from "@/server/cloudflare";
import type { NextRequest } from "next/server";
import { getIPLocation } from "@/server/geoip";

export async function POST(request: NextRequest) {
  let json: LookupInput;
  try {
    json = await request.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { query } = json;
  let ip;
  let domain;
  if (ipRegex.test(query)) {
    ip = query;
  } else if (domainRegex.test(query)) {
    // Check ip that domain resolves to
    domain = query;
    const records = await dns.promises.lookup(query).catch(() => null);
    if (!records) {
      return new Response(
        JSON.stringify({ error: "Domain is not pointing to an IP" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    ip = records.address;
  } else {
    return new Response(JSON.stringify({ error: "Invalid query" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const entity = await cloudflare.radar.entities.get({ ip: ip });
  const { asn } = await cloudflare.radar.entities.asns.ip({ ip: ip });
  const country = await cloudflare.radar.entities.locations.get(
    entity.ip.location
  );

  const location = await getIPLocation(ip);

  return new Response(
    JSON.stringify({
      ip,
      domain,
      entity: entity.ip,
      location: location,
      asn: asn,
      country: country.location,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
