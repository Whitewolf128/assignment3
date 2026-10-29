import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as itemService from "../services/itemService";
import { Item } from "../models/itemModel";

/**
 * Manages requests and reponses to retrieve all Items
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllItems = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const items: Item[] = await itemService.getAllItems();
        res.status(HTTP_STATUS.OK).json({
            message: "Items retrieved successfully",
            data: items,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests, reponses, and validation to create an Item
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const createItem = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Basic validation - check for required fields
        if (!req.body.name) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Item name is required",
            });
        } else if (!req.body.description) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Item dscription is required",
            });
        } else {
            // Extract only the fields we want (destructuring)
            // const name: string = req.body.name;
            // const description: string = req.body.description;
            const { name, description } = req.body;

            const newItem: Item = await itemService.createItem({ name, description });
            res.status(HTTP_STATUS.CREATED).json({
                message: "Item created successfully",
                data: newItem,
            });
        }
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to update an Item
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const updateItem = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // const id: string = req.params.id;
        const { id } = req.params;

        // Extract update fields
        const { name, description } = req.body;

        // create the update item object with the fields to be updated
        const updatedItem: Item = await itemService.updateItem(id, { name, description });

        res.status(HTTP_STATUS.OK).json({
            message: "Item updated successfully",
            data: updatedItem,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to delete an Item
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteItem = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        await itemService.deleteItem(id);
        res.status(HTTP_STATUS.OK).json({
            message: "Item deleted successfully",
        });
    } catch (error: unknown) {
        next(error);
    }
};