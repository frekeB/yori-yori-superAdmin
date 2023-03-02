import { UserAccount } from "../controllers";
import express from "express";

const { Search, Engagement } = new UserAccount();

const router = express.Router();

router.route("/search").get(Search);

router.route("/engagement/:id").get(Engagement);

export default router;
