import React, { useEffect, useState } from "react";
import receiptService from "../services/receipt.service";

const Reports = () => {
	const [lapReportData, setLapReportData] = useState([]);
	const [groupReportData, setGroupReportData] = useState([]);

	useEffect(() => {
		// Fetch the lap report data
		receiptService
			.getLapReports()
			.then((response) => {
				const sortedData = response.data.sort((a, b) => {
					const valueA = parseInt(
						a["Número de vueltas o tiempo máximo permitido"]
					);
					const valueB = parseInt(
						b["Número de vueltas o tiempo máximo permitido"]
					);
					return valueA - valueB;
				});
				setLapReportData(sortedData);
			})
			.catch((error) => {
				console.error("Error fetching lap report data:", error);
				alert("Hubo un error al cargar los reportes de vueltas.");
			});

		// Fetch the group report data
		receiptService
			.getGroupReports()
			.then((response) => {
				setGroupReportData(response.data);
			})
			.catch((error) => {
				console.error("Error fetching group report data:", error);
				alert("Hubo un error al cargar los reportes de grupos.");
			});
	}, []);

	// Function to format numbers with $ and thousands separators
	const formatCurrency = (value) => {
		if (typeof value !== "number") return value;
		return new Intl.NumberFormat("es-CL", {
			style: "currency",
			currency: "CLP",
			minimumFractionDigits: 0,
		}).format(value);
	};

	return (
		<div style={{ padding: "2rem" }}>
			<h2 style={{ fontSize: "2.2rem" }}>Reportes</h2>

			{/* Lap Report Table */}
			<div
				style={{ margin: "40px auto", maxWidth: "1000px", overflowX: "auto" }}
			>
				<h3 style={{ textAlign: "center", color: "#f0f0f0" }}>
					Reporte de Vueltas
				</h3>
				<table
					style={{
						width: "100%",
						borderCollapse: "collapse",
						boxShadow: "0 2px 15px rgba(0, 0, 0, 0.1)",
						borderRadius: "8px",
						overflow: "hidden",
					}}
				>
					<thead>
						<tr style={{ backgroundColor: "#d03434", color: "white" }}>
							<th style={{ padding: "15px", textAlign: "center" }}>
								Número de vueltas o tiempo máximo permitido
							</th>
							<th style={{ padding: "15px", textAlign: "center" }}>
								Suma inicial
							</th>
							<th style={{ padding: "15px", textAlign: "center" }}>
								Descuento cumpleaños
							</th>
							<th style={{ padding: "15px", textAlign: "center" }}>
								Descuento cliente frecuente
							</th>
							<th style={{ padding: "15px", textAlign: "center" }}>
								Descuento festivo
							</th>
							<th style={{ padding: "15px", textAlign: "center" }}>Total</th>
						</tr>
					</thead>
					<tbody style={{ color: "black" }}>
						{lapReportData.map((row, index) => (
							<tr
								key={index}
								style={{
									backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
									textAlign: "center",
								}}
							>
								<td style={{ padding: "15px" }}>
									{row["Número de vueltas o tiempo máximo permitido"]}
								</td>
								<td style={{ padding: "15px" }}>
									{formatCurrency(row["Suma inicial"])}
								</td>
								<td style={{ padding: "15px" }}>
									{formatCurrency(row["Descuento cumpleaños"])}
								</td>
								<td style={{ padding: "15px" }}>
									{formatCurrency(row["Descuento cliente frecuente"])}
								</td>
								<td style={{ padding: "15px" }}>
									{formatCurrency(row["Descuento festivo"])}
								</td>
								<td style={{ padding: "15px" }}>
									{formatCurrency(row["Total"])}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Group Report Table */}
			<div
				style={{ margin: "40px auto", maxWidth: "1000px", overflowX: "auto" }}
			>
				<h3 style={{ textAlign: "center", color: "#f0f0f0" }}>
					Reporte de Tamaño de Grupos
				</h3>
				<table
					style={{
						width: "100%",
						borderCollapse: "collapse",
						boxShadow: "0 2px 15px rgba(0, 0, 0, 0.1)",
						borderRadius: "8px",
						overflow: "hidden",
					}}
				>
					<thead>
						<tr style={{ backgroundColor: "#d03434", color: "white" }}>
							<th style={{ padding: "15px", textAlign: "center" }}>
								Tamaño de Grupo
							</th>
							<th style={{ padding: "15px", textAlign: "center" }}>
								Suma Inicial
							</th>
							<th style={{ padding: "15px", textAlign: "center" }}>
								Descuento Cumpleaños
							</th>
							<th style={{ padding: "15px", textAlign: "center" }}>
								Descuento Cliente Frecuente
							</th>
							<th style={{ padding: "15px", textAlign: "center" }}>
								Descuento Festivo
							</th>
							<th style={{ padding: "15px", textAlign: "center" }}>
								Descuento por Grupo
							</th>
							<th style={{ padding: "15px", textAlign: "center" }}>Total</th>
						</tr>
					</thead>
					<tbody style={{ color: "black" }}>
						{groupReportData.map((row, index) => (
							<tr
								key={index}
								style={{
									backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
									textAlign: "center",
								}}
							>
								<td style={{ padding: "15px" }}>{row["Tamaño del grupo"]}</td>
								<td style={{ padding: "15px" }}>
									{formatCurrency(row["Suma inicial"])}
								</td>
								<td style={{ padding: "15px" }}>
									{formatCurrency(row["Descuento cumpleaños"])}
								</td>
								<td style={{ padding: "15px" }}>
									{formatCurrency(row["Descuento cliente frecuente"])}
								</td>
								<td style={{ padding: "15px" }}>
									{formatCurrency(row["Descuento festivo"])}
								</td>
								<td style={{ padding: "15px" }}>
									{formatCurrency(row["Descuento por grupo"])}
								</td>
								<td style={{ padding: "15px" }}>
									{formatCurrency(row["Total"])}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Reports;
