import express from "express";
import http from "http";
import { connectToDB, createChannel } from "./utils";
import { PORT, DB } from "./config";
import createApp from "./app";

const startApp = async () => {
  const app = express();

  const channel = await createChannel();

  await connectToDB(DB);

  await createApp(app, channel);

  const server = http.createServer(app);

  server
    .listen(PORT, (): void => {
      console.log(`initiated Superadmin Service`);
    })
    .on("listening", () =>
      console.log(`Superadmin Service listening on port ${PORT}`)
    )
    .on("error", (err: any) => {
      console.log(err);
      process.exit();
    })
    .on("close", () => {
      channel.close();
    });
};

startApp();
