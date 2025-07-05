import React, { useState, useEffect } from "react";
import reservationService from "../services/reservation.service";
import receiptService from "../services/receipt.service";

const MakeReservation = () => {
	const [form, setForm] = useState({
		startTime: "",
		reservationType: 0, // 0=10min, 1=15min, 2=20min
		riderAmount: 1,
		clientRuts: [{ rut: "", frequency: 1 }],
	});

	const [endTime, setEndTime] = useState("");
	const [errors, setErrors] = useState({});
	const [toast, setToast] = useState({
		show: false,
		message: "",
		type: "error",
	});

	useEffect(() => {
		if (!form.startTime) return;

		const start = new Date(form.startTime);
		const durationMap = [30, 35, 40]; // Durations in minutes for 10, 15, and 20 minutes, considering setup time
		const end = new Date(
			start.getTime() + durationMap[form.reservationType] * 60000
		);
		setEndTime(end.toISOString());
	}, [form.startTime, form.reservationType]);

	useEffect(() => {
		if (toast.show) {
			const timer = setTimeout(() => setToast({ ...toast, show: false }), 3500);
			return () => clearTimeout(timer);
		}
	}, [toast]);

	const handleRiderAmountChange = (e) => {
		const amount = Math.min(parseInt(e.target.value || 0), 15);
		const updatedRuts = [...form.clientRuts];
		while (updatedRuts.length < amount)
			updatedRuts.push({ rut: "", frequency: 1 });
		while (updatedRuts.length > amount) updatedRuts.pop();

		setForm({
			...form,
			riderAmount: amount,
			clientRuts: updatedRuts,
		});
	};

	const handleRUTChange = (index, value) => {
		const updated = [...form.clientRuts];
		updated[index].rut = formatRUT(value);

		if (index === 0) {
			updated[0].rut = formatRUT(value);
		}

		setForm({
			...form,
			clientRuts: updated,
		});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "mainClientRUT") {
			setForm({
				...form,
				[name]: formatRUT(value),
			});
		} else if (name === "reservationType" || name === "riderAmount") {
			setForm({
				...form,
				[name]: Number(value),
			});
		} else {
			setForm({
				...form,
				[name]: value,
			});
		}
	};

	// Format RUT function
	const formatRUT = (value) => {
		let cleaned = value.replace(/[^\dkK]/gi, "").toUpperCase();
		cleaned = cleaned.slice(0, 9);
		let formatted = "";

		if (cleaned.length > 0) {
			const body = cleaned.slice(0, -1);
			const checkDigit = cleaned.slice(-1);
			formatted =
				body
					.split("")
					.reverse()
					.reduce((acc, char, i) => {
						return char + (i > 0 && i % 3 === 0 ? "." : "") + acc;
					}, "") +
				"-" +
				checkDigit;
		}

		return formatted;
	};

	const validateForm = () => {
		let valid = true;
		let newErrors = {};

		const now = new Date();
		const selectedStart = new Date(form.startTime);

		if (!form.startTime) {
			newErrors.startTime = "Tiempo de inicio es requerido";
			valid = false;
		} else if (selectedStart < now) {
			newErrors.startTime = "Tiempo de inicio no puede ser en el pasado";
			valid = false;
		} else {
			// Restrict hours by day of week
			const day = selectedStart.getDay(); // 0=Sunday, 6=Saturday
			const hour = selectedStart.getHours();
			if (day === 0 || day === 6) {
				// Saturday or Sunday: 10:00 to 22:00
				if (hour < 10 || hour >= 22) {
					newErrors.startTime =
						"Solo se puede reservar entre 10:00 y 22:00 los fines de semana";
					valid = false;
				}
			} else {
				// Weekdays: 14:00 to 22:00
				if (hour < 14 || hour >= 22) {
					newErrors.startTime =
						"Solo se puede reservar entre 14:00 y 22:00 de lunes a viernes";
					valid = false;
				}
			}
		}

		if (form.riderAmount < 1 || form.riderAmount > 15) {
			newErrors.riderAmount = "Cantidad de personas debe ser entre 1 y 15";
			valid = false;
		}

		// Check for unique RUTs
		const rutList = form.clientRuts.map((client) =>
			client.rut.trim().toUpperCase()
		);
		const rutSet = new Set(rutList);
		if (rutSet.size !== rutList.length) {
			newErrors.clientRuts = "Cada RUT debe ser único";
			valid = false;
		}

		form.clientRuts.forEach((client, index) => {
			if (!client.rut) {
				newErrors[`clientRut_${index}`] = `Rut del cliente ${
					index + 1
				} es requerido`;
				valid = false;
			}
		});

		if (!form.clientRuts[0].rut) {
			newErrors[`clientRut_0`] = "Rut del cliente principal es requerido";
			valid = false;
		}

		setErrors(newErrors);
		return valid;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			const formatLocalDateTime = (dateString) => {
				const date = new Date(dateString);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const day = String(date.getDate()).padStart(2, "0");
				const hours = String(date.getHours()).padStart(2, "0");
				const minutes = String(date.getMinutes()).padStart(2, "0");

				return `${year}-${month}-${day}T${hours}:${minutes}`; // "YYYY-MM-DDTHH:mm"
			};

			const reservationData = {
				startTime: formatLocalDateTime(form.startTime),
				endTime: formatLocalDateTime(endTime),
				reservationType: form.reservationType,
				riderAmount: form.riderAmount,
				mainClientRut: form.clientRuts[0].rut,
				clientRuts: form.clientRuts.map((client) => client.rut),
			};

			console.log("Sending reservation data:", reservationData);

			// Save the reservation
			const reservationResponse = await reservationService.saveReservation(
				reservationData
			);
			console.log("Reservation saved:", reservationResponse.data);

			// Save receipts for each client
			for (const client of form.clientRuts) {
				const receiptData = {
					clientRut: client.rut,
					monthlyVisits: client.frequency,
					reservationId: reservationResponse.data.id,
				};

				console.log("Sending receipt data:", receiptData);
				await receiptService.saveReceipt(receiptData);
			}

			setToast({
				show: true,
				message: "Reserva y comprobantes guardados!",
				type: "success",
			});

			setForm({
				startTime: "",
				reservationType: 0,
				riderAmount: 1,
				clientRuts: [{ rut: "", frequency: 1 }],
			});
			setEndTime("");
		} catch (error) {
			console.error("Full error details:", {
				message: error.message,
				status: error.response?.status,
				data: error.response?.data,
				config: error.config,
			});
			const backendMsg =
				error.response?.data?.message ||
				"Error al crear la reserva. Verifique los datos e intente nuevamente.";
			setToast({ show: true, message: backendMsg, type: "error" });
		}
	};

	// Styles
	const inputStyle = {
		padding: "0.5rem",
		width: "300px",
		fontSize: "16px",
	};

	const wrapperStyle = {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: "0.5rem",
	};

	const labelStyle = {
		fontWeight: "bold",
		marginBottom: "0.2rem",
	};

	const errorStyle = {
		color: "red",
		fontSize: "0.9rem",
		height: "1.2rem",
	};

	const buttonStyle = {
		padding: "0.75rem",
		width: "300px",
		fontSize: "16px",
		backgroundColor: "#4CAF50",
		color: "white",
		border: "none",
		borderRadius: "4px",
		cursor: "pointer",
		transition: "all 0.3s ease",
	};

	const toastStyle = {
		position: "fixed",
		bottom: "30px",
		left: "50%",
		transform: "translateX(-50%)",
		background: toast.type === "success" ? "#4CAF50" : "#d03434",
		color: "white",
		padding: "1rem 2rem",
		borderRadius: "8px",
		boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
		fontSize: "1.1rem",
		zIndex: 9999,
		transition: "opacity 0.3s",
		opacity: toast.show ? 1 : 0,
		pointerEvents: "none",
	};

	return (
		<div style={{ padding: "2rem", textAlign: "center" }}>
			<h2 style={{ fontSize: "2.2rem" }}>Reservar hora</h2>
			{toast.show && <div style={toastStyle}>{toast.message}</div>}
			<form
				onSubmit={handleSubmit}
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "2rem",
					width: "100%",
				}}
			>
				{/* Start Time */}
				<div style={wrapperStyle}>
					<label style={labelStyle}>Hora y fecha de inicio</label>
					<input
						type="datetime-local"
						name="startTime"
						value={form.startTime}
						onChange={handleChange}
						style={inputStyle}
						min={new Date().toISOString().slice(0, 16)}
					/>
					<div style={errorStyle}>{errors.startTime}</div>
				</div>

				{/* Reservation Type */}
				<div style={wrapperStyle}>
					<label style={labelStyle}>Duración</label>
					<select
						name="reservationType"
						value={form.reservationType}
						onChange={handleChange}
						style={inputStyle}
					>
						<option value={0}>10 vueltas / 10 minutos</option>
						<option value={1}>15 vueltas / 15 minutos</option>
						<option value={2}>20 vueltas / 20 minutos</option>
					</select>
					<div style={errorStyle}>{errors.reservationType}</div>
				</div>

				{/* Rider Amount */}
				<div style={wrapperStyle}>
					<label style={labelStyle}>Cantidad de personas (15 máx.)</label>
					<input
						type="number"
						name="riderAmount"
						value={form.riderAmount}
						onChange={handleRiderAmountChange}
						style={inputStyle}
						min={1}
						max={15}
					/>
					<div style={errorStyle}>{errors.riderAmount}</div>
				</div>

				{/* Client RUTs */}
				<div style={wrapperStyle}>
					<label style={labelStyle}>Clientes</label>
					{form.clientRuts.map((client, index) => (
						<div
							key={index}
							style={{
								...wrapperStyle,
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<input
								type="text"
								placeholder={
									index === 0
										? "Rut Cliente principal"
										: `Rut Cliente ${index + 1}`
								}
								value={client.rut}
								onChange={(e) => handleRUTChange(index, e.target.value)}
								style={{ ...inputStyle, marginRight: "1rem" }}
							/>
							<div
								style={{
									display: "flex",
									alignItems: "center",
								}}
							>
								<label style={{ marginBottom: "0.2rem" }}>Frecuencia</label>
								<input
									type="number"
									name="frequency"
									value={client.frequency || ""}
									onChange={(e) => {
										const updatedClients = [...form.clientRuts];
										updatedClients[index].frequency = e.target.value;
										setForm({ ...form, clientRuts: updatedClients });
									}}
									style={{
										...inputStyle,
										width: "100px",
										marginLeft: "0.5rem",
										marginRight: "1rem",
									}}
									min={1}
								/>
							</div>

							<div style={errorStyle}>{errors[`clientRut_${index}`]}</div>
						</div>
					))}
					{errors.clientRuts && (
						<div
							style={{
								color: "red",
								fontSize: "0.95rem",
								marginBottom: "0.5rem",
							}}
						>
							{errors.clientRuts}
						</div>
					)}
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					style={buttonStyle}
					onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
					onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
				>
					Crear reserva
				</button>
			</form>
		</div>
	);
};

export default MakeReservation;
