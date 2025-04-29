package com.josue.kartingRM.entities;

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
	private double initialCost;
	private double groupDiscount;
	private LocalDateTime date;
	private int monthlyVisits;
	private double frequentClientDiscount;
	private boolean birthdayCheck;
	private double birthdayDiscount;
	private boolean holidayCheck;
	private double holidayDiscount;
	private double totalCost;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "reservation_id")
	private ReservationEntity reservation;
}
