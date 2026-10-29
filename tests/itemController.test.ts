import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as eventController from "../src/api/v1/controllers/eventController";
import * as eventService from "../src/api/v1/services/eventService";
import { Event } from "../src/api/v1/models/eventModel"; 
import { mock } from "node:test";
import { beforeEach,afterAll, describe, expect, it, jest } from "@jest/globals";

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
            (eventService.getAllEvents as jest.Mock).mockReturnValue(mockEvents);

            await (eventController.getAllEvents as unknown as (
                req: Request,
                res: Response,
                next: NextFunction
            ) => Promise<void>)(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Events retrieved successfully",
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
            (eventService.createEvents as jest.Mock).mockReturnValue(mockEvent);

            await (eventController.createEvents as unknown as (
                req: Request,
                res: Response,
                next: NextFunction
            ) => Promise<void>)(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Event created successfully",
                data: mockEvent,
            });
        });

        it("should return 400 when name is missing", async () => {
            mockReq.body = { description: "Test Description" };

            await (eventController.createEvents as unknown as (
                req: Request,
                res: Response,
                next: NextFunction
            ) => Promise<void>)(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Event name is required",
            });
        });
    });
});