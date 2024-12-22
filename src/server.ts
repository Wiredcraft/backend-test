import express from "express";
import errorHandler from "./Middleware/errorMiddleware";
import { userRoutes } from "./Routes/userRoutes";
import { authRoutes } from "./Routes/authRoutes";
import { profileRoutes } from "./Routes/profileRoutes";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import "dotenv";
import path from "path";
import cors from "cors";

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

export const app = express();
const port = process.env.PORT || 3000;
app.use(
  cors({
    origin: "*", // aceita requisições de qualquer origem
  })
);

// usando express.static para servir arquivos estáticos do swagger
app.use(express.static("public"));
app.use(express.json());
// configurando o swagger
const optionsSwagger = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Wiredcraft API",
      version: "1.0.0",
      description: "API documentation",
      contact: {
        name: "Heryson Andrade",
        email: "belkiorheryson@gmail.com",
      },
    },
    servers: [
      {
        url: "https://backend-wiredcraft.vercel.app",
        description: "Production server",
      },
    ],
  },
  apis: [
    path.join(__dirname, "../docs/*.yaml"),
    path.join(__dirname, "../docs/**/*.yaml"),
  ], // Caminho para os arquivos yaml
};

const specs = swaggerJSDoc(optionsSwagger);
app.use(
  "/api/docs",
  swaggerUI.serve,
  swaggerUI.setup(specs, {
    swaggerOptions: {
      url: "/docs/swagger.json",
    },
    customCssUrl: CSS_URL,
  })
);

app.use("/docs", express.static(path.join(__dirname, "../docs")));

app.get("/docs/swagger.json", (req, res) => {
  res.json(specs);
});

app.get("/", (req, res) => {
  res.redirect("/api/docs");
});

// endpoints
userRoutes(app);
authRoutes(app);
profileRoutes(app);

// o middleware de erro deve vir após as rotas
app.use(errorHandler);
/*
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
*/
module.exports = app;
