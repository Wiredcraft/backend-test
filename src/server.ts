import express from "express";
import errorHandler from "./Middleware/errorMiddleware";
import { userRoutes } from "./Routes/userRoutes";

const app = express();
app.use(express.json());
app.use(errorHandler);

userRoutes(app);

app.listen(3000, () => {
  console.log("Server is running on Port 3000");
});
