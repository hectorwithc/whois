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
import { MoveRightIcon, UsersRoundIcon } from "lucide-react";
import Link from "next/link";
import { formatWithCommas, formatWithSuffix } from "@/utils/formatNumbers";
import Footer from "@/components/footer";

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
  );

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
          <p className="text-muted-foreground text-center my-4">No location found</p>
        )}
      </div>
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{data.ip}</CardTitle>
          <CardDescription>
            {data.location?.city?.names.en}, {data.location?.country?.names.en}{" "}
            ({data.location?.continent?.names.en})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            ISP:{" "}
            <span className="font-medium text-white">
              {data.entity.asnOrgName}
            </span>
          </p>
          <p className="text-muted-foreground">
            City:{" "}
            <span className="font-medium text-white">
              {data.location?.city?.names.en}
            </span>
          </p>
          <p className="text-muted-foreground">
            Region:{" "}
            <span className="font-medium text-white">
              {data.location?.subdivisions?.[0].names.en}
            </span>
          </p>
          <p className="text-muted-foreground">
            Country:{" "}
            <span className="font-medium text-white">
              {data.location?.country?.names.en}
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
              {formatWithCommas(data.asn.estimatedUsers.estimatedUsers!)} ({formatWithSuffix(data.asn.estimatedUsers.estimatedUsers!)})
            </span>
          </p>
        </CardContent>
        <CardFooter className="text-muted-foreground text-xs">
            User estimates come from APNIC (refer to{" "}<Link href={"https://labs.apnic.net/?p=526"} className="underline text-white ml-1">https://labs.apnic.net/?p=526</Link>).
        </CardFooter>
      </Card>
      <Footer />
    </div>
  );
}
