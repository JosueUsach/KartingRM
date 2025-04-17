import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Costs from './components/Costs';
import MakeReservation from './components/MakeReservation';
import Rack from './components/Rack';

function App() {
	return (
		<Router>
			<Navbar />
			<main>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/Costs" element={<Costs />} />
				<Route path="/MakeReservation" element={<MakeReservation />} />
				<Route path="/Rack" element={<Rack />} />
			</Routes>
			</main>
		</Router>
	);
}

export default App;
