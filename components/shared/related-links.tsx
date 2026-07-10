import Link from "next/link";
import { LucideIcon, ExternalLink } from "lucide-react";

interface RelatedItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function RelatedLinks({ items }: { items: RelatedItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center justify-between rounded-lg border border-c px-3 py-2.5 text-sm hover:border-accent-blue/40"
        >
          <span className="flex items-center gap-2">
            <item.icon size={16} className="text-muted-c" />
            {item.label}
          </span>
          <ExternalLink size={14} className="text-muted-c" />
        </Link>
      ))}
    </div>
  );
}
