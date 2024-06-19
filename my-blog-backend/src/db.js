import { db, client } from './server';

export async function ConnectToDb(req, res, next) {
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
export async function DisconnectFromDb(req, res, next) {
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
