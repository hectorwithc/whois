import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
