package com.josue.kartingRM.services;

import com.josue.kartingRM.entities.ClientEntity;
import com.josue.kartingRM.entities.KartEntity;
import com.josue.kartingRM.entities.ReservationEntity;
import com.josue.kartingRM.repositories.ClientRepository;
import com.josue.kartingRM.repositories.KartRepository;
import com.josue.kartingRM.repositories.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReservationService {
	@Autowired
	private ReservationRepository reservationRepository;
	@Autowired
	private ClientRepository clientRepository;
	@Autowired
	private KartRepository kartRepository;

	// Input: A reservation object
	// Description: Adds the inputted reservation to the DB
	// Output: A saved reservation
	public ReservationEntity createReservation(ReservationEntity reservation) {
		// Link each client by RUT before saving the reservation
		for (String rut : reservation.getClientRuts()) {
			ClientEntity client = clientRepository.findByClientRut(rut)
					.orElseThrow(() -> new RuntimeException("Client with RUT " + rut + " not found"));

			// Link both sides
			reservation.getClientList().add(client);
		}

		for (int i = 1; i <= reservation.getRiderAmount(); i++) {
			KartEntity kart = kartRepository.findById((long) i)
					.orElseThrow(() -> new RuntimeException("Kart not found"));

			reservation.getKartList().add(kart);
		}

		// Now save the reservation with all clients linked
		return reservationRepository.save(reservation);
	}


	public void addClientToReservation(ClientEntity client, ReservationEntity reservation) {}

	// Description: Finds all reservations and puts them in an array
	// Output: An array of reservations
	public ArrayList<ReservationEntity> getAllReservations() {
		return (ArrayList<ReservationEntity>) reservationRepository.findAll();
	}

}