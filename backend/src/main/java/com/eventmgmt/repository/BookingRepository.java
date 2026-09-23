package com.eventmgmt.repository;

import com.eventmgmt.entity.Booking;
import com.eventmgmt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserOrderByBookedAtDesc(User user);

    List<Booking> findAllByOrderByBookedAtDesc();

    Optional<Booking> findByRazorpayOrderId(String razorpayOrderId);
}