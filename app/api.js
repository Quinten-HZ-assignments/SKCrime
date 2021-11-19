import express from 'express';
import prisma from '@prisma/client';
import Mercury from '@postlight/mercury-parser';

const db = new prisma.PrismaClient();

// Setup router
const router = express.Router();

// Articles
router.get('/articles', async (req, res) => {
	const { search, country } = req.query;

	try {
		const articles = await db.article.findMany({
			where: {

				// Country filter
				country: typeof country === 'string'
					? country
					: undefined,

				// Search query
				OR: typeof search === 'string'
					? [
						{ title: { contains: search, mode: 'insensitive' } },
						{ content: { contains: search, mode: 'insensitive' } },
						{ description: { contains: search, mode: 'insensitive' } },
						{ keywords: { has: search } },
					]
					: undefined,

			},
			orderBy: { createdAt: 'desc' }
		});

		return res.json(articles);
	} catch (error) {
		return res.status(400).send('Error finding articles');
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
