import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import indexRoutes from './routes/index.js';
import adminRoutes from './routes/admin.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
    })
);

app.set('view engine', 'ejs');

app.use(indexRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});