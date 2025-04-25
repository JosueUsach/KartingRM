package com.josue.kartingRM.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "reservation")
@Getter
@Setter
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
	private String mainClientRut;

	@ElementCollection
	@CollectionTable(name = "client_ruts")
	@Column(name = "clientRuts")
	private List<String> clientRuts = new ArrayList<>();

	@OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "receipt_id", referencedColumnName = "id")
	private ReceiptEntity receipt;

	@ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
	@JoinTable(
			name = "client_reservation",
			joinColumns = @JoinColumn(name = "reservation_id"),
			inverseJoinColumns = @JoinColumn(name = "client_id")
	)
	private Set<ClientEntity> clientList = new HashSet<>();


	@ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
	@JoinTable(
			name = "kart_reservation",
			joinColumns = @JoinColumn(name = "reservation_id"),
			inverseJoinColumns = @JoinColumn(name = "kart_id")
	)
	private Set<KartEntity> kartList = new HashSet<>();

}