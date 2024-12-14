import express from "express";
import errorHandler from "./Middleware/errorMiddleware";
import { userRoutes } from "./Routes/userRoutes";
import { authRoutes } from "./Routes/authRoutes";
import { profileRoutes } from "./Routes/profileRoutes";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

export const app = express();
app.use(express.json());

// configurando o swagger
const optionsSwagger = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Wiredcraft API",
      version: "1.0.0",
      description: "Api documentation",
      contact: {
        name: "Heryson Andrade",
        email: "belkiorheryson@gmail.com",
      },
    },
  },
  apis: ["./docs/*.yaml", "./docs/**/*.yaml"], // Caminho para os arquivos yaml
};

const specs = swaggerJSDoc(optionsSwagger);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(specs));

// endpoints
userRoutes(app);
authRoutes(app);
profileRoutes(app);

// o middleware de erro deve vir após as rotas
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on Port 3000");
});
