import DatabaseConnection from "./config/DatabaseConnection";
import express from "express";
import routes from "./route";
import { queryParseHandler, errorHandler } from "./middleware";

require('dotenv').config();

const app = express();

DatabaseConnection.setup().then(() => {
    app.listen(3000, function () {
        console.log('app are running on port : 3000');
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(queryParseHandler);
    app.use("/", routes);
    app.use(errorHandler);
}).catch((e) => {
    console.log(e);
    process.exit();
});

process.on('uncaughtException', function (error) {
    console.log(error)
    process.exit(1000);
});

// app.use(express.static(path.join(__dirname, '../public')));