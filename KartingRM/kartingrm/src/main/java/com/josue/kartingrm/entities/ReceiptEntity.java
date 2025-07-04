package com.josue.kartingrm.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

	private int monthlyVisits;
	private boolean birthdayCheck;

	private double initialCost;
	private double groupDiscount;
	private double frequentClientDiscount;
	private double birthdayDiscount;
	private double holidayDiscount;
	private double totalCost;

	private LocalDateTime date;

	private Long reservationId;
}
