package com.josue.kartingrm.repositories;

import com.josue.kartingrm.entities.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {
    @Query("SELECT r FROM ReservationEntity r WHERE " +
           "((r.startTime <= :startTime AND r.endTime > :startTime) OR " +
           "(r.startTime < :endTime AND r.endTime >= :endTime) OR " +
           "(r.startTime >= :startTime AND r.endTime <= :endTime))")
    List<ReservationEntity> findOverlappingReservations(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}