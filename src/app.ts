import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import * as swaggerDoc from './swagger.json'; 
import * as http from 'http';
dotenv.config();

import publicRoutes from './routes/public';
import userRoutes from './routes/user';
import adminRoutes from './routes/admin';
import siteRoutes from './utils/site';
import emptyRoutes from './routes/empty';
import { apiRatelimit } from './utils/ddos_protection';
import * as socketIO from './utils/socket';

const app = express();
const httpServer = http.createServer(app);
const options = {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
    }
 };
const io = socketIO.default.init(httpServer, options); 

const port = process.env.SERVER_PORT || 8080;

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
  
app.use(apiRatelimit); //DDOS prtection

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }))

app.use(morgan('short'));

app.use((req, res, next) => { //CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/public', publicRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/site', siteRoutes);

app.use(emptyRoutes); //When can't resolve the path

const server = httpServer.listen(port);