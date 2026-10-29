import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as eventController from "../src/api/v1/controllers/eventController";
import * as eventService from "../src/api/v1/services/eventService";
import { Event } from "../src/api/v1/models/eventModel"; 
import { mock } from "node:test";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("../src/api/v1/services/eventService");

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
    });
});