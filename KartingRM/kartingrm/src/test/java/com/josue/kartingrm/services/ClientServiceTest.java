/*package com.josue.kartingRM.services;

import com.josue.kartingRM.entities.ClientEntity;
import com.josue.kartingRM.entities.ReservationEntity;
import com.josue.kartingRM.repositories.ClientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

class ClientServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private ClientService clientService;

    private ClientEntity testClient;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testClient = new ClientEntity();
        testClient.setId(1L);
        testClient.setClientRut("12.345.678-9");
        testClient.setClientName("Test Client");
        testClient.setClientEmail("test@example.com");
    }

    @Test
    void whenRegisterNewClient_thenClientIsSaved() {
        // Given
        when(clientRepository.existsByClientEmail(testClient.getClientEmail())).thenReturn(false);
        when(clientRepository.existsByClientRut(testClient.getClientRut())).thenReturn(false);
        when(clientRepository.save(any(ClientEntity.class))).thenReturn(testClient);

        // When
        ClientEntity savedClient = clientService.registerClient(testClient);

        // Then
        assertThat(savedClient).isNotNull();
        assertThat(savedClient.getClientRut()).isEqualTo(testClient.getClientRut());
    }

    @Test
    void whenRegisterExistingClient_thenReturnNull() {
        // Given
        when(clientRepository.existsByClientEmail(testClient.getClientEmail())).thenReturn(true);

        // When
        ClientEntity savedClient = clientService.registerClient(testClient);

        // Then
        assertThat(savedClient).isNull();
    }

    @Test
    void whenGetAllClients_thenReturnClientsList() {
        // Given
        List<ClientEntity> clientList = new ArrayList<>();
        clientList.add(testClient);
        when(clientRepository.findAll()).thenReturn(clientList);

        // When
        List<ClientEntity> result = clientService.getAllClients();

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getClientRut()).isEqualTo(testClient.getClientRut());
    }

    @Test
    void whenGetClientByEmail_thenReturnClient() {
        // Given
        when(clientRepository.findByClientEmail(testClient.getClientEmail())).thenReturn(testClient);

        // When
        ClientEntity foundClient = clientService.getClientByClientEmail(testClient.getClientEmail());

        // Then
        assertThat(foundClient).isNotNull();
        assertThat(foundClient.getClientEmail()).isEqualTo(testClient.getClientEmail());
    }

    @Test
    void whenUpdateClient_thenReturnUpdatedClient() {
        // Given
        ClientEntity updatedClient = testClient;
        updatedClient.setClientName("Updated Name");
        when(clientRepository.save(any(ClientEntity.class))).thenReturn(updatedClient);

        // When
        ClientEntity result = clientService.updateClient(updatedClient);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getClientName()).isEqualTo("Updated Name");
    }

    @Test
    void whenDeleteClientWithReservations_thenClientIsDeleted() throws Exception {
        // Given
        when(clientRepository.existsById(testClient.getId())).thenReturn(true);

        // When
        clientService.deleteClient(testClient.getId());

        // Then
        verify(clientRepository).deleteById(testClient.getId());
    }


}*/