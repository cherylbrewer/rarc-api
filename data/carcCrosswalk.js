// Brewer Data Solutions CARC Crosswalk
// Version: 1.1.0
// Last verified against the X12 CARC list: 2026-08-01
//
// IMPORTANT:
// - "summary" contains original Brewer Data Solutions wording.
// - It is not the official X12 description.
// - "category", "adjustmentType", "owner", "keywords", and
//   "recommendedAction" are operational fields created by BDS.
// - CARCs explain why a claim or service was paid differently than billed.
// - A CARC does not always represent a denial.

export const carcCrosswalk = [
  {
    code: "16",
    codeType: "CARC",
    summary:
      "The claim or service is missing required information or contains a billing or submission error.",
    category: "Missing / Invalid Information",
    adjustmentType: "Denial",
    keywords: [
      "claim missing information",
      "service missing information",
      "required information missing",
      "incomplete claim information",
      "invalid claim information",
      "billing error",
      "submission error",
      "claim contains errors",
      "claim cannot be processed",
      "missing required claim data",
      "invalid billing information",
      "incomplete billing information",
    ],
    exclusions: [
      "missing medical records",
      "missing attachment",
      "documentation required",
      "attachment not received",
    ],
    owner: "Varies — use accompanying RARC",
    recommendedAction:
      "Review the accompanying RARC to identify the specific missing or invalid information. Correct the claim and submit it according to the payer's correction or replacement-claim requirements.",
    requiresRemarkCode: true,
    preventable: true,
    status: "active",
    effectiveDate: "1995-01-01",
    lastModifiedDate: "2018-03-01",
    deactivationDate: null,
  },

  {
    code: "18",
    codeType: "CARC",
    summary:
      "The payer identified the claim or service as an exact duplicate of one previously received or processed.",
    category: "Duplicate Claim / Service",
    adjustmentType: "Denial",
    keywords: [
      "exact duplicate claim",
      "duplicate claim",
      "duplicate service",
      "claim previously submitted",
      "service previously submitted",
      "claim already processed",
      "service already processed",
      "previously processed claim",
      "duplicate billing",
      "same claim submitted twice",
      "same service submitted twice",
    ],
    exclusions: [
      "overlapping service",
      "frequency limit",
      "included in another service",
      "bundled service",
    ],
    owner: "Billing / Claims",
    recommendedAction:
      "Confirm whether the claim or service is truly duplicated. Do not rebill a valid duplicate. If the payer matched it incorrectly, submit a corrected claim or reconsideration with documentation showing why the services are distinct.",
    requiresRemarkCode: false,
    preventable: true,
    status: "active",
    effectiveDate: "1995-01-01",
    lastModifiedDate: "2013-06-02",
    deactivationDate: null,
  },

  {
    code: "22",
    codeType: "CARC",
    summary:
      "Another insurer may be responsible for the claim under coordination-of-benefits rules.",
    category: "Coordination of Benefits",
    adjustmentType: "Coordination of Benefits",
    keywords: [
      "another payer may be responsible",
      "other insurance may be primary",
      "coordination of benefits",
      "cob information required",
      "bill primary insurance",
      "submit to primary payer",
      "primary coverage exists",
      "other insurance coverage",
      "incorrect payer order",
      "payer is secondary",
      "secondary payer denial",
      "another insurance is primary",
      "other insurance is primary",
      "coordination of benefits",
      "payer is secondary",
      "primary payer must process first",
      "submit primary payer eob",
      "primary insurance must be billed first",
    ],
    exclusions: [
      "patient not eligible",
      "coverage terminated",
      "non-covered benefit",
      "authorization missing",
      "wrong payer",
      "incorrect payer",
      "correct payer",
      "send to correct payer",
      "submit to correct payer",
      "not covered by this payer",
      "bill another payer",
      "bill correct payer",
    ],
    owner: "Registration / Eligibility",
    recommendedAction:
      "Verify the patient's coverage and payer order for the date of service. Bill the correct primary payer first, update coordination-of-benefits information, and then submit the primary payer's adjudication to the secondary payer when required.",
    requiresRemarkCode: false,
    preventable: true,
    status: "active",
    effectiveDate: "1995-01-01",
    lastModifiedDate: "2007-09-30",
    deactivationDate: null,
  },

  {
    code: "29",
    codeType: "CARC",
    summary:
      "The claim was received after the payer's filing deadline.",
    category: "Timely Filing",
    adjustmentType: "Denial",
    keywords: [
      "timely filing expired",
      "filing deadline expired",
      "time limit for filing expired",
      "claim filed late",
      "claim received late",
      "claim submitted after deadline",
      "past filing limit",
      "untimely claim submission",
      "timely filing denial",
      "filing limit exceeded",
      "late claim",
    ],
    exclusions: [
      "appeal deadline expired",
      "authorization time limit expired",
      "documentation received late",
    ],
    owner: "Billing / Claims",
    recommendedAction:
      "Confirm the payer's filing limit and the original submission date. If the claim was submitted timely, appeal with clearinghouse acceptance reports, payer acknowledgments, or other proof of timely filing. Otherwise, determine whether an exception applies.",
    requiresRemarkCode: false,
    preventable: true,
    status: "active",
    effectiveDate: "1995-01-01",
    lastModifiedDate: null,
    deactivationDate: null,
  },

  {
    code: "45",
    codeType: "CARC",
    summary:
      "The billed charge exceeds the payer's fee schedule, maximum allowable amount, contracted rate, or legislated payment limit.",
    category: "Contractual / Fee Schedule",
    adjustmentType: "Contractual Adjustment",
    keywords: [
      "charge exceeds fee schedule",
      "exceeds maximum allowable",
      "contracted rate adjustment",
      "contractual adjustment",
      "fee schedule reduction",
      "allowed amount reduction",
      "charge exceeds allowed amount",
      "maximum allowable amount",
      "provider contract adjustment",
      "negotiated rate adjustment",
      "charges exceed contracted rate",
      "amount above fee schedule",
    ],
    exclusions: [
      "medical necessity denial",
      "non-covered service",
      "duplicate claim",
      "authorization missing",
    ],
    owner: "Contracting / Payment Variance",
    recommendedAction:
      "Compare the payer's allowed amount with the applicable contract or fee schedule. Post a valid contractual adjustment. Investigate or dispute the payment when the allowed amount does not match the expected contracted or regulated rate.",
    requiresRemarkCode: false,
    preventable: false,
    status: "active",
    effectiveDate: "1995-01-01",
    lastModifiedDate: "2017-07-01",
    deactivationDate: null,
  },

  {
    code: "50",
    codeType: "CARC",
    summary:
      "The payer considers the service non-covered because its medical-necessity requirements were not met.",
    category: "Medical Necessity",
    adjustmentType: "Denial",
    keywords: [
      "not medically necessary",
      "medical necessity not met",
      "medical necessity denial",
      "service lacks medical necessity",
      "service not supported as medically necessary",
      "does not meet medical necessity criteria",
      "clinical criteria not met",
      "medical necessity requirements not satisfied",
      "payer determined service unnecessary",
      "non-covered for medical necessity",
      "documentation does not support medical necessity",
    ],
    exclusions: [
      "documentation not received",
      "authorization missing",
      "benefit exclusion",
      "experimental procedure",
      "frequency limit",
    ],
    owner: "Clinical Appeals / Utilization Review",
    recommendedAction:
      "Review the payer's medical policy and the clinical documentation. Determine whether the record supports medical necessity. Submit a clinical appeal, corrected diagnosis information, or additional records when appropriate.",
    requiresRemarkCode: false,
    preventable: "Varies",
    status: "active",
    effectiveDate: "1995-01-01",
    lastModifiedDate: "2017-07-01",
    deactivationDate: null,
  },

  {
    code: "96",
    codeType: "CARC",
    summary:
      "The payer considers the charge non-covered for a reason identified by the accompanying remark code.",
    category: "Non-Covered",
    adjustmentType: "Denial",
    keywords: [
      "non-covered charge",
      "noncovered charge",
      "service not covered",
      "charge not covered",
      "benefit not covered",
      "excluded service",
      "coverage exclusion",
      "not a covered benefit",
      "plan does not cover service",
      "procedure not covered",
      "item not covered",
      "services are non-covered",
    ],
    exclusions: [
      "not medically necessary",
      "contractual adjustment",
      "fee schedule reduction",
      "duplicate claim",
    ],
    owner: "Varies — use accompanying RARC",
    recommendedAction:
      "Review the accompanying RARC and the patient's benefit plan to identify the specific coverage reason. Determine whether the service should be corrected, billed to another payer, appealed, or transferred to patient responsibility when permitted.",
    requiresRemarkCode: true,
    preventable: "Varies",
    status: "active",
    effectiveDate: "1995-01-01",
    lastModifiedDate: "2017-07-01",
    deactivationDate: null,
  },

 {
  code: "109",
  codeType: "CARC",
  summary:
    "This payer or contractor does not cover the claim or service. The claim must be sent to the correct payer or contractor.",
  category: "Wrong Payer / Claim Routing",
  adjustmentType: "Denial",
  keywords: [
    "wrong payer",
    "incorrect payer",
    "not covered by this payer",
    "not covered by this contractor",
    "send claim to correct payer",
    "submit claim to correct payer",
    "bill the correct payer",
    "bill another payer",
    "claim sent to wrong payer",
    "claim routed to wrong payer",
    "correct payer must process",
    "payer not responsible for claim",
    "contractor not responsible for claim"
  ],
  exclusions: [
    "another insurance is primary",
    "other insurance is primary",
    "coordination of benefits",
    "payer is secondary",
    "primary payer must process first",
    "submit primary payer eob"
  ],
  owner: "Registration / Eligibility",
  recommendedAction:
    "Verify the patient's coverage and payer assignment for the date of service. Correct the payer selection or claim routing and submit the claim to the appropriate payer or contractor.",
  requiresRemarkCode: false,
  preventable: true,
  status: "active",
  effectiveDate: "1995-01-01",
  lastModifiedDate: "2012-01-29",
  deactivationDate: null,
},
  
  {
    code: "197",
    codeType: "CARC",
    summary:
      "Required precertification, authorization, notification, or pretreatment approval was absent.",
    category: "Authorization / Pre-cert",
    adjustmentType: "Denial",
    keywords: [
      "authorization absent",
      "prior authorization absent",
      "precertification absent",
      "pre-certification absent",
      "notification absent",
      "pretreatment approval absent",
      "no authorization on file",
      "authorization not obtained",
      "prior auth not obtained",
      "missing prior authorization",
      "missing precertification",
      "service not authorized",
      "no precert on file",
      "service wasn't authorized",
      "service was not authorized",
      "authorization missing",
      "authorization required",
      "prior authorization required",
      "precertification required",
      "precertification missing",
    ],
    exclusions: [
      "authorization exceeded",
      "authorization expired",
      "invalid authorization number",
      "services do not match authorization",
      "referral absent",
    ],
    owner: "Authorization / Pre-cert",
    recommendedAction:
      "Verify whether authorization or notification was required and whether it was obtained. Add the valid authorization information to a corrected claim when permitted. Otherwise, request retrospective authorization or appeal with emergency, medical-necessity, or payer-notification documentation when applicable.",
    requiresRemarkCode: false,
    preventable: true,
    status: "active",
    effectiveDate: "2006-10-31",
    lastModifiedDate: "2018-05-01",
    deactivationDate: null,
  },

  {
    code: "252",
    codeType: "CARC",
    summary:
      "The payer needs an attachment or other documentation before it can adjudicate the claim or service.",
    category: "Documentation Required",
    adjustmentType: "Denial",
    keywords: [
      "documentation required",
      "attachment required",
      "additional documentation required",
      "medical records required",
      "records needed for review",
      "supporting documentation needed",
      "claim attachment needed",
      "documentation needed to process claim",
      "records required to adjudicate",
      "submit requested records",
      "payer needs documentation",
      "additional records required",
      "medical records required",
      "additional medical records required",
      "medical records are required",
      "supporting medical records required",
      "records required before processing",
      "records needed before claim can be considered",
    ],
    exclusions: [
      "documentation not received",
      "attachment referenced but not received",
      "documentation received late",
      "medical necessity not met",
    ],
    owner: "HIM / Medical Records",
    recommendedAction:
      "Review the accompanying RARC to identify the specific attachment or records requested. Submit the documentation using the payer's required method and retain proof of submission.",
    requiresRemarkCode: true,
    preventable: "Varies",
    status: "active",
    effectiveDate: "2012-09-30",
    lastModifiedDate: "2013-06-02",
    deactivationDate: null,
  },

  {
    code: "253",
    codeType: "CARC",
    summary:
      "The payment was reduced because of a federal sequestration requirement.",
    category: "Government Payment Reduction",
    adjustmentType: "Reduction",
    keywords: [
      "sequestration reduction",
      "federal sequestration",
      "federal payment reduction",
      "sequester adjustment",
      "medicare sequestration",
      "mandatory federal reduction",
      "government payment reduction",
      "sequestration amount",
      "federal budget reduction",
    ],
    exclusions: [
      "contractual adjustment",
      "fee schedule reduction",
      "medical necessity denial",
      "non-covered service",
    ],
    owner: "Payment Posting",
    recommendedAction:
      "Post the sequestration reduction using the appropriate contractual or government-adjustment workflow. Do not classify it as a denial or recovery opportunity unless the calculation itself appears incorrect.",
    requiresRemarkCode: false,
    preventable: false,
    status: "active",
    effectiveDate: "2013-06-02",
    lastModifiedDate: "2013-11-01",
    deactivationDate: null,
  },
];

