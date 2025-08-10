# Hero API Test Guide

## Testing the Fixed Hero API

The issue with `titleImage` validation has been fixed. Here's how to test it:

### 1. Test with Postman

**Endpoint:** `POST /api/hero`

**Headers:**
- `Content-Type`: `multipart/form-data` (Postman will set this automatically)

**Body (form-data):**
- `maintitle` (text): "Your Main Title"
- `subtitle` (text): "Your Subtitle" 
- `description` (text): "Your Description"
- `titleImage` (file): Select an image file
- `images` (file): Select one or more image files

### 2. What Was Fixed

1. **Validation Schema**: Made `titleImage` optional in the validation since it's handled as a file upload
2. **Controller Logic**: Updated to properly extract `titleImage` from `req.files` instead of `req.body`
3. **Model Schema**: Made text fields optional to allow partial updates
4. **File Handling**: Properly handles both `images` and `titleImage` file fields

### 3. Expected Response

**Success (201):**
```json
{
  "message": "Hero section item created successfully.",
  "heroSection": {
    "_id": "...",
    "maintitle": "Your Main Title",
    "subtitle": "Your Subtitle", 
    "description": "Your Description",
    "images": ["path/to/image1.jpg", "path/to/image2.jpg"],
    "titleImage": "path/to/titleImage.jpg"
  }
}
```

### 4. File Upload Behavior

- `titleImage`: Single image file (max 1)
- `images`: Multiple image files (max 10)
- If no `titleImage` is provided, the first `images` file will be used as `titleImage`
- At least one image file is required

### 5. Testing Different Scenarios

1. **With titleImage**: Send both `titleImage` and `images`
2. **Without titleImage**: Send only `images` (first image becomes titleImage)
3. **Text fields only**: Send only text fields for updates
4. **Mixed update**: Send both files and text fields

The API should now work correctly with form-data containing both text fields and image files.
