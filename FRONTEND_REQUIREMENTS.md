# Frontend Requirements Documentation

## Overview

This document outlines all the required fields, field types, and validation rules for the Next Models Nepal backend API. Use this as a reference when building frontend forms and components.

---

## 🎯 Hero Section

### Create/Update Hero Item

**Endpoint**: `POST/PATCH /api/hero`

| Field        | Type   | Required | Description      | Validation            |
| ------------ | ------ | -------- | ---------------- | --------------------- |
| `images`     | File[] | ❌       | Multiple images  | Max 4 files, 5MB each |
| `titleImage` | File   | ✅       | Main title image | Max 1 file, 5MB       |

**Notes**:

- `titleImage` is required for creation
- Images are handled as file uploads via FormData

---

## 📰 News Section

### Create News Item

**Endpoint**: `POST /api/news`

| Field         | Type          | Required | Description                     | Validation                        |
| ------------- | ------------- | -------- | ------------------------------- | --------------------------------- |
| `title`       | string        | ✅       | News title                      | Min 1 character                   |
| `description` | string        | ✅       | News description                | Min 1 character                   |
| `content`     | string        | ❌       | News content                    | Optional                          |
| `year`        | string/number | ❌       | Year (defaults to current year) | Optional, auto-converts to number |
| `images`      | File[]        | ❌       | News images                     | Max 10 files, 5MB each            |
| `event`       | ObjectId      | ❌       | Associated event ID             | Optional                          |

### Update News Item

**Endpoint**: `PATCH /api/news/:id`

| Field         | Type          | Required | Description       | Validation                        |
| ------------- | ------------- | -------- | ----------------- | --------------------------------- |
| `title`       | string        | ❌       | News title        | Min 1 character if provided       |
| `description` | string        | ❌       | News description  | Min 1 character if provided       |
| `content`     | string        | ❌       | News content      | Optional                          |
| `year`        | string/number | ❌       | Year              | Optional, auto-converts to number |
| `images`      | File[]        | ❌       | Additional images | Max 10 files, 5MB each            |

**Notes**:

- All fields are optional for updates
- New images are appended to existing ones
- Year defaults to current year if not provided

---

## 👥 Members Section

### Create Member

**Endpoint**: `POST /api/members`

| Field          | Type     | Required | Description               | Validation                         |
| -------------- | -------- | -------- | ------------------------- | ---------------------------------- |
| `name`         | string   | ✅       | Member name               | Min 1 character, must be unique    |
| `participants` | string   | ✅       | Participant category      | Min 1 character                    |
| `bio`          | string   | ❌       | Member biography          | Optional, defaults to empty string |
| `event`        | ObjectId | ✅       | Associated event ID       | Must reference valid event         |
| `slug`         | string   | ✅       | URL slug                  | Required                           |
| `year`         | string   | ❌       | Year (defaults to "2025") | Optional, auto-defaults if empty   |
| `images`       | File[]   | ❌       | Member images             | Optional                           |

### Update Member

**Endpoint**: `PATCH /api/members/:id`

| Field          | Type     | Required | Description          | Validation                             |
| -------------- | -------- | -------- | -------------------- | -------------------------------------- |
| `name`         | string   | ❌       | Member name          | Min 1 character if provided            |
| `participants` | string   | ❌       | Participant category | Min 1 character if provided            |
| `bio`          | string   | ❌       | Member biography     | Optional                               |
| `event`        | ObjectId | ❌       | Associated event ID  | Must reference valid event if provided |
| `slug`         | string   | ❌       | URL slug             | Optional                               |
| `year`         | string   | ❌       | Year                 | Optional, auto-defaults if empty       |
| `images`       | File[]   | ❌       | Additional images    | Optional, appended to existing         |

**Notes**:

- `uniqueId` is auto-generated based on participant category
- Year defaults to "2025" if empty string or undefined
- Images are appended to existing ones during updates

---

## 🎉 Events Section

### Create Event

**Endpoint**: `POST /api/events`

