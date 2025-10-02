"use client";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full h-screen">
      <h1 className="text-2xl font-bold font-mono">WhoIs</h1>
      <p className="text-muted-foreground text-sm">
        Check information about a domain or IP address.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!query) {
            return;
          }

          setLoading(true);
          router.push(`/lookup/${query}`);
        }}
        className="flex gap-1 max-w-xl w-full"
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Domain or IP address"
        />
        <Button type="submit">
          {loading ? <Loader2Icon className="animate-spin" /> : <SearchIcon />}
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>
      <Footer floating={true} />
    </div>
  );
}
