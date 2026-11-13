// Import Libraries
import { Request, Response, NextFunction } from "express";
import { createEvents as createEventService, getAllEvents as fetchAllEvents} from "../services/eventService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Event } from "../models/eventModel";
import * as eventService from "../services/eventService";

/*
Export getAllEventsController which gets all events and returns them in the response.
*/
export const getAllEventsController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const events: Event[] = await fetchAllEvents();
        res.status(200).json(
        {
            "message": "events Retrieved",
            count: events.length,
            data: events
        })
    } catch (error: unknown) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to get events"
        })
    }
};
// Export createEventsController which creates a new event and returns it in the response.
export const createEventsController = async (req: Request,
    res: Response, next: NextFunction): Promise<void> =>
{
    try
    {
        const {
            name,
            date,
            capacity,
            registrationCount,
            status,
            category,
            createdAt,
            updatedAt
        } = req.body;
 
        const event: Event =
        {
            name,
            date,
            capacity,
            registrationCount,
            status,
            category,
            createdAt,
            updatedAt
        };
 
        const events: Event = await createEventService(event);
 
        res.status(HTTP_STATUS.CREATED).json
        ({  message: "Event created",
            data: events
        });
    }
    catch (error: unknown)
    {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to create event"
        });
    }
};

// Export updateEventController which updates an existing event and returns a success message in the response.
export const updateEventController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const eventData: Partial<Event> = req.body;
        const updatedEvent = await eventService.updateEvent(
            Array.isArray(id) ? id[0] : id,
            eventData
        );
        res.status(HTTP_STATUS.OK).json({ message: "Event updated", data: updatedEvent });
    } catch (error: unknown) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to update event",
        });
    }
};
// Export deleteEventController which deletes an existing event and returns a success message in the response.
export const deleteEventController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await eventService.deleteEvent(Array.isArray(id) ? id[0] : id);
        res.status(HTTP_STATUS.OK).json({ message: "Event deleted" });
    } catch (error: unknown) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to Delete event",
        });
    }
    
};
// Export getEventsByIdController which retrieves an event by its ID and returns it in the response.
export const getEventsByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const events = await eventService.getEventsById(id);
        if (events.length === 0) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Event not found"
            });
            return;
        }
        res.status(HTTP_STATUS.OK).json({
            message: "Event retrieved",
            data: events[0]
        });
    } catch (error: unknown) {
        next(error);
    }
};
