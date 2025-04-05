package com.josue.kartingRM.controllers;

import com.josue.kartingRM.entities.ClientEntity;
import com.josue.kartingRM.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client")
@CrossOrigin(origins = "*")
public class ClientController {
	@Autowired
	ClientService clientService;

	@GetMapping("/")
	public ResponseEntity<List<ClientEntity>> listClients() {
		List<ClientEntity> clients = clientService.getAllClients();
		return ResponseEntity.ok(clients);
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
