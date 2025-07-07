package com.josue.kartingrm.controllers;

import com.josue.kartingrm.entities.ClientEntity;
import com.josue.kartingrm.services.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client")
@CrossOrigin(origins = "http://localhost:5173/")
public class ClientController {
	final
	ClientService clientService;

	public ClientController(ClientService clientService) {
		this.clientService = clientService;
	}

	@GetMapping("/")
	public ResponseEntity<List<ClientEntity>> listClients() {
		List<ClientEntity> clients = clientService.getAllClients();
		return ResponseEntity.ok(clients);
	}

	@PutMapping("/")
	public ResponseEntity<ClientEntity> updateClient(@RequestBody ClientEntity client) {
		ClientEntity updatedClient = clientService.updateClient(client);
		return ResponseEntity.ok(updatedClient);
	}

	@DeleteMapping("/{id}")
	public void deleteClient(@PathVariable Long id) {
		clientService.deleteClient(id);
	}

	@PostMapping("/")
	public ResponseEntity<ClientEntity> registerClient(@RequestBody ClientEntity client) {
		ClientEntity newClient = clientService.registerClient(client);
		return ResponseEntity.ok(newClient);
	}

	@GetMapping("/{email}")
	public ResponseEntity<ClientEntity> findClientByEmail(@PathVariable String email) {
		ClientEntity client = clientService.getClientByClientEmail(email);
		return ResponseEntity.ok(client);
	}
}
