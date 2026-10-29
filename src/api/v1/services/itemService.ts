import { Item } from "../models/itemModel";

// In-memory storage for demo purposes
const items: Item[] = [];

/**
 * Retrieves all items from storage
 * @returns Array of all items
 */
export const getAllItems = async (): Promise<Item[]> => {
    return structuredClone(items);
};

/**
 * Creates a new item
 * @param itemData - The data for the new item (name and description)
 * @returns The created item with generated ID
 */
export const createItem = async (itemData: {
    name: string;
    description: string;
}): Promise<Item> => {
    // create a new item with generated id
    const newItem: Item = {
        id: Date.now().toString(),
        name: itemData.name,
        description: itemData.description,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    items.push(newItem);

    return structuredClone(newItem);
};

/**
 * Updates (replaces) an existing item
 * @param id - The ID of the item to update
 * @param itemData - The fields to updates (name and/or description)
 * @returns The updated item
 * @throws Error if item with given ID is not found
 */
export const updateItem = async (
    id: string,
    itemData: Pick<Item, "name" | "description">
): Promise<Item> => {
    const index: number = items.findIndex((item: Item) => item.id === id);

    if (index === -1) {
        throw new Error(`Item with ID ${id} not found`);
    }

    items[index] = {
        ...items[index],
        ...itemData,
        updatedAt: new Date(),
    };

    return structuredClone(items[index]);
};

/**
 * Deletes an item from storage
 * @param id - The ID of the item to delete
 * @throws Error if item with given ID is not found
 */
export const deleteItem = async (id: string): Promise<void> => {
    const index: number = items.findIndex((item: Item) => item.id === id);

    if (index === -1) {
        throw new Error(`Item with ID ${id} not found`);
    }

    items.splice(index, 1);
};