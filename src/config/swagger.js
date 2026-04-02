const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Data Processing and Access Control API",
      version: "1.0.0",
      description: "Backend API documentation for authentication, users, records, and dashboard analytics.",
    },
    servers: [
      {
        url: "/",
        description: "Current server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Demo Admin" },
            email: { type: "string", format: "email", example: "admin@test.com" },
            password: { type: "string", example: "admin123" },
            role: { type: "string", enum: ["admin", "analyst", "viewer"], example: "admin" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "admin@test.com" },
            password: { type: "string", example: "admin123" },
          },
        },
        CreateRecordRequest: {
          type: "object",
          required: ["amount", "type", "category", "date"],
          properties: {
            amount: { type: "number", example: 50000 },
            type: { type: "string", enum: ["income", "expense"], example: "income" },
            category: { type: "string", example: "salary" },
            date: { type: "string", format: "date", example: "2026-04-01" },
            notes: { type: "string", example: "Monthly salary credited" },
          },
        },
        CreateUserRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Finance Manager" },
            email: { type: "string", format: "email", example: "manager@test.com" },
            password: { type: "string", example: "manager123" },
            role: { type: "string", enum: ["admin", "analyst", "viewer"], example: "analyst" },
            status: { type: "string", enum: ["active", "inactive"], example: "active" },
          },
        },
      },
    },
    paths: {
      "/": {
        get: {
          tags: ["Health"],
          summary: "API root",
          description: "Returns a simple HTML page confirming backend is running.",
          responses: {
            200: { description: "Server is running" },
          },
        },
      },
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
              },
            },
          },
          responses: {
            201: { description: "User registered successfully" },
            400: { description: "Validation error" },
            409: { description: "User already exists" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: { description: "Login successful" },
            401: { description: "Invalid credentials" },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get current user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Current user fetched" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/users": {
        get: {
          tags: ["Users"],
          summary: "Get all users (admin)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Users fetched" },
            403: { description: "Forbidden" },
          },
        },
        post: {
          tags: ["Users"],
          summary: "Create user (admin)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateUserRequest" },
              },
            },
          },
          responses: {
            201: { description: "User created" },
            403: { description: "Forbidden" },
          },
        },
      },
      "/api/users/{id}": {
        patch: {
          tags: ["Users"],
          summary: "Update user role/status (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    role: { type: "string", enum: ["admin", "analyst", "viewer"] },
                    status: { type: "string", enum: ["active", "inactive"] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "User updated" },
            404: { description: "User not found" },
          },
        },
      },
      "/api/records": {
        get: {
          tags: ["Records"],
          summary: "Get records",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "type", in: "query", schema: { type: "string", enum: ["income", "expense"] } },
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "startDate", in: "query", schema: { type: "string", format: "date" } },
            { name: "endDate", in: "query", schema: { type: "string", format: "date" } },
            { name: "page", in: "query", schema: { type: "integer", example: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", example: 10 } },
          ],
          responses: {
            200: { description: "Records fetched" },
            401: { description: "Unauthorized" },
          },
        },
        post: {
          tags: ["Records"],
          summary: "Create record (admin)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateRecordRequest" },
              },
            },
          },
          responses: {
            201: { description: "Record created" },
            403: { description: "Forbidden" },
          },
        },
      },
      "/api/records/{id}": {
        get: {
          tags: ["Records"],
          summary: "Get record by id",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Record fetched" },
            404: { description: "Record not found" },
          },
        },
        patch: {
          tags: ["Records"],
          summary: "Update record (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    amount: { type: "number" },
                    type: { type: "string", enum: ["income", "expense"] },
                    category: { type: "string" },
                    date: { type: "string", format: "date" },
                    notes: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Record updated" },
            403: { description: "Forbidden" },
          },
        },
        delete: {
          tags: ["Records"],
          summary: "Delete record (admin, soft delete)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Record deleted" },
            403: { description: "Forbidden" },
          },
        },
      },
      "/api/dashboard/summary": {
        get: {
          tags: ["Dashboard"],
          summary: "Get dashboard summary",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Summary fetched" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/dashboard/trends": {
        get: {
          tags: ["Dashboard"],
          summary: "Get dashboard trends",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "period",
              in: "query",
              schema: { type: "string", enum: ["monthly", "weekly"] },
              description: "Trends grouping period",
            },
          ],
          responses: {
            200: { description: "Trends fetched" },
            400: { description: "Invalid period" },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = { setupSwagger };
