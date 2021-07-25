import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
dotenv.config();

import publicRoutes from './routes/public';
import userRoutes from './routes/user';
import adminRoutes from './routes/admin';
import emptyRoutes from './routes/empty';
import * as swaggerDoc from './swagger.json'

const app = express();

const port = process.env.DB_PORT || 8080;

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc))

app.use(bodyParser.json({ limit: '50mb' }));

app.use(morgan('short'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/public', publicRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

app.use(emptyRoutes);

app.listen(port);