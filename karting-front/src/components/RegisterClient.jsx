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
	const [toast, setToast] = useState({
		show: false,
		message: "",
		type: "success",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "clientPhone") {
			const numericValue = value.replace(/\D/g, "");
			setForm({ ...form, [name]: numericValue });
		} else if (name === "clientRut") {
			// Clean input: remove dots and dashes
			let cleaned = value.replace(/[^\dkK]/g, "").toUpperCase();

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
		} else if (!/\S+@\S+\.\S+/.test(form.clientEmail)) {
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
					setToast({
						show: true,
						message: "El cliente ya está registrado con ese correo o RUT.",
						type: "error",
					});
					return;
				}
				setToast({
					show: true,
					message: "Cliente registrado!",
					type: "success",
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
				setToast({
					show: true,
					message: "Ocurrió un error al registrar el cliente.",
					type: "error",
				});
			});
	};

	// Toast auto-hide effect
	React.useEffect(() => {
		if (toast.show) {
			const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
			return () => clearTimeout(timer);
		}
	}, [toast]);

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

	const toastStyle = {
		position: "fixed",
		bottom: "30px", // Changed from top to bottom
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
			{toast.show && <div style={toastStyle}>{toast.message}</div>}
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
