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
}).array('images', 10);

export const uploadImage = multer({
    storage,
    fileFilter: imageFilter,
}).single('image');

export const uploadIcon = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/svg+xml') cb(null, true);
        else cb(new Error('Only SVG files are allowed.'));
    },
}).single('icon');

// Combined middleware for handling both images and icons
export const uploadImagesAndIcons = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'image/svg+xml') {
            cb(null, true);
        } else {
            cb(new Error('Only image files (including SVG) are allowed.'));
        }
    },
}).fields([
    { name: 'images', maxCount: 10 },
    { name: 'icons', maxCount: 10 }
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
}).any();

// New middleware specifically for next event with nested field support
export const uploadNextEventFiles = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'image/svg+xml') {
            cb(null, true);
        } else {
            cb(new Error('Only image files (including SVG) are allowed.'));
        }
    },
}).fields([
    { name: 'images', maxCount: 10 },
    { name: 'icons', maxCount: 10 },
    { name: 'subtitle[0].icon', maxCount: 5 },
    { name: 'subtitle[0].items[0].tagIcon', maxCount: 5 },
    { name: 'subtitle[0].items[1].tagIcon', maxCount: 5 },
    { name: 'subtitle[1].icon', maxCount: 5 },
    { name: 'subtitle[1].items[0].tagIcon', maxCount: 5 },
    { name: 'subtitle[1].items[1].tagIcon', maxCount: 5 },
]);

export const uploadImageFiles = multer({
    storage,
    fileFilter: imageFilter,
}).fields([
    { name: 'coverImage', maxCount: 1 },  // Single cover image
    { name: 'gallery', maxCount: 10 }     // Multiple gallery images
]);

// Middleware for company models with cover image and gallery images
export const uploadCompanyModelFiles = multer({
    storage,
    fileFilter: imageFilter,
}).fields([
    { name: 'coverImage', maxCount: 1 },  // Single cover image
    { name: 'images', maxCount: 10 }      // Multiple gallery images
]);

// Middleware for events with cover image, title image, sub image, highlight images, and logo
export const uploadEventFiles = multer({
    storage,
    fileFilter: imageFilter,
}).fields([
    { name: 'coverImage', maxCount: 1 },  // Single cover image
    { name: 'titleImage', maxCount: 1 },  // Single title image
    { name: 'subImage', maxCount: 1 },    // Single sub image
    { name: 'highlight', maxCount: 10 },  // Multiple highlight images
    { name: 'logo', maxCount: 1 },
    {name: 'startingTimelineIcon', maxCount: 1},   
    {name: 'midTimelineIcon', maxCount: 1},        
    {name: 'endTimelineIcon', maxCount: 1}         
]);