package com.josue.kartingRM.repositories;

import com.josue.kartingRM.entities.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, Long> {

	ClientEntity findByClientEmail(String email);

	ClientEntity findByClientRut(String rut);

}
