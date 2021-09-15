import express from 'express';
import { ClientError } from '../responses/client_errors'

const router = express.Router();


router.get('*', (req, res, next) => {
    ClientError.misdirectedRequest(res,"Cannot reach the path");
})
router.post('*', (req, res, next) => {
    ClientError.misdirectedRequest(res, "Cannot reach the path");
})
router.delete('*', (req, res, next) => {
    ClientError.misdirectedRequest(res, "Cannot reach the path");
})
router.patch('*', (req, res, next) => {
    ClientError.misdirectedRequest(res, "Cannot reach the path");
})
router.put('*', (req, res, next) => {
    ClientError.misdirectedRequest(res, "Cannot reach the path");
})

export default router;