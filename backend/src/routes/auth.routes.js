// src/routes/auth.routes.js

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Auth  route is working!');
});

export default router;