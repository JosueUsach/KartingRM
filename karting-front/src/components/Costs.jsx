import React from "react";

const PricingCards = () => {
	const styles = {
		container: {
			display: "flex",
			justifyContent: "center",
			gap: "20px",
			padding: "20px",
			flexWrap: "wrap",
		},
		card: {
			border: "1px solid #e0e0e0",
			borderRadius: "8px",
			padding: "25px",
			width: "300px",
			boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
			backgroundColor: "white",
			transition: "transform 0.3s ease",
			":hover": {
				transform: "translateY(-5px)",
			},
		},
		title: {
			color: "#333",
			fontSize: "24px",
			marginBottom: "10px",
			textAlign: "center",
		},
		price: {
			fontSize: "50px",
			fontWeight: "bold",
			color: "#2c3e50",
			textAlign: "center",
			marginBottom: "1px",
		},
		perPerson: {
			color: "#7f8c8d",
			textAlign: "center",
			marginBottom: "15px",
			fontSize: "14px",
		},
		timeline: {
			color: "#3498db",
			textAlign: "center",
			marginBottom: "20px",
			fontWeight: "bold",
		},
		features: {
			listStyleType: "none",
			padding: "0",
			margin: "0",
		},
		featureItem: {
			padding: "8px 0",
			borderBottom: "1px solid #eee",
			color: "#555",
		},
		lastFeatureItem: {
			borderBottom: "none",
		},
		tableContainer: {
			margin: "40px auto",
			maxWidth: "600px",
			padding: "0 20px",
		},
		tableTitle: {
			textAlign: "center",
			fontSize: "24px",
			color: "white",
			marginBottom: "1px",
			fontWeight: "600",
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
		tableRow: {
			borderBottom: "1px solid #e0e0e0",
			":lastChild": {
				borderBottom: "none",
			},
		},
		tableCell: {
			color: "#333",
			padding: "15px",
			textAlign: "center",
			":firstChild": {
				fontWeight: "500",
			},
		},
		evenRow: {
			backgroundColor: "#f8f9fa",
		},
		oddRow: {
			backgroundColor: "white",
		},
	};

	// Pricing plans data
	const pricingPlans = [
		{
			title: "Opción 1",
			price: "$15.000",
			perPerson: "Por persona",
			features: ["10 vueltas", "Maximo de 10 minutos"],
		},
		{
			title: "Opción 2",
			price: "$20.000",
			perPerson: "Por persona",
			features: ["15 vueltas", "Maximo de 15 minutos"],
		},
		{
			title: "Opción 3",
			price: "$25.000",
			perPerson: "Por persona",
			features: ["20 vueltas", "Maximo de 20 minutos"],
		},
	];

	const discountData = [
		{ category: "1-2 personas", discount: "0%" },
		{ category: "3-5 personas", discount: "10%" },
		{ category: "6-10 personas", discount: "20%" },
		{ category: "11-15 personas", discount: "30%" },
	];

	const frequencyDiscountData = [
		{ category: "No frecuente", visits: "0 a 1 vez", discount: "0%" },
		{ category: "Regular", visits: "2 a 4 veces", discount: "10%" },
		{ category: "Frecuente", visits: "5 a 6 veces", discount: "20%" },
		{ category: "Muy frecuente", visits: "7 a MAS veces", discount: "30%" },
	];

	return (
		<div>
			{/* Pricing Cards Section */}
			<div style={styles.container}>
				{pricingPlans.map((plan, index) => (
					<div key={index} style={styles.card}>
						<h2 style={styles.title}>{plan.title}</h2>
						<div style={styles.price}>{plan.price}</div>
						<div style={styles.perPerson}>{plan.perPerson}</div>
						<div style={styles.timeline}>{plan.timeline}</div>
						<ul style={styles.features}>
							{plan.features.map((feature, i) => (
								<li
									key={i}
									style={
										i === plan.features.length - 1
											? { ...styles.featureItem, ...styles.lastFeatureItem }
											: styles.featureItem
									}
								>
									{feature}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			{/* Discount Table Section */}
			<div style={styles.tableContainer}>
				<h3 style={styles.tableTitle}>Descuentos por grupo</h3>
				<p style={styles.perPerson}>
					Se aplica un descuento si hay una cantidad suficiente de personas
				</p>
				<table style={styles.table}>
					<thead>
						<tr>
							<th style={styles.tableHeader}>Número de personas</th>
							<th style={styles.tableHeader}>Descuento aplicado</th>
						</tr>
					</thead>
					<tbody>
						{discountData.map((row, index) => (
							<tr
								key={index}
								style={{
									...styles.tableRow,
									...(index % 2 === 0 ? styles.evenRow : styles.oddRow),
								}}
							>
								<td style={{ ...styles.tableCell, fontWeight: "bold" }}>
									{row.category}
								</td>
								<td
									style={{
										...styles.tableCell,
										color: "#d03434",
										fontWeight: "bold",
									}}
								>
									{row.discount}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div style={styles.tableContainer}>
				<h3 style={styles.tableTitle}>Descuentos por frecuencia de cliente</h3>
				<p style={styles.perPerson}>
					Se aplica un descuento según la frecuencia de visitas (Aplicado a cada
					cliente individualmente)
				</p>
				<table style={styles.table}>
					<thead>
						<tr>
							<th style={styles.tableHeader}>Categoría de Cliente Frecuente</th>
							<th style={styles.tableHeader}>Número de visitas al mes</th>
							<th style={styles.tableHeader}>Descuento aplicado</th>
						</tr>
					</thead>
					<tbody>
						{frequencyDiscountData.map((row, index) => (
							<tr
								key={index}
								style={{
									...styles.tableRow,
									...(index % 2 === 0 ? styles.evenRow : styles.oddRow),
								}}
							>
								<td style={{ ...styles.tableCell, fontWeight: "bold" }}>
									{row.category}
								</td>
								<td style={styles.tableCell}>{row.visits}</td>
								<td
									style={{
										...styles.tableCell,
										color: "#d03434",
										fontWeight: "bold",
									}}
								>
									{row.discount}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PricingCards;
