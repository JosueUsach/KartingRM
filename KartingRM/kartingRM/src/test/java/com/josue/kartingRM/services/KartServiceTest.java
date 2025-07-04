/*package com.josue.kartingRM.services;

import com.josue.kartingRM.entities.KartEntity;
import com.josue.kartingRM.repositories.KartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

class KartServiceTest {

    @Mock
    private KartRepository kartRepository;

    @InjectMocks
    private KartService kartService;

    private KartEntity testKart;
    private List<KartEntity> kartList;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Setup test kart
        testKart = new KartEntity();
        testKart.setId(1L);
        testKart.setModel("Test Model");
        testKart.setAvailable(true);
        testKart.setReservationList(new HashSet<>());
        
        // Setup kart list
        kartList = new ArrayList<>();
        kartList.add(testKart);
        
        // Add a second kart to the list
        KartEntity testKart2 = new KartEntity();
        testKart2.setId(2L);
        testKart2.setModel("Advanced Model");
        testKart2.setAvailable(false);
        testKart2.setReservationList(new HashSet<>());
        kartList.add(testKart2);
    }

    @Test
    void whenGetAllKarts_thenReturnKartsList() {
        // Given
        when(kartRepository.findAll()).thenReturn(kartList);

        // When
        List<KartEntity> result = kartService.getAllKarts();

        // Then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getModel()).isEqualTo("Test Model");
        assertThat(result.get(0).isAvailable()).isTrue();
        assertThat(result.get(1).getModel()).isEqualTo("Advanced Model");
        assertThat(result.get(1).isAvailable()).isFalse();
    }

    @Test
    void whenGetAllKarts_withEmptyRepository_thenReturnEmptyList() {
        // Given
        when(kartRepository.findAll()).thenReturn(new ArrayList<>());

        // When
        List<KartEntity> result = kartService.getAllKarts();

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEmpty();
    }
}*/