package com.josue.kartingrm.services;

import com.josue.kartingrm.entities.ClientEntity;
import com.josue.kartingrm.repositories.ClientRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Slf4j
@Service
public class ClientService {
	private final ClientRepository clientRepository;

	public ClientService(ClientRepository clientRepository) {
		this.clientRepository = clientRepository;
	}

	// Input: A client object
	// Description: Adds the inputted client to the DB
	// Output: A registered user
	public ClientEntity registerClient(ClientEntity newClient) {
		if ((clientRepository.existsByClientEmail(newClient.getClientEmail())) || (clientRepository.existsByClientRut(newClient.getClientRut()))) {
			log.warn("Client with email {} or rut {} already exists", newClient.getClientEmail(), newClient.getClientRut());
			return null;
		}
		else
			return clientRepository.save(newClient);
	}

	// Description: Finds all clients and puts them in an array
	// Output: An array of clients
	public List<ClientEntity> getAllClients() {
		return clientRepository.findAll();
	}

	// Input: An email
	// Description: Compares the input to emails on the database, then returns the client with a matching email
	// Output: A client
	public ClientEntity getClientByClientEmail(String clientEmail) {
		return clientRepository.findByClientEmail(clientEmail);
	}

	// Input: A Client entity
	// Description: Changes the desired parameters
	// Output: A modified Client
	public ClientEntity updateClient(ClientEntity client) {
		return clientRepository.save(client);
	}

	// Input: A client's ID
	// Description: Removes the client from all reservations and then deletes the client
	// Output: A boolean for if the removal works
	public void deleteClient(Long id) {
    if (!clientRepository.existsById(id)) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found");
    }
    clientRepository.deleteById(id);
}
}