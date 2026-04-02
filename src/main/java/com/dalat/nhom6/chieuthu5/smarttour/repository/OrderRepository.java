package com.dalat.nhom6.chieuthu5.smarttour.repository;

import com.dalat.nhom6.chieuthu5.smarttour.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUserId(Integer userId);
    List<Order> findByStatus(String status);
}
