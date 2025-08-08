# Next Models Nepal - Admin Dashboard Documentation

## Overview
This document provides comprehensive guidance for building the frontend admin dashboard for Next Models Nepal. The dashboard should allow administrators to manage all aspects of the website including events, models, content, and user submissions.

## Base URL
```
http://localhost:8000/api
```

## Authentication
Currently, the API doesn't have authentication implemented. You may want to add authentication middleware for the admin dashboard.

## API Endpoints

### 1. Hero Section Management
**Base Path:** `/api/hero`

#### Get All Hero Items
```http
GET /api/hero
```
**Response:**
```json
{
  "success": true,
  "message": "Hero items retrieved successfully.",
  "data": [
    {
      "_id": "string",
      "maintitle": "string",
      "subtitle": "string", 
      "description": "string",
      "images": ["string"]
    }
  ]
}
```

#### Get Single Hero Item
```http
GET /api/hero/:id
```

#### Create Hero Item
```http
POST /api/hero
Content-Type: multipart/form-data
```
**Required Fields:**
- `maintitle` (string)
- `subtitle` (string)
- `description` (string)
- `images` (file array) - At least one image required

#### Update Hero Item
```http
PATCH /api/hero/:id
Content-Type: multipart/form-data
```
**Optional Fields:**
- `maintitle` (string)
- `subtitle` (string)
- `description` (string)
- `images` (file array)

#### Delete Hero Item
```http
DELETE /api/hero/:id
```

---

### 2. Navigation Management
**Base Path:** `/api/nav`

#### Get All Navigation Items
```http
GET /api/nav
```

#### Get Single Navigation Item
```http
GET /api/nav/:id
```

#### Create Navigation Item
```http
POST /api/nav
Content-Type: application/json
```
**Required Fields:**
- `title` (string)
- `link` (string)
- `order` (number)

#### Update Navigation Item
```http
PATCH /api/nav/:id
Content-Type: application/json
```

#### Delete Navigation Item
```http
DELETE /api/nav/:id
```

---

### 3. Events Management
**Base Path:** `/api/events`

#### Get All Events
```http
GET /api/events
```

#### Get Single Event
```http
GET /api/events/:id
```

#### Create Event
```http
POST /api/events
Content-Type: multipart/form-data
```
**Required Fields:**
- `title` (string)
- `overview` (string)
- `coverImage` (file)
- `titleImage` (file)
- `subImage` (file)
- `logo` (file)
- `highlight` (file array)
- `sponsersImage` (file array)
- `startingTimelineIcon` (file)
- `midTimelineIcon` (file)
- `endTimelineIcon` (file)

**Optional Fields:**
- `tag` (string)
- `date` (string)
- `purpose` (string)
- `eventDescription` (string)
- `startingTimelineDate` (string)
- `startingTimelineEvent` (string)
- `midTimelineDate` (string)
- `midTimelineEvent` (string)
- `endTimelineDate` (string)
- `endTimelineEvent` (string)
- `sponsers` (string)

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

### 4. Next Events Management
**Base Path:** `/api/next-events`

#### Get All Next Events
```http
GET /api/next-events
```

#### Get Single Next Event
```http
GET /api/next-events/:id
```

#### Create Next Event
```http
POST /api/next-events
Content-Type: multipart/form-data
```
**Required Fields:**
- `tag` (string)
- `title` (string)
- `titleImage` (file)
- `image` (file)
- `description` (string)
- `noticeName` (string)
- `notice` (string array)
- `card` (object array) - Each card should have:
  - `cardTitle` (string)
  - `item` (array) - Each item should have:
    - `criteriaTitle` (string)
    - `criteria` (string)
    - `criteriaIcon` (file)

#### Update Next Event
```http
PATCH /api/next-events/:id
Content-Type: multipart/form-data
```

#### Delete Next Event
```http
DELETE /api/next-events/:id
```

---

### 5. Company Models Management
**Base Path:** `/api/models`

