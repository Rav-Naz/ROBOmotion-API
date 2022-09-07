import express from 'express';

import * as socketIO from '../utils/socket';
import visitor_counter from '../utils/visitor_counter';
import { Success } from '../responses/success';



const router = express.Router();

router.get('/addOnePerson', (req, res, next) => {

    let current = visitor_counter.addOne();
    socketIO.default.getIO().emit("currentVisitors", current)
    Success.OK(res, {currentVisitors: current})
});

router.get('/removeOnePerson', (req, res, next) => {
    
    let current = visitor_counter.removeOne();
    socketIO.default.getIO().emit("currentVisitors", current)
    Success.OK(res, {currentVisitors: current})
    
});

export default router;