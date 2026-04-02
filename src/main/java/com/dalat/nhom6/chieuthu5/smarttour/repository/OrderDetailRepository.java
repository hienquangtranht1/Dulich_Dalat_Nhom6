package com.dalat.nhom6.chieuthu5.smarttour.repository;

import com.dalat.nhom6.chieuthu5.smarttour.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findByServiceId(Integer serviceId);

    // Cần @Modifying + @Transactional + @Query để Spring Data JPA thực sự
    // thực thi câu lệnh DELETE. Nếu thiếu, query sẽ bị bỏ qua hoàn toàn!
    @Modifying
    @Transactional
    @Query("DELETE FROM OrderDetail od WHERE od.service.id = :serviceId")
    void deleteByServiceId(@Param("serviceId") Integer serviceId);
}
