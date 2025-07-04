/*package com.josue.kartingRM.services;

import com.josue.kartingRM.entities.ClientEntity;
import com.josue.kartingRM.entities.KartEntity;
import com.josue.kartingRM.entities.ReservationEntity;
import com.josue.kartingRM.repositories.ClientRepository;
import com.josue.kartingRM.repositories.KartRepository;
import com.josue.kartingRM.repositories.ReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private ReservationService reservationService;

    private ReservationEntity testReservation;
    private ClientEntity testClient;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup test client
        testClient = new ClientEntity();
        testClient.setId(1L);
        testClient.setClientRut("12.345.678-9");
        testClient.setClientName("Test Client");

        // Setup test reservation
        testReservation = new ReservationEntity();
        testReservation.setId(1L);
        testReservation.setMainClientRut("12.345.678-9");
        testReservation.setStartTime(LocalDateTime.now());
        testReservation.setEndTime(LocalDateTime.now().plusHours(1));
        testReservation.setRiderAmount(2);
        testReservation.setClientRuts(new ArrayList<>());
        testReservation.getClientRuts().add("12.345.678-9");
        testReservation.setClientList(new HashSet<>());
        testReservation.setKartList(new HashSet<>());
    }

    @Test
    void whenCreateReservation_thenReservationIsSaved() {
        // Given
        when(clientRepository.findByClientRut(testClient.getClientRut()))
                .thenReturn(Optional.of(testClient));
        when(reservationRepository.save(any(ReservationEntity.class)))
                .thenReturn(testReservation);

        // When
        ReservationEntity savedReservation = reservationService.createReservation(testReservation);

        // Then
        assertThat(savedReservation).isNotNull();
        assertThat(savedReservation.getMainClientRut()).isEqualTo(testReservation.getMainClientRut());
        assertThat(savedReservation.getClientList()).hasSize(1);
    }

    @Test
    void whenCreateReservationWithInvalidClient_thenThrowException() {
        // Given
        when(clientRepository.findByClientRut(testClient.getClientRut()))
                .thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> reservationService.createReservation(testReservation))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Client with RUT");
    }

    @Test
    void whenGetAllReservations_thenReturnReservationsList() {
        // Given
        ArrayList<ReservationEntity> reservationList = new ArrayList<>();
        reservationList.add(testReservation);
        when(reservationRepository.findAll()).thenReturn(reservationList);

        // When
        ArrayList<ReservationEntity> result = reservationService.getAllReservations();

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getMainClientRut()).isEqualTo(testReservation.getMainClientRut());
    }
}*/