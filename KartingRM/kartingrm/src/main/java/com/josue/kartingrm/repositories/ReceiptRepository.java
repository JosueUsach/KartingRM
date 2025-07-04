package com.josue.kartingrm.repositories;

import com.josue.kartingrm.entities.ReceiptEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceiptRepository extends JpaRepository<ReceiptEntity, Long> {

	ReceiptEntity findByClientRutAndReservationId(String rut, Long reservationId);

	@Query(value = "SELECT " +
			"CASE " +
			"   WHEN initial_cost = 15000 THEN '10 vueltas o máx 10 min' " +
			"   WHEN initial_cost = 20000 THEN '15 vueltas o máx 15 min' " +
			"   WHEN initial_cost = 25000 THEN '20 vueltas o máx 20 min' " +
			"END AS reservationType, " +
			"COUNT(*) AS reservationCount, " +
			"SUM(initial_cost) AS initialSum, " +
			"SUM(birthday_discount) AS birthdayDiscountSum, " +
			"SUM(frequent_client_discount) AS frequentClientDiscountSum, " +
			"SUM(holiday_discount) AS holidayDiscountSum, " +
			"SUM(total_cost) AS totalSum " +
			"FROM receipt " +
			"GROUP BY initial_cost " +
			"UNION ALL " +
			"SELECT " +
			"'TOTAL' AS reservationType, " +
			"COUNT(*) AS reservationCount, " +
			"SUM(initial_cost) AS initialSum, " +
			"SUM(birthday_discount) AS birthdayDiscountSum, " +
			"SUM(frequent_client_discount) AS frequentClientDiscountSum, " +
			"SUM(holiday_discount) AS holidayDiscountSum, " +
			"SUM(total_cost) AS totalSum " +
			"FROM receipt", nativeQuery = true)
	List<Object[]> getReservationSummaryReport();


	@Query(value = "SELECT " +
			"CASE " +
			"   WHEN group_discount = 0 THEN '1 - 2 participantes' " +
			"   WHEN group_discount = -1500 OR group_discount = -2000 OR group_discount = -2500 THEN '3 - 5 participantes' " +
			"   WHEN group_discount = -3000 OR group_discount = -4000 OR group_discount = -5000 THEN '6 - 10 participantes' " +
			"   WHEN group_discount = -4500 OR group_discount = -6000 OR group_discount = -7500 THEN '11 - 15 participantes' " +
			"   ELSE 'Other group size' " +
			"END AS riderSegment, " +
			"COUNT(*) AS reservationCount, " +
			"SUM(initial_cost) AS initialSum, " +
			"SUM(birthday_discount) AS birthdayDiscountSum, " +
			"SUM(frequent_client_discount) AS frequentClientDiscountSum, " +
			"SUM(holiday_discount) AS holidayDiscountSum, " +
			"SUM(group_discount) AS groupDiscountSum, " +
			"SUM(total_cost) AS totalSum " +
			"FROM receipt " +
			"GROUP BY riderSegment " +
			"UNION ALL " +
			"SELECT " +
			"'TOTAL' AS riderSegment, " +
			"COUNT(*) AS reservationCount, " +
			"SUM(initial_cost) AS initialSum, " +
			"SUM(birthday_discount) AS birthdayDiscountSum, " +
			"SUM(frequent_client_discount) AS frequentClientDiscountSum, " +
			"SUM(holiday_discount) AS holidayDiscountSum, " +
			"SUM(group_discount) AS groupDiscountSum, " +
			"SUM(total_cost) AS totalSum " +
			"FROM receipt", nativeQuery = true)
	List<Object[]> getRiderGroupSizeReport();

    void deleteByReservationId(Long reservationId);
    List<ReceiptEntity> findByReservationId(Long reservationId);
}