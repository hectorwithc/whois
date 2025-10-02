import * as ipaddr from "ipaddr.js";

const cloudflareIps = [
  "1.1.1.1",
  "1.0.0.1",
  "1.1.1.2",
  "1.0.0.2",
  "1.1.1.3",
  "1.0.0.3",
  "173.245.48.0/20",
  "103.21.244.0/22",
  "103.22.200.0/22",
  "103.31.4.0/22",
  "141.101.64.0/18",
  "108.162.192.0/18",
  "190.93.240.0/20",
  "188.114.96.0/20",
  "197.234.240.0/22",
  "198.41.128.0/17",
  "162.158.0.0/15",
  "104.16.0.0/13",
  "104.24.0.0/14",
  "172.64.0.0/13",
  "131.0.72.0/22",
];

/**
 * Check if an IP is in Cloudflare's network
 */
export function isCloudflareIp(ip: string): boolean {
  const addr = ipaddr.parse(ip);

  for (const entry of cloudflareIps) {
    if (entry.includes("/")) {
      // Subnet check
      const [range, bits] = entry.split("/");
      const subnet = ipaddr.parse(range);
      if (addr.match(subnet, parseInt(bits, 10))) {
        return true;
      }
    } else {
      // Direct IP match
      if (addr.toString() === ipaddr.parse(entry).toString()) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if the given IPv4 address is any kind of private/non-public IP.
 * This includes:
 * - RFC1918 private ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
 * - Loopback (127.0.0.0/8)
 * - Link-local (169.254.0.0/16)
 * - Carrier-grade NAT (100.64.0.0/10)
 * - Reserved ranges
 * - Unspecified (0.0.0.0)
 *
 * @param ip string representation of an IP address
 * @returns true if the IP is private/non-public, false if it is public
 */
export function isPrivateIPv4(ip: string): boolean {
  if (!ipaddr.isValid(ip)) {
    return false;
  }

  const parsed = ipaddr.parse(ip);

  // Only IPv4 addresses
  if (parsed.kind() !== "ipv4") {
    return false;
  }

  // Any range that is not public
  const nonPublicRanges = [
    "private",
    "loopback",
    "linkLocal",
    "carrierGradeNat",
    "reserved",
    "unspecified",
    "broadcast"
  ];

  return nonPublicRanges.includes(parsed.range());
}

/**
 * Checks if the given IP address is a valid public IPv4 address.
 * @param ip string representation of an IP address
 * @returns true if the IP is a public IPv4, false otherwise
 */
export function isPublicIPv4(ip: string): boolean {
  if (!ipaddr.isValid(ip)) {
    return false;
  }

  const parsed = ipaddr.parse(ip);

  // Ensure it's IPv4
  if (parsed.kind() !== "ipv4") {
    return false;
  }

  // List of IPv4 range categories to exclude (private, reserved, loopback, etc.)
  const nonPublicRanges = [
    "private",   // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
    "loopback",  // 127.0.0.0/8
    "linkLocal", // 169.254.0.0/16
    "broadcast", // 255.255.255.255
    "carrierGradeNat", // 100.64.0.0/10
    "reserved",  // IANA reserved ranges
    "unspecified" // 0.0.0.0
  ];

  return !nonPublicRanges.some(range => parsed.range() === range);
}