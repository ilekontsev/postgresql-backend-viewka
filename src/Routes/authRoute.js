const express = require("express");

const authRouter = express.Router();

const authController = require("../Controllers/OauthController");

authRouter.get("/authorization", authController.authorization);

module.exports = authRouter;
