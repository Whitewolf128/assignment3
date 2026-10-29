import request from "supertest";
import app from "../src/app";
import * as itemController from "../src/api/v1/controllers/eventController";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";

jest.mock("../src/api/v1/controllers/eventController", () => ({
    getAllEvents: jest.fn((_req: Request, res: Response) =>
        res.status(HTTP_STATUS.OK).json([]),
    ),
    createEvents: jest.fn((req: Request, res: Response) =>
        res.status(HTTP_STATUS.CREATED).json(req.body),
    ),
    updateEvent: jest.fn((req: Request, res: Response) =>
        res.status(HTTP_STATUS.OK).json({ id: req.params.id, ...req.body }),
    ),
    deleteEvent: jest.fn((req: Request, res: Response) =>
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
            expect(itemController.getAllEvents).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/events/", () => {
        it("should call createEvents controller with valid data", async () => {
            const mockEvent = {
                name: "Test Event",
                date: new Date(),
                capacity: 100,
                registrationCount: 50,
                status: "active",
                category: "TestCategory",
            }; 

            const response = await request(app)
                .post("/api/v1/events/")
                .send(mockEvent);

            expect(itemController.createEvents).toHaveBeenCalled();
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

            expect(itemController.updateEvent).toHaveBeenCalled();
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(response.body).toEqual({ id: "testId", ...mockEvent });
        });
    });

    describe("DELETE /api/v1/events/:id", () => {
        it("should call deleteEvent controller with valid data", async () => {
            await request(app).delete("/api/v1/events/testId");
            expect(itemController.deleteEvent).toHaveBeenCalled();
        });
    });
})