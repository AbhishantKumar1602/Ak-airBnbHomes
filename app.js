const path = require('path');

const express = require('express');
const MONGO_URL = "mongodb+srv://root:1602@akmongo.sya0hez.mongodb.net/airbnb?retryWrites=true&w=majority&appName=AkMongo";
const { default: Mongoose } = require('mongoose');
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session);

const { authRouter } = require("./routes/authRouter");
const { hostRouter } = require("./routes/hostRouter")
const { storeRouter } = require("./routes/storeRouter")
const errorController = require("./controllers/errors");

const user = require('./models/user');

const store = new MongoDbStore({
    uri: MONGO_URL,
    collection: 'sessions',
});


const app = express();

app.set("view engine", "ejs"); 
app.set("views", "views");

app.use(express.urlencoded());
app.use(session({
    secret: 'Aknodejs',
    resave: false,
    saveUninitialized: true,
    store: store,
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
    req.isLoggedIn = req.session.isLoggedIn;
    next();
});
app.use(storeRouter);
app.use(authRouter);
app.use("/host", (req, res, next) => {
    if (req.isLoggedIn && user.usertype==='host') {
        next();
    } else {
        res.redirect("/login");
    }
});
app.use("/host", hostRouter);
app.use(errorController.PageNotFound404);


const PORT = 3001;
Mongoose.connect(MONGO_URL).then(() => {
    console.log('Connected to Mongo database');
    app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.log('Error while connecting to database ' , err);
});