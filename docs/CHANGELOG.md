# Changelog

## 1.3.0 — 2026-08-30

### Response terminology

- Renamed the response/crosswalk field `adjustmentType` to `reasonType`.
- Updated all 17 supported CARCs so `reasonType` describes the specific adjudication reason rather than implying every CARC is an operational adjustment.
- Reworded the CARC 23 BDS summary from adjustment-centric language to: `The amount reflects how a prior payer previously adjudicated the claim or service.`
- Updated README terminology to distinguish CARC terminology from the operational meaning of returned amounts.
- Removed a duplicate `matchedKeywords` property in the response formatter.

### Compatibility note

- This release changes the response schema: clients using `adjustmentType` should use `reasonType` instead.

### Validation

- 201/201 configured keywords routed to the intended CARC.
- 17/17 BDS summaries routed to the intended CARC.
- 88/88 configured exclusion phrases did not route back to the CARC that excludes them.
- 17 targeted production-style collision and weak-evidence tests passed.

## 1.2.0 — 2026-08-30

### Added

- CARC 1 — deductible
- CARC 2 — coinsurance
- CARC 3 — copayment
- CARC 4 — procedure/modifier inconsistency
- CARC 23 — prior-payer adjudication impact
- CARC 97 — bundled/inclusive payment
- Natural-language coverage for `noncovered service` under CARC 96.
- Natural-language coverage for `procedure was not authorized` under CARC 197.

### Matching changes

- Raised the minimum confidence required for a single-match response.
- Weak evidence now returns `matchStatus: "no_match"` instead of forcing a CARC.
- Similar keyword phrases no longer accumulate duplicate weight.
- Fuzzy word evidence is counted once per unique meaningful term.
- Phrase containment now respects word boundaries, preventing false substring matches such as `correct payer` inside `incorrect payer`.
- Hardened the exported `searchCarcs()` helper to use the same safer phrase and fuzzy-evidence principles.

### Crosswalk cleanup

- Removed an over-broad CARC 22 exclusion that conflicted with its own `incorrect payer order` keyword.
- Added additional CARC 23 language for prior-payer payment/adjudication scenarios.
- Updated the crosswalk verification date to 2026-08-30.

### Validation

- 17 supported CARCs.
- 201 configured keywords regression-tested: 201/201 routed to the intended CARC.
- All configured exclusion phrases tested against self-matching: 0 failures.
- Every BDS summary tested against its own CARC: 0 failures.
- Targeted collision tests passed for:
  - CARC 22 vs. 23 vs. 109
  - CARC 18 vs. 97
  - CARC 4 vs. 197
  - CARC 50 vs. 96 vs. 252
  - CARC 1 vs. 2 vs. 3
  - weak generic phrases returning `no_match`

## 1.1.0 — 2026-08-29

### Added

- Ambiguous multi-match responses for denial text that cannot reliably identify one CARC.
- Known ambiguous handling for broad payer phrases such as `other payer`, `other payor`, `another payer`, and `another payor`.
- `matchReason` for known ambiguous candidate results.
- `sharedTerms` to distinguish fuzzy word overlap from literal keyword matches.

### Changed

- `matchedKeywords` reports literal phrase matches rather than fuzzy keyword candidates.
- Clear, well-supported denial text continues to return a single CARC.

### Validated examples

- `other payer` → CARC 22 and CARC 109
- `other payor` → CARC 22 and CARC 109
- `another payer` → CARC 22 and CARC 109
- `other insurance is primary` → CARC 22
- `coordination of benefits` → CARC 22
- `claim submitted to wrong payer` → CARC 109
- `service was not authorized` → CARC 197
- `additional medical records are required` → CARC 252

## 1.0.0

- Initial BDS Denial Intelligence CARC matching implementation.
- Text normalization, weighted keyword matching, exclusions, operational categories, ownership, and recommended actions.
