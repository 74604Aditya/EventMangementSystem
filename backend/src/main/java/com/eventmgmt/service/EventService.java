package com.eventmgmt.service;

import com.eventmgmt.dto.EventRequest;
import com.eventmgmt.entity.Category;
import com.eventmgmt.entity.Event;
import com.eventmgmt.entity.User;
import com.eventmgmt.repository.CategoryRepository;
import com.eventmgmt.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;


    /* =========================================================
       GET ALL ACTIVE EVENTS
       ========================================================= */

    public List<Event> getAllActiveEvents() {

        return eventRepository.findByActiveTrue();
    }


    /* =========================================================
       GET CUSTOMIZED EVENTS FOR USER
       ========================================================= */

    public List<Event> getCustomizedEventsForUser(User user) {

        boolean hasCity =
                user.getPreferredCity() != null &&
                        !user.getPreferredCity().isBlank();

        boolean hasCategories =
                user.getPreferredCategories() != null &&
                        !user.getPreferredCategories().isBlank();


        /*
         * No preferences
         * Return all active events
         */

        if (!hasCity && !hasCategories) {

            return eventRepository.findByActiveTrue();
        }


        /*
         * City + Categories
         */

        if (hasCity && hasCategories) {

            List<String> categories =
                    Arrays.stream(
                                    user.getPreferredCategories().split(",")
                            )
                            .map(String::trim)
                            .toList();


            return eventRepository
                    .findByCityIgnoreCaseAndCategory_NameInAndActiveTrue(
                            user.getPreferredCity(),
                            categories
                    );
        }


        /*
         * City only
         */

        if (hasCity) {

            return eventRepository
                    .findByCityIgnoreCaseAndActiveTrue(
                            user.getPreferredCity()
                    );
        }


        /*
         * Categories only
         */

        List<String> categories =
                Arrays.stream(
                                user.getPreferredCategories().split(",")
                        )
                        .map(String::trim)
                        .toList();


        return eventRepository
                .findByCategory_NameInAndActiveTrue(
                        categories
                );
    }


    /* =========================================================
       GET EVENT BY ID
       ========================================================= */

    public Event getById(Long id) {

        return eventRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Event not found"
                        )
                );
    }


    /* =========================================================
       CREATE EVENT
       ========================================================= */

    public Event createEvent(EventRequest request) {

        Category category =
                request.getCategoryId() != null
                        ? categoryRepository
                        .findById(request.getCategoryId())
                        .orElse(null)
                        : null;


        Event event = Event.builder()

                .title(request.getTitle())

                .description(request.getDescription())

                .category(category)

                .city(request.getCity())

                .venue(request.getVenue())

                .eventDateTime(
                        request.getEventDateTime()
                )

                .ticketPrice(
                        request.getTicketPrice()
                )

                .imageUrl(
                        request.getImageUrl()
                )

                .active(true)

                .build();


        return eventRepository.save(event);
    }


    /* =========================================================
       UPDATE EVENT
       ========================================================= */

    public Event updateEvent(
            Long id,
            EventRequest request
    ) {

        Event event = getById(id);


        Category category =
                request.getCategoryId() != null
                        ? categoryRepository
                        .findById(request.getCategoryId())
                        .orElse(null)
                        : null;


        event.setTitle(
                request.getTitle()
        );


        event.setDescription(
                request.getDescription()
        );


        event.setCategory(
                category
        );


        event.setCity(
                request.getCity()
        );


        event.setVenue(
                request.getVenue()
        );


        event.setEventDateTime(
                request.getEventDateTime()
        );


        event.setTicketPrice(
                request.getTicketPrice()
        );


        event.setImageUrl(
                request.getImageUrl()
        );


        return eventRepository.save(event);
    }


    /* =========================================================
       DEACTIVATE EVENT
       ========================================================= */

    public void deactivateEvent(Long id) {

        Event event = getById(id);

        event.setActive(false);

        eventRepository.save(event);
    }
}