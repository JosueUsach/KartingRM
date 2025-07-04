package com.josue.kartingrm.repositories;

import com.josue.kartingrm.entities.KartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KartRepository extends JpaRepository<KartEntity, Long> {
}
