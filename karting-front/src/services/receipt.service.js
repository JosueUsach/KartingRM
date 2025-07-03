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

const findReceiptByRutAndReservationId = (clientRut, reservationId) => {
    return httpClient.get(`/api/receipt/search`, {
        params: {
            clientRut,
            reservationId,
        },
    });
};

export default { saveReceipt, getLapReports, getGroupReports, findReceiptByRutAndReservationId };