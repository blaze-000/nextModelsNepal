# 🚀 Next Models Nepal API Documentation

<div align="center">

![Next Models Nepal](https://img.shields.io/badge/Next%20Models%20Nepal-API%20v1.0.0-blue?style=for-the-badge&logo=node.js)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18+-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green?style=for-the-badge&logo=mongodb)

</div>

---

## 📡 Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

---

## 🎯 Complete API Endpoints

### 📅 Events

#### Get All Events
```http
GET /api/events
```

**Response:**
```json
{
  "success": true,
  "message": "Event items retrieved successfully.",
  "data": [
    {
      "_id": "68907b53502aac8af4d8cc01",
      "index": 1,
      "title": "Miss Nepal Peace",
      "overview": "Beauty pageant for peace",
      "logo": "uploads/1234567890-logo.jpg",
      "coverImage": "uploads/1234567890-cover.jpg",
      "eventDescription": "Timeline description",
      "startingTimelineIcon": "uploads/1234567890-start-icon.jpg",
      "startingTimelineDate": "2024-01-15",
      "startingTimelineEvent": "Registration Opens",
      "midTimelineIcon": "uploads/1234567890-mid-icon.jpg",
      "midTimelineDate": "2024-02-15",
      "midTimelineEvent": "Auditions Begin",
      "endTimelineIcon": "uploads/1234567890-end-icon.jpg",
      "endTimelineDate": "2024-03-15",
      "endTimelineEvent": "Final Event"
    }
  ]
}
```

#### Get Event by ID
```http
GET /api/events/:id
```

#### Create Event
```http
POST /api/events
Content-Type: multipart/form-data
```

**Form Data:**
- `title` (required): Event title
- `overview` (required): Event overview
- `content` (optional): Event content
- `logo` (required): Event logo image
- `coverImage` (optional): Cover image
- `titleImage` (optional): Title image
- `subImage` (optional): Sub image
- `highlight` (optional): Multiple highlight images
- `eventDescription` (optional): Timeline description
- `startingTimelineIcon` (required): Starting timeline icon
- `startingTimelineDate` (optional): Starting date
- `startingTimelineEvent` (optional): Starting event
- `midTimelineIcon` (required): Mid timeline icon
- `midTimelineDate` (optional): Mid date
- `midTimelineEvent` (optional): Mid event
- `endTimelineIcon` (required): End timeline icon
- `endTimelineDate` (optional): End date
- `endTimelineEvent` (optional): End event

#### Update Event
```http
PATCH /api/events/:id
Content-Type: multipart/form-data
```

#### Delete Event
```http
DELETE /api/events/:id
```

---

### 📰 News

#### Get All News
```http
GET /api/news
```

**Response:**
```json
{
  "success": true,
  "message": "News items retrieved successfully.",
  "data": [
    {
      "_id": "6890841ae32f6cdea9ede0e4",
      "title": "Next Grand Event",
      "description": "Be part of the biggest modeling competition",
      "content": "Detailed news content",
      "year": 2024,
      "images": ["uploads/1234567890-image1.jpg"],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Get News by ID
```http
GET /api/news/:id
```

#### Create News
```http
POST /api/news
Content-Type: multipart/form-data
```

**Form Data:**
- `title` (required): News title
- `description` (required): News description
- `content` (optional): News content
- `year` (optional): News year (defaults to current year)
- `images` (optional): Multiple news images

#### Update News
```http
PATCH /api/news/:id
Content-Type: multipart/form-data
```

#### Delete News
```http
DELETE /api/news/:id
```

---

### 📝 Application Forms

#### Get All Applications
```http
GET /api/apply-form
```

#### Get Application by ID
```http
GET /api/apply-form/:id
```

#### Create Application Form
```http
POST /api/apply-form/:eventId
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (required): Applicant name
- `phone` (required): Phone number
- `country` (required): Country
- `city` (required): City
- `ethnicity` (required): Ethnicity
- `email` (required): Email address
- `age` (required): Age
- `languages` (required): Languages (comma-separated)
- `gender` (optional): Gender (Male/Female/Other)
- `occupation` (required): Occupation
- `weight` (optional): Weight in kg
- `parentsName` (required): Parents name
- `parentsMobile` (required): Parents mobile
- `permanentAddress` (required): Permanent address
- `images` (required): At least one image
- `dressSize` (optional): Dress size
- `shoeSize` (optional): Shoe size
- `hairColor` (optional): Hair color
- `eyeColor` (optional): Eye color
- `auditionPlace` (optional): Audition place
- `parentsOccupation` (optional): Parents occupation
- `temporaryAddress` (optional): Temporary address
- `hobbies` (optional): Hobbies
- `talents` (optional): Talents
- `hearedFrom` (optional): How they heard about us
- `message` (optional): Additional message

**Response:**
```json
{
  "success": true,
  "message": "Application form submitted successfully.",
  "data": {
    "_id": "6890841ae32f6cdea9ede0e4",
    "name": "John Doe",
    "phone": "1234567890",
    "email": "john@example.com",
    "event": "Miss Nepal Peace",
    "images": ["uploads/1234567890-profile.jpg"],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Delete Application
```http
DELETE /api/apply-form/:id
```

---

### 👥 Company Models

#### Get All Models
```http
GET /api/models
```

#### Get Model by ID
```http
GET /api/models/:id
```

#### Create Model
```http
POST /api/models
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (required): Model name
- `intro` (required): Model introduction
- `address` (required): Address
- `gender` (required): Gender
- `coverImage` (required): Cover image
- `images` (optional): Gallery images

#### Update Model
```http
PATCH /api/models/:id
Content-Type: multipart/form-data
```

#### Delete Model
```http
DELETE /api/models/:id
```

---

### 💼 Career

#### Get All Career Items
```http
GET /api/career
```

#### Get Career by ID
```http
GET /api/career/:id
```

#### Create Career Item
```http
POST /api/career
Content-Type: multipart/form-data
```

**Form Data:**
- `maintitle` (required): Main title
- `subtitle` (required): Subtitle
- `description` (required): Description
- `images` (optional): Career images
- `link` (optional): Career link

#### Update Career
```http
PATCH /api/career/:id
Content-Type: multipart/form-data
```

#### Delete Career
```http
DELETE /api/career/:id
```

---

### 📞 Contact

#### Get All Contacts
```http
GET /api/contact
```

#### Get Contact by ID
```http
GET /api/contact/:id
```

#### Create Contact
```http
POST /api/contact
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "message": "Hello, I'm interested in your services."
}
```

#### Update Contact
```http
PATCH /api/contact/:id
Content-Type: application/json
```

#### Delete Contact
```http
DELETE /api/contact/:id
```

---

### 🤝 Partners

#### Get All Partners
```http
GET /api/partners
```

#### Get Partner by ID
```http
GET /api/partners/:id
```

#### Create Partner
```http
POST /api/partners
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (required): Partner name
- `logo` (required): Partner logo
- `description` (optional): Partner description

#### Update Partner
```http
PATCH /api/partners/:id
Content-Type: multipart/form-data
```

#### Delete Partner
```http
DELETE /api/partners/:id
```

---

### ⭐ Feedback

#### Get All Feedback
```http
GET /api/feedback
```

#### Get Feedback by ID
```http
GET /api/feedback/:id
```

#### Create Feedback
```http
POST /api/feedback
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "rating": 5,
  "message": "Great experience!"
}
```

#### Update Feedback
```http
PATCH /api/feedback/:id
Content-Type: application/json
```

#### Delete Feedback
```http
DELETE /api/feedback/:id
```

---

### 👤 Members

#### Get All Members
```http
GET /api/member
```

#### Get Member by ID
```http
GET /api/member/:id
```

#### Create Member
```http
POST /api/member
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (required): Member name
- `position` (required): Position
- `image` (required): Member image
- `description` (optional): Description

