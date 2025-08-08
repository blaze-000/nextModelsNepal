# Frontend-Backend Data Mapping Documentation

## Overview
This document provides a comprehensive mapping between what your backend sends and what your frontend expects for each API endpoint. This will help identify gaps and ensure proper data flow between frontend and backend.

---

## 📊 Navigation API

### Backend Sends (`GET /api/nav`)
```json
{
  "success": true,
  "message": "Navigation items retrieved successfully.",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Home",
      "path": "/",
      "link": "/",
      "type": "link",
      "children": [],
      "visible": true,
      "order": 0
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Events",
      "path": "/#",
      "link": "/#",
      "type": "dropdown",
      "children": [
        {
          "title": "Model Hunt Nepal",
          "path": "/events/model-hunt-nepal",
          "link": "/events/model-hunt-nepal",
          "order": 0
        }
      ],
      "visible": true,
      "order": 1
    }
  ]
}
```

### Frontend Expects
```typescript
interface MenuItem {
  id: number;
  label: string;
  href: string;
  submenu?: {
    columns: number;
    titles?: string[];
    items: Array<Array<{ label: string; href: string }>>;
  };
}
```

### Data Mapping Table

| Backend Field | Backend Data Type | Frontend Field | Frontend Data Type | Status         | Notes                                 |
|---------------|-------------------|----------------|------------------- |----------------|---------------------------------------|
| `_id`         | ObjectId          | `id`           | number             | ❌ **MISSING** | Frontend expects numeric ID           |
| `title`       | string            | `label`        | string             | ✅ **MATCH**   | Direct mapping                        |
| `path`        | string            | `href`         | string             | ✅ **MATCH**   | Direct mapping                        |
| `type`        | enum              | -              | -                  | ❌ **UNUSED**  | Frontend determines type from submenu |
| `children`    | array             | `submenu.items`| array              | ❌ **MISMATCH**| Different structure                   |
| `visible`     | boolean           | -              | -                  | ❌ **UNUSED**  | Frontend doesn't usevisibility        |
| `order`       | number            | -              | -                  | ❌ **UNUSED**  | Frontend uses array order             |

---

## 🎯 Hero Section API

### Backend Sends (`GET /api/hero`)
```json
{
  "success": true,
  "message": "Hero items retrieved successfully.",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "maintitle": "Nepal's No.1",
      "subtitle": "Modeling Agency",
      "description": "Next Models Nepal is a team of seasoned professionals...",
      "images": ["uploads/hero1.jpg", "uploads/hero2.jpg"]
    }
  ]
}
```

### Frontend Expects
```typescript
interface HeroSection {
  maintitle: string;
  subtitle: string;
  description: string;
  images: string[];
  badgeImage?: string;
  status?: 'active' | 'inactive';
  order?: number;
}
```

### Data Mapping Table

| Backend Field | Backend Data Type | Frontend Field | Frontend Data Type | Status         | Notes                         |
|---------------|-------------------|----------------|--------------------|----------------|-------------------------      |
| `_id`         | ObjectId          | -              | -                  | ❌ **UNUSED**  | Frontend doesn't use ID      |
| `maintitle`   | string            | `maintitle`    | string             | ✅ **MATCH**   | Direct mapping               |
| `subtitle`    | string            | `subtitle`     | string             | ✅ **MATCH**   | Direct mapping               |
| `description` | string            | `description`  | string             | ✅ **MATCH**   | Direct mapping               |
| `images`      | string[]          | `images`       | string[]           | ✅ **MATCH**   | Direct mapping               |
| -             | -                 | `badgeImage`   | string             | ❌ **MISSING** | Frontend expects badge image |
| -             | -                 | `status`       | enum               | ❌ **MISSING** | Frontend expects status      |
| -             | -                 | `order`        | number             | ❌ **MISSING** | Frontend expects ordering    |

---

## 🎪 Events API

