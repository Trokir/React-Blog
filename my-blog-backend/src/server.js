import express from 'express'

let articleInfo = [
    {
        name: 'learn-react',
        upvotes: 0,
        comments: []
    },
    {
        name: 'learn-node',
        upvotes: 0,
        comments: []
    },
    {
        name: 'learn-mongoDb',
        upvotes: 0,
        comments: []
    },
]
const app = express();

app.use(express.json())

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

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});