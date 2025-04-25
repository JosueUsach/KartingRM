import React, { useState, useEffect } from "react";
import reservationService from "../services/reservation.service";

const MakeReservation = () => {
	const [form, setForm] = useState({
		startTime: "",
		reservationType: 0, // 0=10min, 1=15min, 2=20min
		riderAmount: 1,
		clientRuts: [""], // First RUT is the main client's RUT
	});

	const [endTime, setEndTime] = useState("");
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (!form.startTime) return;

		const start = new Date(form.startTime);
		const durationMap = [10, 15, 20];
		const end = new Date(
			start.getTime() + durationMap[form.reservationType] * 60000
		);
		setEndTime(end.toISOString());
	}, [form.startTime, form.reservationType]);

	const handleRiderAmountChange = (e) => {
		const amount = Math.min(parseInt(e.target.value || 0), 15);
		const updatedRuts = [...form.clientRuts];
		while (updatedRuts.length < amount) updatedRuts.push("");
		while (updatedRuts.length > amount) updatedRuts.pop();

		setForm({
			...form,
			riderAmount: amount,
			clientRuts: updatedRuts,
		});
	};

	const handleRUTChange = (index, value) => {
		const updated = [...form.clientRuts];
		updated[index] = formatRUT(value);

		// Ensure the first RUT is always synchronized with the main client's RUT
		if (index === 0) {
			updated[0] = formatRUT(value);
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

	// RUT formatting function from second code
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
			newErrors.startTime = "Start time is required";
			valid = false;
		} else if (selectedStart < now) {
			newErrors.startTime = "Start time cannot be in the past";
			valid = false;
		}

		if (form.riderAmount < 1 || form.riderAmount > 15) {
			newErrors.riderAmount = "Must be between 1 and 15";
			valid = false;
		}

		if (!form.clientRuts[0]) {
			newErrors[`clientRut_0`] = "Main client RUT is required";
			valid = false;
		}

		form.clientRuts.forEach((rut, index) => {
			if (!rut) {
				newErrors[`clientRut_${index}`] = `Client ${index + 1} RUT is required`;
				valid = false;
			}
		});

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
				mainClientRut: form.clientRuts[0],
				clientRuts: form.clientRuts,
			};

			console.log("Sending data:", reservationData);

			// Send the entire reservationData object
			await reservationService.saveReservation(reservationData);

			alert("Reservation created successfully!");

			setForm({
				startTime: "",
				reservationType: 0,
				riderAmount: 1,
				clientRuts: [""],
			});
			setEndTime("");
		} catch (error) {
			console.error("Full error details:", {
				message: error.message,
				status: error.response?.status,
				data: error.response?.data,
				config: error.config,
			});
			alert(`Error: ${error.response?.data?.message || error.message}`);
		}
	};

	// 🎨 Styles
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

	return (
		<div style={{ padding: "2rem", textAlign: "center" }}>
			<h2>Create Reservation</h2>
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
					<label style={labelStyle}>Start Time</label>
					<input
						type="datetime-local"
						name="startTime"
						value={form.startTime}
						onChange={handleChange}
						style={inputStyle}
						min={new Date().toISOString().slice(0, 16)}
						required
					/>
					<div style={errorStyle}>{errors.startTime}</div>
				</div>

				{/* Reservation Type */}
				<div style={wrapperStyle}>
					<label style={labelStyle}>Reservation Type</label>
					<select
						name="reservationType"
						value={form.reservationType}
						onChange={handleChange}
						style={inputStyle}
					>
						<option value={0}>10 laps / 10 minutes</option>
						<option value={1}>15 laps / 15 minutes</option>
						<option value={2}>20 laps / 20 minutes</option>
					</select>
					<div style={errorStyle}>{errors.reservationType}</div>
				</div>

				{/* Rider Amount */}
				<div style={wrapperStyle}>
					<label style={labelStyle}>Rider Amount (max 15)</label>
					<input
						type="number"
						name="riderAmount"
						value={form.riderAmount}
						onChange={handleRiderAmountChange}
						style={inputStyle}
						min={1}
						max={15}
						required
					/>
					<div style={errorStyle}>{errors.riderAmount}</div>
				</div>

				{/* Client RUTs */}
				<div style={wrapperStyle}>
					<label style={labelStyle}>Client RUTs</label>
					{form.clientRuts.map((rut, index) => (
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
								value={rut}
								onChange={(e) => handleRUTChange(index, e.target.value)}
								style={{ ...inputStyle, marginRight: "1rem" }}
								required
							/>
							<div
								style={{
									display: "flex",
									alignItems: "center",
								}}
							>
								<label style={{ marginBottom: "0.2rem" }}>Frequencia</label>
								<input
									type="number"
									name="frequency"
									value={form.frequency || ""}
									onChange={(e) =>
										setForm({ ...form, frequency: e.target.value })
									}
									style={{ ...inputStyle, width: "100px" }}
									min={1}
									required
								/>
							</div>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
								}}
							>
								<label style={{ marginBottom: "0.2rem" }}>Cumpleaños</label>
								<input type="checkbox" />
							</div>

							<div style={errorStyle}>{errors[`clientRut_${index}`]}</div>
						</div>
					))}
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					style={buttonStyle}
					onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
					onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
				>
					Create Reservation
				</button>
			</form>
		</div>
	);
};

export default MakeReservation;
