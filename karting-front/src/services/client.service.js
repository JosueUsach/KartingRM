import httpClient from "../http-common";

const registerClient = (client) => {
	return httpClient.post('/api/client/', client);
}

const getAll = () => {
	return httpClient.get('/api/client/');
}

const getClientByEmail = (email) => {
	return httpClient.get(`/api/client/${email}`);
}

const updateClient = (client) => {
	return httpClient.put(`/api/client/${client.clientId}`, client);
}

const deleteClient = (clientId) => {
	return httpClient.delete(`/api/client/${clientId}`);
}

export default { getAll, registerClient, getClientByEmail, updateClient, deleteClient };
