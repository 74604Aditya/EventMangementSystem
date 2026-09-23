import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import api from '../api/axiosConfig';
import { useAuth } from '../context/useAuth';

import './UserDashboard.css';

export default function UserDashboard() {

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);
                setError('');

                // =====================================================
                // LOAD USER PROFILE
                // =====================================================

                try {

                    console.log('Loading user profile...');

                    const profileResponse =
                        await api.get('/users/profile');

                    console.log(
                        'User profile loaded:',
                        profileResponse.data
                    );

                    setUser(profileResponse.data);

                } catch (profileError) {

                    console.error(
                        'PROFILE API ERROR:',
                        profileError
                    );

                    console.error(
                        'Profile status:',
                        profileError.response?.status
                    );

                    console.error(
                        'Profile response:',
                        profileError.response?.data
                    );

                    throw profileError;
                }


                // =====================================================
                // LOAD BOOKINGS
                // =====================================================

                try {

                    console.log('Loading user bookings...');

                    const bookingsResponse =
                        await api.get('/bookings/my');

                    console.log(
                        'Bookings loaded:',
                        bookingsResponse.data
                    );

                    setBookings(
                        Array.isArray(bookingsResponse.data)
                            ? bookingsResponse.data
                            : []
                    );

                } catch (bookingError) {

                    console.error(
                        'BOOKINGS API ERROR:',
                        bookingError
                    );

                    console.error(
                        'Booking status:',
                        bookingError.response?.status
                    );

                    console.error(
                        'Booking response:',
                        bookingError.response?.data
                    );

                    throw bookingError;
                }

            } catch (err) {

                console.error(
                    'Dashboard error:',
                    err
                );

                // =====================================================
                // AUTHENTICATION ERROR
                // =====================================================

                if (
                    err.response?.status === 401 ||
                    err.response?.status === 403
                ) {

                    navigate('/login', {
                        replace: true
                    });

                    return;
                }


                // =====================================================
                // OTHER ERROR
                // =====================================================

                setError(
                    err.response?.data?.message ||
                    'Failed to load dashboard'
                );

            } finally {

                setLoading(false);
            }

        };

        loadDashboard();

    }, [navigate]);
}