package com.josue.kartingrm.services;

import com.josue.kartingrm.entities.ReservationEntity;
import com.josue.kartingrm.repositories.ClientRepository;
import com.josue.kartingrm.repositories.ReservationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional
public class ReservationService {
	private final ReservationRepository reservationRepository;
	private final ClientRepository clientRepository;
	private final ReceiptService receiptService;

	public ReservationService(ReservationRepository reservationRepository, ClientRepository clientRepository, ReceiptService receiptService) {
		this.reservationRepository = reservationRepository;
		this.clientRepository = clientRepository;
		this.receiptService = receiptService;
	}

	// Input: A reservation object
	// Description: Adds the inputted reservation to the DB and links all clients to it
	// Output: A saved reservation
	public ReservationEntity createReservation(ReservationEntity reservation) {
    // Check if all clients exist
    for (String rut : reservation.getClientRuts()) {
        clientRepository.findByClientRut(rut)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Client with RUT " + rut + " not found"
                ));
    }

    // Check for overlapping reservations
    List<ReservationEntity> overlappingReservations = reservationRepository
            .findOverlappingReservations(reservation.getStartTime(), reservation.getEndTime());

    // Replace the existing validation with this:
    if (!overlappingReservations.isEmpty()) {
        log.warn("Attempted to create overlapping reservation for time slot: {} to {}",
            reservation.getStartTime(),
            reservation.getEndTime());
		return null;
    }

    return reservationRepository.save(reservation);
}

	// Description: Finds all reservations and puts them in an array
	// Output: An array of reservations
	public List<ReservationEntity> getAllReservations() {
		return reservationRepository.findAll();
	}

	// Input: An ID
	// Description: Finds the reservation with the corresponding ID
	// Output: The correct reservation
	public ReservationEntity findReservationById(Long id) {
		return reservationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Reservation with ID " + id + " not found"));
	}

	public void deleteReservation(Long reservationId) {
		// First, delete all associated receipts
		receiptService.deleteReceiptByReservationId(reservationId);

		// Then delete the reservation
		reservationRepository.deleteById(reservationId);
    }
}