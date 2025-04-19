package com.josue.kartingRM.repositories;

import com.josue.kartingRM.entities.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, Long> {

	ClientEntity findByClientEmail(String email);

	boolean existsByClientEmail(String email);

	boolean existsByClientRut(String rut);

}
