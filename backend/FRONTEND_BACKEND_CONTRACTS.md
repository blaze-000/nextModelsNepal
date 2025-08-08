## Frontend ↔ Backend API Contracts

This document summarizes what the backend exposes (endpoints, request/response shapes) and what the frontend currently expects or calls. It highlights mismatches to fix.

### Base routes

All routes are mounted under these prefixes (see `backend/src/app.ts`):

- `/api/nav`
- `/api/hero`
- `/api/events`
- `/api/next-events`
- `/api/models`
- `/api/career`
- `/api/feedback`
- `/api/partners`
- `/api/news`
- `/api/contact`
- `/api/member`
- `/api/hire-model`
- `/api/app-form`

All controllers generally return JSON of the form:

```
{ success: boolean, message: string, data?: any }
```

---

### Navigation

- Backend
  - GET `/api/nav` → list of nav items
  - POST `/api/nav` → create item(s)
  - GET `/api/nav/:id`, PATCH `/api/nav/:id`, DELETE `/api/nav/:id`
  - Item schema (simplified): `{ _id, label, path?, type: 'link'|'dropdown', children?: [{ label, path, order? }], visible?, order? }`
- Frontend
  - Currently uses static data from `frontend/data/data.ts` (no live fetch)
  - Expected types: see `frontend/src/types/navbar.types.d.ts` (`MenuItem`, `Submenu`)
- Notes
  - If wired up, backend `children` would need transforming to `submenu` shape and add a numeric `id` per item (frontend expects `id: number`).

---

### Hero

- Backend
  - GET `/api/hero` → list
  - POST `/api/hero`, GET/PATCH/DELETE `/api/hero/:id`
  - Schema: `{ _id, maintitle, subtitle, description, images: string[] }`
- Frontend
  - No direct fetch found; sections rely on static content/components
  - If needed, frontend can use the fields above directly
- Notes
  - Frontend does not currently require IDs or timestamps; backend does not include timestamps.

---

### Events

- Backend
  - GET `/api/events` → list; GET `/api/events/:id`
  - POST `/api/events` (multipart for images), PATCH `/api/events/:id`, DELETE `/api/events/:id`
  - Schema (key fields): `{ _id, index:number, state?:string, coverImage, title, titleImage?, date, overview, logo, subImage?, purpose?, member?:ObjectId, highlight:string[], eventDescription?, startingTimelineIcon, startingTimelineDate?, startingTimelineEvent?, midTimelineIcon, midTimelineDate?, midTimelineEvent?, endTimelineIcon, endTimelineDate?, endTimelineEvent?, sponsersImage:string[] }`
- Frontend
  - No live fetch found; components use hardcoded demo data (`frontend/src/components/home/event.tsx`, `events/hero.tsx`)
  - Expected type in `frontend/src/types/types.d.ts` (`EventType`) includes: `{ id, title, startDate, endDate, briefInfo, imageSrc, state: 'ongoing'|'ended', managedBy: 'self'|'partner', getTicketLink, aboutLink }`
- Mismatches to address when wiring
  - Backend has single `date` string, frontend expects `startDate` and `endDate`
  - Frontend expects `managedBy`, `getTicketLink`, `aboutLink` (missing in backend)
  - Map backend `_id`/`index` to frontend `id` string
  - Map `overview` → `briefInfo`, `coverImage` → `imageSrc`

---

### Next Events (criteria/cards)

- Backend
  - GET `/api/next-events` → list; GET `/api/next-events/:id`
  - POST/PATCH/DELETE with nested `card` and `item` arrays
  - Schema: `{ _id, tag, title, titleImage, image, description, noticeName, notice:string[], card:[{ index?, cardTitle, item:[{ index?, criteriaTitle, criteria, criteriaIcon }] }] }`
- Frontend
  - No direct usage found

---

### Company Models

- Backend
  - GET `/api/models` → list; GET `/api/models/:id`
  - POST `/api/models` (multipart), PATCH `/api/models/:id`, DELETE `/api/models/:id`
  - Schema: `{ _id, name, intro, address, coverImage, images:string[], gender }`
- Frontend
  - Static model lists in multiple components; expects `Model` as `{ name, image, location?, link?, designation?, tag? }`
- Mapping notes
  - Map `coverImage` → `image`, `address` → `location`, `intro` → `designation`
  - `link` and `tag` are not present in backend; add or compute on frontend

---

### Career

- Backend
  - GET `/api/career` → list; GET `/api/career/:id`
  - POST (multipart), PATCH, DELETE
  - Schema: `{ _id, maintitle, subtitle, description, images?:string[], link? }`
- Frontend
  - No live fetch found

---

### Feedback

- Backend
  - GET `/api/feedback` → list; item: `{ _id, maintitle, item:[{ index, name, message, images:string[] }] }`
- Frontend
  - Expects `FeedbackSection` with `feedback: Testimonial[]` where `Testimonial = { quote, name, image }`
