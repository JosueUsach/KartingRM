import httpClient from "../http-common";

const saveReceipt = (receipt) => {
	return httpClient.post('/api/receipt/', receipt);
};

export default { saveReceipt };