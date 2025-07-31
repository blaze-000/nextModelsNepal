import { Request, Response } from "express";
import { NavModel } from "../models/nav.model";
import { navItemsSchema, navItemSchema } from "../validations/nav.validation";

/**
 * Fetch all navigation items
 */
export const getNavItem = async (_req: Request, res: Response) => {
    try {
        const navItems = await NavModel.find({});
        if (!navItems || navItems.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No navigation items found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Navigation items retrieved successfully.",
            data: navItems,
        });
    } catch (error: any) {
        console.error("Error fetching navigation items:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving nav items.",
        });
    }
};

/**
 * Get single nav item by ID
 */
export const getNavItemById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const eventItem = await NavModel.findById(id);

        if (!eventItem) {
            return res.status(404).json({
                success: false,
                message: `Nav item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Nav item retrieved successfully.",
            data: eventItem,
        });
    } catch (error: any) {
        console.error(`Error fetching Nav item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving Nav item.",
        });
    }
};

/**
 * Create multiple navigation items
 */
export const createNavItem = async (req: Request, res: Response) => {
    try {
        const navItems = navItemsSchema.parse(req.body);
        for (const item of navItems) {
            const existItem = await NavModel.findOne({ title: item.title });
            if (existItem) {
                return res.status(403).send(`Navigation item with title "${item.title}" already exists.`);
            }
        }

        const createdItems = await Promise.all(
            navItems.map(async (item) => {
                NavModel.create({
                    title: item.title,
                    path: item.path,
                    link: item.link,
                    type: item.type,
                    children: item.children,
                    visible: item.visible,
                    order: item.order,
                })
            }
            )
        );

        return res.status(201).json({
            success: true,
            message: "Navigation items created successfully.",
            data: createdItems,
        });
    } catch (error: any) {
        console.error("Error creating navigation items:", error.message);
        return res.status(400).json({
            success: false,
            message: "Invalid input data.",
            error: error.message,
        });
    }
};

/**
 * Update a navigation item by ID
 */
export const updateNavById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = navItemSchema.parse(req.body);

        const updatedItem = await NavModel.findByIdAndUpdate(id, updateData, {
            new: true,
            upsert: false,
        });

        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: `Navigation item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Navigation item updated successfully.",
            data: updatedItem,
        });
    } catch (error: any) {
        console.error(`Error updating navigation item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating navigation item.",
            error: error.message,
        });
    }
};

/**
 * Delete a navigation item by ID
 */
export const deleteNavById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedItem = await NavModel.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: `Navigation item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Navigation item deleted successfully.",
            data: deletedItem,
        });
    } catch (error: any) {
        console.error(`Error deleting navigation item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting navigation item.",
            error: error.message,
        });
    }
};
