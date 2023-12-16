import express from 'express';
import * as packageJson from "./package.json" assert { type: "json" }
import { configDotenv as env } from 'dotenv';

const packages = packageJson.default
const getENV = env().parsed
const app = express();
const { PORT = 3000, NODE_ENV } = getENV;


/** Get Index */
app.get('/', (req, res) => {
    res.send('App works!!');
});


/** Get User API  */
app.get('/api/user', async (req, res) => {
    try {
        res.json({
            msg: 'Sucess',
            Code: 200,
            data: {
                name: 'amit',
                phone: '123456789',
            },
        });
    } catch (error) {
        res.json({
            msg: 'Error',
            Code: 404,
            err: error,
        });
    }
});


/** Not found page */
app.get('*', (req, res) => {
    res.status(404).send('not found!');
});


/** Starting CLI */
app.listen(PORT, (err) => {

    console.log(`[Node][${NODE_ENV}] v${packages.version || '0.0.0'}`, err || '');

    console.log('\x1b[36m%s\x1b[0m', `running server on from port: ${PORT}`);

    console.log('\x1b[33m%s\x1b[0m',  err || '');

    console.log(
        'Preview:  \x1b[36m%s\x1b[0m', `${
        NODE_ENV == 'development'
            ? `http://localhost:${PORT}`
            : `${NODE_ENV}`
        }`
    );
});
