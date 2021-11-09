const express = require("express");

const messageRoute = express.Router();

const messageController = require("../Controllers/messageController");

messageRoute.get("/listdialogues", messageController.getListDialogues);
messageRoute.get("/getmessage", messageController.getMessageUser);

module.exports = messageRoute;
