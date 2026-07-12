import { CasesCatalog } from "@/components/case/cases-catalog";
export default function CasesPage() { return <div className="flex flex-col gap-8"><div><h1 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Клинические задачи</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-c">Учебные случаи с сохранением ответа, разбора и статуса.</p></div><CasesCatalog /></div>; }
