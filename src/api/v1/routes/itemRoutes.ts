import express, { Router } from "express";
import * as itemController from "../controllers/itemController";

const router: Router = express.Router();

// "/api/v1/items" prefixes all below routes
router.get("/", itemController.getAllItems);
router.post("/", itemController.createItem);
router.put("/:id", itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

export default router;