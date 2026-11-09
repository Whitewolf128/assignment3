import { Request, Response, NextFunction } from "express";
import { createEvents as createEventService, getAllEvents as fetchAllEvents} from "../services/eventService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Event } from "../models/eventModel";
import * as eventService from "../services/eventService";


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

export const updateEventController = (req: Request, res: Response): void => {
    try{
        const { id } = req.params;
    const updatedEvent: string = req.body;
    eventService.updateEvent(Array.isArray(id) ? id[0] : id, updatedEvent);
    res.status(HTTP_STATUS.OK).json({ message: "Event updated", data: updateEventController });
    }
    catch(error:unknown){
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to update event"
        });
    }
    
};

export const deleteEventController = (req: Request, res: Response): void => {
    try{
        const { id } = req.params;
    eventService.deleteEvent(Array.isArray(id) ? id[0] : id);
    res.status(HTTP_STATUS.OK).json({ message: "Event deleted" });
    } catch (error: unknown) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to Delete event",
        });
    }
    
};

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
                message: "Product not found"
            });
            return;
        }
        res.status(HTTP_STATUS.OK).json({
            message: "Product retrieved",
            data: events[0]
        });
    } catch (error: unknown) {
        next(error);
    }
};
