"use client";

import { useEffect } from "react";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusSelect } from "./status-select";
import { usePersonalData } from "@/components/providers/personal-data-provider";

export function TopicProgressControls({ slug }: { slug: string }) {
  const { progress, markTopicOpened, updateTopicStatus } = usePersonalData();
  const status = progress[slug]?.status ?? "not-started";

  useEffect(() => {
    void markTopicOpened(slug);
    // Marking once per mounted topic page is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-52">
      <StatusSelect slug={slug} />
      {status === "not-started" && (
        <Button variant="primary" onClick={() => void updateTopicStatus(slug, "learning")}>
          <PlayCircle size={16} />
          Начать тему
        </Button>
      )}
      {status !== "mastered" && status !== "not-started" && (
        <Button variant="secondary" onClick={() => void updateTopicStatus(slug, "mastered")}>
          <CheckCircle2 size={16} />
          Отметить освоенной
        </Button>
      )}
    </div>
  );
}
