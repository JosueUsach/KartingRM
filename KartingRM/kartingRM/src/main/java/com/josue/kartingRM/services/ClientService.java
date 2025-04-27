package com.josue.kartingRM.services;

import com.josue.kartingRM.entities.ClientEntity;
import com.josue.kartingRM.entities.ReservationEntity;
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
		if ((clientRepository.existsByClientEmail(newClient.getClientEmail())) || (clientRepository.existsByClientRut(newClient.getClientRut()))) {
			System.out.printf("Client %s already exists\n", newClient.getClientRut());
			return null;
		}
		else
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

	// Input: A Client entity
	// Description: Changes the desired parameters
	// Output: A modified Client
	//Todo: fix updateClient
	public ClientEntity updateClient(ClientEntity client) {
		return clientRepository.save(client);
	}

	// Input: A client's ID
	// Description: Removes the client from all reservations and then deletes the client
	// Output: A boolean for if the removal works
	public boolean deleteClient(Long id) throws Exception {
		try {
			ClientEntity client = clientRepository.findById(id)
					.orElseThrow(() -> new Exception("Client not found"));

			for (ReservationEntity reservation : client.getReservationList()) {
				reservation.getClientList().remove(client);
				if (reservation.getMainClientRut().equals(client.getClientRut())) {
					reservation.setMainClientRut(null);
				}
				reservation.getClientRuts().remove(client.getClientRut());
			}

			client.getReservationList().clear();

			clientRepository.deleteById(id);
			return true;

		} catch (Exception e) {
			throw new Exception("Error deleting client");
		}
	}
}