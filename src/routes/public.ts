import { GRUPY_WALK } from './../models/database/GRUPY_WALK';
import express from 'express';
import db from '../utils/database'

const router = express.Router();

router.get('/hello', (req, res, next) => {

    const a = "asd";

    try {
        GRUPY_WALK.validator({nazwa: a});
    } catch (err) {
        res.status(404).send(err.message)
        return;
    }

    db.query("CALL `ROBOTY_pobierzWszystkieRoboty`();", (err, results, fields) => {

        if (err) {
            res.send(err.sqlMessage);
            return;
        }

        res.send(results);
    })
})


export default router;