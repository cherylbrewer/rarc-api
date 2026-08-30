import carcCrosswalk from "../../data/carcCrosswalk.js";
import carcMetadata from "../../data/carcMetadata.js";

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .replace(/\bwasn't\b/g, "was not")
    .replace(/\bweren't\b/g, "were not")
    .replace(/\bisn't\b/g, "is not")
    .replace(/\baren't\b/g, "are not")
    .replace(/\bdoesn't\b/g, "does not")
    .replace(/\bdidn't\b/g, "did not")
    .replace(/\bhasn't\b/g, "has not")
    .replace(/\bhaven't\b/g, "have not")
    .replace(/\bhadn't\b/g, "had not")
    .replace(/\bcan't\b/g, "cannot")
    .replace(/\bcouldn't\b/g, "could not")
    .replace(/\bwon't\b/g, "will not")
    .replace(/\bwouldn't\b/g, "would not")
    .replace(/\bshouldn't\b/g, "should not")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const ignoredWords = new Set([
  "claim",
  "claims",
  "service",
  "services",
  "payer",
  "patient",
  "payment",
  "payments",
  "paid",
  "billing",
  "billed",
  "provider",
  "information",
  "required",
  "processed",
  "processing",
  "denied",
  "denial",
  "says",
  "said",
  "because",
  "under",
  "this",
  "that",
  "with",
  "from",
  "into",
  "were",
  "was",
  "not",
]);

const highValueWords = new Set([
  "authorization",
  "authorized",
  "preauthorization",
  "precertification",
  "precert",
  "duplicate",
  "timely",
  "filing",
  "sequestration",
  "necessity",
  "noncovered",
  "covered",
  "documentation",
  "records",
  "attachment",
  "primary",
  "secondary",
  "coordination",
  "benefits",
  "fee",
  "schedule",
  "allowable",
]);

// These phrases are inherently too vague to reliably distinguish
// coordination of benefits (CARC 22) from wrong payer / claim routing (CARC 109).
// Return both candidates instead of forcing a false single answer.
const knownAmbiguousPhrases = new Map([
  ["other payer", ["22", "109"]],
  ["other payor", ["22", "109"]],
  ["another payer", ["22", "109"]],
  ["another payor", ["22", "109"]],
]);

const MIN_MATCH_SCORE = 15;
const AMBIGUITY_SCORE_GAP = 5;
const MAX_AMBIGUOUS_MATCHES = 3;

function calculateSharedWordScore(firstText, secondText) {
  const firstWords = new Set(firstText.split(" "));
  const secondWords = new Set(secondText.split(" "));
  let score = 0;

  for (const word of firstWords) {
    if (
      secondWords.has(word) &&
      word.length > 2 &&
      !ignoredWords.has(word)
    ) {
      score += highValueWords.has(word) ? 8 : 3;
    }
  }

  return score;
}

function calculateMatchScore(entry, normalizedSearch) {
  let score = 0;
  const matchedKeywords = [];

  for (const keyword of entry.keywords ?? []) {
    const normalizedKeyword = normalizeText(keyword);

    if (normalizedSearch === normalizedKeyword) {
      score += 40;
      matchedKeywords.push(keyword);
    } else if (normalizedSearch.includes(normalizedKeyword)) {
      score += 25;
      matchedKeywords.push(keyword);
    } else if (normalizedKeyword.includes(normalizedSearch)) {
      score += 15;
      matchedKeywords.push(keyword);
    } else {
      const sharedWordScore = calculateSharedWordScore(
        normalizedSearch,
        normalizedKeyword
      );

      if (sharedWordScore > 0) {
        score += sharedWordScore;
        matchedKeywords.push(keyword);
      }
    }
  }

  for (const exclusion of entry.exclusions ?? []) {
    const normalizedExclusion = normalizeText(exclusion);

    if (normalizedSearch.includes(normalizedExclusion)) {
      score -= 30;
    }
  }

  const normalizedSummary = normalizeText(entry.summary);
  const normalizedCategory = normalizeText(entry.category);

  if (normalizedSummary.includes(normalizedSearch)) {
    score += 12;
  }

  if (normalizedCategory.includes(normalizedSearch)) {
    score += 8;
  }

  return {
    score: Math.max(score, 0),
    matchedKeywords: [...new Set(matchedKeywords)],
  };
}

function formatMatch(entry, score, matchedKeywords) {
  return {
    code: entry.code,
    codeType: entry.codeType,
    summary: entry.summary,
    category: entry.category,
    adjustmentType: entry.adjustmentType,
    owner: entry.owner,
    recommendedAction: entry.recommendedAction,
    requiresRemarkCode: entry.requiresRemarkCode,
    preventable: entry.preventable,
    matchScore: score,
    matchedKeywords,
    status: entry.status,
  };
}

function getKnownAmbiguousMatches(normalizedSearch) {
  const codes = knownAmbiguousPhrases.get(normalizedSearch);

  if (!codes) {
    return null;
  }

  const matches = codes
    .map((code) => carcCrosswalk.find((entry) => entry.code === code))
    .filter(Boolean)
    .map((entry) => {
      const result = calculateMatchScore(entry, normalizedSearch);
      return formatMatch(entry, result.score, result.matchedKeywords);
    });

  return matches.length > 1 ? matches : null;
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      error: "Use POST for normalization",
    });
  }

  const { text } = req.body ?? {};

  if (!text || typeof text !== "string") {
    return res.status(400).json({
      error: "Provide denial text in the 'text' field",
    });
  }

  const normalizedSearch = normalizeText(text);

  if (!normalizedSearch) {
    return res.status(400).json({
      error: "Provide denial text in the 'text' field",
    });
  }

  // Handle phrases we already know are semantically ambiguous.
  const knownMatches = getKnownAmbiguousMatches(normalizedSearch);

  if (knownMatches) {
    return res.status(200).json({
      matchStatus: "ambiguous",
      code: "MULTIPLE",
      codeType: "CARC",
      crosswalkVersion: carcMetadata.version,
      message:
        "The denial text is too broad to identify one CARC reliably. Review the possible matches and use additional payer context to distinguish them.",
      matches: knownMatches,
    });
  }

  // Score every CARC so we can compare the strongest candidates rather than
  // discarding all but the first winner.
  const rankedMatches = carcCrosswalk
    .map((entry) => {
      const result = calculateMatchScore(entry, normalizedSearch);
      return {
        entry,
        score: result.score,
        matchedKeywords: result.matchedKeywords,
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);

  if (rankedMatches.length === 0) {
    return res.status(200).json({
      matchStatus: "no_match",
      code: "N/A",
      crosswalkVersion: carcMetadata.version,
      codeType: "CARC",
      summary: "No matching CARC code found",
      category: null,
      adjustmentType: null,
      owner: null,
      recommendedAction: null,
      requiresRemarkCode: null,
      preventable: null,
      matchScore: 0,
      matchedKeywords: [],
      status: null,
    });
  }

  const bestMatch = rankedMatches[0];

  // If two or more meaningful candidates score almost the same, return the
  // close candidates rather than pretending the first one is certain.
  const closeMatches = rankedMatches
    .filter(
      (candidate) =>
        candidate.score >= MIN_MATCH_SCORE &&
        bestMatch.score - candidate.score <= AMBIGUITY_SCORE_GAP
    )
    .slice(0, MAX_AMBIGUOUS_MATCHES);

  if (closeMatches.length > 1) {
    return res.status(200).json({
      matchStatus: "ambiguous",
      code: "MULTIPLE",
      codeType: "CARC",
      crosswalkVersion: carcMetadata.version,
      message:
        "More than one CARC is a plausible match. Review the ranked matches or provide additional denial context.",
      matches: closeMatches.map((candidate) =>
        formatMatch(
          candidate.entry,
          candidate.score,
          candidate.matchedKeywords
        )
      ),
    });
  }

  return res.status(200).json({
    matchStatus: "matched",
    crosswalkVersion: carcMetadata.version,
    ...formatMatch(
      bestMatch.entry,
      bestMatch.score,
      bestMatch.matchedKeywords
    ),
  });
}
