package com.josue.kartingRM.controllers;

import com.josue.kartingRM.entities.ReceiptEntity;
import com.josue.kartingRM.repositories.ReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/receipt")
@CrossOrigin(origins = "*")
public class ReceiptController {
	@Autowired
	ReceiptRepository receiptRepository;

	// Todo: Finish, Mr. G has a start
	@PostMapping("/")
	public ResponseEntity<ReceiptEntity> createRecipt() {}
}
