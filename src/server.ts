import express from "express";
import errorHandler from "./Middleware/errorMiddleware";
import { userRoutes } from "./Routes/userRoutes";
import { authRoutes } from "./Routes/authRoutes";

const app = express();
app.use(express.json());
userRoutes(app);
authRoutes(app);

// o middleware de erro deve vir após as rotas
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on Port 3000");
});
