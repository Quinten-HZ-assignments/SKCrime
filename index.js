import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import prisma from '@prisma/client';

// Load config
dotenv.config();

const app = express();
const db = new prisma.PrismaClient()

// Setup middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files server
app.use('/', express.static('static'));

// API route
app.get('/api', async (req, res) => {
    return res.send('Hello World!');
});

// Start webserver
app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
});