| Field                   | Type     | Required | Description             | Validation                        |
| ----------------------- | -------- | -------- | ----------------------- | --------------------------------- |
| `title`                 | string   | ✅       | Event title             | Min 1 character                   |
| `overview`              | string   | ✅       | Event overview          | Min 1 character                   |
| `logo`                  | string   | ✅       | Event logo              | Required                          |
| `coverImage`            | string   | ✅       | Event cover image       | Required                          |
| `startingTimelineIcon`  | string   | ✅       | Starting timeline icon  | Required                          |
| `midTimelineIcon`       | string   | ✅       | Mid timeline icon       | Required                          |
| `endTimelineIcon`       | string   | ✅       | End timeline icon       | Required                          |
| `sponsersImage`         | string[] | ✅       | Sponsor images          | At least 1 required               |
| `state`                 | string   | ❌       | Event state             | Optional                          |
| `date`                  | string   | ✅       | Event date              | Required                          |
| `year`                  | string   | ❌       | Event year              | Optional, defaults to "2025"      |
| `titleImage`            | string   | ❌       | Title image             | Optional                          |
| `subImage`              | string   | ❌       | Sub image               | Optional                          |
| `purpose`               | string   | ❌       | Event purpose           | Optional                          |
| `eventDescription`      | string   | ❌       | Event description       | Optional                          |
| `startingTimelineDate`  | string   | ❌       | Starting timeline date  | Optional                          |
| `startingTimelineEvent` | string   | ❌       | Starting timeline event | Optional                          |
| `midTimelineDate`       | string   | ❌       | Mid timeline date       | Optional                          |
| `midTimelineEvent`      | string   | ❌       | Mid timeline event      | Optional                          |
| `endTimelineDate`       | string   | ❌       | End timeline date       | Optional                          |
| `endTimelineEvent`      | string   | ❌       | End timeline event      | Optional                          |
| `highlight`             | string[] | ❌       | Event highlights        | Optional, defaults to empty array |
| `member`                | ObjectId | ❌       | Associated member ID    | Optional                          |

### Update Event

**Endpoint**: `PATCH /api/events/:id`

| Field      | Type | Required | Description         | Validation                      |
| ---------- | ---- | -------- | ------------------- | ------------------------------- |
| All fields | -    | ❌       | All fields optional | Same validation rules as create |

**Notes**:

- `index` is auto-generated sequentially
- All timeline fields are optional but icons are required if timeline is provided
- Year defaults to "2025" if empty string

---

## 🚀 Next Events Section

### Create Next Event

**Endpoint**: `POST /api/next-events`

| Field         | Type     | Required | Description       | Validation                            |
| ------------- | -------- | -------- | ----------------- | ------------------------------------- |
| `state`       | string   | ✅       | Event state       | Min 1 character                       |
| `title`       | string   | ✅       | Event title       | Min 1 character                       |
| `titleImage`  | string   | ✅       | Title image       | Required                              |
| `image`       | string   | ✅       | Main image        | Required                              |
| `description` | string   | ✅       | Event description | Min 1 character                       |
| `noticeName`  | string   | ✅       | Notice name       | Min 1 character                       |
| `notice`      | string[] | ✅       | Notice items      | At least 1 required, no empty strings |
| `card`        | Card[]   | ❌       | Event cards       | Optional, defaults to empty array     |
| `slug`        | string   | ❌       | URL slug          | Optional, auto-generated              |

#### Card Structure

| Field       | Type       | Required | Description                         |
| ----------- | ---------- | -------- | ----------------------------------- |
| `cardTitle` | string     | ✅       | Card title                          |
| `item`      | CardItem[] | ❌       | Card items, defaults to empty array |

#### Card Item Structure

| Field           | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| `criteriaTitle` | string | ✅       | Criteria title       |
| `criteria`      | string | ✅       | Criteria description |
| `criteriaIcon`  | string | ✅       | Criteria icon        |

### Update Next Event

**Endpoint**: `PATCH /api/next-events/:id`

| Field      | Type | Required | Description         | Validation                      |
| ---------- | ---- | -------- | ------------------- | ------------------------------- |
| All fields | -    | ❌       | All fields optional | Same validation rules as create |

**Notes**:

- Card indices are auto-generated if not provided
- All fields are optional for updates

---

## 📞 Contact Section

### Create Contact

**Endpoint**: `POST /api/contact`

