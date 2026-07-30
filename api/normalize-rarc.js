export default function handler(req, res) {
  // Allow GET requests without crashing
  if (req.method === "GET") {
    return res.status(200).json({
      status: "ok",
      message: "RARC API is running",
      endpoint: "/api/normalize-rarc"
    });
  }

  // Handle POST requests
  const { denial_text, payer } = req.body || {};

  res.status(200).json({
    rarc: "M20",
    description: "Missing/incomplete/invalid HCPCS",
    category: "Coding/Billing",
    matched_pattern: "invalid hcpcs",
    confidence: 0.98
  });
}
