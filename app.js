const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Cargar variables de entorno
dotenv.config({ path: "./config/config.env" });

// Conectar a la base de datos
connectDB();

// Inicializar aplicación Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Montar rutas
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${PORT}`
  )
);

// Manejar promesas rechazadas
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
