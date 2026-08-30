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
  "and",
  "or",
  "amount",
  "adjustment",
  "adjustments",
  "procedure",
  "procedures",
  "code",
  "codes",
  "responsibility",
  "another",
  "other",
  "prior",
  "previous",
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

const MIN_MATCH_SCORE = 20;
const AMBIGUITY_SCORE_GAP = 5;
const MAX_AMBIGUOUS_MATCHES = 3;

function getSharedTerms(firstText, secondText) {
  const firstWords = new Set(firstText.split(" "));
  const secondWords = new Set(secondText.split(" "));

  return [...firstWords].filter(
    (word) =>
      secondWords.has(word) &&
      word.length > 2 &&
      !ignoredWords.has(word)
  );
}

function calculateSharedWordScore(firstText, secondText) {
  return getSharedTerms(firstText, secondText).reduce(
    (score, word) => score + (highValueWords.has(word) ? 8 : 3),
    0
  );
}

function containsPhrase(text, phrase) {
  return ` ${text} `.includes(` ${phrase} `);
}

function calculateMatchScore(entry, normalizedSearch) {
  let score = 0;
  let bestKeywordPhraseScore = 0;
  const matchedKeywords = [];
  const sharedTerms = new Set();

  // Use the strongest phrase relationship rather than summing every similar
  // keyword. This prevents an entry from winning simply because it contains
  // many near-duplicate keyword phrases.
  for (const keyword of entry.keywords ?? []) {
    const normalizedKeyword = normalizeText(keyword);
    let phraseScore = 0;

    if (normalizedSearch === normalizedKeyword) {
      phraseScore = 40;
      matchedKeywords.push(keyword);
    } else if (containsPhrase(normalizedSearch, normalizedKeyword)) {
      phraseScore = 25;
      matchedKeywords.push(keyword);
    } else if (containsPhrase(normalizedKeyword, normalizedSearch)) {
      phraseScore = 15;

      for (const term of getSharedTerms(normalizedSearch, normalizedKeyword)) {
        sharedTerms.add(term);
      }
    } else {
      for (const term of getSharedTerms(normalizedSearch, normalizedKeyword)) {
        sharedTerms.add(term);
      }
    }

    bestKeywordPhraseScore = Math.max(bestKeywordPhraseScore, phraseScore);
  }

  // Fuzzy evidence is scored once per unique meaningful term, not once for
  // every keyword containing the same term.
  const sharedWordScore = [...sharedTerms].reduce(
    (total, word) => total + (highValueWords.has(word) ? 8 : 3),
    0
  );

  score += Math.max(bestKeywordPhraseScore, sharedWordScore);

  for (const exclusion of entry.exclusions ?? []) {
    const normalizedExclusion = normalizeText(exclusion);

    if (containsPhrase(normalizedSearch, normalizedExclusion)) {
      score -= 30;
    }
  }

  const normalizedSummary = normalizeText(entry.summary);
  const normalizedCategory = normalizeText(entry.category);
  const meaningfulSearchTerms = normalizedSearch
    .split(" ")
    .filter((word) => word.length > 2 && !ignoredWords.has(word));

  // Summary/category bonuses are useful for phrases, but one generic word
  // should not become a confident CARC match merely because it appears in a
  // summary or category label.
  if (normalizedSearch === normalizedSummary) {
    score += 40;
  } else if (
    meaningfulSearchTerms.length >= 2 &&
    containsPhrase(normalizedSummary, normalizedSearch)
  ) {
    score += 12;
  }

  if (
    meaningfulSearchTerms.length >= 2 &&
    containsPhrase(normalizedCategory, normalizedSearch)
  ) {
    score += 8;
  }

  return {
    score: Math.max(score, 0),
    matchedKeywords: [...new Set(matchedKeywords)],
    sharedTerms: [...sharedTerms],
  };
}

function formatMatch(entry, score, matchedKeywords, sharedTerms) {
  return {
    code: entry.code,
    codeType: entry.codeType,
    summary: entry.summary,
    category: entry.category,
    reasonType: entry.reasonType,
    owner: entry.owner,
    recommendedAction: entry.recommendedAction,
    requiresRemarkCode: entry.requiresRemarkCode,
    preventable: entry.preventable,
    matchScore: score,
    matchedKeywords,
    sharedTerms,
    status: entry.status,
  };
}

function getKnownAmbiguousMatches(normalizedSearch) {
  const codes = knownAmbiguousPhrases.get(normalizedSearch);

  if (!codes) {
    return null;
  }

  const matchReasons = {
    "22": "Another payer may be primary or responsible under coordination-of-benefits rules.",
    "109": "The claim may have been submitted or routed to the wrong payer.",
  };

  const matches = codes
    .map((code) => carcCrosswalk.find((entry) => entry.code === code))
    .filter(Boolean)
    .map((entry) => ({
      code: entry.code,
      codeType: entry.codeType,
      summary: entry.summary,
      category: entry.category,
      reasonType: entry.reasonType,
      owner: entry.owner,
      recommendedAction: entry.recommendedAction,
      requiresRemarkCode: entry.requiresRemarkCode,
      preventable: entry.preventable,
      matchReason:
        matchReasons[entry.code] ??
        "The available denial text supports this CARC as a possible interpretation.",
      status: entry.status,
    }));

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
        "The phrase may indicate coordination of benefits or an incorrect payer. Use additional payer context to distinguish the correct CARC.",
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
        sharedTerms: result.sharedTerms,
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
      reasonType: null,
      owner: null,
      recommendedAction: null,
      requiresRemarkCode: null,
      preventable: null,
      matchScore: 0,
      matchedKeywords: [],
      sharedTerms: [],
      status: null,
    });
  }

  const bestMatch = rankedMatches[0];

  // Do not force a CARC when the strongest evidence is still weak.
  if (bestMatch.score < MIN_MATCH_SCORE) {
    return res.status(200).json({
      matchStatus: "no_match",
      code: "N/A",
      crosswalkVersion: carcMetadata.version,
      codeType: "CARC",
      summary: "No matching CARC code found",
      category: null,
      reasonType: null,
      owner: null,
      recommendedAction: null,
      requiresRemarkCode: null,
      preventable: null,
      matchScore: bestMatch.score,
      matchedKeywords: bestMatch.matchedKeywords,
      sharedTerms: bestMatch.sharedTerms,
      status: null,
    });
  }

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
          candidate.matchedKeywords,
          candidate.sharedTerms
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
      bestMatch.matchedKeywords,
      bestMatch.sharedTerms
    ),
  });
}
