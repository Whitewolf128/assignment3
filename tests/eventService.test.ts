// Import necessary modules and types
import { Timestamp } from "firebase-admin/firestore";
import * as firestoreRepository from "../src/api/v1/repostitories/firestoreRepository";
import { getAllEvents, getEventsById } from "../src/api/v1/services/eventService";
import { afterEach, describe, expect, it, jest } from "@jest/globals";

// Mock the Firestore repository to control its behavior during tests
jest.mock("../src/api/v1/repostitories/firestoreRepository", () => ({
    getDocuments: jest.fn(),
}));

// Test suite for the Event service
describe("Event service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    // Test case to verify that Firestore timestamps are correctly converted to JavaScript Date objects
    it("converts Firestore timestamps to dates for event responses", async () => {
        const eventDate = new Date("2030-01-01T18:00:00.000Z");
        const createdAt = new Date("2029-12-01T12:00:00.000Z");
        const updatedAt = new Date("2029-12-02T12:00:00.000Z");
        jest.mocked(firestoreRepository.getDocuments).mockResolvedValue({
            docs: [{
                id: "event-123",
                data: () => ({
                    name: "Community Meetup",
                    date: Timestamp.fromDate(eventDate),
                    capacity: 100,
                    registrationCount: 1,
                    status: "active",
                    category: "meetup",
                    createdAt: Timestamp.fromDate(createdAt),
                    updatedAt: Timestamp.fromDate(updatedAt),
                }),
            }],
        } as unknown as FirebaseFirestore.QuerySnapshot);

        const events = await getAllEvents();

        expect(events[0].date).toEqual(eventDate);
        expect(events[0].createdAt).toEqual(createdAt);
        expect(events[0].updatedAt).toEqual(updatedAt);
        expect(JSON.parse(JSON.stringify(events))[0].date).toBe(eventDate.toISOString());
    });
    // Test case to verify that Firestore timestamps are correctly converted when retrieving an event by its ID
    it("converts Firestore timestamps when retrieving an event by ID", async () => {
        const eventDate = new Date("2030-01-01T18:00:00.000Z");
        const createdAt = new Date("2029-12-01T12:00:00.000Z");
        const updatedAt = new Date("2029-12-02T12:00:00.000Z");
        jest.mocked(firestoreRepository.getDocuments).mockResolvedValue({
            docs: [{
                id: "event-123",
                data: () => ({
                    name: "Community Meetup",
                    date: Timestamp.fromDate(eventDate),
                    capacity: 100,
                    registrationCount: 1,
                    status: "active",
                    category: "meetup",
                    createdAt: Timestamp.fromDate(createdAt),
                    updatedAt: Timestamp.fromDate(updatedAt),
                }),
            }],
        } as unknown as FirebaseFirestore.QuerySnapshot);

        const events = await getEventsById("event-123");

        expect(events).toHaveLength(1);
        expect(events[0].date).toEqual(eventDate);
        expect(events[0].createdAt).toEqual(createdAt);
        expect(events[0].updatedAt).toEqual(updatedAt);
        expect(JSON.parse(JSON.stringify(events[0])).date).toBe(eventDate.toISOString());
    });
});
