import express from "express";
import cors from "cors";
import session from 'express-session';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import PendaftaranMentorRoute from "./routes/PendaftaranMentor.js";
import AuthRoute from "./routes/AuthRoute.js";
import db from "./config/database.js";
import User from "./model/UserModel.js";
import PendaftaranMentor from "./model/PendaftaranMentorModel.js";
// import User from "./model/UserModel.js";
// import db from "./config/database.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db : db
});

// User.sync();
// (async()=>{
//     await db.sync();
// })();

app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : true,
    store : store,
    cookie : {
        //http biasa
        secure: 'auto'
    }
}));

app.use(cors({
    credentials : true,
    origin : 'http://localhost:3000'
}));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.json());
app.use(UserRoute);
app.use(PendaftaranMentorRoute);
app.use(AuthRoute);

app.use('document', express.static('./document'));
// PendaftaranMentor.sync();

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running');
});