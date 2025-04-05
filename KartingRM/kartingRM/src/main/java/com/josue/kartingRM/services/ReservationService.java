package com.josue.kartingRM.services;

import com.josue.kartingRM.entities.ReservationEntity;
import com.josue.kartingRM.repositories.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class ReservationService {
	@Autowired
	private ReservationRepository reservationRepository;

	// Input: A reservation object
	// Description: Adds the inputted reservation to the DB
	// Output: A saved reservation
	public ReservationEntity createReservation(ReservationEntity reservation) {
		return reservationRepository.save(reservation);
	}

	// Description: Finds all reservations and puts them in an array
	// Output: An array of reservations
	public ArrayList<ReservationEntity> getAllReservations() {
		return (ArrayList<ReservationEntity>) reservationRepository.findAll();
	}

}