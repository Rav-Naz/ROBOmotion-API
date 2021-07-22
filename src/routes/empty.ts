import express from 'express';

const router = express.Router();


router.get('*', (req, res, next) => {
    res.send('Cannot reach the path');
})
router.post('*', (req, res, next) => {
    res.send('Cannot reach the path');
})
router.delete('*', (req, res, next) => {
    res.send('Cannot reach the path');
})
router.patch('*', (req, res, next) => {
    res.send('Cannot reach the path');
})
router.put('*', (req, res, next) => {
    res.send('Cannot reach the path');
})

export default router;