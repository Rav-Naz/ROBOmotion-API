import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import * as swaggerDoc from './swagger.json';
import * as http from 'http';
import cors from 'cors';
import fileUpload from 'express-fileupload';

dotenv.config();

import publicRoutes from './routes/public';
import siteRoutes from './utils/site';
import userRoutes from './routes/user';
import volunteerRoutes from './routes/volunteer';
import refereeRoutes from './routes/referee';
import adminRoutes from './routes/admin';
import emptyRoutes from './routes/empty';
import deviceRoutes from './routes/device';
// import { apiRatelimit } from './utils/ddos_protection';
import * as socketIO from './utils/socket';
import * as JWT from './utils/jwt';
import * as auth from './utils/auth';
import * as Nodemailer from './utils/nodemailer'
import db from './utils/database';
import * as time_constraints from './utils/time_constraints';
import * as register_addons from './utils/register_addons';
import * as visitor_counter from './utils/visitor_counter';
import { ROZMIAR_KOSZULKI } from './models/database/ROZMIAR_KOSZULKI';
import { JEDZENIE } from './models/database/JEDZENIE';
import sms from './utils/sms';

const hostName = '127.0.0.1';
const app = express();
const httpServer = http.createServer(app);
const corsOptions = {
    origin: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT'],
    allowedHeaders: ['Content-Type', 'x-requested-with', 'Authorization', 'Accept', 'token'],
    maxAge: 86400
};

const io = socketIO.default.init(httpServer, { cors: corsOptions });
const nodemailer = Nodemailer.default.init();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const port = Number(process.env.SERVER_PORT) || 8080;

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// app.use(apiRatelimit); //DDOS prtection

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }))

app.use(morgan('short'));

app.use(cors(corsOptions));

app.use(fileUpload({
    createParentPath: true
}));

app.use('/site', siteRoutes);
app.use('/public', publicRoutes);
app.use('/user', JWT.default.verify, auth.default.authorize(0), userRoutes);
app.use('/volunteer', JWT.default.verify, auth.default.authorize(1), volunteerRoutes);
app.use('/referee', JWT.default.verify, auth.default.authorize(2), refereeRoutes);
app.use('/admin', JWT.default.verify, auth.default.authorize(3), adminRoutes);
app.use('/device', auth.default.authorize(4), deviceRoutes);

app.use(emptyRoutes); //When can't resolve the path

const server = httpServer.listen(port, hostName, async () => {
    db.query("SELECT * FROM `OGRANICZENIA_CZASOWE`", [], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            return;
        }
        results.forEach((element: any) => {
            var nazwa = String(element.nazwa);
            var data_rozpoczecia = new Date(element.data_rozpoczecia);
            var data_zakonczenia = new Date(element.data_zakonczenia);
            time_constraints.default.addToTimeConstraints({ nazwa, data_rozpoczecia, data_zakonczenia });
        });
    });
    db.query("SELECT * FROM `JEDZENIE`", [], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            return;
        }

        results.forEach((element: any) => {
            try {
                JEDZENIE.validator({ nazwa: element.nazwa });
            } catch (err: any) {
                console.log(err)
                return;
            }
            register_addons.default.addJedzenie(element.nazwa);
        });
    });
    db.query("SELECT * FROM `ROZMIARY_KOSZULEK`", [], (err, results, fields) => {
        if (err?.sqlState === '45000') {
            return;
        }
        results.forEach((element: any) => {
            try {
                ROZMIAR_KOSZULKI.validator({ rozmiar: element.rozmiar });
            } catch (err: any) {
                console.log(err)
                return;
            }
            register_addons.default.addRozmiarKoszulki(element.rozmiar);
        });
    });
    db.query("CALL `ILE_OSOB_NA_WYDARZENIU_ileOsob(D)`();", (err, results, fields) => {
        if (err?.sqlState === '45000') {
            return;
        }
        visitor_counter.default.setIleOsobNaWydarzeniu(results != undefined ? results[0][0].iloscOsob : 0)
    });
    await sms.login();
    console.log(`Server running at http://${hostName}:${port}`);
});
