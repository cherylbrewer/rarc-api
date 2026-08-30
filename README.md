# BDS Denial Intelligence API

The BDS Denial Intelligence API interprets free-text healthcare denial language and returns likely Claim Adjustment Reason Code (CARC) matches together with operational context.

## Current scope

This release supports a curated subset of CARCs. It is intended for free-text denial language, portal text, notes, and other workflows where a reliable CARC is not already available.

It is **not** intended to replace the CARC supplied on a properly populated 835 remittance.

## Response behavior

### Clear match

When the available text supports one clear CARC, the API returns:

- CARC code and BDS summary
- operational category
- adjustment type
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

## Version

Current crosswalk/API behavior version: **1.1.0**

## Important notes

BDS summaries, categories, ownership, recommended actions, keywords, and other operational fields are independently written by Brewer Data Solutions. Do not treat them as verbatim X12 code descriptions.

This API is a decision-support and normalization tool. Users should validate results against the actual remittance, payer documentation, contract terms, and applicable billing requirements.