### Backend Sends (`GET /api/events`)
```json
{
  "success": true,
  "message": "Event items retrieved successfully.",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "index": 1,
      "title": "Miss Nepal Peace",
      "overview": "Beauty pageant for peace",
      "date": "2024-07-19",
      "coverImage": "uploads/event1.jpg",
      "logo": "uploads/logo1.jpg",
      "subImage": ["uploads/sub1.jpg"],
      "purpose": "Celebrating peace",
      "eventDescription": "Timeline description",
      "startingTimelineIcon": "uploads/start-icon.jpg",
      "startingTimelineDate": "2024-01-15",
      "startingTimelineEvent": "Registration Opens",
      "midTimelineIcon": "uploads/mid-icon.jpg",
      "midTimelineDate": "2024-02-15",
      "midTimelineEvent": "Auditions Begin",
      "endTimelineIcon": "uploads/end-icon.jpg",
      "endTimelineDate": "2024-03-15",
      "endTimelineEvent": "Final Event",
      "sponsers": "Sponsor names",
      "sponsersImage": ["uploads/sponsor1.jpg"]
    }
  ]
}
```

### Frontend Expects
```typescript
interface EventType {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  briefInfo: string;
  imageSrc: string;
  state: "ongoing" | "ended" | "upcoming";
  managedBy: "self" | "partner";
  getTicketLink?: string;
  aboutLink?: string;
}
```

### Data Mapping Table

| Backend Field | Backend Data Type | Frontend Field        | Frontend Data Type | Status           | Notes                                                     |
|---------------|-------------------|-----------------------|--------------------|------------------|-----------------------------------------------------------|
| `_id`         | ObjectId          | `id`                  | string             | ❌ **MISMATCH**  | Frontend expects string ID                                |
| `title`       | string            | `title`               | string             | ✅ **MATCH**     | Direct mapping                                            |
| `overview`    | string            | `briefInfo`           | string             | ✅ **MATCH**     | Direct mapping                                            |
| `date`        | string            | `startDate`/`endDate` | string             | ❌ **MISMATCH**  | Backend has single date, frontend expects separate dates  |
| `coverImage`  | string            | `imageSrc`            | string             | ✅ **MATCH**     | Direct mapping                                            |
| `logo`        | string            | -                     | -                  | ❌ **UNUSED**    | Frontend doesn't use logo                                 |
| `subImage`    | string[]          | -                     | -                  | ❌ **UNUSED**    | Frontend doesn't use sub images                           |
| `purpose`     | string            | -                     | -                  | ❌ **UNUSED**    | Frontend doesn't use purpose                              |
| -             | -                 | `state`               | enum               | ❌ **MISSING**   | Frontend expects state (ongoing/ended/upcoming)           |
| -             | -                 | `managedBy`           | enum               | ❌ **MISSING**   | Frontend expects managedBy (self/partner)                 |
| -             | -                 | `getTicketLink`       | string             | ❌ **MISSING**   | Frontend expects ticket link                              |
| -             | -                 | `aboutLink`           | string             | ❌ **MISSING**   | Frontend expects about link                               |

---

## 👥 Company Models API

### Backend Sends (`GET /api/models`)
```json
{
  "success": true,
  "message": "Models retrieved successfully.",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Monika Adhikary",
      "intro": "Professional model with 5 years experience",
      "address": "Kathmandu, Nepal",
      "coverImage": "uploads/model1.jpg",
      "images": ["uploads/model1-1.jpg", "uploads/model1-2.jpg"],
      "gender": "Female"
    }
  ]
}
```

### Frontend Expects
```typescript
interface Model {
  name: string;
  image: string;
  location?: string;
  link?: string;
  designation?: string;
  tag?: string;
}
```

### Data Mapping Table

