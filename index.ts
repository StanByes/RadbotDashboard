import cookieParser from "cookie-parser";
import express, {NextFunction, Request, Response} from "express";
import session from "express-session";
import dayjs from "dayjs";

import logger from "./logger";
import env from "./env";

import User from "./classes/User";
import { login, logout, oauthRedirect } from "./controllers/auth";
import { refreshToken } from "./utils/api";
import guildRouter from "./controllers/guild";
import fileRouter from "./controllers/file";
import createHttpError, { HttpError } from "http-errors";

logger.info("Application starting...");
const startTime = Date.now();

// Application Configuration //
logger.info("Init configuration...");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static("public"));
app.set("view engine", "ejs");

// Session Configuration //
app.use(session({secret: env.SESSION_SECRET, resave: true, saveUninitialized: false, cookie: { secure: process.env.NODE_ENV == "production" }}));

declare module "express-session" {
    interface SessionData {
        flash: {
            error: boolean,
            message: string
        } | null,
        user: User
    }
}


// Init Routes //
logger.info("Init routes...");
app.use(async (req: Request, res: Response, next: NextFunction) => {
    logger.log("info", "Request : [" + req.method + "] " + req.url + " - " + req.ip);

    if (req.session.user == null) { // Auto Connect
        if (req.url.includes("/login") || req.url.includes("/oauth_redirect"))
            return next();

        return res.redirect("/login");
    } else if (dayjs(req.session.user.expires_at).isBefore(dayjs().format())) { // Auto Refresh
        const data = await refreshToken(req.session.user);
        const user = new User(data.access_token, data.refresh_token, data.expires_in);

        user.name = req.session.user.name;
        user.id = req.session.user.id;
        user.avatar = req.session.user.avatar;

        req.session.user = user;
        logger.log("auth", "Token refreshed for " + user.name + " ( " + user.id + " )");
    }

    // Add User Data //
    res.locals.user = req.session.user;

    // Add Flash Message //
    res.locals.flash = req.session.flash;
    req.session.flash = null;

    // Add Time Format Function //
    res.locals.format = (dateContent: string) => {
        const date = new Date(dateContent);
        const month = date.getUTCMonth() + 1;
        return `${(date.getUTCDate() < 10 ? "0" : "") + date.getUTCDate()}/${(month < 10 ? "0" : "") + month}/${date.getFullYear()} ${date.getUTCHours()}:${date.getMinutes()}`;
    }

    return next();
});

// Auth Routes //
app.get("/login", login);
app.get("/oauth_redirect", oauthRedirect);
app.get("/logout", logout);

// Guild Routes //
app.use("/guilds", guildRouter);

// File Routes //
app.use("/files", fileRouter);

// Views Routes //
app.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const user = req.session.user;
    if (user == null)
        return next(createHttpError(500));

    return res.render("index");
});

app.get("/profile", async (req: Request, res: Response, next: NextFunction) => {
    return res.render("profile");
});



// error handler //
app.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
    logger.error(`Request Error : ${req.method} ${req.originalUrl} [${err.statusCode || 500}] ${err.message}`);
    if (typeof err == "number") {
        return res.status(err).json({code: err, message: err < 500 ? "Client Error" : "Server Error"});
    } else {
        return res.status(err.statusCode || 500).send(`${req.method} ${req.originalUrl} [${err.statusCode || 500}] ${err.name}`);
    }
});



// Attach Port //
const port = env.PORT || 3000;
app.listen(port, () => {
    logger.info("Connect to " + port + " in " + ((Date.now() - startTime) / 1000) + " seconds.");
});