import { NextFunction, Request, Response } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import sharp from "sharp";

const folder = "uploads";
if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
}

// Use memory storage to process images before saving
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Accept images and SVG files
        if (
            file.mimetype.startsWith("image/") ||
            file.mimetype === "image/svg+xml"
        ) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for uploaded files
    },
});

/**
 * Middleware to process uploaded images with Sharp
 * - Compresses images
 * - Converts to WebP format (except SVG)
 * - Maintains original filename structure
 */
export const processImages = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Check if there are any files to process
        if (!req.file && !req.files) {
            return next();
        }

        // Handle single file upload (req.file)
        if (req.file) {
            await processImage(req.file);
        }

        // Handle multiple files upload (req.files)
        if (req.files) {
            // req.files can be an array or object with field names
            if (Array.isArray(req.files)) {
                // Array of files (upload.array())
                for (const file of req.files) {
                    await processImage(file);
                }
            } else {
                // Object with field names (upload.fields())
                for (const fieldName in req.files) {
                    const files = (
                        req.files as {
                            [fieldname: string]: Express.Multer.File[];
                        }
                    )[fieldName];
                    for (const file of files) {
                        await processImage(file);
                    }
                }
            }
        }

        next();
    } catch (error) {
        console.error("Error processing images:", error);
        next(error);
    }
};

/**
 * Process a single image file
 * @param file - Multer file object
 */
async function processImage(file: Express.Multer.File): Promise<void> {
    // Skip processing for SVG files - save them as-is
    if (file.mimetype === "image/svg+xml") {
        const filename = `${Date.now()}-${file.originalname}`;
        const filepath = path.join(folder, filename);
        fs.writeFileSync(filepath, file.buffer);
        file.filename = filename;
        file.path = filepath;
        return;
    }

    // Generate filename with .webp extension
    const originalName = file.originalname.replace(/\.[^/.]+$/, ""); // Remove original extension
    const filename = `${Date.now()}-${originalName}.webp`;
    const filepath = path.join(folder, filename);

    // Process image with Sharp: compress and convert to WebP
    await sharp(file.buffer)
        .rotate() // Auto-rotate based on EXIF orientation (removes EXIF after rotation)
        .webp({
            quality: 80, // Adjust quality (1-100). 80 is a good balance between quality and size
            effort: 4, // Compression effort (0-6). 4 is balanced between speed and compression
        })
        .toFile(filepath);

    // Update file object with new filename and path
    file.filename = filename;
    file.path = filepath;
    file.mimetype = "image/webp";
}

export default upload;
