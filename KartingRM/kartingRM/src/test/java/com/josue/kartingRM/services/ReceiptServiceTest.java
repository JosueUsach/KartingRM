package com.josue.kartingRM.services;

import com.josue.kartingRM.entities.ClientEntity;
import com.josue.kartingRM.entities.ReceiptEntity;
import com.josue.kartingRM.entities.ReservationEntity;
import com.josue.kartingRM.repositories.ClientRepository;
import com.josue.kartingRM.repositories.ReceiptRepository;
import com.josue.kartingRM.repositories.ReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class ReceiptServiceTest {

    @Mock
    private ReceiptRepository receiptRepository;

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private ReceiptService receiptService;

    private ReceiptEntity testReceipt;
    private ClientEntity testClient;
    private ReservationEntity testReservation;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup test client
        testClient = new ClientEntity();
        testClient.setId(1L);
        testClient.setClientRut("12.345.678-9");
        testClient.setClientName("Test Client");
        testClient.setClientEmail("test@example.com");

        // Setup test reservation
        testReservation = new ReservationEntity();
        testReservation.setId(1L);
        testReservation.setReservationType(0); // 10 laps
        testReservation.setRiderAmount(3);
        testReservation.setStartTime(LocalDateTime.now());
        testReservation.setEndTime(LocalDateTime.now().plusHours(1));

        // Setup test receipt
        testReceipt = new ReceiptEntity();
        testReceipt.setId(1L);
        testReceipt.setClientRut("12.345.678-9");
        testReceipt.setMonthlyVisits(2);
        testReceipt.setBirthdayCheck(true);
        testReceipt.setHolidayCheck(true);
        testReceipt.setReservation(testReservation);
    }

    @Test
    void whenCreateReceipt_thenReceiptIsSavedWithCorrectCalculations() {
        // Given
        when(clientRepository.findByClientRut(testClient.getClientRut()))
                .thenReturn(Optional.of(testClient));
        when(reservationRepository.findById(testReservation.getId()))
                .thenReturn(Optional.of(testReservation));
        when(receiptRepository.save(any(ReceiptEntity.class)))
                .thenReturn(testReceipt);

        // When
        ReceiptEntity savedReceipt = receiptService.createReceipt(testReceipt);

        // Then
        assertThat(savedReceipt).isNotNull();
        assertThat(savedReceipt.getInitialCost()).isEqualTo(15000.0); // 10 laps cost
        assertThat(savedReceipt.getGroupDiscount()).isEqualTo(-1500.0); // 10% for 3-5 riders
        assertThat(savedReceipt.getFrequentClientDiscount()).isEqualTo(-1500.0); // 10% for 2-4 monthly visits
        assertThat(savedReceipt.getBirthdayDiscount()).isEqualTo(-7500.0); // 50% for birthday
        assertThat(savedReceipt.getHolidayDiscount()).isEqualTo(-1500.0); // 10% for holiday
    }

    @Test
    void whenCreateReceiptWithInvalidClient_thenThrowException() {
        // Given
        when(clientRepository.findByClientRut(testClient.getClientRut()))
                .thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> receiptService.createReceipt(testReceipt))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Client not found");
    }

    @Test
    void whenCreateReceiptWithInvalidReservation_thenThrowException() {
        // Given
        when(clientRepository.findByClientRut(testClient.getClientRut()))
                .thenReturn(Optional.of(testClient));
        when(reservationRepository.findById(testReservation.getId()))
                .thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> receiptService.createReceipt(testReceipt))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Reservation not found");
    }

    @Test
    void whenGenerateSummaryReport_thenReturnReportData() {
        // Given
        List<Object[]> mockResults = new ArrayList<>();
        Object[] row = new Object[]{"10 laps", 5, 75000.0, -37500.0, -7500.0, -7500.0, 22500.0};
        mockResults.add(row);
        when(receiptRepository.getReservationSummaryReport()).thenReturn(mockResults);

        // When
        List<Map<String, Object>> report = receiptService.generateSummaryReport();

        // Then
        assertThat(report).hasSize(1);
        Map<String, Object> firstRow = report.get(0);
        assertThat(firstRow).containsKey("Número de vueltas o tiempo máximo permitido");
        assertThat(firstRow).containsKey("Cantidad de reservas");
        assertThat(firstRow).containsKey("Suma inicial");
        assertThat(firstRow).containsKey("Total");
    }

    @Test
    void whenGenerateRiderGroupReport_thenReturnReportData() {
        // Given
        List<Object[]> mockResults = new ArrayList<>();
        Object[] row = new Object[]{"3-5", 3, 45000.0, -22500.0, -4500.0, -4500.0, -4500.0, 9000.0};
        mockResults.add(row);
        when(receiptRepository.getRiderGroupSizeReport()).thenReturn(mockResults);

        // When
        List<Map<String, Object>> report = receiptService.generateRiderGroupReport();

        // Then
        assertThat(report).hasSize(1);
        Map<String, Object> firstRow = report.get(0);
        assertThat(firstRow).containsKey("Tamaño del grupo");
        assertThat(firstRow).containsKey("Cantidad de reservas");
        assertThat(firstRow).containsKey("Suma inicial");
        assertThat(firstRow).containsKey("Total");
    }

    @Test
    void whenCreateReceipt15Laps_WithFrequentClientDiscount_thenCalculateCorrectly() {
        // Given
        testReservation.setReservationType(1); // 15 laps
        testReservation.setRiderAmount(2); // No group discount
        testReceipt.setMonthlyVisits(5); // 20% frequent client discount
        testReceipt.setBirthdayCheck(false);
        testReceipt.setHolidayCheck(false);
        
        when(clientRepository.findByClientRut(testClient.getClientRut()))
                .thenReturn(Optional.of(testClient));
        when(reservationRepository.findById(testReservation.getId()))
                .thenReturn(Optional.of(testReservation));
        when(receiptRepository.save(any(ReceiptEntity.class)))
                .thenReturn(testReceipt);

        // When
        ReceiptEntity savedReceipt = receiptService.createReceipt(testReceipt);

        // Then
        assertThat(savedReceipt.getInitialCost()).isEqualTo(20000.0);
        assertThat(savedReceipt.getGroupDiscount()).isEqualTo(0.0);
        assertThat(savedReceipt.getFrequentClientDiscount()).isEqualTo(-4000.0); // 20% of 20000
        assertThat(savedReceipt.getBirthdayDiscount()).isEqualTo(0.0);
        assertThat(savedReceipt.getHolidayDiscount()).isEqualTo(0.0);
        assertThat(savedReceipt.getTotalCost()).isEqualTo(16000.0);
    }

    @Test
    void whenCreateReceipt20Laps_WithLargeGroup_thenCalculateCorrectly() {
        // Given
        testReservation.setReservationType(2); // 20 laps
        testReservation.setRiderAmount(11); // 30% group discount
        testReceipt.setMonthlyVisits(1); // No frequent client discount
        testReceipt.setBirthdayCheck(false);
        testReceipt.setHolidayCheck(true); // 10% holiday discount
        
        when(clientRepository.findByClientRut(testClient.getClientRut()))
                .thenReturn(Optional.of(testClient));
        when(reservationRepository.findById(testReservation.getId()))
                .thenReturn(Optional.of(testReservation));
        when(receiptRepository.save(any(ReceiptEntity.class)))
                .thenReturn(testReceipt);

        // When
        ReceiptEntity savedReceipt = receiptService.createReceipt(testReceipt);

        // Then
        assertThat(savedReceipt.getInitialCost()).isEqualTo(25000.0);
        assertThat(savedReceipt.getGroupDiscount()).isEqualTo(-7500.0); // 30% of 25000
        assertThat(savedReceipt.getFrequentClientDiscount()).isEqualTo(0.0);
        assertThat(savedReceipt.getBirthdayDiscount()).isEqualTo(0.0);
        assertThat(savedReceipt.getHolidayDiscount()).isEqualTo(-2500.0); // 10% of 25000
        assertThat(savedReceipt.getTotalCost()).isEqualTo(15000.0);
    }

    @Test
    void whenCreateReceipt10Laps_WithAllDiscounts_thenCalculateCorrectly() {
        // Given
        testReservation.setReservationType(0); // 10 laps
        testReservation.setRiderAmount(6); // 20% group discount
        testReceipt.setMonthlyVisits(7); // 30% frequent client discount
        testReceipt.setBirthdayCheck(true); // 50% birthday discount
        testReceipt.setHolidayCheck(true); // 10% holiday discount
        
        when(clientRepository.findByClientRut(testClient.getClientRut()))
                .thenReturn(Optional.of(testClient));
        when(reservationRepository.findById(testReservation.getId()))
                .thenReturn(Optional.of(testReservation));
        when(receiptRepository.save(any(ReceiptEntity.class)))
                .thenReturn(testReceipt);

        // When
        ReceiptEntity savedReceipt = receiptService.createReceipt(testReceipt);

        // Then
        assertThat(savedReceipt.getInitialCost()).isEqualTo(15000.0);
        assertThat(savedReceipt.getGroupDiscount()).isEqualTo(-3000.0); // 20% of 15000
        assertThat(savedReceipt.getFrequentClientDiscount()).isEqualTo(-4500.0); // 30% of 15000
        assertThat(savedReceipt.getBirthdayDiscount()).isEqualTo(-7500.0); // 50% of 15000
        assertThat(savedReceipt.getHolidayDiscount()).isEqualTo(-1500.0); // 10% of 15000
        assertThat(savedReceipt.getTotalCost()).isEqualTo(0); // All discounts applied
    }

    @Test
    void whenCreateReceipt15Laps_WithMediumGroupAndFrequentClient_thenCalculateCorrectly() {
        // Given
        testReservation.setReservationType(1); // 15 laps
        testReservation.setRiderAmount(4); // 10% group discount
        testReceipt.setMonthlyVisits(6); // 20% frequent client discount
        testReceipt.setBirthdayCheck(false);
        testReceipt.setHolidayCheck(false);
        
        when(clientRepository.findByClientRut(testClient.getClientRut()))
                .thenReturn(Optional.of(testClient));
        when(reservationRepository.findById(testReservation.getId()))
                .thenReturn(Optional.of(testReservation));
        when(receiptRepository.save(any(ReceiptEntity.class)))
                .thenReturn(testReceipt);

        // When
        ReceiptEntity savedReceipt = receiptService.createReceipt(testReceipt);

        // Then
        assertThat(savedReceipt.getInitialCost()).isEqualTo(20000.0);
        assertThat(savedReceipt.getGroupDiscount()).isEqualTo(-2000.0); // 10% of 20000
        assertThat(savedReceipt.getFrequentClientDiscount()).isEqualTo(-4000.0); // 20% of 20000
        assertThat(savedReceipt.getBirthdayDiscount()).isEqualTo(0.0);
        assertThat(savedReceipt.getHolidayDiscount()).isEqualTo(0.0);
        assertThat(savedReceipt.getTotalCost()).isEqualTo(14000.0);
    }
}