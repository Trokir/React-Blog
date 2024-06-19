import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

app.use(express.json());

async function ConnectToDb(req, res, next) {
    if (!db) {
        try {
            await client.connect();
            db = client.db('react-blog-db');
            console.log('Connected to the database');
        } catch (err) {
            console.error('Failed to connect to the database', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    }
    req.db = db;
    next();
}

async function DisconnectFromDb(req, res, next) {
    if (db) {
        try {
            await client.close();
            db = null;
            console.log('Disconnected from the database');
        } catch (err) {
            console.error('Failed to disconnect from the database', err);
        }
    }
    next();
}

app.use(ConnectToDb);

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const article = await req.db.collection('articles').findOne({ name });
        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/articles', async (req, res) => {
    try {
        const collInfos = await req.db.listCollections().toArray();
        console.log('Collections in the database:');
        collInfos.forEach((coll) => {
            console.log(coll.name);
        });
        res.json(collInfos);
    } catch (error) {
        console.error('Error fetching collection info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/hello', (req, res) => {
    res.send("Hello, world!");
});

app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
    try {
        await req.db.collection('articles').updateOne({ name }, {
            $inc: { upvotes: 1 }
        });
        const article = await req.db.collection('articles').findOne({ name });
        if (article) {
            res.send(`The ${name} now has ${article.upvotes} upvotes !!!!!`);
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;
    try {
        await req.db.collection('articles').updateOne(
            { name },
            {
                $push: {
                    comments: {
                        postedBy,
                        text
                    }
                }
            }
        );
        const article = await req.db.collection('articles').findOne({ name });
        if (article) {
            res.send(article.comments);
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.use(DisconnectFromDb);

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});
