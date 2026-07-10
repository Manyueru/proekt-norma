import { topics } from "@/lib/data";
import { HomeDashboard } from "@/components/home/home-dashboard";

export default function HomePage() {
  return <HomeDashboard topics={topics} />;
}
