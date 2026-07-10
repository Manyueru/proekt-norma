import { SearchBar } from "@/components/shared/search-bar";

export default function SearchPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-medium">Поиск</h1>
      <SearchBar />
    </div>
  );
}
