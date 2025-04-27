package com.josue.kartingRM.services;

import com.josue.kartingRM.entities.ClientEntity;
import com.josue.kartingRM.entities.ReceiptEntity;
import com.josue.kartingRM.entities.ReservationEntity;
import com.josue.kartingRM.repositories.ClientRepository;
import com.josue.kartingRM.repositories.ReceiptRepository;
import com.josue.kartingRM.repositories.ReservationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class ReceiptService {
	@Autowired
	private ReceiptRepository receiptRepository;
	@Autowired
	private ClientRepository clientRepository;
	@Autowired
	private ReservationRepository reservationRepository;

	// Input: A client, a reservation and checks for discounts
	// Description: This method runs for every client on a reservation, it also takes data from the reservation and applies discounts for every needed check
	// Output: A receipt in the database with all costs and discounts
	public ReceiptEntity createReceipt(ReceiptEntity receipt) {
		ClientEntity client = clientRepository.findByClientRut(receipt.getClientRut())
				.orElseThrow(() -> new RuntimeException("Client not found"));
		String clientName = client.getClientName();
		String clientEmail = client.getClientEmail();

		ReservationEntity reservation = reservationRepository.findById(receipt.getReservation().getId())
				.orElseThrow(() -> new RuntimeException("Reservation not found"));
		// Initial cost depends on the number of laps / max time
		double initialCost = 0;
		int reservationType = reservation.getReservationType();
		if (reservationType == 0)		// 0. 10 laps or 10 min
			initialCost = 15000;
		else if (reservationType == 1)	// 1. 15 laps or 15 min
			initialCost = 20000;
		else if (reservationType == 2)	// 2. 20 laps or 20 min
			initialCost = 25000;
		System.out.println("initial cost: " + initialCost + "");

		// Group discount calculation
		double groupDiscount = 0;
		int riderAmount = reservation.getRiderAmount();
		if (riderAmount >= 3 && riderAmount <= 5)
			groupDiscount = 0.1; // 10% off
		else if (riderAmount >= 6 && riderAmount <= 10)
			groupDiscount = 0.2; // 20% off
		else if (riderAmount >= 11 && riderAmount <= 15)
			groupDiscount = 0.3; // 30% off
		System.out.println("group discount: " + groupDiscount + "");

		// Frequency discount calculation
		int monthlyVisits = receipt.getMonthlyVisits();
		double frequentClientDiscount = 0;
		if (monthlyVisits >=2 && monthlyVisits <=4)
			frequentClientDiscount = 0.1; // 10% off
		else if (monthlyVisits >= 5 && monthlyVisits <=6)
			frequentClientDiscount = 0.2; // 20% off
		else if (monthlyVisits >= 7)
			frequentClientDiscount = 0.3; // 30% off
		System.out.println("frequent client discount: " + frequentClientDiscount + "");

		// Birthday discount calculation
		System.out.println("isBirthday: " + receipt.isBirthdayCheck() + "");
		double birthdayDiscount = 0;
		if (receipt.isBirthdayCheck())
			birthdayDiscount = 0.5; // 50% off
		System.out.println("birthday discount: " + birthdayDiscount + "");

		// Holiday discount calculation
		System.out.println("isHoliday: " + receipt.isHolidayCheck() + "");
		double holidayDiscount = 0;
		if (receipt.isHolidayCheck())
			holidayDiscount = 0.1; // 10% off
		System.out.println("holiday discount: " + holidayDiscount + "");

		//double totalCost = initialCost * groupDiscount * frequentClientDiscount * birthdayDiscount * holidayDiscount;
		double totalCost = ( initialCost - (
				initialCost * groupDiscount +
				initialCost * frequentClientDiscount +
				initialCost * birthdayDiscount +
				initialCost * holidayDiscount));

		// Updating every discount to reflect how much it subtracted from the initial cost
		groupDiscount = -(initialCost * groupDiscount);
		frequentClientDiscount = -(initialCost * frequentClientDiscount);
		birthdayDiscount = -(initialCost * birthdayDiscount);
		holidayDiscount = -(initialCost * holidayDiscount);

		//ReceiptEntity newReceipt = new ReceiptEntity();
		//receipt.setClientRut(receipt.getClientRut());
		receipt.setClientName(clientName);
		receipt.setClientEmail(clientEmail);
		receipt.setInitialCost(initialCost);
		receipt.setGroupDiscount(groupDiscount);
		receipt.setFrequentClientDiscount(frequentClientDiscount);
		receipt.setBirthdayDiscount(birthdayDiscount);
		receipt.setHolidayDiscount(holidayDiscount);
		receipt.setTotalCost(totalCost);
		receipt.setReservation(reservation);

		receipt.setReservation(reservation);
		reservation.getReceipts().add(receipt);

		return receiptRepository.save(receipt);
	}
}