// Find one CARC by its code.
// Accepts either a string or number, such as "16" or 16.
export function getCarcByCode(code) {
  const normalizedCode = String(code).trim().toUpperCase();

  return (
    carcCrosswalk.find((item) => item.code === normalizedCode) ?? null
  );
}

// Return all CARCs matching a category.
// Matching is case-insensitive.
export function getCarcsByCategory(category) {
  const normalizedCategory = String(category).trim().toLowerCase();

  return carcCrosswalk.filter(
    (item) => item.category.toLowerCase() === normalizedCategory
  );
}

// Search summaries, keywords, categories, and actions.
// Results are sorted with the strongest matches first.
export function searchCarcs(searchText) {
  if (typeof searchText !== "string" || !searchText.trim()) {
    return [];
  }

  const normalizedSearch = normalizeText(searchText);

  return carcCrosswalk
    .map((item) => ({
      ...item,
      matchScore: calculateMatchScore(item, normalizedSearch),
    }))
    .filter((item) => item.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

function calculateMatchScore(item, normalizedSearch) {
  let score = 0;

  const normalizedCode = normalizeText(item.code);
  const normalizedSummary = normalizeText(item.summary);
  const normalizedCategory = normalizeText(item.category);
  const normalizedAction = normalizeText(item.recommendedAction);

  // Exact code match receives the highest score.
  if (normalizedSearch === normalizedCode) {
    score += 100;
  }

  // Exact keyword phrases are the strongest natural-language matches.
  for (const keyword of item.keywords) {
    const normalizedKeyword = normalizeText(keyword);

    if (normalizedSearch === normalizedKeyword) {
      score += 40;
    } else if (normalizedSearch.includes(normalizedKeyword)) {
      score += 25;
    } else if (normalizedKeyword.includes(normalizedSearch)) {
      score += 15;
    } else {
      score += countSharedWords(normalizedSearch, normalizedKeyword) * 3;
    }
  }

  // Exclusion phrases subtract from the score to reduce false matches.
  for (const exclusion of item.exclusions ?? []) {
    const normalizedExclusion = normalizeText(exclusion);

    if (normalizedSearch.includes(normalizedExclusion)) {
      score -= 30;
    }
  }

  if (normalizedSummary.includes(normalizedSearch)) {
    score += 12;
  }

  if (normalizedCategory.includes(normalizedSearch)) {
    score += 8;
  }

  if (normalizedAction.includes(normalizedSearch)) {
    score += 4;
  }

  return Math.max(score, 0);
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

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default carcCrosswalk;
