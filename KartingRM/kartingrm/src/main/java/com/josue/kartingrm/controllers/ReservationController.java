package com.josue.kartingrm.controllers;

import com.josue.kartingrm.entities.ReservationEntity;
import com.josue.kartingrm.services.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservation")
@CrossOrigin(origins = "http://localhost:5173/")
public class ReservationController {
	final
	ReservationService reservationService;

	public ReservationController(ReservationService reservationService) {
		this.reservationService = reservationService;
	}

	@GetMapping("/")
	public ResponseEntity<List<ReservationEntity>> listReservations() {
		List<ReservationEntity> reservations = reservationService.getAllReservations();
		return ResponseEntity.ok(reservations);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ReservationEntity> getReservationById(@PathVariable Long id) {
		ReservationEntity reservation = reservationService.findReservationById(id);
		return ResponseEntity.ok(reservation);
	}

	@PostMapping("/")
	public ResponseEntity<ReservationEntity> addReservation(@RequestBody ReservationEntity reservation) {
		ReservationEntity newReservation = reservationService.createReservation(reservation);
		return ResponseEntity.ok(newReservation);
	}

	@GetMapping("/calendar")
	public List<Map<String, Object>> getReservationsForCalendar() {
		List<ReservationEntity> reservations = reservationService.getAllReservations();

		return reservations.stream().map(res -> {
			Map<String, Object> event = new HashMap<>();
			event.put("id", res.getId());
			event.put("title", "Reserva de " + res.getMainClientRut());
			event.put("start", res.getStartTime());
			event.put("end", res.getEndTime());
			return event;
		}).toList();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
		try {
			reservationService.deleteReservation(id);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.notFound().build();
		}
	}
}