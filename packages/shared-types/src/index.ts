/**
 * ✅ Shared Utilities Package (Trimmed Down)
 * 
 * This package now contains ONLY:
 * - Reusable Zod validators (building blocks)
 * - Universal constants (if any)
 * - Shared utilities (if any)
 * 
 * ❌ What this package does NOT contain:
 * - API-specific schemas → Now defined inline in procedures
 * - API response types → ORPC infers these automatically
 * - Procedure input/output schemas → Defined in procedures
 * 
 * **Why this change?**
 * ORPC's automatic type inference makes manual type syncing unnecessary.
 * Schemas defined in procedures flow to frontend automatically.
 * 
 * @see ORPC_TYPE_INFERENCE_GUIDE.md
 */

export * from './fileUpload';

