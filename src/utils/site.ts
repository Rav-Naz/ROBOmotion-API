import express from 'express';
import { Success } from '../responses/success';
import { env } from 'process';
import time_constraints from './time_constraints';
import register_addons from './register_addons';
import db from '../utils/database';


const router = express.Router();

router.get('/info', (req, res, next) => {

    const streamLink = env.WS_STREAMLINK;
    let rejestracjaInfo:any = null;
    
    db.query("CALL `UZYTKOWNICY_czyRejestracjaOtwarta`();", (err, results, fields) => {
        rejestracjaInfo = results[0][0];
    
        Success.OK(res, {
            eventDate: time_constraints.getTimeConstraint('Zawody'),
            streamLink: streamLink,
            accessToModifyExpirationDate: time_constraints.getTimeConstraint('Rejestracja'),
            accesToSendDocumentation: time_constraints.getTimeConstraint('Dokumentacje'),
            robotAcceptTime: time_constraints.getTimeConstraint('Akceptacja robotów'),
            registerInfo: rejestracjaInfo
        })
    });

})

router.get('/registerAddons', (req, res, next) => {

    Success.OK(res, {
        rozmiaryKoszulek: register_addons.getRozmiaryKoszulek(),
        jedzenie: register_addons.getJedzenie()
    })
})

export default router;