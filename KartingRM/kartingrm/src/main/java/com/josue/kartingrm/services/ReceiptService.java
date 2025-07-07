package com.josue.kartingrm.services;

import com.josue.kartingrm.entities.ClientEntity;
import com.josue.kartingrm.entities.ReceiptEntity;
import com.josue.kartingrm.entities.ReservationEntity;
import com.josue.kartingrm.repositories.ClientRepository;
import com.josue.kartingrm.repositories.ReceiptRepository;
import com.josue.kartingrm.repositories.ReservationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class ReceiptService {
	private final ReceiptRepository receiptRepository;
	private final ClientRepository clientRepository;
	private final ReservationRepository reservationRepository;

	private static final Set<String> holidays = new HashSet<>();
	// Example holidays
	static {
		holidays.add("01-01"); // New year
		holidays.add("12-25"); // Christmas
		holidays.add("09-18"); // Fiestas patrias
	}

	public ReceiptService(ReceiptRepository receiptRepository, ClientRepository clientRepository, ReservationRepository reservationRepository) {
		this.receiptRepository = receiptRepository;
		this.clientRepository = clientRepository;
		this.reservationRepository = reservationRepository;
	}

	// Input: A client, a reservation and checks for discounts
	// Description: This method runs for every client on a reservation, it also takes data from the reservation and applies discounts for every needed check
	// Output: A receipt in the database with all costs and discounts
	public ReceiptEntity createReceipt(ReceiptEntity receipt) {
		ClientEntity client = clientRepository.findByClientRut(receipt.getClientRut())
				.orElseThrow(() -> new RuntimeException("Client not found"));

		ReservationEntity reservation = reservationRepository.findById(receipt.getReservationId())
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

		LocalDateTime date = reservation.getStartTime();
		double birthdayDiscount = 0.0;
		if (client.getClientBirthDate().getDayOfMonth() == date.getDayOfMonth()
				&& client.getClientBirthDate().getMonthValue() == date.getMonthValue())
			birthdayDiscount = 0.5; // 50% off

		// Holiday discount calculation
		double holidayDiscount = 0;
		DayOfWeek dayOfWeek = date.getDayOfWeek();
		String monthDay = String.format("%02d-%02d", date.getMonthValue(), date.getDayOfMonth());
		if  (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY || holidays.contains(monthDay))
			holidayDiscount = 0.1;

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
		String clientName = client.getClientName();
		String clientEmail = client.getClientEmail();
		receipt.setClientName(clientName);
		receipt.setClientEmail(clientEmail);
		receipt.setInitialCost(initialCost);
		receipt.setGroupDiscount(groupDiscount);
		receipt.setFrequentClientDiscount(frequentClientDiscount);
		receipt.setBirthdayDiscount(birthdayDiscount);
		receipt.setHolidayDiscount(holidayDiscount);
		receipt.setTotalCost(totalCost);

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

	// Input: A client's Rut and a reservation's ID
	// Description: Finds the receipt for the client in the reservation
	// Output: The correct receipt
	public ReceiptEntity findByRutAndReservationId(String clientRut, Long reservationId) {
		ReceiptEntity receipt = receiptRepository.findByClientRutAndReservationId(clientRut, reservationId);
		if (receipt != null)
			return receipt;
		else
			throw new RuntimeException("Receipt with client RUT " + clientRut + " and reservation ID " + reservationId + " not found");
	}

	// Input: A reservation ID
	// Description: Finds every receipt involved in that reservation and deletes it
    public void deleteReceiptByReservationId(Long reservationId) {
        List<ReceiptEntity> receipts = receiptRepository.findByReservationId(reservationId);
        receiptRepository.deleteAll(receipts);
    }
}