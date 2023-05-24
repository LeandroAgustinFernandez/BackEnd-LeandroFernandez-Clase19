import cartRouter from "./routes/cart.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/view.router.js";
import sessionRouter from "./routes/session.router.js";
import handlebars from "express-handlebars";
import express from "express";
import cors from "cors";
import { __dirname, PORT, DB_USER, DB_PASS } from "./utils.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();

try {
  mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASS}@coderhousecluster.phsl88g.mongodb.net/ecommerce?retryWrites=true&w=majority`
  );
  console.log(`Base de datos conectada`);
} catch (error) {
  console.log(error.message);
}

app.use(
  session({
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: "LeanBack",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser("LeanBack"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/session", sessionRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

const socketio = app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

const io = new Server(socketio);
app.set("socketio", io);
