package com.josue.kartingrm.services;

import com.josue.kartingrm.entities.KartEntity;
import com.josue.kartingrm.repositories.KartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KartService {
	@Autowired
	private KartRepository kartRepository;

	// Description: Finds all clients and puts them in an array
	// Output: An array of clients
	public List<KartEntity> getAllKarts() {
		return kartRepository.findAll();
	}
}
