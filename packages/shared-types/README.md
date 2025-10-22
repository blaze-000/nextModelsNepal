# @nextmodels/shared-types

**✅ Reusable Building Blocks Only**

This package contains ONLY reusable Zod validators and utilities used across the monorepo.

## ⚠️ Important: ORPC Type Inference

With ORPC, we **don't need** to manually define API types here. ORPC automatically infers types from backend procedures and flows them to the frontend.

**See:** `ORPC_TYPE_INFERENCE_GUIDE.md` in the project root.

---

## What's Included

### ✅ Reusable Zod Validators

```typescript
import { ImageFileSchema } from "@nextmodels/shared-types";

// Use in procedures
const schema = z.object({
    photo: ImageFileSchema, // ✅ Reusable building block
});
```

**Contains:**

-   `ImageFileSchema` - Image file validation (PNG, JPEG, WebP, SVG, max 10MB)
-   `OptionalImageFileSchema` - Optional image file validation

---

## ❌ What's NOT Included (By Design)

### API Schemas → Define in Procedures

```typescript
// ❌ DON'T define API schemas here
// ✅ Define them inline in procedures instead

// backend/procedures/hero.ts
const HeroLandingSchema = z.object({  // ← Define inline
  hero: z.object({ ... }).nullable(),
  upcoming: z.boolean(),
});

export const heroRouter = {
  getLanding: baseProcedure
    .output(HeroLandingSchema)  // ← ORPC infers types
    .handler(async () => { ... }),
};
```

### API Types → ORPC Infers Automatically

```typescript
// ❌ DON'T manually define types like this
// export type HeroLandingPayload = { ... };

// ✅ ORPC automatically infers types in frontend
const data = await orpc.hero.getLanding();
//    ↑ Type automatically correct!
```

---

## Why This Approach?

### Traditional Approach (❌ Manual Sync)

```
1. Define schema in @shared-types
2. Import in backend
3. Import type in frontend
4. Update all 3 when API changes
```

### ORPC Approach (✅ Automatic)

```
1. Define schema in backend procedure
2. ORPC infers types automatically
3. Frontend gets types automatically
4. Update only 1 place when API changes
```

**Result:**

-   🔴 Manual sync: 3 places to update
-   🟢 ORPC: 1 place to update
-   ✅ 67% less maintenance work

---

## Installation

```bash
# Installed automatically as workspace dependency
pnpm install
```

---

## Usage

```typescript
// ✅ Use reusable validators
import { ImageFileSchema } from "@nextmodels/shared-types";

// Backend procedure
const uploadSchema = z.object({
    photo: ImageFileSchema,
    thumbnail: ImageFileSchema.optional(),
});

// ❌ Don't import API types (ORPC handles them)
// import type { HeroPayload } from '@nextmodels/shared-types';  // Wrong!
```

---

## Adding New Validators

**Only add if:**

-   ✅ Used by MULTIPLE procedures
-   ✅ General-purpose validation (not API-specific)
-   ✅ Reusable building block

**Example:**

```typescript
// ✅ Good: Reusable validator
export const EmailSchema = z.string().email().toLowerCase();

// ❌ Bad: API-specific schema
export const UserLoginSchema = z.object({
    // Define in procedure!
    email: EmailSchema,
    password: z.string(),
});
```

---

## Project Structure

```
packages/shared-types/
├── src/
│   ├── fileUpload.ts    ← Reusable Zod validators
│   └── index.ts         ← Re-exports
├── package.json
├── tsconfig.json
└── README.md
```

---

## Learn More

-   [ORPC Type Inference Guide](../../ORPC_TYPE_INFERENCE_GUIDE.md)
-   [ORPC Architecture](../../ORPC_ARCHITECTURE.md)
-   [ORPC Documentation](https://github.com/unnoq/orpc)

---

**Last Updated:** After ORPC migration (removed API-specific types)
