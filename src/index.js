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

const handleUserBlogsRequest = (req, res, next) => {
    database.collection("blogs").find({}).sort({ createdAt: -1 }).toArray((err, results) => {
        if (err) {
            next(err)
        } else {
            res.json(results)
        }
    })
}

app.get("/blogs", (req, res) => {
    res.json(blogs);
});

app.post("/create-blog", (req, res, next) => {
    const newBlog = {
        text: req.body.text,
        createdAt: new Date()
    }
    database.collection("blogs").insertOne(newBlog, (err) => {
        if (err) {
            next(err)
        } else {
            handleUserBlogsRequest(req, res, next)
        }
    })
});

app.listen(port, () => console.log(`Blog server listening at http://localhost:${port}`));


