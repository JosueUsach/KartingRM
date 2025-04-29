import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // Import FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid"; // Import the day grid plugin
import reservationService from "../services/reservation.service"; // Import your service

const Rack = () => {
	const [events, setEvents] = useState([]);

	// Fetch reservations on component mount
	useEffect(() => {
		reservationService
			.getReservationsForCalendar()
			.then((response) => {
				setEvents(response.data);
			})
			.catch((error) => {
				console.error("Error fetching reservations:", error);
				alert("Hubo un error al cargar las reservas.");
			});
	}, []);

	const calendarStyles = {
		container: {
			padding: "2rem",
			backgroundColor: "white",
			borderRadius: "8px",
			boxShadow: "0 2px 15px rgba(0, 0, 0, 0.1)",
		},
		header: {
			textAlign: "center",
			color: "#8b0000",
			marginBottom: "1rem",
			fontSize: "2.2rem",
		},
		toolbar: {
			backgroundColor: "#8b0000",
			color: "white",
			padding: "0.5rem",
			borderRadius: "5px",
		},
		event: {
			backgroundColor: "#8b0000",
			color: "white",
			border: "none",
			textAlign: "center",
			padding: "0.2rem",
			borderRadius: "4px",
		},
		dayCell: {
			border: "2px solid #ddd",
			color: "black",
			textAlign: "center",
		},
		button: {
			backgroundColor: "#8b0000",
			color: "white",
			border: "none",
			padding: "0.5rem 1rem",
			borderRadius: "5px",
			cursor: "pointer",
		},
		buttonHover: {
			backgroundColor: "#a80000",
		},
	};

	return (
		<div style={calendarStyles.container}>
			<h2 style={calendarStyles.header}>Calendario de Reservas</h2>
			<FullCalendar
				plugins={[dayGridPlugin]}
				initialView="dayGridMonth"
				events={events}
				locale="es"
				headerToolbar={{
					left: "prev,next today",
					center: "customTitle",
					right: "dayGridMonth,dayGridWeek,dayGridDay",
				}}
				datesSet={(dateInfo) => {
					const title = new Intl.DateTimeFormat("es", {
						month: "long",
						year: "numeric",
					}).format(dateInfo.start);

					const titleButton = document.querySelector(".fc-customTitle-button");
					if (titleButton) {
						titleButton.innerHTML = title;
						titleButton.style.color = "#000000";
						titleButton.style.fontWeight = "bold";
						titleButton.style.backgroundColor = "transparent";
						titleButton.style.border = "none";
						titleButton.style.pointerEvents = "none";
						titleButton.style.fontSize = "2rem";
					}
				}}
				height="auto"
				contentHeight="auto"
				dayCellClassNames={() => calendarStyles.dayCell}
				dayCellContent={(content) => {
					return (
						<div style={{ color: "black", fontWeight: "bold" }}>
							{content.dayNumberText}
						</div>
					);
				}}
				eventContent={(eventInfo) => (
					<div style={calendarStyles.event}>{eventInfo.event.title}</div>
				)}
				buttonText={{
					today: "Hoy",
					month: "Mes",
					week: "Semana",
					day: "Día",
				}}
			/>
		</div>
	);
};

export default Rack;
