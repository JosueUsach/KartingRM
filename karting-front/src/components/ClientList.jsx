import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import clientService from "../services/client.service";

// Overlay component for messages
function MessageOverlay({ show, message, onClose }) {
	if (!show) return null;
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
	return (
		<div style={modalOverlayStyle} data-testid="clientlist-message-overlay">
			<div style={modalContentStyle}>
				<p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{message}</p>
				<button
					onClick={onClose}
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
					data-testid="clientlist-message-close"
				>
					Cerrar
				</button>
			</div>
		</div>
	);
}

const ClientList = () => {
	const [clients, setClients] = useState([]);
	const [editingClient, setEditingClient] = useState(null);
	const [message, setMessage] = useState({ show: false, message: "" });
	const [editErrors, setEditErrors] = useState({});

	useEffect(() => {
		fetchClients();
	}, []);

	// Function to fetch clients
	const fetchClients = () => {
		clientService
			.getAll()
			.then((response) => {
				setClients(response.data);
			})
			.catch((error) => {
				console.error("Error fetching clients:", error);
			});
	};

	// Function to delete a client
	const handleDeleteClient = (clientId) => {
		if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
			clientService
				.deleteClient(clientId)
				.then(() => {
					setClients(clients.filter((client) => client.id !== clientId));
					setMessage({
						show: true,
						message: "Cliente eliminado exitosamente.",
					});
				})
				.catch((error) => {
					console.error("Error deleting client:", error);
					setMessage({
						show: true,
						message: "Hubo un error al eliminar el cliente.",
					});
				});
		}
	};

	// Function to handle edit button click
	const handleEditClient = (client) => {
		setEditingClient(client);
	};

	// Function to handle form submission for updating a client
	const handleUpdateClient = (e) => {
		e.preventDefault();

		let errors = {};

		// Use a linear, safe regex for email validation (no nested quantifiers)
		if (
			!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/.test(
				editingClient.clientEmail
			)
		) {
			errors.clientEmail = "Formato de correo electrónico inválido";
		}

		// Check for duplicate RUT or email (excluding the client being edited)
		const duplicateRut = clients.some(
			(client) =>
				client.id !== editingClient.id &&
				client.clientRut.replace(/\./g, "").toUpperCase() ===
					editingClient.clientRut.replace(/\./g, "").toUpperCase()
		);
		const duplicateEmail = clients.some(
			(client) =>
				client.id !== editingClient.id &&
				client.clientEmail.trim().toLowerCase() ===
					editingClient.clientEmail.trim().toLowerCase()
		);

		if (duplicateRut) {
			setMessage({
				show: true,
				message: "Ya existe un cliente registrado con ese RUT.",
			});
			return;
		}
		if (duplicateEmail) {
			setMessage({
				show: true,
				message: "Ya existe un cliente registrado con ese correo.",
			});
			return;
		}
		if (Object.keys(errors).length > 0) {
			setEditErrors(errors);
			return;
		}

		setEditErrors({});

		clientService
			.updateClient(editingClient)
			.then(() => {
				setClients(
					clients.map((client) =>
						client.id === editingClient.id ? editingClient : client
					)
				);
				setMessage({
					show: true,
					message: "Cliente actualizado exitosamente.",
				});
				setEditingClient(null);
			})
			.catch((error) => {
				console.error("Error updating client:", error);
				setMessage({
					show: true,
					message: "Hubo un error al actualizar el cliente.",
				});
			});
	};

	// Function to handle input changes in the edit form
	const handleInputChange = (e) => {
		const { name, value } = e.target;

		if (name === "clientRut") {
			// Only allow numbers and 'K'
			let cleaned = value.replace(/[^\dkK]/g, "").toUpperCase();

			// Limit to 9 characters
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

			setEditingClient({ ...editingClient, [name]: formatted });
		} else {
			setEditingClient({ ...editingClient, [name]: value });
		}
		// Clear error on change
		if (editErrors[name]) {
			setEditErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	// Function to format the birthdate
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const day = String(date.getDate() + 1).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();
		return `${day} - ${month} - ${year}`;
	};

	// Styles for the tables
	const tableStyles = {
		tableContainer: {
			margin: "40px auto",
			maxWidth: "1000px",
			padding: "0 20px",
		},
		table: {
			width: "100%",
			borderCollapse: "collapse",
			borderRadius: "8px",
			overflow: "hidden",
			boxShadow: "0 2px 15px rgba(0, 0, 0, 0.1)",
		},
		tableHeader: {
			backgroundColor: "#d03434",
			color: "white",
			fontWeight: "600",
			textAlign: "center",
			padding: "15px",
		},
		tableCell: {
			color: "#333",
			padding: "15px",
			textAlign: "center",
		},
		evenRow: {
			backgroundColor: "#f8f9fa",
		},
		oddRow: {
			backgroundColor: "white",
		},
	};

	const closeMessage = () => setMessage({ ...message, show: false });

	return (
		<div style={{ padding: "2rem", position: "relative" }}>
			<MessageOverlay
				show={message.show}
				message={message.message}
				onClose={closeMessage}
			/>
			{/* Register Client button */}
			<div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
				<Link to="/RegisterClient">
					<button
						style={{
							padding: "1rem",
							fontSize: "1.3rem",
							color: "white",
							backgroundColor: "#d03434",
							borderRadius: "5px",
							border: "none",
							cursor: "pointer",
							transition: "background-color 0.3s ease",
						}}
						onMouseOver={(e) => (e.target.style.backgroundColor = "#a82828")}
						onMouseOut={(e) => (e.target.style.backgroundColor = "#d03434")}
					>
						Registrar Cliente
					</button>
				</Link>
			</div>

			{/* Edit Form */}
			{editingClient && (
				<div
					style={{
						marginBottom: "2rem",
						padding: "1rem",
						border: "1px solid #ddd",
					}}
				>
					<h3>Editar Cliente</h3>
					<form onSubmit={handleUpdateClient}>
						<div style={{ marginBottom: "1rem" }}>
							<label htmlFor="edit-clientName">Nombre:</label>
							<input
								id="edit-clientName"
								type="text"
								name="clientName"
								value={editingClient.clientName}
								onChange={handleInputChange}
								style={{ marginLeft: "1rem", padding: "0.5rem" }}
							/>
						</div>
						<div style={{ marginBottom: "1rem" }}>
							<label htmlFor="edit-clientRut">RUT:</label>
							<input
								id="edit-clientRut"
								type="text"
								name="clientRut"
								value={editingClient.clientRut}
								onChange={handleInputChange}
								style={{ marginLeft: "1rem", padding: "0.5rem" }}
							/>
						</div>
						<div style={{ marginBottom: "1rem" }}>
							<label htmlFor="edit-clientEmail">Email:</label>
							<input
								id="edit-clientEmail"
								type="email"
								name="clientEmail"
								value={editingClient.clientEmail}
								onChange={handleInputChange}
								style={{ marginLeft: "1rem", padding: "0.5rem" }}
							/>
							{editErrors.clientEmail && (
								<div style={{ color: "red", fontSize: "0.9rem" }}>
									{editErrors.clientEmail}
								</div>
							)}
						</div>
						<div style={{ marginBottom: "1rem" }}>
							<label htmlFor="edit-clientPhone">Teléfono:</label>
							<input
								id="edit-clientPhone"
								type="text"
								name="clientPhone"
								value={editingClient.clientPhone}
								onChange={handleInputChange}
								style={{ marginLeft: "1rem", padding: "0.5rem" }}
							/>
						</div>
						<div style={{ marginBottom: "1rem" }}>
							<label htmlFor="edit-clientBirthDate">Fecha de Nacimiento:</label>
							<input
								id="edit-clientBirthDate"
								type="date"
								name="clientBirthDate"
								value={editingClient.clientBirthDate}
								onChange={handleInputChange}
								style={{ marginLeft: "1rem", padding: "0.5rem" }}
							/>
						</div>
						{/* Save Button */}
						<button
							type="submit"
							style={{
								marginRight: "1rem",
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
							Guardar
						</button>
						{/* Cancel Button */}
						<button
							type="button"
							onClick={() => setEditingClient(null)}
							style={{
								padding: "0.5rem 1rem",
								border: "2px solid transparent",
								cursor: "pointer",
								transition: "box-shadow 0.3s ease, border-color 0.3s ease",
							}}
							onMouseOver={(e) => {
								e.target.style.borderColor = "#d03434";
							}}
							onMouseOut={(e) => {
								e.target.style.borderColor = "transparent";
							}}
						>
							Cancelar
						</button>
					</form>
				</div>
			)}

			{/* Table to display client data */}
			<h2 style={{ fontSize: "2.2rem" }}>Lista de Clientes</h2>
			<div style={tableStyles.tableContainer}>
				<table style={tableStyles.table}>
					<thead>
						<tr style={tableStyles.tableHeader}>
							<th style={{ padding: "15px", textAlign: "center" }}>Nombre</th>
							<th style={{ padding: "15px", textAlign: "center" }}>RUT</th>
							<th style={{ padding: "15px", textAlign: "center" }}>Email</th>
							<th style={{ padding: "15px", textAlign: "center" }}>Teléfono</th>
							<th style={{ padding: "15px", textAlign: "center" }}>
								Fecha de Nacimiento
							</th>
							<th style={{ padding: "15px", textAlign: "center" }}>Acciones</th>
						</tr>
					</thead>
					<tbody>
						{clients.map((client, index) => (
							<tr
								key={client.id}
								style={
									index % 2 === 0 ? tableStyles.evenRow : tableStyles.oddRow
								}
							>
								<td style={tableStyles.tableCell}>{client.clientName}</td>
								<td style={tableStyles.tableCell}>{client.clientRut}</td>
								<td style={tableStyles.tableCell}>{client.clientEmail}</td>
								<td style={tableStyles.tableCell}>{client.clientPhone}</td>
								<td style={tableStyles.tableCell}>
									{formatDate(client.clientBirthDate)}
								</td>
								<td style={tableStyles.tableCell}>
									<button
										onClick={() => handleEditClient(client)}
										style={{
											marginRight: "0.5rem",
											padding: "0.5rem 1rem",
											backgroundColor: "#333333",
											border: "2px solid transparent",
											cursor: "pointer",
											transition:
												"box-shadow 0.3s ease, border-color 0.3s ease",
										}}
										onMouseOver={(e) => {
											e.target.style.borderColor = "#d03434";
										}}
										onMouseOut={(e) => {
											e.target.style.borderColor = "transparent";
										}}
									>
										Editar
									</button>
									<button
										onClick={() => handleDeleteClient(client.id)}
										style={{
											backgroundColor: "#d03434",
											color: "white",
											border: "none",
											padding: "0.5rem 1rem",
											cursor: "pointer",
											borderRadius: "5px",
											transition: "background-color 0.3s ease",
										}}
										onMouseOver={(e) =>
											(e.target.style.backgroundColor = "#a82828")
										}
										onMouseOut={(e) =>
											(e.target.style.backgroundColor = "#d03434")
										}
									>
										Eliminar
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ClientList;
