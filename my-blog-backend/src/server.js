import express from 'express'
import { MongoClient } from 'mongodb'



const app = express();

app.use(express.json())


app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    const client = new MongoClient('mongodb://127.0.0.1:27017');

    try {
        await client.connect();
        const db = client.db('react-blog-db');
        const article = await db.collection('articles').findOne({ name });

        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

app.get('/api/articles', async (req, res) => {
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    try {
        await client.connect();
        const db = client.db('react-blog-db'); // Replace with your actual database name

        const collInfos = await db.listCollections().toArray();
        console.log('Collections in the database:');
        collInfos.forEach((coll) => {
            console.log(coll.name);
        });
    } catch (error) {
        console.error('Error fetching collection info:', error);
    } finally {
        await client.close();
    }
    
});

app.get('/api/hello', async (req, res) => {
   
    res.send("collections");
});

/*
app.put('/api/articles/:name/upvote', (req, res) => {
    const { name } = req.params;
    const article = articleInfo.find(a => a.name === name);
    if (article) {
        article.upvotes += 1;
        res.send(`The ${name} now has  ${article.upvotes} upvotes !!!!!`);
    }
    else {
        res.send('This article doesn\'t exist');
    }
});
*/
/*
app.post('/api/articles/:name/comments', (req, res) => {
    const { postedBy, text } = req.body;
    const { name } = req.params;
    const article = articleInfo.find(a => a.name === name);
    if (article) {
        article.comments.push({ postedBy, text });
        res.send(article.comments);
    }
    else {
        res.send('This article doesn\'t exist');
    }
});
*/


app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});