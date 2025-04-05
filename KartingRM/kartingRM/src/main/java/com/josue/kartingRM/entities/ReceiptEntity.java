package com.josue.kartingRM.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "receipt")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class ReceiptEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true, nullable = false)
	private Long id;

	private String clientName;
	private String clientEmail;
	private double initialCost;
	private double groupDiscount;
	private double frequentClientDiscount;
	private double birthdayDiscount;
	private double holidayDiscount;
	private double totalCost;

	@OneToOne(mappedBy = "receipt")
	private ReservationEntity Reservation;
}
