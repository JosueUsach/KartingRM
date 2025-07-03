package com.josue.kartingRM.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "kart")
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
	private boolean available;
}
