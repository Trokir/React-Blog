import express from 'express';
import { db, connectToDb } from './db.js';

const app = express();
app.use(express.json());

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const article = await db.collection('articles').findOne({ name });

        if (article) {
            res.json(article);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the article.' });
    }
});

app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;

    try {
        await db.collection('articles').updateOne({ name }, { $inc: { upvotes: 1 } });
        const article = await db.collection('articles').findOne({ name });

        if (article) {
            res.json(article);
        } else {
            res.status(404).send("That article doesn't exist");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while upvoting the article.' });
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;

    if (!postedBy || !text) {
        return res.status(400).json({ error: 'Invalid request: Both "postedBy" and "text" fields are required.' });
    }

    try {
        await db.collection('articles').updateOne({ name }, { $push: { comments: { postedBy, text } } });
        const article = await db.collection('articles').findOne({ name });

        if (article) {
            res.json(article);
        } else {
            res.status(404).send("That article doesn't exist!");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding a comment to the article.' });
    }
});

connectToDb(() => {
    console.log('Successfully connected to database!');
    app.listen(8000, () => {
        console.log('Server is listening on port 8000');
    });
});
