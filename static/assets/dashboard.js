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

    const dataRequest = await fetch('dist/GeoJSON/countries.geojson');
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
    console.log(position);

    if (position < offset) {
        sidebar.style.marginTop = '0px';
    }

    if (position >= offset) {
        sidebar.style.marginTop = `${position - offset}px`;
    }
});

////////////////////////////////////////////////////

// Emulate reload
let timer;
function emulateReload() {
    const images = document.querySelectorAll('.article-image');
    const elements = document.querySelectorAll('.layout-block');
    
    // Enable loading animation
    elements.forEach((element) => {
        element.classList.add('loading');
    });
    
    // Remove old timer if its already running
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
        elements.forEach((element) => {

            // Shuffle articles
            for (let i = element.children.length; i >= 0; i--) {
                element.appendChild(element.children[Math.random() * i | 0]);
            }

            // Update images
            // images.forEach((image) => {
            //     const randomImageID = Math.floor(Math.random() * 500);
            //     image.style.backgroundImage = `url(https://picsum.photos/seed/${randomImageID}/600/400)`;
            // });

            // Stop loading
            element.classList.remove('loading');
        });
    }, 500);
}

// Reload on click
document.querySelectorAll('.sidebar-checkbox').forEach(checkbox => {
    checkbox.addEventListener('click', () => emulateReload());
});

// Reload on search
document.querySelector('.search-bar').addEventListener('keyup', () => {
    emulateReload();
});
