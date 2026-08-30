# BDS Denial Intelligence API

The BDS Denial Intelligence API interprets free-text healthcare denial and remittance language and returns likely Claim Adjustment Reason Code (CARC) matches together with operational context.

## Current scope

Version 1.4.0 supports a curated subset of 25 CARCs:

`1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 18, 22, 23, 29, 45, 50, 96, 97, 109, 197, 252, 253`

It is intended for free-text denial/remittance language, portal text, notes, and other workflows where a reliable CARC is not already available.

It is **not** intended to replace the CARC supplied on a properly populated 835 remittance.

Not every supported CARC represents a denial. The current set also includes patient-responsibility amounts, prior-payer adjudication, contractual payment limits, bundled/inclusive payment logic, coding-consistency edits, and government payment reductions.

## Response behavior

### Clear match

When the available text supports one clear CARC, the API returns:

- CARC code and BDS summary
- operational category
- reason type
- likely operational owner
- recommended action
- match score
- literal matched keywords
- shared terms used for fuzzy matching, when applicable

### Ambiguous match

When short or broad text can reasonably represent more than one CARC, the API may return:

- `matchStatus: "ambiguous"`
- `code: "MULTIPLE"`
- multiple candidate CARCs
- a `matchReason` explaining why each candidate is plausible

For example, `other payer` may represent either coordination of benefits (CARC 22) or an incorrect/wrong payer situation (CARC 109). The API returns both rather than forcing an unsupported single answer.

### No match

Weak or overly generic evidence returns:

- `matchStatus: "no_match"`
- `code: "N/A"`

This prevents broad phrases such as `modifier`, `patient responsibility`, `age mismatch`, `gender mismatch`, `provider mismatch`, or `another service` from being forced into a CARC without enough context.

## Matching safeguards

The matcher includes safeguards intended to reduce false positives:

- keyword families do not gain artificial weight simply because many similar phrases are configured
- fuzzy term evidence is counted once per unique meaningful term
- phrase matching respects word boundaries
- low-confidence matches return `no_match`
- known semantic ambiguity can return multiple CARCs instead of false certainty
- paired coding-consistency CARCs require enough context to distinguish procedure, diagnosis, demographic, provider, and place-of-service conflicts

## Version

Current crosswalk/API behavior version: **1.4.0**

## Response terminology

`reasonType` describes the specific reason represented by the CARC, such as `Deductible`, `Timely Filing`, `Medical Necessity`, `Diagnosis / Procedure Consistency`, or `Sequestration`.

## Important notes

BDS summaries, categories, ownership, recommended actions, keywords, exclusions, and other operational fields are independently written by Brewer Data Solutions. Do not treat them as verbatim X12 code descriptions.

This API is a decision-support and normalization tool. Users should validate results against the actual remittance, payer documentation, contract terms, benefit information, coding rules, and applicable billing requirements.
