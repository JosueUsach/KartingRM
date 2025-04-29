package com.josue.kartingRM.repositories;

import com.josue.kartingRM.entities.KartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KartRepository extends JpaRepository<KartEntity, Long> {
}
