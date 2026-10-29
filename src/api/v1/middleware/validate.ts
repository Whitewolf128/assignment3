import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

import { MiddlewareFunction } from "../types/express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

interface RequestSchemas {
    body?: ObjectSchema;
    params?: ObjectSchema;
    query?: ObjectSchema;
}

interface ValidationOptions {
    stripBody?: boolean;
    stripQuery?: boolean;
    stripParams?: boolean;
}

export const validateRequest = (
    schemas: RequestSchemas,
    options: ValidationOptions = {}
): MiddlewareFunction => {
    // stripParams - Usually don't strip params as they're route-defined
    const defaultOptions = {
        stripBody: true,
        stripQuery: true,
        stripParams: false,
        ...options,
    };

    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors: string[] = [];

            const validatePart = (
                schema: ObjectSchema,
                data: any,
                partName: string,
                shouldStrip: boolean
            ) => {
                const { error, value } = schema.validate(data, {
                    abortEarly: false,
                    stripUnknown: shouldStrip,
                });

                if (error) {
                    errors.push(
                        ...error.details.map(
                            (detail) => `${partName}: ${detail.message}`
                        )
                    );
                } else if (shouldStrip) {
                    return value;
                }
                return data;
            };

            // Validate each request part if schema is provided
            if (schemas.body) {
                const value = validatePart(
                    schemas.body,
                    req.body,
                    "Body",
                    defaultOptions.stripBody
                );
                Object.assign(req.body, value);
            }

            if (schemas.params) {
                const value = validatePart(
                    schemas.params,
                    req.params,
                    "Params",
                    defaultOptions.stripParams
                );
                Object.assign(req.params, value);
            }

            if (schemas.query) {
                const value = validatePart(
                    schemas.query,
                    req.query,
                    "Query",
                    defaultOptions.stripQuery
                );
                Object.assign(req.query, value);
            }

            // If there are any validation errors, return them
            if (errors.length > 0) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    error: `Validation error: ${errors.join(", ")}`,
                });
            }

            next();
        } catch (error: unknown) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: (error as Error).message,
            });
        }
    };
};