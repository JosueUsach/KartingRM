package com.josue.kartingRM.services;

import com.josue.kartingRM.entities.KartEntity;
import com.josue.kartingRM.repositories.KartRepository;
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
