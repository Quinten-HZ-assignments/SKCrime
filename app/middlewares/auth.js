import prisma from '@prisma/client';

const db = new prisma.PrismaClient();

/**
 * Authentication middleware
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
export default async function auth(req, res, next) {
	const { cookies } = req;
	const { token } = cookies;

	// If no token
	if (!token) return next();

	// Find user by token
	const user = await db.user.findFirst({
		where: { token },
		select: { id: true, username: true, permissions: true }
	});

	// If invalid token
	if (!user) {
		return res.clearCookie('token').status(400).send('Invalid token, removed from your cookies');
	}

	// Make user global
	req.user = user;

	return next();
}
