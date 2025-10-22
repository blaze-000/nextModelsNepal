import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const UPLOAD_FOLDER = 'uploads';

// Ensure upload folder exists
if (!fs.existsSync(UPLOAD_FOLDER)) {
    fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
}

export interface ProcessedFile {
    filename: string;
    path: string;
    mimetype: string;
    size: number;
}

/**
 * Process and save a File object (from ORPC/Zod file schema)
 * - Compresses images
 * - Converts to WebP format (except SVG)
 * - Returns saved file info
 */
export async function processAndSaveFile(file: File): Promise<ProcessedFile> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name;
    const mimetype = file.type;

    // Handle SVG files - save as-is
    if (mimetype === 'image/svg+xml') {
        const filename = `${Date.now()}-${originalName}`;
        const filepath = path.join(UPLOAD_FOLDER, filename);

        fs.writeFileSync(filepath, buffer);

        return {
            filename,
            path: filepath,
            mimetype,
            size: buffer.length,
        };
    }

    // Process other images with Sharp: compress and convert to WebP
    const baseName = originalName.replace(/\.[^/.]+$/, ''); // Remove extension
    const filename = `${Date.now()}-${baseName}.webp`;
    const filepath = path.join(UPLOAD_FOLDER, filename);

    await sharp(buffer)
        .rotate() // Auto-rotate based on EXIF orientation
        .webp({
            quality: 80, // Quality balance (1-100)
            effort: 4, // Compression effort (0-6)
        })
        .toFile(filepath);

    const stats = fs.statSync(filepath);

    return {
        filename,
        path: filepath,
        mimetype: 'image/webp',
        size: stats.size,
    };
}

/**
 * Process multiple files
 */
export async function processAndSaveFiles(files: File[]): Promise<ProcessedFile[]> {
    return Promise.all(files.map(file => processAndSaveFile(file)));
}

/**
 * Delete a file from the filesystem
 */
export function deleteFile(filePath: string): void {
    try {
        if (filePath && filePath.trim() !== '') {
            const fullPath = path.resolve(filePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
    }
}

/**
 * Delete multiple files
 */
export function deleteFiles(filePaths: string[]): void {
    filePaths.forEach(deleteFile);
}

/**
 * Check if file is an image
 */
export function isImageFile(mimetype: string): boolean {
    return mimetype.startsWith('image/');
}

/**
 * Validate file size (in bytes)
 */
export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxBytes;
}

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
}

