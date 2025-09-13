const express = require('express');
const storeRouter = express.Router();
const storeController = require("../controllers/storeController");


storeRouter.get("/", storeController.getIndex);
storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/favourite", storeController.getFavoriteList);
storeRouter.get("/homes/:homeId", storeController.getHomeDetails);
storeRouter.post("/favourite", storeController.postAddToFavourite);
storeRouter.post("/remove-home/:homeId", storeController.postRemoveHome);

exports.storeRouter = storeRouter;``