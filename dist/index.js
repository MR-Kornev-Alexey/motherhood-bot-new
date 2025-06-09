import express from "express";
import "dotenv/config";
import cors from "cors";
import Routes from "./routes/index.js";
const app = express();
const PORT = process.env.PORT || 8000;
import { motherHoodBot } from "./motherHoodBot-bot/index.js";
// * Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
    return res.send("It's working 🙌");
});
// * Routes
app.use("/api", Routes);
motherHoodBot.launch();
console.log("🤖 motherHoodBot bots started");
process.once('SIGINT', () => motherHoodBot.stop('SIGINT'));
process.once('SIGTERM', () => motherHoodBot.stop('SIGTERM'));
app.listen(PORT, () => console.log(`🤖  Server is running on PORT ${PORT}`));
