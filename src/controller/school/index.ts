import { prisma } from "../../prisma/prisma";
import { CreateSchoolRequest } from "../../types";
import { Request, Response, NextFunction } from "express"; // Include NextFunction for middleware-style error handling
import createError from "http-errors";
import { z } from "zod"; // For runtime validation
import { calculateDistance } from "./calculate-distance";

// Schema validation using Zod
const SchoolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number()
    .min(-180)
    .max(180, "Longitude must be between -180 and 180"),
});

export default class SchoolController {
  static async addSchool(
    req: CreateSchoolRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const schoolData = SchoolSchema.safeParse(req.body);
      if (!schoolData.success) {
        createError(400, {
          message: "Invalid input data",
          details: "Data validation failed",
        });
      }
      const schoolResponse = await prisma.school.create({
        data: schoolData.data!,
      });

      return res.status(201).json({
        message: "School added successfully",
        data: schoolResponse,
      });
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        return next(
          createError(400, {
            message: "Invalid input",
            details: error.errors,
          }),
        );
      }

      console.error("Error adding school:", error);
      return next(createError(500, "Internal Server Error"));
    }
  }

  static async getSchools(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, limit } = req.query;

      if (id) {
        const school = await prisma.school.findUnique({
          where: { id: Number(id) },
        });

        if (!school) {
          return next(createError(404, `School with ID ${id} not found`));
        }

        return res.status(200).json({
          message: "School fetched successfully",
          data: school,
        });
      }

      const schools = await prisma.school.findMany({
        take: limit ? Number(limit) : undefined,
      });

      return res.status(200).json({
        message: "Schools fetched successfully",
        data: schools,
      });
    } catch (error) {
      console.error("Error fetching schools:", error);
      return next(createError(500, "Internal Server Error"));
    }
  }

  static async listSchools(req: Request, res: Response, next: NextFunction) {
    try {
      const { latitude, longitude } = req.query;
      console.log(req.query);
      if (!latitude || !longitude) {
        return next(createError(400, "Latitude and longitude are required"));
      }

      const userLatitude = Number(latitude);
      const userLongitude = Number(longitude);

      if (isNaN(userLatitude) || isNaN(userLongitude)) {
        return next(
          createError(400, "Latitude and longitude must be valid numbers"),
        );
      }

      const schools = await prisma.school.findMany();

      const sortedSchools = schools
        .map((school) => ({
          ...school,
          distance: calculateDistance(
            userLatitude,
            userLongitude,
            school.latitude,
            school.longitude,
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      // Return the sorted list
      return res.status(200).json({
        message: "Schools fetched and sorted by proximity successfully",
        data: sortedSchools,
      });
    } catch (error) {
      console.error("Error fetching and sorting schools:", error);
      return next(createError(500, "Internal Server Error"));
    }
  }

  static async updateSchool(
    req: Request<{ id: string }, {}, CreateSchoolRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params; // School ID from the route
      const schoolData = req.body; // New data to update

      // Validate request body using Zod
      const validatedData = SchoolSchema.safeParse(schoolData);
      if (!validatedData.success) {
        return next(
          createError(400, {
            message: "Invalid input data",
            details: validatedData.error.errors,
          }),
        );
      }

      // Check if school exists
      const schoolExists = await prisma.school.findUnique({
        where: { id: Number(id) },
      });

      if (!schoolExists) {
        return next(createError(404, "School not found"));
      }

      // Update the school
      const updatedSchool = await prisma.school.update({
        where: { id: Number(id) },
        data: validatedData.data,
      });

      return res.status(200).json({
        message: "School updated successfully",
        data: updatedSchool,
      });
    } catch (error) {
      console.error("Error updating school:", error);
      return next(createError(500, "Internal Server Error"));
    }
  }

  static async deleteSchool(
    req: Request<{ id: string }, {}, {}>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params; // School ID from the route

      // Check if school exists
      const schoolExists = await prisma.school.findUnique({
        where: { id: Number(id) },
      });

      if (!schoolExists) {
        return next(createError(404, "School not found"));
      }

      // Delete the school
      await prisma.school.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json({
        message: "School deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting school:", error);
      return next(createError(500, "Internal Server Error"));
    }
  }
}
