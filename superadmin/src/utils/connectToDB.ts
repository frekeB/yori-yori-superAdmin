import { connect } from "mongoose";

export default async (DB: string) => {
  connect(DB, {
    dbName: "yorisDb",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
    .then(() => {
      console.log("DB CONNECTION SUCCESSFUL!");
    })
    .catch((err) => console.log(`An error occured, ${err}`));
};
