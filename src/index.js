import express from "express";
import cors from "cors";
import {json} from "body-parser";
import {MongoClient} from "mongodb";

let database;

MongoClient.connect("mongodb://localhost:27017/", function(err, db) {
    if (err) throw err;
    database = db.db("blog");
    console.log("database initialized!");
});

const app = express();
const port = 8080;

app.use(cors({origin: "http://localhost:3000"}));
app.use(json());

const blogs = []

app.get("/", (req, res) => {
    res.send("We just created our first server!");
});

app.get("/blogs", (req, res) => {
    res.json(blogs);
});

app.post("/create-blog", (req, res) => {
    const newBlog = {
        id: "blog-" + blogs.length.toString(),
        text: req.body.text,
        createdAt: new Date()
    }
    blogs.unshift(newBlog);
    res.json(blogs);
});

app.listen(port, () => console.log(`Blog server listening at http://localhost:${port}`));
