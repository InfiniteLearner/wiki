import express, {Express, Request, Response} from "express" ;
import mongoose, { CallbackError, Schema, UpdateWriteOpResult, connect, model} from "mongoose";
import { allowedNodeEnvironmentFlags } from "process";
import { isGeneratorFunction } from "util/types";
import {DeleteResult} from "mongodb" ;

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

mongoose.set("strictQuery", true);

const cluster: string = "127.0.0.1:27017";
const db: string = "wikiDB";

interface IArticle{
    title: string,
    content: string
}

const articleSchema: Schema<IArticle> = new Schema<IArticle>({
    title: {
        type: String,
        required: [true, "The article needs a title"]
    },
    content: {
        type: String,
        required: [true, "The article needs some content"]
    }
});

const Article = model("Article", articleSchema);

async function run(){
    await connect(`mongodb://${cluster}/${db}`);

    /*All articles */

    app.route("/articles")

    /* Get road */

        .get((req: Request, res: Response) => {
            Article.find({}, (err: CallbackError, articles: IArticle[]) => {
                if(err){
                    res.status(500).send(err.message);
                }else {
                    res.send(articles);
                }
            })
        })

    /*-----------------*/

    /* Post road */

        .post((req: Request, res: Response) => {
            const title: string = req.body.title ;
            const content: string = req.body.content ;

            const newArticle = new Article({
                title: title,
                content: content
            });

            newArticle.save((err: CallbackError, article: IArticle) => {
                if(err){
                    res.status(500).send(err.message);
                }else{
                    res.send(article);
                }
            })
        })

    /*---------------------*/


    /* Delete road */

        .delete((req: Request, res: Response) => {
            Article.deleteMany({}, (err: CallbackError, result: DeleteResult) => {
                if(err){
                    res.status(500).send(err.message);
                }else{
                    res.send(result);
                }
            })
        });    

    /*--------------------*/

    /*----------------------------------------*/

    /* Specific article */

    app.route("/articles/:title")

    /* Get road */
        .get((req: Request, res: Response) => {
            const title: string = req.params.title ;

            Article.findOne({title: title}, (err: CallbackError, article: IArticle) => {
                if(err){
                    res.status(500).send(err.message);
                }else{
                    res.send(article);
                }
            })
        })

    /*------------------*/

    /* Put road */

        .put((req: Request, res: Response) => {
            const title: string = req.params.title ;

            Article.replaceOne({title: title}, {title: req.body.title, content: req.body.content}, (err: CallbackError, result: UpdateWriteOpResult) => {
                if(err){
                    res.status(500).send(err.message);
                }else{
                    res.send(result);
                }
            })
        })

    /*-----------------*/

    /* Patch road */
    
        .patch((req: Request, res: Response) => {
            const title: string = req.params.title ;

            Article.updateOne({title: title}, {title: req.body.title, content: req.body.content}, (err: CallbackError, result: UpdateWriteOpResult) => {
                if(err){
                    res.status(500).send(err.message);
                }else{
                    res.send(result);
                }
            })
        })

    /*-----------------*/

    /* Delete road */

        .delete((req: Request, res: Response) => {
            const title: string = req.params.title ;

            Article.deleteOne({title: title}, (err: CallbackError, result: DeleteResult) => {
                if(err){
                    res.status(500).send(err.message);
                }else{
                    res.send(result);
                }
            })
        });    

/*--------------------*/

    /*----------------------------------------*/

    app.listen(3000, () => {
        console.log("Server started on port 3000");
    })
}

run().catch(err => console.log(err));

