import { SearchBar } from "@/components/shared/search-bar";

export default function SearchPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Поиск</h1>
      <SearchBar />
    </div>
  );
}
