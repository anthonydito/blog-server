import express from "express";
import cors from "cors";

const app = express();
const port = 8080;

app.use(cors({origin: "http://localhost:3000"}));

const blogs = [
    {
        id: "blog3",
        text: "This is our third blog",
        createdAt: new Date()
    },
    {
        id: "blog2",
        text: "This is our second blog",
        createdAt: new Date()
    },
    {
        id: "blog1",
        text: "This is our first blog",
        createdAt: new Date()
    }
]

app.get("/", (req, res) => {
    res.send("We just created our first server!");
});

app.listen(port, () => console.log(`Blog server listening at http://localhost:${port}`));
