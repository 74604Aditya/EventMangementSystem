package com.eventmgmt.repository;

import com.eventmgmt.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByActiveTrue();
    List<Event> findByCityIgnoreCaseAndActiveTrue(String city);
    List<Event> findByCategory_NameInAndActiveTrue(List<String> categoryNames);
    List<Event> findByCityIgnoreCaseAndCategory_NameInAndActiveTrue(String city, List<String> categoryNames);
}
