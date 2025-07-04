package com.josue.kartingrm.services;

import com.josue.kartingrm.entities.ReservationEntity;
import com.josue.kartingrm.repositories.ClientRepository;
import com.josue.kartingrm.repositories.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@Transactional
public class ReservationService {
	@Autowired
	private ReservationRepository reservationRepository;
	@Autowired
	private ClientRepository clientRepository;
    @Autowired
    private ReceiptService receiptService;

	// Input: A reservation object
	// Description: Adds the inputted reservation to the DB and links all clients to it
	// Output: A saved reservation
	public ReservationEntity createReservation(ReservationEntity reservation) {
		for (String rut : reservation.getClientRuts()) {
			clientRepository.findByClientRut(rut)
					.orElseThrow(() -> new RuntimeException("Client with RUT " + rut + " not found"));
		}

		return reservationRepository.save(reservation);
	}

	// Description: Finds all reservations and puts them in an array
	// Output: An array of reservations
	public ArrayList<ReservationEntity> getAllReservations() {
		return (ArrayList<ReservationEntity>) reservationRepository.findAll();
	}

	// Input: An ID
	// Description: Finds the reservation with the corresponding ID
	// Output: The correct reservation
	public ReservationEntity findReservationById(Long id) {
		return reservationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Reservation with ID " + id + " not found"));
	}

    public void deleteReservation(Long reservationId) {
        // First delete all associated receipts
        receiptService.deleteReceiptByReservationId(reservationId);
        
        // Then delete the reservation
        reservationRepository.deleteById(reservationId);
    }
}