- Mapping
  - Map `message` → `quote`, and pick one `image` from `images`

---

### Partners

- Backend
  - GET `/api/partners` → list; schema: `{ _id, partners:[{ index:number, sponserName, sponserImage }] }`
- Frontend
  - Expects `{ mainTitle?: string, partners: { name, image }[] }` in components; or simple `Partner[]`
- Mapping
  - Map `sponserName` → `name`, `sponserImage` → `image`

---

### News

- Backend
  - GET `/api/news` → list; GET `/api/news/:id`
  - POST (multipart), PATCH, DELETE
  - Schema: `{ _id, title, description, content?, year:number, images:string[], event?:ObjectId }`
- Frontend
  - Expected `News` type (if used): `{ id, title, description, content?, year:number, images:string[], event?:string, createdAt?, updatedAt? }`
- Mapping
  - Map `_id` → `id`, `event:ObjectId` → `event:string`
  - Backend currently lacks timestamps

---

### Contact (general inquiries)

- Backend
  - POST `/api/contact` (JSON): body validated by `contactFormSchema`
    - `{ name, subject, email, phone, message }`
  - GET `/api/contact` → list; GET/DELETE `/api/contact/:id`
  - Response: `{ success, message, data: ContactModel }` where model also includes `{ status:'new'|'read'|'replied'|'archived', replied:boolean, createdAt:Date, updatedAt:Date }`
- Frontend
  - `frontend/src/components/home/contact-form.tsx` posts to `/api/contact` with the same JSON keys and expects `{ success: true }`
  - Works as-is; frontend ignores extra fields in response

---

### Hire a Model

- Backend
  - POST `/api/hire-model/:id` (JSON): body validated by `hireFormSchema`
    - `{ name?, date: Date, email, phone, message }`, `:id` is the `COMMODEL` id to hire
  - GET `/api/hire-model` → list; GET/DELETE `/api/hire-model/:id`
- Frontend
  - `frontend/src/components/hire-model-form.tsx` currently posts to `/api/contact` with `{ name, subject, email, phone, date, message }`
- Mismatch
  - Should call `POST /api/hire-model/:id` (and pick the model id), not `/api/contact`
  - Backend expects `date` parsable as Date; frontend sends a `YYYY-MM-DD` string which is fine if coerced

---

### Become a Model (Application Form)

- Backend
  - POST `/api/app-form/:id` (multipart/form-data via `uploadImages`): fields validated by `appModelSchema`
    - Files: multiple images
    - Fields (subset): `{ name, phone, country, city, ethnicity, email, age, languages:string[], gender?, occupation, dressSize?, shoeSize?, hairColor?, eyeColor?, selectEvent?:ObjectId, event?:string, auditionPlace?:string, weight?:number, parentsName, parentsMobile, parentsOccupation?, permanentAddress, temporaryAddress?, hobbies?, talents?, hearedFrom?, additionalMessage? }`
  - GET `/api/app-form` → list; GET/DELETE `/api/app-form/:id`
- Frontend
  - `frontend/src/components/become-model-form.tsx` currently posts `FormData` to `/api/contact` (not `/api/app-form/:id`), with slightly different field names:
    - Uses `language` (single) instead of `languages` (array)
    - Uses `auditionLocation` instead of `auditionPlace`
    - Uses `howDoYouKnow` instead of `hearedFrom`
    - Uses `somethingElse` instead of `additionalMessage`
- Mismatches to fix
  - Endpoint: use `/api/app-form/:id` and include the target event id if applicable
  - Field names and types as noted above; send `languages` as an array and align names

---

### Members (winners/participants)

- Backend
  - GET `/api/member` → list; GET `/api/member/:id`
  - POST (multipart), PATCH, DELETE
  - Schema: `{ _id, name, participants, uniqueId, bio, images:string[], icon, event:ObjectId }`
- Frontend
  - No direct usage found

---

## Quick mismatch checklist

- Events: split `date` → `startDate`/`endDate`, add `managedBy`, `getTicketLink`, `aboutLink`; map `_id` → `id`
- Company Models: expose `link`, `tag` or compute on frontend; map `intro` → `designation`
- Feedback: map `message` → `quote`
- Partners: map `sponserName` → `name`, `sponserImage` → `image`
- News: map `_id` → `id`, `event:ObjectId` → `event:string`; add timestamps if needed
- Hire Model: frontend should call `/api/hire-model/:id` instead of `/api/contact`
- Application Form: frontend should call `/api/app-form/:id` and align field names/types

## Current frontend API calls detected

- POST `/api/contact` from:
  - `frontend/src/components/home/contact-form.tsx` → `{ name, subject, email, phone, message }`
  - `frontend/src/components/hire-model-form.tsx` → `{ name, subject, email, phone, date, message }` (should target `/api/hire-model/:id`)
  - `frontend/src/components/become-model-form.tsx` → `FormData` with photos and many fields (should target `/api/app-form/:id`)

Keep this contract updated if schemas or frontend usage change.


