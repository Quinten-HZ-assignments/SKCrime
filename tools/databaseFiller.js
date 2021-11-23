import prisma from '@prisma/client';
import { URL } from 'url';
import got from 'got';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import xml2js from 'xml2js';
import mercury from '@postlight/mercury-parser';

dayjs.extend(customParseFormat);

const query = 'cocaine';
const bingUrl = `https://www.bing.com/news/search?q=${query}&setlang=en&format=rss`;

const db = new prisma.PrismaClient();

async function fetch() {
	console.log('fetching...');

	const request = await got.get(bingUrl);
	const parsed = await xml2js.parseStringPromise(request.body);

	const articles = parsed?.rss?.channel?.[0]?.item;
	if (!articles) throw new Error('Articles not found!');

	console.log('fetched!');

	articles.forEach(async article => {
		const title = article?.title?.[0];

		const description = article?.description?.[0];

		const publisher = article?.['News:Source']?.[0];

		const rawDate = article?.pubDate?.[0]?.substring(4)?.trim();
		const date = dayjs(rawDate, 'DD MMM YYYY HH:mm:ss').toDate();

		const rawImage = article?.['News:Image']?.[0];
		const image = rawImage?.replace('&pid=News', '');

		const rawLink = article?.link?.[0];
		const parsedLink = new URL(rawLink);
		const url = parsedLink?.searchParams?.get('url');

		const rawContent = await mercury.parse(url, { contentType: 'text' });
		const content = rawContent.content;

		const isExists = await  db.article.count({ where: { url } }) > 0;
		if (isExists) return;

		await db.article.create({
			data: {
				url: url,
				date: date,
				title: title,
				description: description,
				content: content,
				publisher: publisher,
				image: image
			}
		});

		console.log(`Saving article "${title}"...`);
	});
}

fetch()
