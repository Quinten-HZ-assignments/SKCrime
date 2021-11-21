/**
 * Generate short initials (The New York Times -> NYT)
 * @param {string} text Text to generate initials from
 * @returns Initials
 */
export function generateInitials(text, maxLength = 4) {
	let initials = '';
	let words = [];

	// Capitalize every first word
	text = text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

	// Convert string to array
	words = text.replace(/ /g, '').split(/(?=[A-Z])/);

	// Get first letters
	words = words.map((word) => {
		return word.trim().substring(0, 1);
	});

	// Remove empty words
	words = words.filter((word) => {
		if (!word || word === '') return false;
		return true;
	});

	// Create initials
	words.forEach((initial) => initials += initial);
	initials = initials.trim().toUpperCase();

	// Remove first letter if its T (The)
	if (initials[0] === 'T') initials = initials.substring(1);

	// Limit size
	initials = initials.slice(0, maxLength);

	if (initials === '') return undefined;
	return initials;
}

/**
 * Convert string to color
 * @param {string} str String to generate color from
 * @returns Color
 */
export function stringToColour(str) {
	let hash = 0;
	let colour = '#';

	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	for (let i = 0; i < 3; i++) {
		let value = (hash >> (i * 8)) & 0xFF;
		colour += ('00' + value.toString(16)).substr(-2);
	}

	return colour;
}
