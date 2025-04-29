import httpClient from "../http-common";

const saveReceipt = (receipt) => {
	return httpClient.post('/api/receipt/', receipt);
};

const getLapReports = (clientId) => {
	return httpClient.get('/api/receipt/lapReport');
}

const getGroupReports = (clientId) => {
	return httpClient.get('/api/receipt/groupReport');
}

export default { saveReceipt, getLapReports, getGroupReports };