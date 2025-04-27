import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Costs from "./components/Costs";
import MakeReservation from "./components/MakeReservation";
import RegisterClient from "./components/RegisterClient";
import Rack from "./components/Rack";
import ClientList from "./components/ClientList";

function App() {
	return (
		<Router>
			<Navbar />
			<main>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/Costs" element={<Costs />} />
					<Route path="/MakeReservation" element={<MakeReservation />} />
					<Route path="/RegisterClient" element={<RegisterClient />} />
					<Route path="/ClientList" element={<ClientList />} />
					<Route path="/Rack" element={<Rack />} />
				</Routes>
			</main>
		</Router>
	);
}

export default App;
