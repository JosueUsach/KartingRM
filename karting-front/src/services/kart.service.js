import httpClient from "../http-common";

const getAll = () => {
	return httpClient.get('/api/kart/');
}

export default { getAll };