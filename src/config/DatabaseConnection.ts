import { Mongoose, connect } from "mongoose";

export default class DatabaseConnection {
    private static loading: boolean = false;

    private static suceed: boolean = false;

    private static mongooseInstance: Mongoose;

    public static async setup() {
        if (!this.mongooseInstance && !this.loading) {
            this.loading = true;

            this.mongooseInstance = await connect('mongodb+srv://admin:admin@cluster0.i2ujo.mongodb.net/development?retryWrites=true&w=majority', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            this.suceed = true;
            this.loading = false;
        }
    }
}