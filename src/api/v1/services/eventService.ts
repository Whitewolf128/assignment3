import { Event } from "../models/eventModel";
import * as firestoreRepository from "../repostitories/firestoreRepository";
import { Timestamp } from "firebase-admin/firestore";
/**
 * Updates an existing post.
 * @param {Post} postData - The updated post data.
 * @returns {Promise<void>}
 * @throws {Error} - If validation or repository operation fails.
 */

const COLLECTION = "event";

export const getAllEvents = async(): Promise<Event[]> => {
    try{
        const snapshot = await firestoreRepository.getDocuments(COLLECTION);
        const events: Event[] = snapshot.docs.map((doc) =>{
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
                createdAt: data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : data.createdAt,
                updatedAt: data.updatedAt instanceof Timestamp
                    ? data.updatedAt.toDate()
                    : data.updatedAt,
            } as Event;
        });
        return events; 
    }
    catch (error:unknown){
        const errorMessage = error instanceof Error ? error.message: "Unknown error";
        throw new Error(`Failed to retrieve all events: ${errorMessage}`);
    }
}

export const createEvents = async( eventData: {
    name: string;
    date: Date;
    capacity: number;
    registrationCount: number;
    status: string;
    category: string;
}): Promise<Event> =>{
    try{
        const newProduct: Event = {
            name:eventData.name,
            date: eventData.date,
            capacity:eventData.capacity,
            registrationCount:eventData.registrationCount,
            status:eventData.status,
            category: eventData.category,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const id = await firestoreRepository.createDocument<Event>(COLLECTION, newProduct);
        return{id, ...newProduct} as Event;

    }

    catch(error: unknown){
        const errorMessage = error instanceof Error ? error.message: "Unknown error";
        throw new Error(`Failed to create product: ${errorMessage}`);
    }
};

export const updateEvent = (id: string, event: string): string => {
    // Logic to update an item in the database
    return "Event has been updated";
};

export const deleteEvent = async (id: string): Promise<void> => {
    try {
        await firestoreRepository.deleteDocument(COLLECTION, id);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to delete event: ${errorMessage}`);
    }
};

export const getEventsById = async (id: string): Promise<Event[]> => {
    const event = (await getAllEvents()).find((e) => e.id === id);
  if (!event) {
    return [];
  }

  return [{
    ...event
  }];
};
// ... other service functions (getPostById, updatePost, deletePost) ...