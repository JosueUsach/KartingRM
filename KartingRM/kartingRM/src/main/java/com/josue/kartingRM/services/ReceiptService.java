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

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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

		// Group discount calculation
		double groupDiscount = 0;
		int riderAmount = reservation.getRiderAmount();
		if (riderAmount >= 3 && riderAmount <= 5)
			groupDiscount = 0.1; // 10% off
		else if (riderAmount >= 6 && riderAmount <= 10)
			groupDiscount = 0.2; // 20% off
		else if (riderAmount >= 11 && riderAmount <= 15)
			groupDiscount = 0.3; // 30% off

		// Frequency discount calculation
		int monthlyVisits = receipt.getMonthlyVisits();
		double frequentClientDiscount = 0;
		if (monthlyVisits >=2 && monthlyVisits <=4)
			frequentClientDiscount = 0.1; // 10% off
		else if (monthlyVisits >= 5 && monthlyVisits <=6)
			frequentClientDiscount = 0.2; // 20% off
		else if (monthlyVisits >= 7)
			frequentClientDiscount = 0.3; // 30% off

		// Birthday discount calculation
		double birthdayDiscount = 0;
		if (receipt.isBirthdayCheck())
			birthdayDiscount = 0.5; // 50% off

		// Holiday discount calculation
		double holidayDiscount = 0;
		if (receipt.isHolidayCheck())
			holidayDiscount = 0.1; // 10% off

		// Updating every discount to reflect how much it subtracted from the initial cost
		groupDiscount = -(initialCost * groupDiscount);
		frequentClientDiscount = -(initialCost * frequentClientDiscount);
		birthdayDiscount = -(initialCost * birthdayDiscount);
		holidayDiscount = -(initialCost * holidayDiscount);

		// Calculating the total cost by subtracting the discount amounts from the initial cost
		double totalCost = initialCost + groupDiscount + frequentClientDiscount + birthdayDiscount + holidayDiscount;
		if (totalCost < 0)
			totalCost = 0;

		// Adding all the necessary data to the receipt
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

	// Description: Uses an SQL query to get a sales report, grouped by reservation type
	// Output: A list of maps with the report data
	public List<Map<String, Object>> generateSummaryReport() {
		List<Object[]> results = receiptRepository.getReservationSummaryReport();

		List<Map<String, Object>> report = new ArrayList<>();

		for (Object[] row : results) {
			Map<String, Object> rowMap = new LinkedHashMap<>();
			rowMap.put("Número de vueltas o tiempo máximo permitido", row[0]);
			rowMap.put("Cantidad de reservas", row[1]);
			rowMap.put("Suma inicial", row[2]);
			rowMap.put("Descuento cumpleaños", row[3]);
			rowMap.put("Descuento cliente frecuente", row[4]);
			rowMap.put("Descuento festivo", row[5]);
			rowMap.put("Total", row[6]);
			report.add(rowMap);
		}

		return report;
	}

	// Description: Uses an SQL query to get a sales report, grouped by rider amount
	// Output: A list of maps with the report data
	public List<Map<String, Object>> generateRiderGroupReport() {
		List<Object[]> results = receiptRepository.getRiderGroupSizeReport();

		List<Map<String, Object>> report = new ArrayList<>();

		for (Object[] row : results) {
			Map<String, Object> rowMap = new LinkedHashMap<>();
			rowMap.put("Tamaño del grupo", row[0]);
			rowMap.put("Cantidad de reservas", row[1]);
			rowMap.put("Suma inicial", row[2]);
			rowMap.put("Descuento cumpleaños", row[3]);
			rowMap.put("Descuento cliente frecuente", row[4]);
			rowMap.put("Descuento festivo", row[5]);
			rowMap.put("Descuento por grupo", row[6]);
			rowMap.put("Total", row[7]);
			report.add(rowMap);
		}

		return report;
	}
}