#### Get All Models
```http
GET /api/models
```

#### Get Single Model
```http
GET /api/models/:id
```

#### Create Model
```http
POST /api/models
Content-Type: multipart/form-data
```
**Required Fields:**
- `name` (string)
- `intro` (string)
- `address` (string)
- `gender` (string)
- `coverImage` (file)
- `images` (file array)

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

### 6. Members Management
**Base Path:** `/api/member`

#### Get All Members
```http
GET /api/member
```

#### Get Single Member
```http
GET /api/member/:id
```

#### Create Member
```http
POST /api/member
Content-Type: multipart/form-data
```
**Required Fields:**
- `name` (string)
- `participants` (string)
- `bio` (string)
- `event` (string) - Event ID
- `icon` (file)
- `images` (file array)

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

### 7. Career Management
**Base Path:** `/api/career`

#### Get All Career Items
```http
GET /api/career
```

#### Get Single Career Item
```http
GET /api/career/:id
```

#### Create Career Item
```http
POST /api/career
Content-Type: multipart/form-data
```
**Required Fields:**
- `maintitle` (string)
- `subtitle` (string)
- `description` (string)
- `link` (string)
- `images` (file array)

#### Update Career Item
```http
PATCH /api/career/:id
Content-Type: multipart/form-data
```

#### Delete Career Item
```http
DELETE /api/career/:id
```

---

### 8. Feedback Management
**Base Path:** `/api/feedback`

#### Get All Feedback Items
```http
GET /api/feedback
```

#### Get Single Feedback Item
```http
GET /api/feedback/:id
```

#### Create Feedback Item
```http
POST /api/feedback
Content-Type: multipart/form-data
```
**Required Fields:**
- `maintitle` (string)
- `feedback` (object array) - Each feedback should have:
  - `name` (string)
  - `description` (string)
  - `image` (file)

#### Update Feedback Item
```http
PATCH /api/feedback/:id
Content-Type: multipart/form-data
```

#### Delete Feedback Item
```http
DELETE /api/feedback/:id
```

---

### 9. Partners Management
**Base Path:** `/api/partners`

#### Get All Partners
```http
GET /api/partners
```

#### Get Single Partner
```http
GET /api/partners/:id
```

#### Create Partner
```http
POST /api/partners
Content-Type: multipart/form-data
```
**Required Fields:**
- `maintitle` (string)
- `partners` (object array) - Each partner should have:
  - `name` (string)
  - `image` (file)

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

### 10. News Management
**Base Path:** `/api/news`

#### Get All News Items
```http
GET /api/news
```

#### Get Single News Item
```http
GET /api/news/:id
```

#### Create News Item
```http
POST /api/news
Content-Type: multipart/form-data
```
**Required Fields:**
- `title` (string)
- `description` (string)
- `content` (string)
- `year` (string)
- `images` (file array)

#### Update News Item
```http
PATCH /api/news/:id
Content-Type: multipart/form-data
```

#### Delete News Item
```http
DELETE /api/news/:id
```

---

### 11. Contact Management
**Base Path:** `/api/contact`

#### Get All Contact Submissions
```http
GET /api/contact
```

#### Get Single Contact Submission
```http
GET /api/contact/:id
```

#### Create Contact Submission (Public)
```http
POST /api/contact
Content-Type: application/json
```
**Required Fields:**
- `name` (string)
- `email` (string)
- `phone` (string)
- `message` (string)

#### Delete Contact Submission
```http
DELETE /api/contact/:id
```

---

### 12. Hire Model Management
**Base Path:** `/api/hire-model`

#### Get All Hire Requests
```http
GET /api/hire-model
```

#### Get Single Hire Request
```http
GET /api/hire-model/:id
```

#### Create Hire Request
```http
POST /api/hire-model/:id
Content-Type: application/json
```
**Required Fields:**
- `name` (string)
- `email` (string)
- `phone` (string)
- `message` (string)
- `event` (string)
- `model` (string)

