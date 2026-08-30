# Changelog

## 1.1.0 — 2026-08-29

### Added

- Ambiguous multi-match responses for denial text that cannot reliably identify one CARC.
- Known ambiguous handling for broad payer phrases such as `other payer`, `other payor`, `another payer`, and `another payor`.
- `matchReason` for known ambiguous candidate results.
- `sharedTerms` to distinguish fuzzy word overlap from literal keyword matches.

### Changed

- `matchedKeywords` now reports literal phrase matches rather than fuzzy keyword candidates.
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
