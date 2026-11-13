// Import Libraries
import { Event } from "../models/eventModel";
import * as firestoreRepository from "../repostitories/firestoreRepository";
import { Timestamp } from "firebase-admin/firestore";
/**
 * Updates an existing event.
 * @param {Event} eventData - The updated event data.
 * @returns {Promise<void>}
 * @throws {Error} - If validation or repository operation fails.
 */

// Define the Firestore collection name for events
const COLLECTION = "event";

// The service function to get all events from the Firestore collection.
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

// The service function to create a new event in the Firestore collection.
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

// The service function to update an existing event in the Firestore collection.
export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event> => {
    try {
        await firestoreRepository.updateDocument(COLLECTION, id, eventData);
        const updatedEvent = await getEventsById(id);
        return updatedEvent[0];
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to update event: ${errorMessage}`);
    }
};
// The service function to delete an existing event from the Firestore collection.
export const deleteEvent = async (id: string): Promise<void> => {
    try {
        await firestoreRepository.deleteDocument(COLLECTION, id);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to delete event: ${errorMessage}`);
    }
};
// The service function to retrieve an event by its ID from the Firestore collection.
export const getEventsById = async (id: string): Promise<Event[]> => {
    const event = (await getAllEvents()).find((e) => e.id === id);
  if (!event) {
    return [];
  }

  return [{
    ...event
  }];
};
