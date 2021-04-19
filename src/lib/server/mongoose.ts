import mongoose from "mongoose";
import { MONGO_URI } from "../keys";

mongoose.set("useFindAndModify", false);


export const connect = new Promise<void>((resolve, reject) => {
  mongoose.connect(
    MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) {
        console.error("there was an error connecting to MongoDB ❌");
        console.error(err);
        return reject();
      }
      console.log("connected to MongoDB ✅");
      return resolve();
    }
  );
});
