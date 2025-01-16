import express from 'express';
import db from '../db.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const router = express.Router();

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.redirect('/admin')
}

router.get('/', (req, res) => {
    res.render('pages/adminLogin', { browserTitle: 'Admin Login' });
});

router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM books ORDER BY title ASC');
        const books = result.rows.map(book => ({
            ...book,
            formattedDate: formatDate(book.date_read)
        }));

        res.render('pages/admin', {
            books,
            browserTitle: 'Admin Page',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/dashboard', async (req, res) => {
    const { password } = req.body;



    if (password === process.env.ADMIN_PASSWORD) {
        req.session.isAuthenticated = true;
        try {
            const result = await db.query('SELECT * FROM books ORDER BY title ASC');
            const books = result.rows.map(book => ({
                ...book,
                formattedDate: formatDate(book.date_read)
            }));

            return res.render('pages/admin', {
                books, 
                browserTitle: 'Admin Page', 
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.render('pages/adminLogin', { 
            error: 'Password Incorrect',
            browserTitle: 'Admin Login',
        });
    }
});

router.get('/edit/:id', isAuthenticated, async (req, res) => {
    const bookId = req.params.id;

    try {
        const result = await db.query('SELECT * FROM books WHERE id = $1', [bookId]);
        const book = result.rows[0];

        if (!book) {
            return res.status(404).send('book not found.');
        }

        const formattedDate = book.date_read
            ? new Date(book.date_read).toISOString().split('T')[0]
            : '';

        res.render('pages/editBook', {
            book: { ...book, formattedDate },
            browserTitle: `Edit Book: ${book.title}`,
            route: '/admin/dashboard',
            submitRoute: `/admin/edit/${book.id}`
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/edit/:id', isAuthenticated, async (req, res) => {
    const bookId = req.params.id;
    const { date_read, rating, notes } = req.body;

    try {
        await db.query(
            'UPDATE books SET date_read = $1, rating = $2, notes = $3 WHERE id = $4',
            [date_read, rating, notes, bookId]
        );

        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/search', isAuthenticated, async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.render('pages/searchBook', {
            books: [],
            query: '',
            browserTitle: 'Search Book',
        });
    }

    try {
        const encodedQuery = encodeURIComponent(query);
        const url = `https://openlibrary.org/search.json?q=${encodedQuery}`;

        const response = await axios.get(url);
        const books = response.data.docs.map(book => ({
            title: book.title,
            author: book.author_name,
            olid: book.cover_edition_key,
        }));

        res.render('pages/searchBook', {
            books,
            query,
            browserTitle: 'Search Book',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error while searching books.');
    }
});

router.get('/add', isAuthenticated, (req, res) => {
    const { title, author, olid } = req.query;

    res.render('pages/editBook', {
        book: {
            title: title || '',
            author: author || '',
            olid: olid || '',
            date_read: '',
            rating: '',
            notes: '',
        },
        browserTitle: 'Add Book',
        route: '/admin/search',
        submitRoute: '/admin/add'
    });
});

router.post('/add', isAuthenticated, async (req, res) => {
    const { title, author, olid, date_read, rating, notes } = req.body;

    try {

        await db.query(
            `INSERT INTO books (title, author, olid, date_read, rating, notes)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [title, author, olid, date_read, rating, notes]
        );

        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Error adding book to database:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/delete/:id', isAuthenticated, async (req, res) => {
    const bookId = req.params.id;

    try {
        await db.query('DELETE FROM books WHERE id = $1', [bookId]);
        res.status(200).send('Book deleted successfully.');
    } catch (err) {
        console.error('Error deleting book:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
