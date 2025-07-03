import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import reservationService from "../services/reservation.service";
import receiptService from "../services/receipt.service";

const Rack = () => {
	const [events, setEvents] = useState([]);
	const [showOverlay, setShowOverlay] = useState(false);
	const [reservationDetails, setReservationDetails] = useState(null);
	const [loadingDetails, setLoadingDetails] = useState(false);

	const [showReceiptOverlay, setShowReceiptOverlay] = useState(false);
	const [receiptDetails, setReceiptDetails] = useState(null);
	const [loadingReceipt, setLoadingReceipt] = useState(false);

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

	const handleEventClick = async (clickInfo) => {
		setShowOverlay(true);
		setLoadingDetails(true);
		try {
			const res = await reservationService.getReservationById(
				clickInfo.event.id
			);
			setReservationDetails(res.data);
		} catch (error) {
			setReservationDetails({ error: "No se pudo cargar la reserva." });
		}
		setLoadingDetails(false);
	};

	const closeOverlay = () => {
		setShowOverlay(false);
		setReservationDetails(null);
	};

	const handleShowReceipt = async (rutCliente, idReserva) => {
		setShowReceiptOverlay(true);
		setLoadingReceipt(true);
		try {
			const res = await receiptService.findReceiptByRutAndReservationId(
				rutCliente,
				idReserva
			);
			setReceiptDetails(res.data);
		} catch (error) {
			setReceiptDetails({ error: "No se pudo cargar el comprobante." });
		}
		setLoadingReceipt(false);
	};

	const closeReceiptOverlay = () => {
		setShowReceiptOverlay(false);
		setReceiptDetails(null);
	};

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
			padding: "0.3rem 0.8rem",
			borderRadius: "5px",
			cursor: "pointer",
			marginLeft: "0.5rem",
			fontSize: "0.95rem",
		},
		buttonHover: {
			backgroundColor: "#a80000",
		},
		overlay: {
			position: "fixed",
			top: 0,
			left: 0,
			width: "100vw",
			height: "100vh",
			background: "rgba(0,0,0,0.4)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			zIndex: 1000,
		},
		overlayContent: {
			background: "white",
			padding: "2rem",
			borderRadius: "10px",
			minWidth: "320px",
			maxWidth: "90vw",
			boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
			position: "relative",
			color: "black",
		},
		closeButton: {
			position: "absolute",
			top: "1rem",
			right: "1rem",
			background: "#8b0000",
			color: "white",
			border: "none",
			borderRadius: "50%",
			width: "2.2rem",
			height: "2.2rem",
			fontSize: "1.5rem",
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: 0,
			lineHeight: 1,
		},
	};

	const tipoReservaLabel = (tipo) => {
		switch (tipo) {
			case 0:
				return "10 vueltas / 10 minutos";
			case 1:
				return "15 vueltas / 15 minutos";
			case 2:
				return "20 vueltas / 20 minutos";
			default:
				return tipo;
		}
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
					// Use FullCalendar's built-in title for the current view
					const title = dateInfo.view.title;
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
				eventClick={handleEventClick}
				buttonText={{
					today: "Hoy",
					month: "Mes",
					week: "Semana",
					day: "Día",
				}}
			/>
			{showOverlay && (
				<div style={calendarStyles.overlay} onClick={closeOverlay}>
					<div
						style={calendarStyles.overlayContent}
						onClick={(e) => e.stopPropagation()}
					>
						<button style={calendarStyles.closeButton} onClick={closeOverlay}>
							×
						</button>
						{loadingDetails ? (
							<p>Cargando...</p>
						) : reservationDetails?.error ? (
							<p>{reservationDetails.error}</p>
						) : reservationDetails ? (
							<div>
								<h3 style={{ textAlign: "center" }}>Detalles de la Reserva</h3>
								<p>
									<strong>ID:</strong> {reservationDetails.id}
								</p>
								<p>
									<strong>Inicio:</strong>{" "}
									{new Date(reservationDetails.startTime).toLocaleString(
										"es-CL"
									)}
								</p>
								<p>
									<strong>Término:</strong>{" "}
									{new Date(reservationDetails.endTime).toLocaleString("es-CL")}
								</p>
								<p>
									<strong>Tipo:</strong>{" "}
									{tipoReservaLabel(reservationDetails.reservationType)}
								</p>
								<p>
									<strong>Cantidad de clientes:</strong>{" "}
									{reservationDetails.riderAmount}
								</p>
								<p>
									<strong>RUT Cliente principal:</strong>{" "}
									{reservationDetails.mainClientRut}
								</p>
								<p>
									<strong>RUTs de clientes:</strong>
								</p>
								<ul
									style={{
										listStyle: "none",
										padding: 0,
										margin: 0,
										textAlign: "center",
									}}
								>
									{reservationDetails.clientRuts.map((rut, idx) => (
										<li
											key={idx}
											style={{ textAlign: "center", marginBottom: "0.5rem" }}
										>
											{rut}
											<button
												style={calendarStyles.button}
												onClick={() =>
													handleShowReceipt(rut, reservationDetails.id)
												}
											>
												Ver comprobante
											</button>
										</li>
									))}
								</ul>
							</div>
						) : null}
					</div>
				</div>
			)}

			{showReceiptOverlay && (
				<div style={calendarStyles.overlay} onClick={closeReceiptOverlay}>
					<div
						style={calendarStyles.overlayContent}
						onClick={(e) => e.stopPropagation()}
					>
						<button
							style={calendarStyles.closeButton}
							onClick={closeReceiptOverlay}
						>
							×
						</button>
						{loadingReceipt ? (
							<p>Cargando comprobante...</p>
						) : receiptDetails?.error ? (
							<p>{receiptDetails.error}</p>
						) : receiptDetails ? (
							<div>
								<h3 style={{ textAlign: "center" }}>Comprobante</h3>
								<p>
									<strong>ID:</strong> {receiptDetails.id}
								</p>
								<p>
									<strong>RUT Cliente:</strong> {receiptDetails.clientRut}
								</p>
								<p>
									<strong>Nombre Cliente:</strong> {receiptDetails.clientName}
								</p>
								<p>
									<strong>Mail Cliente:</strong> {receiptDetails.clientEmail}
								</p>
								<p>
									<strong>Visitas Mensuales:</strong>{" "}
									{receiptDetails.monthlyVisits}
								</p>
								<p>
									<strong>¿Cumpleaños?:</strong>{" "}
									{receiptDetails.birthdayCheck ? "Sí" : "No"}
								</p>
								<p>
									<strong>Costo Inicial:</strong> $
									{receiptDetails.initialCost?.toLocaleString("es-CL")}
								</p>
								<p>
									<strong>Descuento Grupo:</strong> $
									{receiptDetails.groupDiscount?.toLocaleString("es-CL")}
								</p>
								<p>
									<strong>Descuento Día Especial:</strong> $
									{receiptDetails.holidayDiscount?.toLocaleString("es-CL")}
								</p>
								<p>
									<strong>Descuento Frecuencia:</strong> $
									{receiptDetails.frequentClientDiscount?.toLocaleString(
										"es-CL"
									)}
								</p>
								<p>
									<strong>Descuento Cumpleaños:</strong> $
									{receiptDetails.birthdayDiscount?.toLocaleString("es-CL")}
								</p>
								<p>
									<strong>Costo Final:</strong> $
									{receiptDetails.totalCost?.toLocaleString("es-CL")}
								</p>
								<p>
									<strong>Fecha Reserva:</strong>{" "}
									{receiptDetails.date
										? new Date(receiptDetails.date).toLocaleString("es-CL")
										: ""}
								</p>
								<p>
									<strong>ID Reserva:</strong> {receiptDetails.reservationId}
								</p>
							</div>
						) : null}
					</div>
				</div>
			)}
		</div>
	);
};

export default Rack;
