package com.josue.kartingRM.controllers;

import com.josue.kartingRM.entities.ReceiptEntity;
import com.josue.kartingRM.repositories.ReceiptRepository;
import com.josue.kartingRM.services.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

	@GetMapping("/search")
	public ResponseEntity<ReceiptEntity> getReservationByRutAndReservationId(
			@RequestParam String clientRut,
			@RequestParam Long reservationId) {
		ReceiptEntity receipt = receiptService.findByRutAndReservationId(clientRut, reservationId);
		if (receipt != null) {
			return ResponseEntity.ok(receipt);
		}
		return ResponseEntity.notFound().build();
	}

	@PostMapping("/")
	public ResponseEntity<ReceiptEntity> createReceipt(@RequestBody ReceiptEntity receipt) {
		ReceiptEntity newReceipt = receiptService.createReceipt(receipt);
		return ResponseEntity.ok(newReceipt);
	}

	@GetMapping("/lapReport")
	public ResponseEntity<List<Map<String, Object>>> generateSummaryReport() {
		List<Map<String, Object>> report = receiptService.generateSummaryReport();
		return ResponseEntity.ok(report);
	}

	@GetMapping("/groupReport")
	public ResponseEntity<List<Map<String, Object>>> generateGroupReport() {
		List<Map<String, Object>> report = receiptService.generateRiderGroupReport();
		return ResponseEntity.ok(report);
	}

}
