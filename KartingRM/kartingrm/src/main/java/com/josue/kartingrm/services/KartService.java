package com.josue.kartingrm.services;

import com.josue.kartingrm.entities.KartEntity;
import com.josue.kartingrm.repositories.KartRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KartService {
	private final KartRepository kartRepository;

	public KartService(KartRepository kartRepository) {
		this.kartRepository = kartRepository;
	}

	// Description: Finds all clients and puts them in an array
	// Output: An array of clients
	public List<KartEntity> getAllKarts() {
		return kartRepository.findAll();
	}
}
