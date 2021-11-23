import { nanoid } from 'nanoid';
import express, { request } from 'express';
import prisma from '@prisma/client';
import Mercury from '@postlight/mercury-parser';

// Middlewares
import Auth from './middlewares/auth.js';

const db = new prisma.PrismaClient();

// Setup router
const router = express.Router();

// Login
router.get('/private', Auth);

router.get('/private', async (req, res) => {
	const { search, country } = req.query;

	if(req.user) {
		return res.send('u are user')
	}
	
	return res.send('hello u are not a user!')
});

// Articles
router.get('/articles', async (req, res) => {
	const { search, country } = req.query;

	try {
		const total = await db.article.count();

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

		return res.json({ total, articles });
	} catch (error) {
		return res.status(400).send('Error finding articles');
	}
});

// Login user
router.post('/login', async (req, res) => {
	const { body } = req;
	const { username, password } = body;

	console.log(username, password)

	try {
		// Find user by username and password
		const user = await db.user.findFirst({
			where: { username, password }
		});

		// If not found
		if (!user) return res.status(400).json({
			success : false,
			message: 'user not found'
		});

		// Generate token
		const token = nanoid();

		// Update users token
		await db.user.update({
			where: { id: user.id },
			data: { token }
		});

		return res.cookie('token', token, { maxAge: 999999 }).json({
			success: true,
			token: token
		});

	} catch (error) {
		console.log(error);
		return res.status(400).json({
			success : false,
			message: 'server error'
		});
	}
});

// Logout
router.get('/logout', async (req, res) => {
	return res.clearCookie('token').redirect('/');
});


// Parse page
router.get('/', async (req, res) => {
	const { body, cookies, query } = req;
	const { url } = query;

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
