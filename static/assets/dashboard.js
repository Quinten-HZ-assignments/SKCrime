const api = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}';
const map = L.map('map').setView([37.8, -96], 4);

async function mapInit() {
	const StamenToner = L.tileLayer(api, {
		attribution: '',
		minZoom: 0,
		maxZoom: 20,
		ext: 'png'
	});

	map.addLayer(StamenToner);

	const dataRequest = await fetch('libs/GeoJSON/countries.geojson');
	const contriesData = await dataRequest.json();

	L.geoJson(contriesData).addTo(map);
}

mapInit();

///////////////////////////////////////////////////////////////////

const sidebar = document.querySelector('.layout-sidebar');

// Fix sidebar
window.addEventListener('scroll', () => {
	const offset = 144;
	const position = window.pageYOffset;

	if (position < offset) {
		sidebar.style.marginTop = '0px';
	}

	if (position >= offset) {
		sidebar.style.marginTop = `${position - offset}px`;
	}
});

////////////////////////////////////////////////////

async function load(search) {
	let url = '/api/articles';

	if (typeof search === 'string' && search.trim() !== '') {
		url += '?' + new URLSearchParams({ search });
	}

	const articles = await GET(url);
	const container1 = document.querySelector('#articles-container-1');
	const container2 = document.querySelector('#articles-container-2');

	// Clean containers
	container1.innerHTML = '';
	container2.innerHTML = '';

	// If no articles
	if (articles.length === 0) {
		container1.innerHTML = '<i>Nothing found</i>'
	}

	// Create articles elements
	const articlesElements = articles.map((article) => createArticleElement(article));

	// Add to the page
	articlesElements.forEach((element) => {
		if (container1.clientHeight > container2.clientHeight) {
			container2.appendChild(element);
		} else {
			container1.appendChild(element);
		}
	});
}

function startLoading() {
	const containers = document.querySelectorAll('.article-container');
	containers.forEach(container => container.classList.add('loading'));
}

function stopLoading() {
	const containers = document.querySelectorAll('.article-container');
	containers.forEach(container => container.classList.remove('loading'));
}

function createArticleElement(article) {
	const element = document.createElement('div');
	element.className = 'article';
	element.onclick = () => window.open(article.url);

	const header = document.createElement('div');
	header.className = 'article-header';

	if (article.publisher) {
		if (article.publisherInitials) {
			const publisherInitials = document.createElement('div');
			publisherInitials.className = 'article-publisher-initials';
			publisherInitials.innerText = article.publisherInitials;
			header.appendChild(publisherInitials);
		}

		const publisher = document.createElement('div');
		publisher.className = 'article-publisher';
		publisher.innerText = article.publisher;
		header.appendChild(publisher);
	}

	const date = document.createElement('div');
	date.className = 'article-date';
	date.innerText = dayjs(article.date).format('HH:mm DD/MM/YYYY');
	header.appendChild(date);

	element.appendChild(header);

	const body = document.createElement('div');
	body.className = 'article-body';

	const title = document.createElement('h1');
	title.className = 'article-title';
	title.innerText = article.title;
	body.appendChild(title);

	const description = document.createElement('p');
	description.className = 'article-description';
	description.innerText = article.description;
	body.appendChild(description);

	element.appendChild(body);

	if (article.image) {
		const image = document.createElement('div');
		image.className = 'article-image';
		image.style.backgroundImage = `url(${article.image})`;
		element.appendChild(image);

		const footer = document.createElement('div');
		footer.className = 'article-footer';
		element.appendChild(footer);
	}

	return element;
}


// Reload on search
let timer;
document.querySelector('.search-bar').addEventListener('keyup', (event) => {
	const search = event.target.value;

	// Clear old timer
	if (timer) clearTimeout(timer);

	// Setup new timer
	timer = setTimeout(async () => {
		startLoading();
		await load(search);
		stopLoading();
	}, 300);
});

load();
