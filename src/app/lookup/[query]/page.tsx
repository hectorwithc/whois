import MapComponent from "@/components/map-component";
import { LookupOutput } from "@/types/LookupAPI";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { CircleXIcon, HatGlassesIcon, LandmarkIcon, MoveRightIcon, UsersRoundIcon } from "lucide-react";
import Link from "next/link";
import { formatWithCommas, formatWithSuffix } from "@/utils/formatNumbers";
import Footer from "@/components/footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CloudflareIcon from "@/components/icon/cloudflare-icon";
import { isCloudflareIp, isPrivateIPv4, isPublicIPv4 } from "@/utils/ipAddress";

export default async function LookupPage({
  params,
}: {
  params: Promise<{ query: string }>;
}) {
  const { query } = await params;

  const res = await axios.post(
    "/api/lookup",
    {
      query,
    },
    {
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    }
  ).catch((error) => {
    return null;
  });

  if (!res) {
    if (isPrivateIPv4(query)) {
      return <div className="flex items-center justify-center flex-col h-screen">
      <HatGlassesIcon size={64} className="text-muted-foreground" />
      <h1 className="text-2xl font-semibold mt-2">Private IP address</h1>
      <p className="text-muted-foreground">This IP address is private and cannot be looked up.</p>
      <Footer floating={true} />
    </div>;
    } else {
      return <div className="flex items-center justify-center flex-col h-screen">
      <CircleXIcon size={64} className="text-red-500" />
      <h1 className="text-2xl font-semibold mt-2">Invalid IP address</h1>
      <p className="text-muted-foreground">Please enter a valid public IP address or domain.</p>
      <Footer floating={true} />
    </div>;
    }
  }

  const data = res.data as LookupOutput;

  return (
    <div className="flex items-center justify-center flex-col gap-2">
      <div className="mt-8">
        {data.domain ? (
          <div className="flex items-center gap-2">
            <h1 className="text-2xl text-muted-foreground font-medium font-mono">
              {data.domain}
            </h1>
            <MoveRightIcon className="text-muted-foreground" />
            {/*
              <img
                src={`https://flagcdn.com/${data.entity.location.toLowerCase()}.svg`}
                width="30"
                alt={data.entity.locationName}
              />
              */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://flagcdn.com/32x24/${data.entity.location.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/64x48/${data.entity.location.toLowerCase()}.png 2x,
    https://flagcdn.com/96x72/${data.entity.location.toLowerCase()}.png 3x`}
              width="32"
              height="24"
              alt={data.entity.locationName}
              title={data.entity.locationName}
            />
            <p className="text-2xl font-bold font-mono">{data.ip}</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/*
              <img
                src={`https://flagcdn.com/${data.entity.location.toLowerCase()}.svg`}
                width="30"
                alt={data.entity.locationName}
              />
              */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://flagcdn.com/32x24/${data.entity.location.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/64x48/${data.entity.location.toLowerCase()}.png 2x,
    https://flagcdn.com/96x72/${data.entity.location.toLowerCase()}.png 3x`}
              width="32"
              height="24"
              alt={data.entity.locationName}
              title={data.entity.locationName}
            />
            <h1 className="text-2xl font-bold font-mono">{data.ip}</h1>
          </div>
        )}
      </div>
      <div className="mt-4 max-w-xl w-full">
        {data.location?.location ? (
          <MapComponent
            latitude={data.location?.location?.latitude as unknown as number}
            longitude={data.location?.location?.longitude as unknown as number}
            defaultZoom={7}
          />
        ) : (
          <p className="text-muted-foreground text-center my-4">
            No location found
          </p>
        )}
      </div>
      {isCloudflareIp(data.ip) && (
        <Alert variant="green" className="w-full max-w-xl">
          <CloudflareIcon className="fill-green-800" />
          <AlertTitle>Cloudflare Network</AlertTitle>
          <AlertDescription>
            This IP address belongs to the Cloudflare network. Many websites use
            Cloudflare for security and performance, which means that the real
            server may be hidden behind Cloudflare&apos;s proxy system.
          </AlertDescription>
        </Alert>
      )}
      {data.location?.country?.is_in_european_union && (
        <Alert variant="blue" className="w-full max-w-xl">
          <LandmarkIcon />
          <AlertTitle>European Union</AlertTitle>
          <AlertDescription>
            This IP address appears to be located in the European Union, where
            GDPR privacy laws may apply.
          </AlertDescription>
        </Alert>
      )}
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{data.ip}</CardTitle>
          <CardDescription>
            {data.location?.city?.names.en || "***"},{" "}
            {data.location?.country?.names.en || "***"} (
            {data.country.subregion})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            ISP:{" "}
            <span className="font-medium text-white">
              {data.entity.asnOrgName || "N/A"}
            </span>
          </p>
          <p className="text-muted-foreground">
            City:{" "}
            <span className="font-medium text-white">
              {data.location?.city?.names.en || "N/A"}
            </span>
          </p>
          <p className="text-muted-foreground">
            Region:{" "}
            <span className="font-medium text-white">
              {data.location?.subdivisions?.[0].names.en || "N/A"}
            </span>
          </p>
          <p className="text-muted-foreground">
            Country:{" "}
            <span className="font-medium text-white">
              {data.location?.country?.names.en || "N/A"}
            </span>
          </p>
        </CardContent>
      </Card>
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>ASN</CardTitle>
          <CardDescription>
            {data.entity.asnOrgName} ({data.asn.orgName})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            ASN: <span className="font-medium text-white">{data.asn.asn}</span>
          </p>
          <p className="text-muted-foreground">
            Org:{" "}
            <span className="font-medium text-white">
              {data.entity.asnOrgName}
            </span>
          </p>
          <p className="text-muted-foreground">
            Website:{" "}
            <span className="font-medium text-white hover:underline">
              <Link href={data.asn.website}>{data.asn.website}</Link>
            </span>
          </p>
          <p className="text-muted-foreground">
            Country:{" "}
            <span className="font-medium text-white">
              {data.asn.countryName}
            </span>
          </p>
          <p className="text-muted-foreground  flex items-center gap-2">
            Estimated Users:{" "}
            <span className="font-medium text-white flex items-center gap-1">
              <UsersRoundIcon size={18} />
              {formatWithCommas(data.asn.estimatedUsers.estimatedUsers!)} (
              {formatWithSuffix(data.asn.estimatedUsers.estimatedUsers!)})
            </span>
          </p>
        </CardContent>
        <CardFooter className="text-muted-foreground text-xs">
          User estimates come from APNIC (refer to{" "}
          <Link
            href={"https://labs.apnic.net/?p=526"}
            className="underline text-white ml-1"
          >
            https://labs.apnic.net/?p=526
          </Link>
          ).
        </CardFooter>
      </Card>
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Location</CardTitle>
          <CardDescription>
            {data.location?.city?.names.en || "***"},{" "}
            {data.country.alpha2 || "***"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Latitude:{" "}
            <span className="font-medium text-white">
              {data.location?.location?.latitude || "N/A"}
            </span>
          </p>
          <p className="text-muted-foreground">
            Longitude:{" "}
            <span className="font-medium text-white">
              {data.location?.location?.longitude || "N/A"}
            </span>
          </p>
          <p className="text-muted-foreground">
            Timezone:{" "}
            <span className="font-medium text-white">
              {data.location?.location?.time_zone || "N/A"}
            </span>
          </p>
          <p className="text-muted-foreground">
            Postal:{" "}
            <span className="font-medium text-white">
              {data.location?.postal?.code || "N/A"}
            </span>
          </p>
          <p className="text-muted-foreground">
            Code:{" "}
            <span className="font-medium text-white">
              {data.country.alpha2}
            </span>
          </p>
          <p className="text-muted-foreground">
            Confidence Level:{" "}
            <span className="font-medium text-white">
              {data.country.confidenceLevel}
            </span>
          </p>
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
}
