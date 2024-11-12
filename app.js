import express from 'express';
import { handler as ssrHandler } from './dist/server/entry.mjs';

import morgan from 'morgan';
import cors from 'cors';
import pruebasRouter from './routes/pruebasRouter.js';
import userRouter from './routes/userRouter.js'

const app = express();

app.use(morgan('dev'));
app.use(cors())
app.use(express.json());

// Modifica esto en función de la opción `base` de tu archivo astro.config.mjs.
// Deben coincidir. El valor predeterminado es "/".
const base = '/'
app.use(base, express.static('dist/client/'));
app.use(ssrHandler);

app.use('/api/v1/pruebas', pruebasRouter);
app.use('/api/v1/usuario', userRouter);



export default app;