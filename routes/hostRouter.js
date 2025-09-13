const express = require('express');
const multer = require('multer');
const hostRouter = express.Router();
const hostController = require("../controllers/hostController");


hostRouter.get("/add-home", hostController.getAddHome);

const upload = multer({ storage: hostController.storage });
hostRouter.post("/add-home", upload.array("photos", 5), hostController.postAddHome);
hostRouter.get("/host-home-list", hostController.getHostHomes);
hostRouter.get("/edit-homes/:homeId", hostController.getEditHomes);
hostRouter.post("/edit-homes/", upload.array("photos", 5), hostController.postEditHomes);
hostRouter.post("/delete-home/:homeId", hostController.postDeleteHome);


exports.hostRouter = hostRouter;
