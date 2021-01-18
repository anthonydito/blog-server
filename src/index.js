import express from "express";
import cors from "cors";
import {json} from "body-parser";
import {MongoClient} from "mongodb";
import bycrypt from "bcrypt";
import jwt, { decode } from "jsonwebtoken";

let database;

MongoClient.connect("mongodb://localhost:27017/", function(err, db) {
    if (err) throw err;
    database = db.db("blog");
    console.log("database initialized!");
});

const app = express();
const port = 8080;

const handleUserBlogsRequest = (req, res, next) => {
    database.collection("blogs").find({user_id: req.user_id}).sort({ createdAt: -1 }).toArray((err, results) => {
        if (err) {
            next(err);
        } else {
            res.json(results);
        }
    });
};

const JWT_SECRET = "make_this_whatever_you_want_but_keep_it_secret";

const issueAccessToken = (user) => {
    return jwt.sign({_id: user._id}, JWT_SECRET);
};

const authorizationMiddleware = (req, res, next) => {
    const accessToken = req.headers["x-blog-access-token"];
    if (!accessToken) {
        next(new Error("Access token not present in request"));
        return;
    }
    jwt.verify(accessToken, JWT_SECRET, (err, decoded) => {
        if (err) {
            next(err);
        } else {
            req.user_id = decoded._id;
            next();
        }
    });
};

app.use(cors({origin: "http://localhost:3000"}));
app.use(json());

app.get("/", (req, res) => {
    res.send("We just created our first server!");
});

app.get("/blogs", authorizationMiddleware, (req, res, next) => {
    handleUserBlogsRequest(req, res, next);
});

app.post("/create-blog", authorizationMiddleware, (req, res, next) => {
    const newBlog = {
        text: req.body.text,
        createdAt: new Date(),
        user_id: req.user_id
    }
    database.collection("blogs").insertOne(newBlog, (err) => {
        if (err) {
            next(err);
        } else {
            handleUserBlogsRequest(req, res, next);
        }
    });
});

app.post("/sign-up", (req, res, next) => {
    database.collection("users").findOne({ username: req.body.username }, (err, existingUser) => {
        if (err) {
            next(err);
            return;
        }
        if (existingUser) {
            next(new Error("username exists"))
            return;
        }
        bycrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                next(err)
            } else {
                const newUser = {
                    username: req.body.username,
                    password: hash
                };
                database.collection("users").insertOne(newUser, (err, response) => {
                    if (err) {
                        next(err);
                    } else {
                        const accessToken = issueAccessToken(response.ops[0]);
                        res.json({accessToken: accessToken});
                    }
                });
            }
        });
    });
});

app.post("/log-in", (req, res, next) => {

});

app.listen(port, () => console.log(`Blog server listening at http://localhost:${port}`));
