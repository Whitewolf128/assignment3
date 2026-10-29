
import Joi from "joi";

// Post operation schemas organized by request part
export const postSchemas = {
    // POST /posts - Create new post
    create: {
        body: Joi.object({
            name: Joi.string().required().min(3).max(80),
            capacity: Joi.number().required().integer().min(5).positive(),
            registrationCount: Joi.number().required().integer().max(100).positive().precision(2),
            date: Joi.date().required().greater('now'),
            status:  Joi.string().required().valid("active", "cancelled", "completed"),
            category:  Joi.string().required().valid("conference", "workshop", "meetup", "seminar", "general"),
            content: Joi.string().required().messages({
                "any.required": "Content is required",
                "string.empty": "Content cannot be empty",
            }), 
        }),
    },
  

    // PUT /posts/:id - Update post
    update: {
            name: Joi.string().required().min(3).max(80),
            capacity: Joi.number().required().integer().min(5).positive(),
            registrationCount: Joi.number().required().integer().max(100).positive().precision(2),
            date: Joi.date().required().greater('now'),
            status:  Joi.string().required().valid("active", "cancelled", "completed"),
            category:  Joi.string().required().valid("conference", "workshop", "meetup", "seminar", "general"),
    },
};