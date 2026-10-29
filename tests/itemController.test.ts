import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as itemController from "../src/api/v1/controllers/itemController";
import * as itemService from "../src/api/v1/services/itemService";
import { Item } from "../src/api/v1/models/itemModel"; 
import { mock } from "node:test";
import { beforeEach,afterAll, describe, expect, it, jest } from "@jest/globals";

jest.mock("../src/api/v1/services/itemService");

describe("Item Controller", () => {
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

    describe("getAllItems", () => {
        it("should handle successful operation", async () => {
            const mockItems: Item[] = [
                { 
                    id: "1",
                    name: "Test Item",
                    description: "Test description",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            (itemService.getAllItems as jest.Mock).mockReturnValue(mockItems);

            await itemController.getAllItems(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Items retrieved successfully",
                data: mockItems,
            });
        });
    });

    describe("createItem", () => {
        it("should handle successful creation", async () => {
            const mockBody = {
                name: "Test Item",
                description: "Test description",
            };

            const mockItem: Item = {
                id: "test_id",
                createdAt: new Date(),
                updatedAt: new Date(),
                ...mockBody
            };

            mockReq.body = mockBody;
            (itemService.createItem as jest.Mock).mockReturnValue(mockItem);

            await itemController.createItem(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Item created successfully",
                data: mockItem,
            });
        });

        it("should return 400 when name is missing", async () => {
            mockReq.body = { description: "Test Description" };

            await itemController.createItem(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Item name is required",
            });
        });
    });
});