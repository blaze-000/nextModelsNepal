import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload folder exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // save to /uploads
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${file.fieldname}${ext}`;
        cb(null, filename);
    },
});

// image-only filter
const imageFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

export const uploadImages = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 10 },
}).fields([
    { name: 'images', maxCount: 10 },
    { name: 'titleImage', maxCount: 1 },
]);

export const uploadImage = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
}).single('image');

export const uploadIcon = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/svg+xml') cb(null, true);
        else cb(new Error('Only SVG files are allowed.'));
    },
    limits: { fileSize: 1 * 1024 * 1024, files: 1 },
}).single('icon');

// Combined middleware for handling both images and icons
export const uploadImagesAndIcons = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Enforce SVG for the icon field, and standard images for images field
        if (file.fieldname === 'icon') {
            if (file.mimetype === 'image/svg+xml') return cb(null, true);
            return cb(new Error('Only SVG files are allowed for icon.'));
        }

        if (file.fieldname === 'images') {
            if (file.mimetype.startsWith('image/')) return cb(null, true);
            return cb(new Error('Only image files are allowed for images.'));
        }

        return cb(new Error(`Unexpected field: ${file.fieldname}`));
    },
    limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
    { name: 'images', maxCount: 10 },
    { name: 'icon', maxCount: 1 },
]);

// Enhanced middleware for handling any image files with nested field names
export const uploadAnyImages = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'image/svg+xml') {
            cb(null, true);
        } else {
            cb(new Error('Only image files (including SVG) are allowed.'));
        }
    },
    // limits: { fileSize: 5 * 1024 * 1024 },
}).any();

export const uploadNextEventRequiredFiles = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'image/svg+xml') {
            cb(null, true);
        } else {
            cb(new Error('Only image files (including SVG) are allowed.'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
    { name: 'titleImage', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    // Add other fields as needed
]);

export const uploadImageFiles = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
    { name: 'coverImage', maxCount: 1 },  // Single cover image
    { name: 'gallery', maxCount: 10 }     // Multiple gallery images
]);

// Middleware for company models with cover image and gallery images
export const uploadCompanyModelFiles = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
    { name: 'coverImage', maxCount: 1 },  // Single cover image
    { name: 'images', maxCount: 10 }      // Multiple gallery images
]);

// Middleware for events with cover image, title image, sub image, highlight images, and logo
export const uploadEventFiles = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
    { name: 'coverImage', maxCount: 1 },  // Single cover image
    { name: 'titleImage', maxCount: 1 },  // Single title image
    { name: 'subImage', maxCount: 1 },    // Single sub image
    { name: 'highlight', maxCount: 10 },  // Multiple highlight images
    { name: 'logo', maxCount: 1 },
    {name: 'startingTimelineIcon', maxCount: 1},   
    {name: 'midTimelineIcon', maxCount: 1},        
    {name: 'endTimelineIcon', maxCount: 1},  
    {name: 'sponsersImage', maxCount: 25}       
]);