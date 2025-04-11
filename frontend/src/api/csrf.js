export async function getCSRFToken() {
	const res = await fetch('http://localhost:8000/api/csrf/', {
		credentials: 'include',
	});

	const data = await res.json();
	return data.csrfToken;
}
