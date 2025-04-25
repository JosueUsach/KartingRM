import httpClient from "../http-common";

const saveReservation = (reservation) => {
	return httpClient.post('/api/reservation/', reservation);
};

export default {saveReservation};