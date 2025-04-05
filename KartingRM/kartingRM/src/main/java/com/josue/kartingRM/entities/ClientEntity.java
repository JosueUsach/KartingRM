package com.josue.kartingRM.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "client")
@Data
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
	private List<ReservationEntity> reservationList = new ArrayList<>();
}
