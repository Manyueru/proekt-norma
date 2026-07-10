import type { Topic, TopicProgressRecord, Track } from "./types";

export function getCurrentTopic(
  topics: Topic[],
  progress: Record<string, TopicProgressRecord>
): Topic | undefined {
  return [...topics]
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
  return topics.find((topic) => topic.slug === "razvitie-2-mesyaca") ?? topics[0];
}

export function getOverallProgress(
  topics: Topic[],
  progress: Record<string, TopicProgressRecord>
) {
  if (!topics.length) return 0;
  const mastered = topics.filter((topic) => progress[topic.slug]?.status === "mastered").length;
  return Math.round((mastered / topics.length) * 100);
}

export function getTrackProgress(
  topics: Topic[],
  progress: Record<string, TopicProgressRecord>,
  track: Track
) {
  const trackTopics = topics.filter((topic) => topic.track === track);
  const mastered = trackTopics.filter((topic) => progress[topic.slug]?.status === "mastered").length;
  return {
    total: trackTopics.length,
    mastered,
    percent: trackTopics.length ? Math.round((mastered / trackTopics.length) * 100) : 0
  };
}
