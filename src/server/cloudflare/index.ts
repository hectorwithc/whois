import "server-only";
import Cloudflare from "cloudflare";

export const cloudflare = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
});
