import express from 'express';
import prisma from '@prisma/client';
import Mercury from '@postlight/mercury-parser';

const db = new prisma.PrismaClient()

// Setup router
const router = express.Router();

// Articles
router.get('/articles', async (req, res) => {
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

// Parse page
router.get('/', async (req, res) => {
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

export default router;
