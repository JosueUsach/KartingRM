import httpClient from "../http-common";

const getAll = () => {
	return httpClient.get('/api/client/');
}

const registerClient = (client) => {
	return httpClient.post('/api/client/', client);
}

const getClientByEmail = (email) => {
	return httpClient.get(`/api/client/${email}`);
}

export default { getAll, registerClient, getClientByEmail };
