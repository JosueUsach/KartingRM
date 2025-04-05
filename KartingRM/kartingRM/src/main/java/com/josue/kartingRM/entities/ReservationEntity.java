package com.josue.kartingRM.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reservation")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class ReservationEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true, nullable = false)
	private Long id;

	private LocalDateTime startTime;
	private LocalDateTime endTime;
	private int reservationType;	// 0. 10 laps or 10 min / 1. 15 laps or 15 min / 2. 20 laps or 20 min
	private int riderAmount;
	private String mainClientName;

	@OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "receipt_id", referencedColumnName = "id")
	private ReceiptEntity receipt;

	@ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
	@JoinTable(
			name = "client_reservation",
			joinColumns = @JoinColumn(name = "reservation_id"),
			inverseJoinColumns = @JoinColumn(name = "client_id")
	)
	private List<ClientEntity> clientList = new ArrayList<>();


	@ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
	@JoinTable(
			name = "kart_reservation",
			joinColumns = @JoinColumn(name = "reservation_id"),
			inverseJoinColumns = @JoinColumn(name = "kart_id")
	)
	private List<KartEntity> kartList = new ArrayList<>();


}