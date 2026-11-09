import express, { Router } from "express";
import {createEventsController, getAllEventsController, updateEventController, deleteEventController, getEventsByIdController} from "../controllers/eventController"
import { validateRequest } from "../middleware/validate";
import { postSchemas} from "../validations/eventValidation";

const eventRouter: Router = express.Router();

eventRouter.get("/events", getAllEventsController);
eventRouter.post("/events", validateRequest(postSchemas.create), createEventsController);
eventRouter.put("/events/:id", updateEventController);
eventRouter.delete("/events/:id", deleteEventController);
eventRouter.get("/events/:id", getEventsByIdController);

export default eventRouter;