#### Delete Hire Request
```http
DELETE /api/hire-model/:id
```

---

### 13. Application Form Management
**Base Path:** `/api/app-form`

#### Get All Applications
```http
GET /api/app-form
```

#### Get Single Application
```http
GET /api/app-form/:id
```

#### Create Application (Public)
```http
POST /api/app-form/:id
Content-Type: multipart/form-data
```
**Required Fields:**
- `images` (file array)
- `name` (string)
- `phone` (string)
- `country` (string)
- `city` (string)
- `ethnicity` (string)
- `email` (string)
- `age` (string)
- `languages` (string array)
- `gender` (string) - "Male", "Female", or "Other"
- `occupation` (string)
- `parentsName` (string)
- `parentsMobile` (string)
- `permanentAddress` (string)

**Optional Fields:**
- `dressSize` (string)
- `shoeSize` (string)
- `hairColor` (string)
- `eyeColor` (string)
- `auditionPlace` (string)
- `weight` (number)
- `parentsOccupation` (string)
- `temporaryAddress` (string)
- `hobbies` (string)
- `talents` (string)
- `hearedFrom` (string)
- `additionalMessage` (string)

#### Delete Application
```http
DELETE /api/app-form/:id
```

---

## File Upload Guidelines

### Supported File Types
- Images: JPG, JPEG, PNG, GIF, SVG
- Maximum file size: Determined by server configuration

### File Upload Structure
- Files are stored in the `uploads/` directory
- File paths are returned as relative paths (e.g., `uploads/filename.jpg`)
- Files are automatically renamed with timestamps to avoid conflicts

### Upload Endpoints
- Single file: Use `uploadImage` middleware
- Multiple files: Use `uploadImages` middleware
- Mixed files: Use `uploadAnyImages` middleware
- Specific file types: Use `uploadImagesAndIcons` middleware

---

## Error Handling

### Common Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Additional error details"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Frontend Implementation Guidelines

### 1. Dashboard Structure
Create a comprehensive admin dashboard with the following sections:

#### Navigation
- Sidebar with all management sections
- Breadcrumb navigation
- User profile/logout

#### Main Sections
1. **Dashboard Overview**
   - Statistics and quick actions
   - Recent submissions
   - System status

2. **Content Management**
   - Hero Section
   - Navigation
   - Events
   - Next Events

3. **Model Management**
   - Company Models
   - Members
   - Career Opportunities

4. **Content & Media**
   - News
   - Partners
   - Feedback

5. **User Submissions**
   - Contact Forms
   - Application Forms
   - Hire Requests

### 2. Form Handling
- Use `FormData` for file uploads
- Implement proper validation
- Show loading states during submissions
- Handle errors gracefully

### 3. File Upload Components
- Drag and drop file upload
- Image preview
- Multiple file selection
- File type validation

### 4. Data Management
- Implement CRUD operations
- Real-time updates
- Search and filtering
- Pagination for large datasets

### 5. UI/UX Considerations
- Responsive design
- Mobile-friendly interface
- Intuitive navigation
- Consistent styling
- Loading states and feedback

---

## Security Considerations

### Current State
- No authentication implemented
- All endpoints are publicly accessible

### Recommendations
1. Implement JWT authentication
2. Add role-based access control
3. Validate file uploads
4. Implement rate limiting
5. Add input sanitization
6. Use HTTPS in production

---

## Testing

### API Testing
- Test all CRUD operations
- Test file uploads
- Test error scenarios
- Test validation rules

### Frontend Testing
- Test form submissions
- Test file uploads
- Test responsive design
- Test user interactions

---

## Deployment

### Environment Variables
- Database connection string
- File upload directory
- API base URL
- Environment (development/production)

### Production Considerations
- Enable HTTPS
- Implement authentication
- Set up proper logging
- Configure backup strategies
- Monitor performance

---

This documentation provides a comprehensive guide for building the admin dashboard. Make sure to implement proper error handling, validation, and user experience considerations throughout the development process. 