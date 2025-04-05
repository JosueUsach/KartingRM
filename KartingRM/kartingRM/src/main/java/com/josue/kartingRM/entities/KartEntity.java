package com.josue.kartingRM.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "kart") // Todo: cannot resolve table???
@Data
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
	private List<ReservationEntity> reservationList = new ArrayList<>();
}
