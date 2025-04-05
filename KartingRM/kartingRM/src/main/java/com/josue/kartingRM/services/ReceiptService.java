package com.josue.kartingRM.services;

import com.josue.kartingRM.entities.ClientEntity;
import com.josue.kartingRM.entities.ReceiptEntity;
import com.josue.kartingRM.entities.ReservationEntity;
import com.josue.kartingRM.repositories.ReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReceiptService {
	@Autowired
	private ReceiptRepository receiptRepository;

	// Input: A client, a reservation and checks for discounts
	// Description: This method runs for every client on a reservation, it also takes data from the reservation and applies discounts for every needed check
	// Output: A receipt in the database with all costs and discounts
	public ReceiptEntity createReceipt(ClientEntity client, ReservationEntity reservation, boolean isBirthday, int monthlyVisits, boolean isHoliday) {
		// Todo: Change input parameters to IDs
		String clientName = client.getClientName();
		String clientEmail = client.getClientEmail();

		// Initial cost depends on the amount of laps / max time
		double initialCost = 0;
		int reservationType = reservation.getReservationType();
		if (reservationType == 0)		// 0. 10 laps or 10 min
			initialCost = 15000;
		else if (reservationType == 1)	// 1. 15 laps or 15 min
			initialCost = 20000;
		else if (reservationType == 2)	// 2. 20 laps or 20 min
			initialCost = 25000;

		// Group discount calculation
		double groupDiscount = 0;
		int riderAmount = reservation.getRiderAmount();
		if (riderAmount >= 3 && riderAmount <= 5)
			groupDiscount = 0.9; // 10% off
		else if (riderAmount >= 6 && riderAmount <= 10)
			groupDiscount = 0.8; // 20% off
		else if (riderAmount >= 11 && riderAmount <= 15)
			groupDiscount = 0.7; // 30% off

		// Frequency discount calculation
		double frequentClientDiscount = 0;
		if (monthlyVisits >=2 && monthlyVisits <=4)
			frequentClientDiscount = 0.9; // 10% off
		else if (monthlyVisits >= 5 && monthlyVisits <=6)
			frequentClientDiscount = 0.8; // 20% off
		else if (monthlyVisits >= 7)
			frequentClientDiscount = 0.7; // 30% off

		// Birthday discount calculation
		double birthdayDiscount = 0;
		if (isBirthday)
			birthdayDiscount = 0.5; // 50% off

		double holidayDiscount = 0;
		if (isHoliday)
			holidayDiscount = 0.1; // 10% off

		double totalCost = initialCost * groupDiscount * frequentClientDiscount * birthdayDiscount * holidayDiscount;

		// Updating every discount to reflect how much it subtracted from the initial cost
		groupDiscount = initialCost - (initialCost * groupDiscount);
		frequentClientDiscount = initialCost - (initialCost * frequentClientDiscount);
		birthdayDiscount = initialCost - (initialCost * birthdayDiscount);
		holidayDiscount = initialCost - (initialCost * holidayDiscount);

		ReceiptEntity newReceipt = new ReceiptEntity();
		newReceipt.setClientName(clientName);
		newReceipt.setClientEmail(clientEmail);
		newReceipt.setInitialCost(initialCost);
		newReceipt.setGroupDiscount(groupDiscount);
		newReceipt.setFrequentClientDiscount(frequentClientDiscount);
		newReceipt.setBirthdayDiscount(birthdayDiscount);
		newReceipt.setHolidayDiscount(holidayDiscount);
		newReceipt.setTotalCost(totalCost);
		newReceipt.setReservation(reservation);

		return receiptRepository.save(newReceipt);
	}
}