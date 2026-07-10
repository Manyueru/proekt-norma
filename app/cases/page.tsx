import { CasesCatalog } from "@/components/case/cases-catalog";
export default function CasesPage() { return <div className="flex flex-col gap-6"><div><h1 className="text-xl font-medium">Клинические задачи</h1><p className="text-sm text-muted-c mt-1">Учебные случаи с сохранением ответа, разбора и статуса.</p></div><CasesCatalog /></div>; }
