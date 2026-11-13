// Import necessary modules and types
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as eventController from "../src/api/v1/controllers/eventController";
import * as eventService from "../src/api/v1/services/eventService";
import { Event } from "../src/api/v1/models/eventModel"; 
import { mock } from "node:test";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

// Mock the eventService module to control its behavior during tests
jest.mock("../src/api/v1/services/eventService");

// Test suite for the Event Controller
describe("Event Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    // reusable mocks for any controller tests
    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
        mockRes = {
            status: jest.fn((_code: number) => mockRes as Response),
            json: jest.fn((_body?: any) => mockRes as Response),
        };
        mockNext = jest.fn();
    });
// Test case for the getAllEventsController function
    describe("getAllEvents", () => {
        it("should handle successful operation", async () => {
            const mockEvents: Event[] = [
                { 
                    id: "1",
                    name: "Test Event",
                    date: new Date(),
                    capacity: 100,
                    registrationCount: 50,
                    status: "active",
                    category: "TestCategory",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            jest.mocked(eventService.getAllEvents).mockResolvedValue(mockEvents);

            await eventController.getAllEventsController(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "events Retrieved",
                count: mockEvents.length,
                data: mockEvents,
            });
        });
    });
    // Test case for the getEventsByIdController function
    describe("getEventsById", () => {
        it("should return the event data from the service", async () => {
            const event: Event = {
                id: "event-123",
                name: "Test Event",
                date: new Date("2030-01-01T18:00:00.000Z"),
                capacity: 100,
                registrationCount: 1,
                status: "active",
                category: "meetup",
                createdAt: new Date("2029-12-01T12:00:00.000Z"),
                updatedAt: new Date("2029-12-02T12:00:00.000Z"),
            };
            mockReq.params = { id: "event-123" };
            jest.mocked(eventService.getEventsById).mockResolvedValue([event]);

            await eventController.getEventsByIdController(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(eventService.getEventsById).toHaveBeenCalledWith("event-123");
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Event retrieved",
                data: event,
            });
        });
    });
    // Test case for the createEventsController function
    describe("createEvent", () => {
        it("should handle successful creation", async () => {
            const mockBody = {
                name: "Test Event",
                date: new Date(),
                capacity: 100,
                registrationCount: 50,
                status: "active",
                category: "TestCategory",
            };

            const mockEvent: Event = {
                id: "test_id",
                createdAt: new Date(),
                updatedAt: new Date(),
                ...mockBody
            };

            mockReq.body = mockBody;
            jest.mocked(eventService.createEvents).mockResolvedValue(mockEvent);

            await eventController.createEventsController(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Event created",
                data: mockEvent,
            });
        });
    });

    // Test case to verify that the controller handles service failures correctly
    it("should return 500 when creation fails", async () => {
        jest.mocked(eventService.createEvents).mockRejectedValue(new Error("Service failure"));

        await eventController.createEventsController(
            mockReq as Request,
            mockRes as Response,
            mockNext
        );

        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Failed to create event",
        });
    });

    // Test case for the updateEventController function
    describe("deleteEvent", () => {
        it("should wait for the service to delete the event", async () => {
            mockReq.params = { id: "event-123" };
            jest.mocked(eventService.deleteEvent).mockResolvedValue();

            await eventController.deleteEventController(
                mockReq as Request,
                mockRes as Response
            );

            expect(eventService.deleteEvent).toHaveBeenCalledWith("event-123");
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Event deleted" });
        });

        // Test case to verify that the controller handles service failures correctly
        it("should return 500 when the service fails to delete the event", async () => {
            mockReq.params = { id: "event-123" };
            jest.mocked(eventService.deleteEvent).mockRejectedValue(new Error("Service failure"));

            await eventController.deleteEventController(
                mockReq as Request,
                mockRes as Response
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Failed to Delete event",
            });
        });
    });
    describe("updateEvent", () => {
        it("should return the updated event", async () => {
            const eventData = { name: "Updated Event" };
            const updatedEvent: Event = {
                id: "event-123",
                name: "Updated Event",
                date: new Date("2030-01-01T18:00:00.000Z"),
                capacity: 100,
                registrationCount: 1,
                status: "active",
                category: "meetup",
                createdAt: new Date("2029-12-01T12:00:00.000Z"),
                updatedAt: new Date("2029-12-02T12:00:00.000Z"),
            };
            mockReq.params = { id: "event-123" };
            mockReq.body = eventData;
            jest.mocked(eventService.updateEvent).mockResolvedValue(updatedEvent);

            await eventController.updateEventController(
                mockReq as Request,
                mockRes as Response
            );

            expect(eventService.updateEvent).toHaveBeenCalledWith("event-123", eventData);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Event updated",
                data: updatedEvent,
            });
        });

        it("should return 500 when the service fails to update the event", async () => {
            mockReq.params = { id: "event-123" };
            jest.mocked(eventService.updateEvent).mockRejectedValue(new Error("Service failure"));

            await eventController.updateEventController(
                mockReq as Request,
                mockRes as Response
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Failed to update event",
            });
        });
    });
});