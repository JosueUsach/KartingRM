import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import clientService from "../services/client.service";

const ClientList = () => {
	const [clients, setClients] = useState([]);
	const [editingClient, setEditingClient] = useState(null); // State for the client being edited

	// Fetch client data on component mount
	useEffect(() => {
		fetchClients();
	}, []);

	// Function to fetch clients
	const fetchClients = () => {
		clientService
			.getAll()
			.then((response) => {
				setClients(response.data); // Store the fetched clients in state
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
					// Remove the deleted client from the state
					setClients(clients.filter((client) => client.id !== clientId));
					alert("Cliente eliminado exitosamente.");
				})
				.catch((error) => {
					console.error("Error deleting client:", error);
					alert("Hubo un error al eliminar el cliente.");
				});
		}
	};

	// Function to handle edit button click
	const handleEditClient = (client) => {
		setEditingClient(client); // Set the client to be edited
	};

	// Function to handle form submission for updating a client
	const handleUpdateClient = (e) => {
		e.preventDefault();
		clientService
			.updateClient(editingClient)
			.then(() => {
				// Update the client in the state
				setClients(
					clients.map((client) =>
						client.id === editingClient.id ? editingClient : client
					)
				);
				alert("Cliente actualizado exitosamente.");
				setEditingClient(null); // Close the edit form
			})
			.catch((error) => {
				console.error("Error updating client:", error);
				alert("Hubo un error al actualizar el cliente.");
			});
	};

	// Function to handle input changes in the edit form
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditingClient({ ...editingClient, [name]: value });
	};

	// Function to format the birthdate
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
		const year = date.getFullYear();
		return `${day}-${month}-${year}`;
	};

	return (
		<div style={{ padding: "2rem", position: "relative" }}>
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
							<label>Nombre:</label>
							<input
								type="text"
								name="clientName"
								value={editingClient.clientName}
								onChange={handleInputChange}
								style={{ marginLeft: "1rem", padding: "0.5rem" }}
							/>
						</div>
						<div style={{ marginBottom: "1rem" }}>
							<label>RUT:</label>
							<input
								type="text"
								name="clientRut"
								value={editingClient.clientRut}
								onChange={handleInputChange}
								style={{ marginLeft: "1rem", padding: "0.5rem" }}
							/>
						</div>
						<div style={{ marginBottom: "1rem" }}>
							<label>Email:</label>
							<input
								type="email"
								name="clientEmail"
								value={editingClient.clientEmail}
								onChange={handleInputChange}
								style={{ marginLeft: "1rem", padding: "0.5rem" }}
							/>
						</div>
						<div style={{ marginBottom: "1rem" }}>
							<label>Teléfono:</label>
							<input
								type="text"
								name="clientPhone"
								value={editingClient.clientPhone}
								onChange={handleInputChange}
								style={{ marginLeft: "1rem", padding: "0.5rem" }}
							/>
						</div>
						<div style={{ marginBottom: "1rem" }}>
							<label>Fecha de Nacimiento:</label>
							<input
								type="date"
								name="clientBirthDate"
								value={editingClient.clientBirthDate}
								onChange={handleInputChange}
								style={{ marginLeft: "1rem", padding: "0.5rem" }}
							/>
						</div>
						<button
							type="submit"
							style={{ marginRight: "1rem", padding: "0.5rem 1rem" }}
						>
							Guardar
						</button>
						<button
							type="button"
							onClick={() => setEditingClient(null)}
							style={{ padding: "0.5rem 1rem" }}
						>
							Cancelar
						</button>
					</form>
				</div>
			)}

			{/* Table to display client data */}
			<h2>Lista de Clientes</h2>
			<table style={{ width: "100%", borderCollapse: "collapse" }}>
				<thead>
					<tr>
						<th style={{ border: "1px solid #ddd", padding: "8px" }}>Nombre</th>
						<th style={{ border: "1px solid #ddd", padding: "8px" }}>RUT</th>
						<th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
						<th style={{ border: "1px solid #ddd", padding: "8px" }}>
							Teléfono
						</th>
						<th style={{ border: "1px solid #ddd", padding: "8px" }}>
							Fecha de Nacimiento
						</th>
						<th style={{ border: "1px solid #ddd", padding: "8px" }}>
							Acciones
						</th>
					</tr>
				</thead>
				<tbody>
					{clients.map((client) => (
						<tr key={client.id}>
							<td style={{ border: "1px solid #ddd", padding: "8px" }}>
								{client.clientName}
							</td>
							<td style={{ border: "1px solid #ddd", padding: "8px" }}>
								{client.clientRut}
							</td>
							<td style={{ border: "1px solid #ddd", padding: "8px" }}>
								{client.clientEmail}
							</td>
							<td style={{ border: "1px solid #ddd", padding: "8px" }}>
								{client.clientPhone}
							</td>
							<td style={{ border: "1px solid #ddd", padding: "8px" }}>
								{formatDate(client.clientBirthDate)}
							</td>
							<td style={{ border: "1px solid #ddd", padding: "8px" }}>
								<button
									onClick={() => handleEditClient(client)}
									style={{ marginRight: "0.5rem", padding: "0.5rem 1rem" }}
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
	);
};

export default ClientList;
