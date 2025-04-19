import React, { useEffect, useState } from "react";
import kartService from "../services/kart.service";

const Rack = () => {
	const [karts, setKarts] = useState([]);

	useEffect(() => {
		kartService
			.getAll()
			.then((response) => {
				setKarts(response.data);
			})
			.catch((error) => {
				console.error("Error fetching karts:", error);
			});
	}, []);

	return (
		<div>
			<h2>Kart List</h2>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Model</th>
						<th>Available</th>
					</tr>
				</thead>
				<tbody>
					{karts.map((kart) => (
						<tr key={kart.id}>
							<td>{kart.id}</td>
							<td>{kart.model}</td>
							<td>{kart.available ? "Yes" : "No"}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Rack;
