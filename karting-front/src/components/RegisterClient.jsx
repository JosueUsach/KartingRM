import React, { useState } from "react";
import clientService from "../services/client.service";

const RegisterClient = () => {
	const [form, setForm] = useState({
		clientRut: "",
		clientName: "",
		clientEmail: "",
		clientPhone: "",
		clientBirthDate: "",
	});

	const [errors, setErrors] = useState({});
	const [modal, setModal] = useState({
		show: false,
		message: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "clientPhone") {
			const numericValue = value.replace(/\D/g, "");
			setForm({ ...form, [name]: numericValue });
		} else if (name === "clientRut") {
			// Clean input: remove dots and dashes
			let cleaned = value.replace(/[^0-9kK]/gi, "").toUpperCase();

			// Limit to 9 characters (8 digits + 1 check digit)
			cleaned = cleaned.slice(0, 9);

			// Format RUT: XX.XXX.XXX-X
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

			setForm({ ...form, [name]: formatted });
		} else {
			setForm({ ...form, [name]: value });
		}

		// Clear error when typing
		if (errors[name]) {
			setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
		}
	};

	// Validate form inputs
	const validateForm = () => {
		let valid = true;
		let newErrors = {};

		if (!form.clientRut) {
			newErrors.clientRut = "Introduzca rut";
			valid = false;
		}

		if (!form.clientName) {
			newErrors.clientName = "Introduzca nombre completo";
			valid = false;
		}

		if (!form.clientEmail) {
			newErrors.clientEmail = "Introduzca correo electrónico";
			valid = false;
		} else if (
			!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/.test(
				form.clientEmail
			)
		) {
			newErrors.clientEmail = "Formato de correo electrónico inválido";
			valid = false;
		}

		if (!form.clientPhone) {
			newErrors.clientPhone = "Introduzca teléfono";
			valid = false;
		} else if (!/^\d{8,15}$/.test(form.clientPhone)) {
			newErrors.clientPhone = "Teléfono debe tener entre 8 y 15 dígitos";
			valid = false;
		}

		if (!form.clientBirthDate) {
			newErrors.clientBirthDate = "La fecha de nacimiento es obligatoria";
		} else {
			const birthDate = new Date(form.clientBirthDate);
			const today = new Date();
			const maxAllowedDate = new Date();
			const minAllowedDate = new Date();
			minAllowedDate.setFullYear(today.getFullYear() - 8); // Client must be at least 8 years old
			maxAllowedDate.setFullYear(today.getFullYear() - 70); // Client must be less than 70 years old, health reasons

			if (birthDate < maxAllowedDate) {
				newErrors.clientBirthDate = "Cliente debe ser menor de 70 años";
				valid = false;
			} else if (birthDate > minAllowedDate) {
				newErrors.clientBirthDate = "Cliente debe tener al menos 8 años";
				valid = false;
			}
		}

		setErrors(newErrors);
		return valid;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return; // Stop submission if validation fails
		}

		clientService
			.registerClient(form)
			.then((res) => {
				console.log("Registro", res);
				if (res.data == "") {
					setModal({
						show: true,
						message: "El cliente ya está registrado con ese correo o RUT.",
					});
					return;
				}
				setModal({
					show: true,
					message: "Cliente registrado!",
				});
				setForm({
					clientRut: "",
					clientName: "",
					clientEmail: "",
					clientPhone: "",
					clientBirthDate: "",
				});
			})
			.catch((err) => {
				setModal({
					show: true,
					message: "Ocurrió un error al registrar el cliente.",
				});
			});
	};

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

	const errorStyle = {
		color: "red",
		fontSize: "0.9rem",
		height: "1.2rem",
		marginTop: "0.2rem",
	};

	const modalOverlayStyle = {
		position: "fixed",
		top: 0,
		left: 0,
		width: "100vw",
		height: "100vh",
		background: "rgba(0,0,0,0.4)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		zIndex: 9999,
	};

	const modalContentStyle = {
		background: "white",
		padding: "2rem",
		borderRadius: "10px",
		minWidth: "320px",
		maxWidth: "90vw",
		boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
		color: "black",
		textAlign: "center",
	};

	const closeModal = () => setModal({ ...modal, show: false });

	return (
		<div style={{ padding: "2rem", textAlign: "center" }}>
			{modal.show && (
				<div style={modalOverlayStyle} data-testid="client-modal-overlay">
					<div style={modalContentStyle}>
						<p
							style={{
								fontWeight: "bold",
								fontSize: "1.2rem",
							}}
						>
							{modal.message}
						</p>
						<button
							onClick={closeModal}
							style={{
								marginTop: "1.5rem",
								padding: "0.5rem 1.5rem",
								background: "#8b0000",
								color: "white",
								border: "none",
								borderRadius: "5px",
								fontWeight: "bold",
								cursor: "pointer",
								fontSize: "1rem",
							}}
							data-testid="client-modal-close"
						>
							Cerrar
						</button>
					</div>
				</div>
			)}
			<h2 style={{ fontSize: "2.2rem" }}>Registrar Cliente</h2>
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
				{/* RUT */}
				<div style={wrapperStyle}>
					<input
						name="clientRut"
						placeholder="RUT"
						value={form.clientRut}
						onChange={handleChange}
						style={inputStyle}
					/>
					<div style={errorStyle}>{errors.clientRut}</div>
				</div>

				{/* Name */}
				<div style={wrapperStyle}>
					<input
						name="clientName"
						placeholder="Nombre completo"
						value={form.clientName}
						onChange={handleChange}
						style={inputStyle}
					/>
					<div style={errorStyle}>{errors.clientName}</div>
				</div>

				{/* Email */}
				<div style={wrapperStyle}>
					<input
						name="clientEmail"
						placeholder="Correo electrónico"
						value={form.clientEmail}
						onChange={handleChange}
						style={inputStyle}
					/>
					<div style={errorStyle}>{errors.clientEmail}</div>
				</div>

				{/* Phone */}
				<div style={wrapperStyle}>
					<input
						name="clientPhone"
						placeholder="Teléfono"
						value={form.clientPhone}
						onChange={handleChange}
						style={inputStyle}
						type="text"
					/>
					<div style={errorStyle}>{errors.clientPhone}</div>
				</div>

				{/* Birth Date */}
				<div style={wrapperStyle}>
					<input
						name="clientBirthDate"
						type="date"
						value={form.clientBirthDate}
						onChange={handleChange}
						style={inputStyle}
					/>
					<div style={errorStyle}>{errors.clientBirthDate}</div>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					style={{
						padding: "0.75rem",
						width: "300px",
						fontSize: "16px",
						backgroundColor: "#4CAF50",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
						transition: "all 0.3s ease",
					}}
					onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
					onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
				>
					Registrar
				</button>
			</form>
		</div>
	);
};

export default RegisterClient;
