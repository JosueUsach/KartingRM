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

	private String clientRut;
	private String clientName;
	private String clientEmail;
	private double initialCost;
	private double groupDiscount;
	int monthlyVisits;
	private double frequentClientDiscount;
	boolean birthdayCheck;
	private double birthdayDiscount;
	boolean holidayCheck;
	private double holidayDiscount;
	private double totalCost;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "reservation_id")
	private ReservationEntity reservation;
}
