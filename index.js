import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import prisma from '@prisma/client';

// Load config
dotenv.config();

import apiController from './app/api.js';

const app = express();
const db = new prisma.PrismaClient()

// Setup middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files server
app.use(express.static('static'));

// API route
app.use('/api', apiController);

// Start webserver
app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
});
