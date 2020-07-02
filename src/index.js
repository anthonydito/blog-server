import express from "express";
import cors from "cors";

const app = express();
const port = 8080;

app.use(cors({origin: "http://localhost:3000"}));

app.get("/", (req, res) => {
    res.send("We just created our first server!");
});

app.listen(port, () => console.log(`Blog server listening at http://localhost:${port}`));
