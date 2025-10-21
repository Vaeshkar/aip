/**
 * HTTP Transport for AIP Server
 */

import express, { Express, Request, Response } from "express";
import type { AIPServer } from "../server/AIPServer";
import type { JSONRPCRequest } from "../schema/aip-schema";
import { ParseError, UnauthorizedError } from "../utils/errors";
import { isAICFFormat } from "../utils/aicf-rpc";

/**
 * HTTP Transport configuration
 */
export interface HTTPTransportConfig {
  port?: number;
  host?: string;
  path?: string;
  cors?: boolean;
  authValidator?: (req: Request) => Promise<boolean>;
}

/**
 * HTTP Transport class
 */
export class HTTPTransport {
  private app: Express;
  private server: AIPServer;
  private config: HTTPTransportConfig;

  constructor(server: AIPServer, config: HTTPTransportConfig = {}) {
    this.server = server;
    this.config = {
      port: 3000,
      host: "0.0.0.0",
      path: "/aip/v1/rpc",
      cors: true,
      ...config,
    };

    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup Express middleware
   */
  private setupMiddleware(): void {
    // JSON body parser
    this.app.use(express.json());

    // Text body parser (for AICF)
    this.app.use(express.text({ type: "text/plain" }));

    // CORS
    if (this.config.cors) {
      this.app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.header(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization, X-AIP-API-Key"
        );

        if (req.method === "OPTIONS") {
          res.sendStatus(200);
        } else {
          next();
        }
      });
    }

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`[AIP] ${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * Setup Express routes
   */
  private setupRoutes(): void {
    // Health check
    this.app.get("/health", (req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    // AIP JSON-RPC endpoint
    this.app.post(this.config.path!, async (req, res) => {
      await this.handleRPCRequest(req, res);
    });

    // AIP AICF-RPC endpoint
    const aicfPath = this.config.path!.replace("/rpc", "/aicf");
    this.app.post(aicfPath, async (req, res) => {
      await this.handleAICFRequest(req, res);
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        error: {
          code: 404,
          message: "Not Found",
          data: { path: req.path },
        },
      });
    });
  }

  /**
   * Handle RPC request
   */
  private async handleRPCRequest(req: Request, res: Response): Promise<void> {
    try {
      // Validate authentication if configured
      if (this.config.authValidator) {
        const isAuthorized = await this.config.authValidator(req);
        if (!isAuthorized) {
          throw new UnauthorizedError("Authentication failed");
        }
      }

      // Parse request
      const request = req.body as JSONRPCRequest;

      if (!request || typeof request !== "object") {
        throw new ParseError("Invalid JSON-RPC request");
      }

      // Handle request
      const response = await this.server.handleRequest(request);

      // Send response
      res.json(response);
    } catch (error) {
      // Handle errors
      if (error instanceof UnauthorizedError) {
        res.status(401).json({
          jsonrpc: "2.0",
          id: req.body?.id ?? null,
          error: error.toJSON(),
        });
      } else if (error instanceof ParseError) {
        res.status(400).json({
          jsonrpc: "2.0",
          id: null,
          error: error.toJSON(),
        });
      } else {
        res.status(500).json({
          jsonrpc: "2.0",
          id: req.body?.id ?? null,
          error: {
            code: -32603,
            message: error instanceof Error ? error.message : "Internal error",
          },
        });
      }
    }
  }

  /**
   * Handle AICF-RPC request
   */
  private async handleAICFRequest(req: Request, res: Response): Promise<void> {
    try {
      // Validate authentication if configured
      if (this.config.authValidator) {
        const isAuthorized = await this.config.authValidator(req);
        if (!isAuthorized) {
          res.status(401).send("ERR|401|Unauthorized");
          return;
        }
      }

      // Parse request (body should be text/plain)
      const input = typeof req.body === "string" ? req.body : String(req.body);

      if (!input || !isAICFFormat(input)) {
        res.status(400).send("ERR|400|Invalid AICF request format");
        return;
      }

      // Handle request
      const response = await this.server.handleAICFRequest(input);

      // Send response as text/plain
      res.setHeader("Content-Type", "text/plain");
      res.send(response);
    } catch (error) {
      // Handle errors
      const errorMessage =
        error instanceof Error ? error.message : "Internal error";
      res.status(500).send(`ERR|500|${errorMessage}`);
    }
  }

  /**
   * Start HTTP server
   */
  listen(port?: number, host?: string): Promise<void> {
    const listenPort = port ?? this.config.port!;
    const listenHost = host ?? this.config.host!;

    return new Promise((resolve) => {
      this.app.listen(listenPort, listenHost, () => {
        const aicfPath = this.config.path!.replace("/rpc", "/aicf");
        console.log(
          `[AIP] Server listening on http://${listenHost}:${listenPort}`
        );
        console.log(`[AIP]   JSON-RPC: ${this.config.path}`);
        console.log(`[AIP]   AICF-RPC: ${aicfPath}`);
        resolve();
      });
    });
  }

  /**
   * Get Express app (for testing or custom middleware)
   */
  getApp(): Express {
    return this.app;
  }
}
