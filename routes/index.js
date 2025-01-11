import express from 'express';
import db from '../db.js';

const router = express.Router();

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

router.get('/', async (req, res) => {
    try {
        const { sort } = req.query;
        let sortQuery = 'SELECT * FROM books';

        switch (sort) {
            case 'title':
                sortQuery += ' ORDER BY title ASC';
                break;
            case 'newest':
                sortQuery += ' ORDER BY date_read DESC';
                break;
            case 'olderst':
                sortQuery += ' ORDER BY date_read ASC';
                break;
            case 'best': 
                sortQuery += ' ORDER BY rating DESC';
                break;
            case 'worst': 
                sortQuery += ' ORDER BY rating ASC';
                break;
            default:
                sortQuery += ' ORDER BY date_read DESC';
                break;
        }

        const result = await db.query(sortQuery);
        const books = result.rows.map(book => ({
            ...book,
            formattedDate: formatDate(book.date_read),
            notes: book.notes || 'No notes available'
        }));

        res.render('pages/home.ejs', { 
            books,
            browserTitle: "Jake's Book Notes"
         });
         
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;