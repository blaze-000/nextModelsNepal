# Admin Dashboard - Quick Reference Guide

## Base URL
```
http://localhost:8000/api
```

## Most Important Endpoints

### 🔥 Hero Section
- `GET /hero` - Get all hero items
- `POST /hero` - Create hero item (with images)
- `PATCH /hero/:id` - Update hero item
- `DELETE /hero/:id` - Delete hero item

### 🎯 Events
- `GET /events` - Get all events
- `POST /events` - Create event (multiple files)
- `PATCH /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### ⭐ Next Events
- `GET /next-events` - Get all next events
- `POST /next-events` - Create next event (with nested cards)
- `PATCH /next-events/:id` - Update next event
- `DELETE /next-events/:id` - Delete next event

### 👥 Models
- `GET /models` - Get all company models
- `POST /models` - Create model (with images)
- `PATCH /models/:id` - Update model
- `DELETE /models/:id` - Delete model

### 🏆 Members
- `GET /member` - Get all members
- `POST /member` - Create member (with images)
- `PATCH /member/:id` - Update member
- `DELETE /member/:id` - Delete member

### 📰 News
- `GET /news` - Get all news
- `POST /news` - Create news (with images)
- `PATCH /news/:id` - Update news
- `DELETE /news/:id` - Delete news

### 📞 Contact Submissions
- `GET /contact` - Get all contact submissions
- `DELETE /contact/:id` - Delete contact submission

### 📝 Application Forms
- `GET /app-form` - Get all applications
- `DELETE /app-form/:id` - Delete application

### 🤝 Hire Requests
- `GET /hire-model` - Get all hire requests
- `DELETE /hire-model/:id` - Delete hire request

## File Upload Tips

### For Single Images
```javascript
const formData = new FormData();
formData.append('image', file);
```

### For Multiple Images
```javascript
const formData = new FormData();
files.forEach(file => {
  formData.append('images', file);
});
```

### For Mixed Content (Next Events)
```javascript
const formData = new FormData();
formData.append('titleImage', titleImageFile);
formData.append('image', imageFile);
formData.append('card[0][item][0][criteriaIcon]', criteriaIconFile);
```

## Common Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": [...]
}
```

## Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Additional details"
}
```

## Quick Dashboard Structure

1. **Overview** - Statistics and recent activity
2. **Content** - Hero, Events, Next Events, News
3. **Models** - Company Models, Members
4. **Submissions** - Contact, Applications, Hire Requests
5. **Settings** - Navigation, Partners, Feedback

## Key Features to Implement

- ✅ File upload with drag & drop
- ✅ Image preview and cropping
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Search and filtering
- ✅ Pagination
- ✅ Responsive design 