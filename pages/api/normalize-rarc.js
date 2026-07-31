import rarcCrosswalk from "../../data/rarcCrosswalk.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST for normalization" });
  }

  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Provide denial text in the 'text' field" });
  }

  const lower = text.toLowerCase();

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of rarcCrosswalk) {
    if (!entry.keywords || entry.keywords.length === 0) continue;

    let score = 0;

    for (const keyword of entry.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (!bestMatch) {
    return res.status(200).json({
      code: "N/A",
      description: "No matching RARC code found",
      category: null,
      confidence: 0,
      matchedKeywords: []
    });
  }

  return res.status(200).json({
    code: bestMatch.code,
    description: bestMatch.description,
    category: bestMatch.category,
    confidence: bestScore,
    matchedKeywords: bestMatch.keywords.filter(k => lower.includes(k.toLowerCase()))
  });
}
