package com.josue.kartingRM.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "receipt")
@Getter
@Setter
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