#### Update Member
```http
PATCH /api/member/:id
Content-Type: multipart/form-data
```

#### Delete Member
```http
DELETE /api/member/:id
```

---

### 🎭 Hire Models

#### Get All Hire Models
```http
GET /api/hire-model
```

#### Get Hire Model by ID
```http
GET /api/hire-model/:id
```

#### Create Hire Model
```http
POST /api/hire-model
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (required): Model name
- `category` (required): Category
- `image` (required): Model image
- `description` (optional): Description

#### Update Hire Model
```http
PATCH /api/hire-model/:id
Content-Type: multipart/form-data
```

#### Delete Hire Model
```http
DELETE /api/hire-model/:id
```

---

### 🏠 Hero Section

#### Get Hero
```http
GET /api/hero
```

#### Create Hero
```http
POST /api/hero
Content-Type: multipart/form-data
```

**Form Data:**
- `title` (required): Hero title
- `subtitle` (required): Hero subtitle
- `image` (required): Hero image

#### Update Hero
```http
PATCH /api/hero/:id
Content-Type: multipart/form-data
```

#### Delete Hero
```http
DELETE /api/hero/:id
```

---

### 🧭 Navigation

#### Get Navigation
```http
GET /api/nav
```

#### Create Navigation
```http
POST /api/nav
Content-Type: application/json
```

**Request Body:**
```json
{
  "logo": "uploads/logo.png",
  "menuItems": [
    {
      "label": "Home",
      "link": "/"
    }
  ]
}
```

#### Update Navigation
```http
PATCH /api/nav/:id
Content-Type: application/json
```

#### Delete Navigation
```http
DELETE /api/nav/:id
```

---

### 📊 Response Format

#### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

<div align="center">

**Made with ❤️ by Next Models Nepal Team**

![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

</div> 