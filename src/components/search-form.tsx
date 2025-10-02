import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isPrivateIPv4, isPublicIPv4 } from "@/utils/ipAddress";
import { domainRegex } from "@/utils/regex";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SearchForm() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (!query) {
          return;
        }

        if (!domainRegex.test(query) && !isPublicIPv4(query) && !isPrivateIPv4(query)) {
          toast.error("Invalid IP address", {
            richColors: true,
            description: "Please enter a valid domain or IPv4 address.",
          });

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
  );
}
