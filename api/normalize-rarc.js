export default function handler(req, res) {
  const { denial_text, payer } = req.body;

  res.status(200).json({
    rarc: "M20",
    description: "Missing/incomplete/invalid HCPCS",
    category: "Coding/Billing",
    matched_pattern: "invalid hcpcs",
    confidence: 0.98
  });
}
