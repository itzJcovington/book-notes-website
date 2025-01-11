import express from 'express';
import db from '../db.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/adminLogin', { browserTitle: 'Admin Login' });
});

router.post('/', async (req, res) => {
    const { password } = req.body;

    const result = await db.query('SELECT * FROM books ORDER BY title ASC');
    const books = result.rows

    if (password === process.env.ADMIN_PASSWORD) {
        res.render('pages/admin', {
            books, 
            browserTitle: 'Admin Page', 
        });
    } else {
        res.render('pages/adminLogin', { 
            error: 'Password Incorrect',
            browserTitle: 'Admin Login',
        });
    }
});

export default router;