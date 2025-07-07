package com.josue.kartingrm.controllers;

import com.josue.kartingrm.entities.KartEntity;
import com.josue.kartingrm.services.KartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kart")
@CrossOrigin(origins = "http://localhost:5173/")
public class KartController {
	final
	KartService kartService;

	public KartController(KartService kartService) {
		this.kartService = kartService;
	}

	@GetMapping("/")
	public ResponseEntity<List<KartEntity>> listKarts() {
		List<KartEntity> karts = kartService.getAllKarts();
		return ResponseEntity.ok(karts);
	}
}
