package com.josue.kartingRM.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "client")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class ClientEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true, nullable = false)
	private Long id;

	private String clientRut;
	private String clientName;
	private String clientEmail;
	private String clientPhone;
	private LocalDate clientBirthDate;

	@ManyToMany(mappedBy = "clientList")
	private Set<ReservationEntity> reservationList = new HashSet<>();
}
