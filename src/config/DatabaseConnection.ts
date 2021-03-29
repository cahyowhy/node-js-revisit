import { Mongoose, connect } from 'mongoose';

export default class DatabaseConnection {
  private static loading: boolean = false;

  private static suceed: boolean = false;

  private static mongooseInstance: Mongoose;

  public static async setup() {
    if (!this.mongooseInstance && !this.loading && !this.suceed) {
      this.loading = true;

      this.mongooseInstance = await connect((process.env.DB_URL as string), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      this.suceed = true;
      this.loading = false;
    }
  }
}
