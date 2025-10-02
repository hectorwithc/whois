"use client";

import { GlobeDemo } from "@/components/globe-demo";
import NavbarNotification from "@/components/navbar-notification";

export default function HomePage() {
  return <div>
    <NavbarNotification />
    <GlobeDemo />
  </div>;
}
