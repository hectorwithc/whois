import "server-only";
import axios from "axios";

export async function getIPLocation(ip: string) {
  const data = await axios
    .get(`https://geolite.info/geoip/v2.1/city/${ip}?pretty`, {
      auth: {
        username: process.env.GEOIP_API_ACCOUNT_ID!,
        password: process.env.GEOIP_API_LICENSE_KEY!,
      },
    })
    .then((res) => {
      return res.data;
    });

  return data;
}
