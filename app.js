import express from 'express';
import bodyParser from 'body-parser';
import indexRoutes from './routes/index.js';
// import adminRoutes from './routes/admin.js';

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(indexRoutes);
// app.use(adminRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});