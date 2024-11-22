import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "API documentation for the blog app",
    },
    servers: [
      {
        url: "http://localhost:3000", // Your local development URL
      },
    ],
  },
  // Path to the API docs
  apis: ["./routes/*.ts"], // This should point to the files with your routes and API annotations
};

const swaggerConfig = swaggerJsdoc(options);

export default swaggerConfig;
