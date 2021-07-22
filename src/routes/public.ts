import express from 'express';
import db from '../utils/database'

const router = express.Router();


router.get('/hello', (req, res, next) => {
    db.query("CALL `ROBOTY_pobierzWszystkieRoboty`();", (err, results, fields) => {

        if (err) {
            res.send(err.sqlMessage);
            return;
        }

        res.send(results);
    })
})


export default router;