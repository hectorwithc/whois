"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavbarNotification() {
  const router = useRouter();

  const [data, setData] = useState<{
    ip: string;
    city: string;
    country: string;
  }>();

  useEffect(() => {
    if (!data) {
      axios
        .get(
          `https://ipinfo.io/json?token=${process.env.NEXT_PUBLIC_IPINFO_API_TOKEN}`
        )
        .then((res) => setData(res.data))
    }
  });

  return (
    <div className="absolute top-0 left-0 w-full flex justify-center py-4 font-medium items-center gap-1 z-50">
      <p>Hello from {data ? `${data.city}, ${data.country}` : "Loading..."},</p>
      <button
        className="text-blue-500 underline cursor-pointer"
        onClick={() => {
          router.push(`/lookup/${data?.ip}`);
        }}
      >
        Check my IP
      </button>
    </div>
  );
}
