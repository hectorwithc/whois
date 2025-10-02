import "server-only";
import axios from "axios";

export async function getIPLocation(ip: string) {
  const data = await axios
    .get(`https://geolite.info/geoip/v2.1/country/${ip}?pretty`, {
      auth: {
        username: process.env.GEOIP_API_ACCOUNT_ID!,
        password: process.env.GEOIP_API_LICENSE_KEY!,
      },
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  console.log(data);

  return data;
}
