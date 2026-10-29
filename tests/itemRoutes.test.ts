import request from "supertest";
import app from "../src/app";
import * as itemController from "../src/api/v1/controllers/eventController";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";

jest.mock("../src/api/v1/controllers/eventController", () => ({
    getAllEventsController: jest.fn((_req: Request, res: Response) =>
        res.status(HTTP_STATUS.OK).json([]),
    ),
    createEventsController: jest.fn((req: Request, res: Response) =>
        res.status(HTTP_STATUS.CREATED).json(req.body),
    ),
    updateEventController: jest.fn((req: Request, res: Response) =>
        res.status(HTTP_STATUS.OK).json({ id: req.params.id, ...req.body }),
    ),
    deleteEventController: jest.fn((req: Request, res: Response) =>
        res.status(HTTP_STATUS.OK).json({ id: req.params.id }),
    ),
}));

describe("Event Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/events/", () => {
        it("should call getAllEvents controller", async () => {
            await request(app).get("/api/v1/events/");
            expect(itemController.getAllEventsController).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/events/", () => {
        it("should call createEvents controller with valid data", async () => {
            const mockEvent = {
                name: "Test Event",
                date: new Date("2030-01-01T00:00:00.000Z"),
                capacity: 100,
                registrationCount: 50,
                status: "active",
                category: "conference",
                content: "A test event",
            }; 

            const response = await request(app)
                .post("/api/v1/events/")
                .send(mockEvent);

            expect(itemController.createEventsController).toHaveBeenCalled();
            expect(response.status).toBe(HTTP_STATUS.CREATED);
            expect(response.body).toEqual({
                ...mockEvent,
                date: mockEvent.date.toISOString(),
            });
        });
    });

    describe("PUT /api/v1/events/:id", () => {
        it("should call updateEvent controller with valid data", async () => {
            const mockEvent = {
                name: "Updated Event",
                date: new Date(),
                capacity: 100,
                registrationCount: 50,
                status: "active",
                category: "TestCategory",
            }; 

            const response = await request(app).put("/api/v1/events/testId").send(mockEvent);

            expect(itemController.updateEventController).toHaveBeenCalled();
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(response.body).toEqual({
                id: "testId",
                ...mockEvent,
                date: mockEvent.date.toISOString(),
            });
        });
    });

    describe("DELETE /api/v1/events/:id", () => {
        it("should call deleteEvent controller with valid data", async () => {
            await request(app).delete("/api/v1/events/testId");
            expect(itemController.deleteEventController).toHaveBeenCalled();
        });
    });
})