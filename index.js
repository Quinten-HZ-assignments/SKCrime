import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import prisma from '@prisma/client';
import Mercury from '@postlight/mercury-parser';

// Load config
dotenv.config();

const app = express();
const db = new prisma.PrismaClient()

// Setup middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files server
app.use(express.static('static'));

// API route
app.get('/api', async (req, res) => {
	const { body, cookies, query } = req;
	const url = query?.url;

	if (!url) {
		return res.status(400).send('No url parameter specified');
	}

	try {
		const result = await Mercury.parse(url, { contentType: 'html' });
		return res.send(result.content);
	} catch (error) {
		return res.status(400).send('Error parsing specified url');
	}
});

// Start webserver
app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
});
