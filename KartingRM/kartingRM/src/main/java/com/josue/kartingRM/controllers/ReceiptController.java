package com.josue.kartingRM.controllers;

import com.josue.kartingRM.entities.ReceiptEntity;
import com.josue.kartingRM.repositories.ReceiptRepository;
import com.josue.kartingRM.services.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receipt")
@CrossOrigin(origins = "*")
public class ReceiptController {
	@Autowired
	ReceiptRepository receiptRepository;
	@Autowired
	private ReceiptService receiptService;

	@GetMapping("/")
	public ResponseEntity<List<ReceiptEntity>> listReceipts() {
		List<ReceiptEntity> receipts = receiptRepository.findAll();
		return ResponseEntity.ok(receipts);
	}

	@PostMapping("/")
	public ResponseEntity<ReceiptEntity> createReceipt(@RequestBody ReceiptEntity receipt) {
		System.out.println(receipt);
		ReceiptEntity newReceipt = receiptService.createReceipt(receipt);
		return ResponseEntity.ok(newReceipt);
	}
}
