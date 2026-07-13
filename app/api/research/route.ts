import { NextRequest, NextResponse } from "next/server";

const CATEGORY_QUERIES = {
  all: '("speech therapy"[Title/Abstract] OR "speech-language pathology"[Title/Abstract] OR "developmental language disorder"[Title/Abstract] OR "speech sound disorder"[Title/Abstract]) AND (child[Title/Abstract] OR children[Title/Abstract] OR adolescent[Title/Abstract])',
  early: '("early intervention"[Title/Abstract] OR "language emergence"[Title/Abstract] OR "communication development"[Title/Abstract]) AND (infant[Title/Abstract] OR toddler[Title/Abstract] OR child[Title/Abstract])',
  language: '("developmental language disorder"[Title/Abstract] OR "language disorder"[Title/Abstract] OR "language intervention"[Title/Abstract]) AND (child[Title/Abstract] OR children[Title/Abstract])',
  speech: '("speech sound disorder"[Title/Abstract] OR "childhood apraxia of speech"[Title/Abstract] OR dysarthria[Title/Abstract]) AND (child[Title/Abstract] OR children[Title/Abstract])',
  fluency: '(stuttering[Title/Abstract] OR cluttering[Title/Abstract] OR "fluency disorder"[Title/Abstract]) AND (child[Title/Abstract] OR children[Title/Abstract] OR adolescent[Title/Abstract])',
  literacy: '(dyslexia[Title/Abstract] OR dysgraphia[Title/Abstract] OR "written language disorder"[Title/Abstract] OR "reading intervention"[Title/Abstract]) AND (child[Title/Abstract] OR children[Title/Abstract] OR adolescent[Title/Abstract])',
  communication: '(autism[Title/Abstract] OR "augmentative and alternative communication"[Title/Abstract] OR "social communication"[Title/Abstract]) AND (child[Title/Abstract] OR children[Title/Abstract])'
} as const;

type Category = keyof typeof CATEGORY_QUERIES;

type PubMedAuthor = { name?: string };
type PubMedSummary = {
  uid: string;
  title?: string;
  pubdate?: string;
  fulljournalname?: string;
  source?: string;
  authors?: PubMedAuthor[];
  articleids?: { idtype?: string; value?: string }[];
};

const REQUEST_TIMEOUT_MS = 9000;


function addNcbiIdentification(params: URLSearchParams) {
  const email = process.env.NCBI_EUTILS_EMAIL?.trim();
  const apiKey = process.env.NCBI_EUTILS_API_KEY?.trim();
  if (email) params.set("email", email);
  if (apiKey) params.set("api_key", apiKey);
}

function isCategory(value: string | null): value is Category {
  return !!value && value in CATEGORY_QUERIES;
}

export async function GET(request: NextRequest) {
  const selected = request.nextUrl.searchParams.get("category");
  const category: Category = isCategory(selected) ? selected : "all";
  const retmax = Math.min(Math.max(Number(request.nextUrl.searchParams.get("limit")) || 12, 1), 20);

  try {
    const searchParams = new URLSearchParams({
      db: "pubmed",
      term: `${CATEGORY_QUERIES[category]} AND ("last 180 days"[PDat])`,
      retmode: "json",
      retmax: String(retmax),
      sort: "pub date",
      tool: "proekt_norma"
    });

    addNcbiIdentification(searchParams);

    const searchResponse = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?${searchParams.toString()}`,
      { next: { revalidate: 21600 }, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) }
    );
    if (!searchResponse.ok) throw new Error(`PubMed search returned ${searchResponse.status}`);

    const searchData = (await searchResponse.json()) as { esearchresult?: { idlist?: string[] } };
    const ids = searchData.esearchresult?.idlist ?? [];
    if (ids.length === 0) {
      return NextResponse.json(
        { category, checkedAt: new Date().toISOString(), items: [] },
        { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } }
      );
    }

    const summaryParams = new URLSearchParams({
      db: "pubmed",
      id: ids.join(","),
      retmode: "json",
      tool: "proekt_norma"
    });
    addNcbiIdentification(summaryParams);

    const summaryResponse = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?${summaryParams.toString()}`,
      { next: { revalidate: 21600 }, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) }
    );
    if (!summaryResponse.ok) throw new Error(`PubMed summary returned ${summaryResponse.status}`);

    const summaryData = (await summaryResponse.json()) as {
      result?: Record<string, PubMedSummary | string[]> & { uids?: string[] };
    };
    const orderedIds = summaryData.result?.uids ?? ids;
    const items = orderedIds.flatMap((id) => {
      const record = summaryData.result?.[id];
      if (!record || Array.isArray(record)) return [];
      const doi = record.articleids?.find((item) => item.idtype === "doi")?.value;
      return [{
        id,
        title: record.title?.replace(/\s+/g, " ").trim() || "Без названия",
        journal: record.fulljournalname || record.source || "PubMed",
        publishedAt: record.pubdate || "Дата не указана",
        authors: (record.authors ?? []).map((author) => author.name).filter(Boolean).slice(0, 6),
        doi,
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`
      }];
    });

    return NextResponse.json(
      { category, checkedAt: new Date().toISOString(), items },
      { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } }
    );
  } catch (error) {
    console.error("Research feed error", error);
    return NextResponse.json(
      {
        category,
        checkedAt: new Date().toISOString(),
        items: [],
        error: "Не удалось получить новые публикации. Попробуйте открыть ленту позже."
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
