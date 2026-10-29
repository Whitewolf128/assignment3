import request from "supertest";
import app from "../src/app";
import * as itemController from "../src/api/v1/controllers/itemController";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { afterEach,afterAll, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";

jest.mock("../src/api/v1/controllers/itemController", () => ({
    getAllItems: jest.fn((_req: Request, res: Response) => res.status(HTTP_STATUS.OK).send()),
    createItem: jest.fn((_req: Request, res: Response) => res.status(HTTP_STATUS.CREATED).send()),
    updateItem: jest.fn((_req: Request, res: Response) => res.status(HTTP_STATUS.OK).send()),
    deleteItem: jest.fn((req: Request, res: Response) => res.status(HTTP_STATUS.OK).send()),
}));

describe("Item Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/items/", () => {
        it("should call getAllItems controller", async () => {
            await request(app).get("/api/v1/items/");
            expect(itemController.getAllItems).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/items/", () => {
        it("should call createItem controller with valid data", async () => {
            const mockItem = {
                name: "Test Item",
                description: "Test description",
            }; 

            await request(app).post("/api/v1/items/").send(mockItem);
            expect(itemController.createItem).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/items/:id", () => {
        it("should call updateItem controller with valid data", async () => {
            const mockItem = {
                name: "Updated Item",
                description: "Updated description",
            }; 

            await request(app).put("/api/v1/items/testId").send(mockItem);
            expect(itemController.updateItem).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/items/:id", () => {
        it("should call deleteItem controller with valid data", async () => {
            await request(app).delete("/api/v1/items/testId");
            expect(itemController.deleteItem).toHaveBeenCalled();
        });
    });
})