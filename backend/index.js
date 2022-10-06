import express from "express";
import cors from "cors";
import session from 'express-session';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import PendaftaranMentorRoute from "./routes/PendaftaranMentor.js";
import LearningPathRoute from "./routes/LearningPathRoute.js";
import KelasRoute from "./routes/KelasRoute.js";
import ModulRoute from "./routes/ModulRoute.js"
import AuthRoute from "./routes/AuthRoute.js";
import MateriVideoRoute from "./routes/MateriVideoRoute.js";
import MateriTextRoute from "./routes/MateriTextRoute.js";
import SoalProjekRoute from "./routes/SoalProjekRoute.js";
import SoalExamRoute from "./routes/SoalExamRoute.js";
import OptionExamRoute from "./routes/OptionExamRoute.js";
import UserAnswerProjekRoute from "./routes/UserAnswerProjekRoute.js";
import db from "./config/database.js";
// import SoalExam from "./model/SoalExamModel.js";
// import OptionExam from "./model/OptionExamModel.js";
// import UserAnswerProjek from "./model/UserAnswerProjekModel.js"
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
app.use(LearningPathRoute);
app.use(KelasRoute);
app.use(ModulRoute);
app.use(MateriTextRoute);
app.use(MateriVideoRoute);
app.use(SoalProjekRoute);
app.use(UserAnswerProjekRoute);
app.use(SoalExamRoute);
app.use(OptionExamRoute);
app.use(AuthRoute);

app.use('document', express.static('./document'));
// SoalExam.sync();OptionExam.sync();

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running');
});