import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    const books = [
        {
            olid: 'OL51709286M', // Example Open Library ID
            title: 'The Hobbit',
            author: 'J.R.R. Tolkien',
            rating: 5,
            review: 'An amazing journey through Middle-earth!',
            date: "2022-04-10"
        },
        {
            olid: 'OL3174961M',
            title: '1984',
            author: 'George Orwell',
            rating: 4,
            review: 'A thought-provoking dystopian novel.',
            date: "2022-04-10"
        },
        {
            olid: 'OL25228947M',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            rating: 5,
            review: 'A powerful story of justice and morality.',
            date: "2022-04-10"
        }
    ];
    res.render('pages/home.ejs', { books });
});

export default router;