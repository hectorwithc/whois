import Link from "next/link";
import { GitForkIcon, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Footer({ floating = false }: { floating?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 w-full p-4 text-sm",
        floating ? "fixed bottom-0 left-0 right-0" : ""
      )}
    >
      <Link
        href={"/"}
        className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-1 text-muted-foreground"
      >
        <SearchIcon />
        Search
      </Link>
      <Link
        href={"https://github.com/hectorwithc/whois"}
        className="hover:text-blue-400 transition-colors duration-300 flex items-center gap-1 text-muted-foreground"
      >
        <GitForkIcon />
        Source Code
      </Link>
    </div>
  );
}
