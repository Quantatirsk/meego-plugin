import { readFile } from "node:fs/promises";

const guideCatalogUrl = new URL("../../catalog/guides.json", import.meta.url);

function normalize(value) {
  return String(value).toLocaleLowerCase("zh-CN").trim();
}

export async function loadGuides() {
  const catalog = JSON.parse(await readFile(guideCatalogUrl, "utf8"));
  if (!Array.isArray(catalog.guides)) {
    throw new Error("catalog/guides.json must contain a guides array.");
  }
  return catalog.guides;
}

export function findGuides(guides, query) {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return guides;
  }

  const candidates = guides
    .map((guide) => {
      const id = normalize(guide.id);
      const title = normalize(guide.title);
      const tags = (guide.tags ?? []).map(normalize);
      const tokenScores = tokens.map((token) => {
        if (id === token || title === token || tags.includes(token)) {
          return 100;
        }
        if (id.includes(token) || title.includes(token)) {
          return 40;
        }
        return tags.some((tag) => tag.includes(token)) ? 30 : 0;
      });
      return {
        guide,
        score: tokenScores.reduce((total, score) => total + score, 0),
        matchesEveryToken: tokenScores.every((score) => score > 0),
      };
    })
    .filter(({ score }) => score > 0);
  const exactCandidates = candidates.filter(({ matchesEveryToken }) => matchesEveryToken);

  return (exactCandidates.length > 0 ? exactCandidates : candidates)
    .sort((left, right) => right.score - left.score || left.guide.id.localeCompare(right.guide.id))
    .map(({ guide }) => guide);
}
