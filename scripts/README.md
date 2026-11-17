# Repository Scripts & Codemods

This directory contains utility scripts and codemods used during codebase refactoring and styling standardization.

## Codemods (`scripts/codemods/`)
- `extract_crm.cjs`: Script to modularize CRM mock and data structures.
- `fix_buttons.cjs`: Codemod to ensure all `<button>` elements explicitly have `type="button"`.
- `fix_colors.cjs`: Standardization script mapping ad-hoc hex values to design token variables.
- `fix_crm_imports.cjs`: Normalizes import paths for CRM components.
- `fix_data_consistency.cjs`: Aligns data properties across mock payloads.
- `fix_imports.cjs`: Cleans up redundant and relative imports.
- `fix_layout_imports.cjs`: Fixes AppShell and layout component paths.
- `fix_performance.cjs`: Adds memoization patterns and performance hooks.
- `fix_spacing.cjs`: Normalizes margin/padding styles to theme spacing tokens.
- `fix_transitions.cjs`: Standardizes CSS transition timings.
- `refactor_crm.cjs`: Refactoring migration script for CRM modules.
