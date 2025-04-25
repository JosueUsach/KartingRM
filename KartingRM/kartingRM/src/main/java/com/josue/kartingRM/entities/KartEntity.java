package com.josue.kartingRM.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "kart") // Todo: cannot resolve table???
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KartEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(unique = true, nullable = false)
	private Long id;

	private String model;
	private boolean available; // Either being used in a reservation or being maintained

	@ManyToMany(mappedBy = "kartList")
	private Set<ReservationEntity> reservationList = new HashSet<>();
}
