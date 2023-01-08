"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importStar(require("mongoose"));
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.use(express_1.default.static("public"));
app.use(express_1.default.urlencoded({ extended: true }));
mongoose_1.default.set("strictQuery", true);
const cluster = "127.0.0.1:27017";
const db = "wikiDB";
const articleSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "The article needs a title"]
    },
    content: {
        type: String,
        required: [true, "The article needs some content"]
    }
});
const Article = (0, mongoose_1.model)("Article", articleSchema);
async function run() {
    await (0, mongoose_1.connect)(`mongodb://${cluster}/${db}`);
    /*All articles */
    app.route("/articles")
        /* Get road */
        .get((req, res) => {
        Article.find({}, (err, articles) => {
            if (err) {
                res.status(500).send(err.message);
            }
            else {
                res.send(articles);
            }
        });
    })
        /*-----------------*/
        /* Post road */
        .post((req, res) => {
        const title = req.body.title;
        const content = req.body.content;
        const newArticle = new Article({
            title: title,
            content: content
        });
        newArticle.save((err, article) => {
            if (err) {
                res.status(500).send(err.message);
            }
            else {
                res.send(article);
            }
        });
    })
        /*---------------------*/
        /* Delete road */
        .delete((req, res) => {
        Article.deleteMany({}, (err, result) => {
            if (err) {
                res.status(500).send(err.message);
            }
            else {
                res.send(result);
            }
        });
    });
    /*--------------------*/
    /*----------------------------------------*/
    /* Specific article */
    app.route("/articles/:title")
        /* Get road */
        .get((req, res) => {
        const title = req.params.title;
        Article.findOne({ title: title }, (err, article) => {
            if (err) {
                res.status(500).send(err.message);
            }
            else {
                res.send(article);
            }
        });
    })
        /*------------------*/
        /* Put road */
        .put((req, res) => {
        const title = req.params.title;
        Article.replaceOne({ title: title }, { title: req.body.title, content: req.body.content }, (err, result) => {
            if (err) {
                res.status(500).send(err.message);
            }
            else {
                res.send(result);
            }
        });
    })
        /*-----------------*/
        /* Patch road */
        .patch((req, res) => {
        const title = req.params.title;
        Article.updateOne({ title: title }, { title: req.body.title, content: req.body.content }, (err, result) => {
            if (err) {
                res.status(500).send(err.message);
            }
            else {
                res.send(result);
            }
        });
    })
        /*-----------------*/
        /* Delete road */
        .delete((req, res) => {
        const title = req.params.title;
        Article.deleteOne({ title: title }, (err, result) => {
            if (err) {
                res.status(500).send(err.message);
            }
            else {
                res.send(result);
            }
        });
    });
    /*--------------------*/
    /*----------------------------------------*/
    app.listen(3000, () => {
        console.log("Server started on port 3000");
    });
}
run().catch(err => console.log(err));
//# sourceMappingURL=app.js.map