| Backend Field | Backend Data Type | Frontend Field | Frontend Data Type | Status          | Notes                         |  
|---------------|-------------------|----------------|--------------------|-----------------|-------------------------------|
| `_id`         | ObjectId          | -              | -                  | ❌ **UNUSED**   | Frontend doesn't use ID       |
| `name`        | string            | `name`         | string             | ✅ **MATCH**    | Direct mapping                |
| `coverImage`  | string            | `image`        | string             | ✅ **MATCH**    | Direct mapping                |
| `address`     | string            | `location`     | string             | ✅ **MATCH**    | Direct mapping                |
| `intro`       | string            | `designation`  | string             | ❌ **MISMATCH** | Different purpose              |
| `images`      | string[]          | -              | -                  | ❌ **UNUSED**   | Frontend only uses cover image |
| `gender`      | string            | -              | -                  | ❌ **UNUSED**   | Frontend doesn't use gender    |
| -             | -                 | `link`         | string             | ❌ **MISSING**  | Frontend expects profile link  |
| -             | -                 | `tag`          | string             | ❌ **MISSING**  | Frontend expects tag           |

---

## 📞 Contact API

### Backend Sends (`GET /api/contact`)
```json
{
  "success": true,
  "message": "Contact retrieved successfully.",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "subject": "General Inquiry",
      "email": "john@example.com",
      "phone": "+977-1234567890",
      "message": "I would like to know more about your services.",
      "status": "new",
      "replied": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Frontend Expects
```typescript
interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
  updatedAt: string;
}
```

### Data Mapping Table

| Backend Field | Backend Data Type | Frontend Field | Frontend Data Type | Status          | Notes                        |
|---------------|-------------------|----------------|--------------------|-----------------|------------------------------|
| `_id`         | ObjectId          | `id`           | string             | ❌ **MISMATCH** | Frontend expects string ID   |
| `name`        | string            | `name`         | string             | ✅ **MATCH**    | Direct mapping               |
| `email`       | string            | `email`        | string             | ✅ **MATCH**    | Direct mapping               |
| `phone`       | string            | `phone`        | string             | ✅ **MATCH**    | Direct mapping               |
| `subject`     | string            | `subject`      | string             | ✅ **MATCH**    | Direct mapping               |
| `message`     | string            | `message`      | string             | ✅ **MATCH**    | Direct mapping               |
| `status`      | enum              | `status`       | enum               | ✅ **MATCH**    | Direct mapping               |
| `replied`     | boolean           | -              | -                  | ❌ **UNUSED**   | Frontend doesn't use replied |
| `createdAt`   | Date              | `createdAt`    | string             | ❌ **MISMATCH** | Frontend expects string      |
| `updatedAt`   | Date              | `updatedAt`    | string             | ❌ **MISMATCH** | Frontend expects string      |

---

## 📝 Application Forms API

### Backend Sends (`GET /api/app-form`)
```json
{
  "success": true,
  "message": "Applications retrieved successfully.",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "images": ["uploads/app1.jpg", "uploads/app2.jpg"],
      "name": "Jane Smith",
      "phone": "+977-9876543210",
      "country": "Nepal",
      "city": "Kathmandu",
      "ethnicity": "Nepali",
      "email": "jane@example.com",
      "age": "25",
      "languages": ["English", "Nepali"],
      "gender": "Female",
      "occupation": "Student",
      "dressSize": "M",
      "shoeSize": "7",
      "hairColor": "Black",
      "eyeColor": "Brown",
      "selectEvent": "507f1f77bcf86cd799439012",
      "event": "Miss Nepal Peace",
      "auditionPlace": "Kathmandu",
      "weight": 55,
      "parentsName": "John Smith",
      "parentsMobile": "+977-1234567890",
      "parentsOccupation": "Business",
      "permanentAddress": "Kathmandu, Nepal",
      "temporaryAddress": "Kathmandu, Nepal",
      "hobbies": "Reading, Dancing",
      "talents": "Singing, Dancing",
      "hearedFrom": "Social Media",
      "additionalMessage": "I am passionate about modeling",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Frontend Expects
```typescript
interface ApplicationForm {
  id: string;
  images: string[];
  name: string;
  phone: string;
  country: string;
  city: string;
  ethnicity: string;
  email: string;
  age: string;
  languages: string[];
  gender: 'Male' | 'Female' | 'Other';
  occupation: string;
  dressSize?: string;
  shoeSize?: string;
  hairColor?: string;
  eyeColor?: string;
  event?: string;
  auditionPlace?: string;
  weight?: number;
  parentsName: string;
  parentsMobile: string;
  parentsOccupation?: string;
  permanentAddress: string;
  temporaryAddress?: string;
  hobbies?: string;
  talents?: string;
  howDoYouKnow?: string;
  additionalMessage?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Data Mapping Table

| Backend Field       | Backend Data Type | Frontend Field      | Frontend Data Type          | Status          | Notes                                  |
|---------------------|-------------------|---------------------|-----------------------------|-----------------|----------------------------------------|
| `_id`               | ObjectId          | `id`                | string                      | ❌ **MISMATCH** | Frontend expects string ID             |
| `images`            | string[]          | `images`            | string[]                    | ✅ **MATCH**    | Direct mapping                         |
| `name`              | string            | `name`              | string                      | ✅ **MATCH**    | Direct mapping                         |
| `phone`             | string            | `phone`             | string                      | ✅ **MATCH**    | Direct mapping                         |
| `country`           | string            | `country`           | string                      | ✅ **MATCH**    | Direct mapping                         |
| `city`              | string            | `city`              | string                      | ✅ **MATCH**    | Direct mapping                         |
| `ethnicity`         | string            | `ethnicity`         | string                      | ✅ **MATCH**    | Direct mapping                         |
| `email`             | string            | `email`             | string                      | ✅ **MATCH**    | Direct mapping                         |
| `age`               | string            | `age`               | string                      | ✅ **MATCH**    | Direct mapping                         |
| `languages`         | string[]          | `languages`         | string[]                    | ✅ **MATCH**    | Direct mapping                         |
| `gender`            | enum              | `gender`            | enum                        | ✅ **MATCH**    | Direct mapping                         |
| `occupation`        | string            | `occupation`        | string                      | ✅ **MATCH**    | Direct mapping                         |
| `dressSize`         | string            | `dressSize`         | string                      | ✅ **MATCH**    | Direct mapping                         |
| `shoeSize`          | string            | `shoeSize`          | string                      | ✅ **MATCH**    | Direct mapping                         |
| `hairColor`         | string            | `hairColor`         | string                      | ✅ **MATCH**    | Direct mapping                         |
| `eyeColor`          | string            | `eyeColor`          | string                      | ✅ **MATCH**    | Direct mapping                         |
| `selectEvent`       | ObjectId          | `event`             | string                      | ❌ **MISMATCH** | Frontend expects string                |
| `event`             | string            | -                   | -                           | ❌ **UNUSED**   | Backend has both selectEvent and event |
| `auditionPlace`     | string            | `auditionPlace`     | string                      | ✅ **MATCH**    | Direct mapping                         |
| `weight`            | number            | `weight`            | number                      | ✅ **MATCH**    | Direct mapping                         |
| `parentsName`       | string            | `parentsName`       | string                      | ✅ **MATCH**    | Direct mapping                         |
| `parentsMobile`     | string            | `parentsMobile`     | string                      | ✅ **MATCH**    | Direct mapping                         |
| `parentsOccupation` | string            | `parentsOccupation` | string                      | ✅ **MATCH**    | Direct mapping                         |
| `permanentAddress`  | string            | `permanentAddress`  | string                      | ✅ **MATCH**    | Direct mapping                         |
| `temporaryAddress`  | string            | `temporaryAddress`  | string                      | ✅ **MATCH**    | Direct mapping                         |
| `hobbies`           | string            | `hobbies`           | string                      | ✅ **MATCH**    | Direct mapping                         |
| `talents`           | string            | `talents`           | string                      | ✅ **MATCH**    | Direct mapping                         |
| `hearedFrom`        | string            | `howDoYouKnow`      | string                      | ❌ **MISMATCH** | Different field name                   |
| `additionalMessage` | string            | `additionalMessage` | string                      | ✅ **MATCH**    | Direct mapping                         |
| `createdAt`         | Date              | `createdAt`         | string                      | ❌ **MISMATCH** | Frontend expects string                |
| `updatedAt`         | Date              | `updatedAt`         | string                      | ❌ **MISMATCH** | Frontend expects string                |

---

## 🤝 Hire Requests API

### Backend Sends (`GET /api/hire-model`)
```json
{
  "success": true,
  "message": "Hire requests retrieved successfully.",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Event Organizer",
      "email": "organizer@example.com",
      "phone": "+977-1234567890",
      "event": "Fashion Show",
      "model": "Monika Adhikary",
      "message": "We would like to hire this model for our event.",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Frontend Expects
```typescript
interface HireRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  event: string;
  model: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Data Mapping Table

| Backend Field | Backend Data Type      | Frontend Field | Frontend Data Type | Status          | Notes                      |
|---------------|------------------------|----------------|--------------------|-----------------|----------------------------|
| `_id`         | ObjectId               | `id`           | string             | ❌ **MISMATCH** | Frontend expects string ID |
| `name`        | string                 | `name`         | string             | ✅ **MATCH**    | Direct mapping             |
| `email`       | string                 | `email`        | string             | ✅ **MATCH**    | Direct mapping             |
| `phone`       | string                 | `phone`        | string             | ✅ **MATCH**    | Direct mapping             |
| `event`       | string                 | `event`        | string             | ✅ **MATCH**    | Direct mapping             |
| `model`       | string                 | `model`        | string             | ✅ **MATCH**    | Direct mapping             |
| `message`     | string                 | `message`      | string             | ✅ **MATCH**    | Direct mapping             |
| `createdAt`   | Date                   | `createdAt`    | string             | ❌ **MISMATCH** | Frontend expects string    |
| `updatedAt`   | Date                   | `updatedAt`    | string             | ❌ **MISMATCH** | Frontend expects string    |

---

## 📰 News API

### Backend Sends (`GET /api/news`)
```json
{
  "success": true,
  "message": "News retrieved successfully.",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Miss Nepal Peace 2024 Winner Announced",
      "description": "The winner of Miss Nepal Peace 2024 has been announced...",
      "content": "Full article content here...",
      "year": 2024,
      "images": ["uploads/news1.jpg", "uploads/news2.jpg"],
      "event": "507f1f77bcf86cd799439012"
    }
  ]
}
```

### Frontend Expects
```typescript
interface News {
  id: string;
  title: string;
  description: string;
  content?: string;
  year: number;
  images: string[];
  event?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### Data Mapping Table

| Backend Field | Backend Data Type        | Frontend Field | Frontend Data Type | Status           | Notes                      |
|---------------|--------------------------|----------------|--------------------|------------------|----------------------------|
| `_id`         | ObjectId                 | `id`           | string             | ❌ **MISMATCH**  | Frontend expects string ID |
| `title`       | string                   | `title`        | string             | ✅ **MATCH**     | Direct mapping             |
| `description` | string                   | `description`  | string             | ✅ **MATCH**     | Direct mapping             |
| `content`     | string                   | `content`      | string             | ✅ **MATCH**     | Direct mapping             |
| `year`        | number                   | `year`         | number             | ✅ **MATCH**     | Direct mapping             |
| `images`      | string[]                 | `images`       | string[]           | ✅ **MATCH**     | Direct mapping             |
| `event`       | ObjectId                 | `event`        | string             | ❌ **MISMATCH**  | Frontend expects string    |
| -             | -                        | `createdAt`    | string             | ❌ **MISSING**   | Frontend expects timestamp |
| -             | -                        | `updatedAt`    | string             | ❌ **MISSING**   | Frontend expects timestamp |

---

## 🏆 Partners API

### Backend Sends (`GET /api/partners`)
```json
{
  "success": true,
  "message": "Partners retrieved successfully.",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "mainTitle": "Our Partners",
      "partners": [
        {
          "name": "Partner 1",
          "image": "uploads/partner1.jpg"
        },
        {
          "name": "Partner 2", 
          "image": "uploads/partner2.jpg"
        }
      ]
    }
  ]
}
```

### Frontend Expects
```typescript
interface Partner {
  name: string;
  image: string;
}

interface PartnersSection {
  mainTitle: string;
  partners: Partner[];
}
```

### Data Mapping Table

| Backend Field      | Backend Data Type | Frontend Field    | Frontend Data Type | Status         | Notes                  |
|--------------------|-------------------|-------------------|--------------------|----------------|------------------------|
| `_id`              | ObjectId          | -                 | -                  | ❌ **UNUSED** | Frontend doesn't use ID |
| `mainTitle`        | string            | `mainTitle`       | string             | ✅ **MATCH**  | Direct mapping          |
| `partners`         | array             | `partners`        | array              | ✅ **MATCH**  | Direct mapping          |
| `partners[].name`  | string            | `partners[].name` | string             | ✅ **MATCH**  | Direct mapping          |
| `partners[].image` | string            | `partners[].image`| string             | ✅ **MATCH**  | Direct mapping          |

---

## 💬 Feedback API

### Backend Sends (`GET /api/feedback`)
```json
{
  "success": true,
  "message": "Feedback retrieved successfully.",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "mainTitle": "What People Say",
      "feedback": [
        {
          "name": "John Doe",
          "description": "Amazing experience working with Next Models Nepal",
          "image": "uploads/feedback1.jpg"
        }
      ]
    }
  ]
}
```

### Frontend Expects
```typescript
interface Testimonial {
  quote: string;
  name: string;
  image: string;
}

interface FeedbackSection {
  mainTitle: string;
  feedback: Testimonial[];
}
```

### Data Mapping Table

| Backend Field            | Backend Data Type | Frontend Field    | Frontend Data Type | Status          | Notes                    |
|--------------------------|-------------------|-------------------|--------------------|-----------------|--------------------------|
| `_id`                    | ObjectId          | -                 | -                  | ❌ **UNUSED**   | Frontend doesn't use ID |
| `mainTitle`              | string            | `mainTitle`       | string             | ✅ **MATCH**    | Direct mapping           |
| `feedback`               | array             | `feedback`        | array              | ✅ **MATCH**    | Direct mapping           |
| `feedback[].name`        | string            | `feedback[].name` | string             | ✅ **MATCH**    | Direct mapping           |
| `feedback[].description` | string            | `feedback[].quote`| string             | ❌ **MISMATCH** | Different field name     |
| `feedback[].image`       | string            | `feedback[].image`| string             | ✅ **MATCH**    | Direct mapping           |

---

## 🎯 Summary of Required Changes

### High Priority (Frontend won't work without these)

1. **Navigation API**
   - Add `id` field (convert ObjectId to string)
   - Restructure `children` to match frontend `submenu.items` format
   - Remove unused fields (`link`, `type`, `visible`, `order`)

2. **Events API**
   - Add `state` field (ongoing/ended/upcoming)
   - Add `managedBy` field (self/partner)
   - Add `getTicketLink` and `aboutLink` fields
   - Split `date` into `startDate` and `endDate`
   - Convert `_id` to string `id`

3. **Hero API**
   - Add `badgeImage`, `status`, `order` fields
   - Add timestamps

4. **Company Models API**
   - Add `link`, `tag` fields
   - Rename `intro` to `designation` or add separate field
   - Convert `_id` to string `id`

### Medium Priority

1. **Contact API**
   - Convert `_id` to string `id`
   - Convert dates to strings
   - Remove unused `replied` field

2. **Application Forms API**
   - Convert `_id` to string `id`
   - Convert dates to strings
   - Rename `hearedFrom` to `howDoYouKnow`
   - Convert `selectEvent` ObjectId to string

3. **News API**
   - Convert `_id` to string `id`
   - Convert `event` ObjectId to string
   - Add timestamps

### Low Priority

1. **Partners API** - Already well aligned
2. **Feedback API** - Rename `description` to `quote`
3. **Hire Requests API** - Convert dates to strings

---

## 🚀 Implementation Recommendations

1. **Start with Navigation API** - Most critical for frontend functionality
2. **Update Events API** - Core content that frontend heavily relies on
3. **Fix Hero API** - Important for homepage
4. **Update remaining APIs** - For full functionality

5. **Add proper error handling** - Ensure consistent error responses
6. **Add validation** - Validate all new fields
7. **Update documentation** - Keep this mapping updated as you make changes

This documentation will help you systematically update your backend to match your frontend requirements. 