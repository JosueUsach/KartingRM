package com.josue.kartingRM.services;

import com.josue.kartingRM.entities.ClientEntity;
import com.josue.kartingRM.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {
	@Autowired
	private ClientRepository clientRepository;
	
	// Input: A client object
	// Description: Adds the inputted client to the DB
	// Output: A registered user
	public ClientEntity registerClient(ClientEntity newClient) {
		return clientRepository.save(newClient);
	}

	// Description: Finds all clients and puts them in an array
	// Output: An array of clients
	public List<ClientEntity> getAllClients() {
		return (List<ClientEntity>) clientRepository.findAll();
	}

	// Input: An email
	// Description: Compares the input to emails on the database, then returns the client with a matching email
	// Output: A client
	public ClientEntity getClientByClientEmail(String clientEmail) {
		return clientRepository.findByClientEmail(clientEmail);
	}
}