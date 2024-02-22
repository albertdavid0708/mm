import express, { Application, Request, Response } from "express";
import { env } from "./config/config"; // Import environment variables
import bodyParser from "body-parser"; // Middleware for parsing request bodies
import cors from "cors"; // Cross-Origin Resource Sharing middleware
import compression from "compression"; // Middleware for response compression
import helmet from "helmet"; // Security middleware for setting HTTP headers
import { UserService } from "./services/impl/UserService"; // Import a user service implementation
import { UserRouter } from "./routers/v1/UserRouter"; // Import a user router
import { MasterRouter } from "./routers/v1/MasterRouter"; // Import the main router
import { mysqlDataSource } from "./database/MyDataSource"; // Import a MySQL data source
import { errorHandlerMiddleware } from "./middlewares/ErrorHandlerMiddlewares"; // Middleware for handling errors
import { UserRepo } from "./repositories/impl/UserRepo"; // Import a user repository implementation
import { requestTimeMiddleware } from "./middlewares/RequestTimeMiddleware"; // Middleware for recording request time
import morgan from "morgan";
import { WalletService } from "./services/impl/WalletService";
import { WalletRepo } from "./repositories/impl/WalletRepo";
import { WalletRouter } from "./routers/v1/WalletRouter";

const app: Application = express();

// Initialize MySQL data source
const dataSource = mysqlDataSource;
dataSource.initialize().then();
console.log("data Source is initialized successfully");

// Create user service and routers using the data source
const userService: UserService = new UserService(new UserRepo(dataSource));
const walletService: WalletService = new WalletService(
  new WalletRepo(dataSource)
);
const userRouter: UserRouter = new UserRouter(userService);
const walletRouter: WalletRouter = new WalletRouter(walletService);
const masterRouter: MasterRouter = new MasterRouter(userRouter, walletRouter);

// Express server application class
class Server {
  public app = express();
  public router = masterRouter;
}

// Initialize server app
const server = new Server();

app.use(morgan("dev"));

// Set up middleware and routing
app.use(
  cors({
    credentials: true,
    origin: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["token"],
  })
);
app.use(helmet()); // Set various HTTP security headers
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(compression()); // Compress response bodies
app.use(requestTimeMiddleware); // Record request time
app.use("/api/v1", masterRouter.router); // Use the main router for routes
app.use(errorHandlerMiddleware); // Handle errors using custom middleware
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Make the server listen on a specific port
app.listen(env.port, () => console.log(`> Listening on port ${env.port}`));

// Start the main function and run the server
export default app;
