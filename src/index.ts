import DatabaseConnection from "./config/DatabaseConnection";
import express from "express";
import routes from "./route";
import { type } from "os";

const app = express();

DatabaseConnection.setup().then(() => {
    app.listen(3000, function () {
        console.log('app are running on port : 3000');
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use(function (req, _res, next) {
        if (req.query && req.query['filter'] && typeof req.query['filter'] == "string") {
            try {
                const filter = JSON.parse(req.query['filter']);

                req.query = { ...req.query, filter };
            } catch (e) {
                console.log(e);
            }
        } else if (!(req.query && req.query['filter'] && typeof req.query['filter'] == "object")) {
            delete req.query['filter'];
        }

        return next();
    });

    app.use("/", routes);

    app.use(function (err: any, _req: any, res: any, next: any) {
        if (res.headersSent) {
            return next(err)
        }

        res.status(500).send({ success: false, data: err && err.stack })
    });
}).catch((e) => {
    console.log(e);
    process.exit();
});

process.on('uncaughtException', function (error) {
    console.log(error)
    process.exit(1000);
});

// app.use(express.static(path.join(__dirname, '../public')));