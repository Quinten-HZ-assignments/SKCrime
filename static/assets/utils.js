/**
 * Send GET request
 * @param {string} url URL to send request
 * @returns Response content
 */
async function GET(url) {
	const request = await fetch(url);
	const data = await request.json();
	return data;
}

/**
 * Send POST request
 * @param {string} url URL to send request
 * @param {object} body Body to send
 * @returns Response content
 */
async function POST(url, body) {
	const request = {
		method: 'POST',
		body: body ? JSON.stringify(body) : undefined,
	};

	const response = await fetch(url, request);
	const data = await response.json();

	return data;
}

/**
 * Escape HTML strings. Prevents Cross-Site Scripting.
 * @param {string} unsafe
 * @returns Escaped HTML
 */
function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}
