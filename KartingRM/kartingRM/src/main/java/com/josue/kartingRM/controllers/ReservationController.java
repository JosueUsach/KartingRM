package com.josue.kartingRM.controllers;

import com.josue.kartingRM.entities.ReservationEntity;
import com.josue.kartingRM.services.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservation")
@CrossOrigin(origins = "*")
public class ReservationController {
	@Autowired
	ReservationService reservationService;

	@GetMapping("/")
	public ResponseEntity<List<ReservationEntity>> listReservations() {
		List<ReservationEntity> reservations = reservationService.getAllReservations();
		return ResponseEntity.ok(reservations);
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
		}).collect(Collectors.toList());
	}

}
