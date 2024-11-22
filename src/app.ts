import express, { urlencoded } from "express";
import expressRateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import loggerMiddleware from "./middleware/logger";
import globalErrorHandler from "./middleware/errors";
import path from "path";
import cors from "cors";
import swagger from "./docs/swagger.json";
import helmet from "helmet";
import schoolRouter from "./routes/school";

const app = express();

// This will serve the generated json document(s)
// (as well as the swagger-ui if configured)

// middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));
// Swagger UI route
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// logger middleware
app.use(loggerMiddleware);
app.use(cors());

// Routes

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swagger));

app.use("/api/v1/", schoolRouter);
// default
app.get("/", (req, res, next) => {
  res.redirect("/api/v1/docs");
  next();
});

const limiter = expressRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use(helmet());
// global error handler ( must be after routes)
app.use(globalErrorHandler);

export default app;
