import httpClient from "../http-common";

const saveReservation = (reservation) => {
	return httpClient.post('/api/reservation/', reservation);
};

const getReservationsForCalendar = () => {
    return httpClient.get("/api/reservation/calendar");
};

export default { saveReservation, getReservationsForCalendar };