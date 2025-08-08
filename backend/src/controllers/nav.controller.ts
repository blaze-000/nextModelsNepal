import { Request, Response } from "express";
import { NavModel } from "../models/nav.model";
import { navItemsSchema, navItemUpdateSchema } from "../validations/nav.validation";
import _ from "lodash"; // to help restructure nested fields

//  Fetch all navigation items
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

//  Get single nav item by ID
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

//  Create multiple navigation items
export const createNavItem = async (req: Request, res: Response) => {
    try {
        const navItems = navItemsSchema.parse(req.body);
        for (const item of navItems) {
            const existItem = await NavModel.findOne({ label: item.label });
            if (existItem) {
                return res.status(403).send(`Navigation item with label "${item.label}" already exists.`);
            }
        }

        const createdItems = await Promise.all(
            navItems.map(async (item) => {
                return NavModel.create({
                    label: item.label,
                    path: item.path,
                    type: item.type,
                    children: item.children,
                    visible: item.visible,
                    order: item.order,
                })
            }
            )
        );

        if(!createdItems) return res.status(401).send("Failed to send nav response.");

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

//  Update a navigation item by ID
export const updateNavById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if event exists
        const existingEvent = await NavModel.findById({_id: id}).lean();
        if (!existingEvent) {
            return res.status(404).json({
                success: false,
                message: "Nav item not found"
            });
        }       
        
        const body = req.body;
        let mergedData: any = _.cloneDeep(existingEvent);

        if (body.label !== undefined) mergedData.label = body.label;
        if (body.path !== undefined) mergedData.path = body.path;
        if (body.type !== undefined) mergedData.type = body.type;
        if (body.children !== undefined) {
            // Deep merge card array if provided
            mergedData.children = _.mergeWith(
                _.cloneDeep(existingEvent.children),
                body.children,
                (objValue, srcValue) => Array.isArray(objValue) && Array.isArray(srcValue) ? srcValue : undefined
            );
        }

         const validData = navItemUpdateSchema.parse(mergedData);

        // Update the event in DB
        const updatedNav = await NavModel.findByIdAndUpdate(
            id,
            validData,
            { new: true, runValidators: true }
        );         

        return res.status(200).json({
            success: true,
            message: "Navigation item updated successfully.",
            data: updatedNav,
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

//  Delete a navigation item by ID
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
