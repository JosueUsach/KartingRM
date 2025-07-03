import Beams from "./Beams.jsx"; // Adjust the import path as necessary

const Home = () => {
	return (
		<div
			style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh" }}
		>
			{/* Background Beams component */}
			<div
				style={{
					position: "absolute",
					top: 48,
					left: 0,
					width: "100%",
					height: "100%",
					zIndex: -1, // Places it behind other content
				}}
			>
				<Beams
					beamWidth={2.6}
					beamHeight={30}
					beamNumber={20}
					lightColor="#FF2F2F"
					speed={2}
					noiseIntensity={1.15}
					scale={0.18}
					rotation={41}
				/>
			</div>

			{/* Content */}
			<div
				style={{
					paddingTop: "300px",
					position: "relative",
					zIndex: 1,
					color: "white",
				}}
			>
				<h1>KartingRM</h1>
				<p>
					Esta pagina es para el uso exclusivo de los trabajadores de KartingRM,
					para apoyar en el proceso de generación de reservas.
				</p>
			</div>
		</div>
	);
};

export default Home;
