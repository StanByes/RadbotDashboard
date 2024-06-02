import cookieParser from "cookie-parser";
import express, {NextFunction, Request, Response} from "express";
import session from "express-session";
import logger from "./logger";
import env from "./env";
import { login, logout, oauthRedirect } from "./controllers/auth";
import User from "./classes/User";
import { getUserGuilds } from "./utils/api";

logger.info("Application starting...");
const startTime = Date.now();

// Application Configuration //
logger.info("Init configuration...");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("view engine", "ejs");

// Session Configuration //
app.use(session({secret: "", resave: false, saveUninitialized: true, cookie: { secure: process.env.NODE_ENV == "production" }}));

declare module "express-session" {
    interface SessionData {
        user: User
    }
}


// Init Routes //
logger.info("Init routes...");
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.log("info", "Request : " + req.url + " - " + req.ip);

    if (req.session.user == null) {
        if (req.url.includes("/login") || req.url.includes("/oauth_redirect"))
            return next();

        return res.redirect("/login");
    }

    return next();
});

// Auth Routes //
app.get("/login", login);
app.get("/oauth_redirect", oauthRedirect);
app.get("/logout", logout);

// Views Routes //
app.get("/", async (req: Request, res: Response) => {
    const user = req.session.user;
    if (user == null)
        return res.status(500);

    user.guilds = await getUserGuilds(user);
    return res.render("index", {user: user});
})
  
// error handler //
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
    console.log(typeof err);
    logger.error(`Request Error : ${req.method} ${req.originalUrl} [${err.statusCode || 500}] ${err.message}`);
    if (typeof err == "number") {
        return res.status(err).json({code: err, message: err < 500 ? "Client Error" : "Server Error"});
    } else {
        return res.status(err.statusCode || 500).send(`${req.method} ${req.originalUrl} [${err.statusCode || 500}] ${err.name}`);
    }
});



// Attach Port //
const port = env.PORT || 3000;
app.listen(process.env.PORT || 3000, () => {
    logger.info("Connect to " + port + " in " + ((Date.now() - startTime) / 1000) + " seconds.");
})


export default app;