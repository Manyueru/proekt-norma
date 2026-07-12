import type { Topic, TopicProgressRecord, Track } from "./types";

function availableTopics(topics: Topic[]) {
  return topics.filter((topic) => topic.contentStatus !== "outline");
}

export function getCurrentTopic(
  topics: Topic[],
  progress: Record<string, TopicProgressRecord>
): Topic | undefined {
  return [...availableTopics(topics)]
    .filter((topic) => {
      const status = progress[topic.slug]?.status;
      return status && status !== "not-started" && status !== "mastered";
    })
    .sort((a, b) => {
      const aDate = progress[a.slug]?.lastOpenedAt || progress[a.slug]?.updatedAt || "";
      const bDate = progress[b.slug]?.lastOpenedAt || progress[b.slug]?.updatedAt || "";
      return bDate.localeCompare(aDate);
    })[0];
}

export function getRecommendedTopic(topics: Topic[]) {
  return availableTopics(topics)[0];
}

export function getOverallProgress(
  topics: Topic[],
  progress: Record<string, TopicProgressRecord>
) {
  const activeTopics = availableTopics(topics);
  if (!activeTopics.length) return 0;
  const mastered = activeTopics.filter(
    (topic) => progress[topic.slug]?.status === "mastered"
  ).length;
  return Math.round((mastered / activeTopics.length) * 100);
}

export function getTrackProgress(
  topics: Topic[],
  progress: Record<string, TopicProgressRecord>,
  track: Track
) {
  const trackTopics = availableTopics(topics).filter((topic) => topic.track === track);
  const mastered = trackTopics.filter(
    (topic) => progress[topic.slug]?.status === "mastered"
  ).length;
  return {
    total: trackTopics.length,
    mastered,
    percent: trackTopics.length ? Math.round((mastered / trackTopics.length) * 100) : 0
  };
}
