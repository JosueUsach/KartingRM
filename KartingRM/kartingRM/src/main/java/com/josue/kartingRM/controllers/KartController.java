package com.josue.kartingRM.controllers;

import com.josue.kartingRM.entities.KartEntity;
import com.josue.kartingRM.services.KartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kart")
@CrossOrigin(origins = "*")
public class KartController {
	@Autowired
	KartService kartService;

	@GetMapping("/")
	public ResponseEntity<List<KartEntity>> listKarts() {
		List<KartEntity> karts = kartService.getAllKarts();
		return ResponseEntity.ok(karts);
	}
}