| Field     | Type   | Required | Description     | Validation         |
| --------- | ------ | -------- | --------------- | ------------------ |
| `name`    | string | ✅       | Contact name    | Min 1 character    |
| `subject` | string | ✅       | Contact subject | Min 1 character    |
| `email`   | string | ✅       | Contact email   | Valid email format |
| `phone`   | string | ✅       | Contact phone   | Min 1 character    |
| `message` | string | ✅       | Contact message | Min 1 character    |

**Notes**:

- `status` defaults to "new"
- `replied` defaults to false
- `createdAt` and `updatedAt` are auto-generated

---

## 📝 Application Form Section

### Create Application

**Endpoint**: `POST /api/app-form`

| Field               | Type     | Required | Description             | Validation                   |
| ------------------- | -------- | -------- | ----------------------- | ---------------------------- |
| `images`            | File[]   | ✅       | Applicant images        | At least 1 image required    |
| `name`              | string   | ✅       | Applicant name          | Min 1 character              |
| `phone`             | string   | ✅       | Mobile number           | Min 1 character              |
| `country`           | string   | ✅       | Country                 | Min 1 character              |
| `city`              | string   | ✅       | City                    | Min 1 character              |
| `ethnicity`         | string   | ✅       | Ethnicity               | Min 1 character              |
| `email`             | string   | ✅       | Email address           | Valid email format           |
| `age`               | string   | ✅       | Age                     | Min 1 character              |
| `languages`         | string[] | ✅       | Languages               | At least 1 language required |
| `gender`            | string   | ❌       | Gender                  | "Male", "Female", or "Other" |
| `occupation`        | string   | ✅       | Occupation              | Min 1 character              |
| `dressSize`         | string   | ❌       | Dress size              | Optional                     |
| `shoeSize`          | string   | ❌       | Shoe size               | Optional                     |
| `hairColor`         | string   | ❌       | Hair color              | Optional                     |
| `eyeColor`          | string   | ❌       | Eye color               | Optional                     |
| `selectEvent`       | ObjectId | ❌       | Selected event          | Optional                     |
| `event`             | string   | ❌       | Event name              | Optional                     |
| `auditionPlace`     | string   | ❌       | Audition place          | Optional                     |
| `weight`            | number   | ❌       | Weight                  | Optional                     |
| `parentsName`       | string   | ✅       | Parent's name           | Min 1 character              |
| `parentsMobile`     | string   | ✅       | Parent's mobile         | Min 1 character              |
| `parentsOccupation` | string   | ❌       | Parent's occupation     | Optional                     |
| `permanentAddress`  | string   | ✅       | Permanent address       | Min 1 character              |
| `temporaryAddress`  | string   | ❌       | Temporary address       | Optional                     |
| `hobbies`           | string   | ❌       | Hobbies                 | Optional                     |
| `talents`           | string   | ❌       | Talents                 | Optional                     |
| `hearedFrom`        | string   | ❌       | How they heard about us | Optional                     |
| `additionalMessage` | string   | ❌       | Additional message      | Optional                     |

**Notes**:

- `createdAt` and `updatedAt` are auto-generated
- Images are required and must be uploaded

---

## 💼 Career Section

### Create Career

**Endpoint**: `POST /api/career`

| Field         | Type   | Required | Description   | Validation      |
| ------------- | ------ | -------- | ------------- | --------------- |
| `maintitle`   | string | ✅       | Main title    | Min 1 character |
| `subtitle`    | string | ✅       | Subtitle      | Min 1 character |
| `description` | string | ✅       | Description   | Min 1 character |
| `images`      | File[] | ❌       | Career images | Optional        |
| `link`        | string | ❌       | Career link   | Optional        |

---

## 💬 Feedback Section

### Create Feedback

**Endpoint**: `POST /api/feedback`

| Field  | Type      | Required | Description    | Validation               |
| ------ | --------- | -------- | -------------- | ------------------------ |
| `item` | Comment[] | ✅       | Feedback items | At least 1 item required |

#### Comment Structure

| Field     | Type   | Required | Description     |
| --------- | ------ | -------- | --------------- | --------------------------------- |
| `index`   | string | ✅       | Comment index   |
| `name`    | string | ✅       | Commenter name  |
| `message` | string | ✅       | Comment message |
| `images`  | File[] | ❌       | Comment images  | Optional, defaults to empty array |

---

