import express from 'express';
import Mercury from '@postlight/mercury-parser';
import prisma from '@prisma/client';

// Setup router
const router = express.Router();
const db = new prisma.PrismaClient()

// Parse page
router.get('/hey', async 	(req, res) => {

	
	const { body, cookies, query } = req;
	const url = query?.url;

	const x = await db.article.findMany();
	return res.send(x);

	
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
