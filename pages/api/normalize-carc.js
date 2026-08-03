import carcCrosswalk from "../../data/carcCrosswalk.js";

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

function countSharedWords(firstText, secondText) {
  const firstWords = new Set(
    firstText.split(" ").filter((word) => word.length > 2)
  );

  const secondWords = new Set(
    secondText.split(" ").filter((word) => word.length > 2)
  );

  let sharedWords = 0;

  for (const word of firstWords) {
    if (secondWords.has(word)) {
      sharedWords += 1;
    }
  }

  return sharedWords;
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
  const sharedWords = countSharedWords(
    normalizedSearch,
    normalizedKeyword
  );

  if (sharedWords > 0) {
    score += sharedWords * 3;
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
    matchedKeywords,
  };
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

  let bestMatch = null;
  let bestScore = 0;
  let bestMatchedKeywords = [];

  for (const entry of carcCrosswalk) {
    const result = calculateMatchScore(entry, normalizedSearch);

    if (result.score > bestScore) {
      bestScore = result.score;
      bestMatch = entry;
      bestMatchedKeywords = result.matchedKeywords;
    }
  }

  if (!bestMatch || bestScore === 0) {
    return res.status(200).json({
      code: "N/A",
      codeType: "CARC",
      summary: "No matching CARC code found",
      category: null,
      adjustmentType: null,
      matchScore: 0,
      matchedKeywords: [],
      recommendedAction: null,
    });
  }

  return res.status(200).json({
    code: bestMatch.code,
    codeType: bestMatch.codeType,
    summary: bestMatch.summary,
    category: bestMatch.category,
    adjustmentType: bestMatch.adjustmentType,
    owner: bestMatch.owner,
    recommendedAction: bestMatch.recommendedAction,
    requiresRemarkCode: bestMatch.requiresRemarkCode,
    preventable: bestMatch.preventable,
    matchScore: bestScore,
    matchedKeywords: bestMatchedKeywords,
    status: bestMatch.status,
  });
}
