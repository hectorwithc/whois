"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { MinusIcon, PlusIcon, RotateCcwIcon } from "lucide-react";

export default function MapComponent({
  latitude,
  longitude,
  defaultZoom,
}: {
  latitude: number;
  longitude: number;
  defaultZoom: number;
}) {
  const [zoom, setZoom] = useState(defaultZoom);

  return (
    <div className="relative inline-block">
      <div className="absolute right-2 bottom-2 z-10 flex flex-col items-center justify-center gap-2">
        {zoom !== 7 && (
          <Button
            onClick={() => {
              setZoom(7);
            }}
            variant={"secondary"}
          >
            <RotateCcwIcon />
          </Button>
        )}
        <Button
          onClick={() => {
            if (zoom === 12) {
              return;
            }

            setZoom(zoom + 1);
          }}
          variant={"secondary"}
        >
          <PlusIcon />
        </Button>
        <Button
          onClick={() => {
            if (zoom === 1) {
              return;
            }

            setZoom(zoom - 1);
          }}
          variant={"secondary"}
        >
          <MinusIcon />
        </Button>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&markers=color:red|${latitude},${longitude}&maptype=roadmap&zoom=${zoom}&size=600x400&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        className="rounded-md shadow-lg"
        alt=""
      />
    </div>
  );
}