## 🎭 Hire Model Section

### Create Hire Request

**Endpoint**: `POST /api/hire`

| Field     | Type     | Required | Description    | Validation                 |
| --------- | -------- | -------- | -------------- | -------------------------- |
| `name`    | string   | ❌       | Requester name | Optional                   |
| `model`   | ObjectId | ✅       | Model ID       | Must reference valid model |
| `email`   | string   | ✅       | Email address  | Valid email format         |
| `phone`   | string   | ✅       | Phone number   | Min 1 character            |
| `message` | string   | ✅       | Hire message   | Min 1 character            |
| `date`    | Date     | ✅       | Hire date      | Required                   |

**Notes**:

- `createdAt` and `updatedAt` are auto-generated

---

## 🧭 Navigation Section

### Create Navigation Item

**Endpoint**: `POST /api/nav`

| Field      | Type       | Required | Description      | Validation                               |
| ---------- | ---------- | -------- | ---------------- | ---------------------------------------- |
| `label`    | string     | ✅       | Navigation label | Min 1 character, must be unique          |
| `path`     | string     | ❌       | Navigation path  | Optional, defaults to empty string       |
| `type`     | string     | ❌       | Navigation type  | "link" or "dropdown", defaults to "link" |
| `children` | NavChild[] | ❌       | Child items      | Optional                                 |
| `visible`  | boolean    | ❌       | Visibility       | Optional, defaults to true               |
| `order`    | number     | ❌       | Display order    | Optional, defaults to 1                  |

#### NavChild Structure

| Field   | Type   | Required | Description                |
| ------- | ------ | -------- | -------------------------- |
| `label` | string | ✅       | Child label                |
| `path`  | string | ✅       | Child path                 |
| `order` | number | ❌       | Child order, defaults to 1 |

---

## 🤝 Partners Section

### Create Partners

**Endpoint**: `POST /api/partners`

| Field      | Type      | Required | Description  | Validation                  |
| ---------- | --------- | -------- | ------------ | --------------------------- |
| `partners` | Partner[] | ✅       | Partner list | At least 1 partner required |

#### Partner Structure

| Field          | Type   | Required | Description   |
| -------------- | ------ | -------- | ------------- |
| `index`        | number | ✅       | Partner index |
| `sponserName`  | string | ✅       | Sponsor name  |
| `sponserImage` | string | ✅       | Sponsor image |

---

## 👗 Company Models Section

### Create Company Model

**Endpoint**: `POST /api/company-models`

| Field        | Type   | Required | Description        | Validation                        |
| ------------ | ------ | -------- | ------------------ | --------------------------------- |
| `name`       | string | ✅       | Model name         | Min 1 character                   |
| `intro`      | string | ✅       | Model introduction | Min 1 character                   |
| `address`    | string | ✅       | Model address      | Min 1 character                   |
| `coverImage` | string | ✅       | Cover image        | Required                          |
| `images`     | File[] | ❌       | Additional images  | Optional, defaults to empty array |
| `gender`     | string | ✅       | Model gender       | Required                          |
| `slug`       | string | ✅       | URL slug           | Required                          |

---

## 🔧 General Notes

### File Upload Requirements

- **Image files**: Max 5MB per file
- **Hero images**: Max 10 files
- **News images**: Max 10 files
- **Member images**: No limit specified
- **Application images**: At least 1 required

### Data Types

- **ObjectId**: MongoDB ObjectId strings
- **Date**: ISO date strings or Date objects
- **Boolean**: true/false values
- **Number**: Numeric values
- **String**: Text values
- **Array**: Array of specified type

### Validation Rules

- **Required fields**: Must be provided and non-empty
- **Optional fields**: Can be omitted or empty
- **Min length**: String fields must meet minimum character requirements
- **Enum values**: Must match specified allowed values
- **Auto-generated fields**: Handled by backend, don't send from frontend

### Error Handling

- **400**: Validation errors (check error details)
- **404**: Resource not found
- **409**: Duplicate resource (e.g., duplicate name)
- **500**: Internal server error

### Form Submission

- Use `multipart/form-data` for endpoints that accept file uploads
- Use `application/json` for endpoints that only accept text data
- Required fields should be marked with asterisks (\*) in UI
- Provide clear error messages for validation failures
