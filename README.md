# Maharashtra Cultural Events Management System

A fullstack event booking platform for Maharashtrian cultural events (Ganeshotsav, Gudi
Padwa, Wari/Palkhi, Lavani, Shivaji Jayanti, Navratri/Garba, Diwali Pahat, Warli Art,
Kojagiri Purnima, Konkan Utsav).

**Stack:** Spring Boot 3 (Java 17) + Spring Security/JWT · MySQL 8 · React 18 (Vite) · Razorpay (payment stub)

---

## 1. Project layout

```
event-management-system/
├── backend/                 # Open this folder as a project in IntelliJ IDEA
│   ├── pom.xml
│   └── src/main/java/com/eventmgmt/
│       ├── entity/          # User, Event, Category, Booking, Payment
│       ├── repository/      # Spring Data JPA repos
│       ├── dto/              # request/response payloads
│       ├── service/          # AuthService, EventService, BookingService, PaymentService
│       ├── controller/       # REST endpoints
│       ├── config/           # SecurityConfig, JwtUtil, JwtAuthFilter
│       └── exception/        # global error handler
├── frontend/                 # React (Vite) app
│   └── src/
│       ├── api/axiosConfig.js
│       ├── context/AuthContext.jsx
│       ├── components/       # Navbar, route guards
│       └── pages/             # Home, Login, Register, EventDetails, MyBookings, Admin*
└── database/schema_and_seed.sql   # category + sample event seed data
```

## 2. Database setup (MySQL)

1. Install MySQL 8 and make sure it's running locally.
2. You don't need to create tables by hand — Hibernate does it automatically
   (`spring.jpa.hibernate.ddl-auto=update` in `application.properties`).
3. Just create the empty database once:
   ```sql
   CREATE DATABASE maha_events_db;
   ```
4. Start the backend once (step 3 below) so Hibernate generates the tables, then run the
   `INSERT` statements from `database/schema_and_seed.sql` to load categories, a sample
   admin user, and sample Maharashtra events.
5. Update `backend/src/main/resources/application.properties` with your actual MySQL
   username/password.

## 3. Backend setup (IntelliJ IDEA)

1. `File → Open` → select the `backend/` folder (IntelliJ will detect the Maven `pom.xml`).
2. Let Maven download dependencies (Spring Web, Spring Security, Spring Data JPA, MySQL
   connector, JWT (jjwt), Lombok, Validation).
3. **Enable annotation processing for Lombok:** Settings → Build, Execution, Deployment →
   Compiler → Annotation Processors → check "Enable annotation processing". Also install
   the Lombok plugin if IntelliJ prompts you.
4. Edit `application.properties` with your MySQL credentials.
5. Run `EventManagementApplication.java`. Backend starts on `http://localhost:8080`.
6. Seed the DB (step 4 above) — this gives you an admin login:
   - email: `admin@mahaevents.in`
   - password: `Admin@123`
   (Change this password after first login — there's no "change password" endpoint yet;
   the fastest way is to register a new admin manually in the DB with a freshly BCrypt-hashed
   password, or add a change-password endpoint.)

## 4. Frontend setup (React)

```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173` and talks to the backend at `http://localhost:8080/api`
(see `src/api/axiosConfig.js` if you need to change the URL).

## 5. Roles & flow

- **Register** (`/register`) creates a normal `USER`. Users pick a preferred city and
  preferred event categories during signup — these power the "Recommended For Me" filter
  on the home page (`GET /api/events/customized`), which is how the app customizes events
  per user.
- **Admin** accounts are not self-service (by design, so random users can't grant
  themselves admin). Seed one directly in the DB (see step 3.6) or promote an existing
  user by updating their `role` column to `ADMIN`.
- Admins get `/admin` — create/edit/deactivate events, view all bookings, view all users.
- All `/api/admin/**` endpoints are locked server-side to the `ADMIN` role
  (`SecurityConfig`), not just hidden in the UI.

## 6. Booking, cancellation & payments

- `POST /api/bookings` reserves seats immediately (seat count is decremented, checked for
  availability, and blocked for past events).
- **12-hour cancellation window:** `BookingService.cancelBooking()` checks
  `Duration.between(booking.getBookedAt(), now).toHours()`. If it's been more than
  `booking.cancellation.window.hours` (default 12, configurable in
  `application.properties`) since the booking was made, cancellation is rejected with a
  409 and the seats stay held. Admins can still force-cancel any time. Cancelling releases
  the seats back to `Event.availableSeats`.
- **Payments:** `PaymentService` stubs the Razorpay Orders API (`createOrder`) and
  verifies the returned signature with HMAC-SHA256 (`verifyPayment`), exactly like the
  real Razorpay flow, but without calling out to Razorpay's servers — so you can run and
  demo the whole flow offline. To go live: swap `createOrder()`'s locally generated order
  ID for a real `POST https://api.razorpay.com/v1/orders` call using your test/live
  `razorpay.key.id` / `razorpay.key.secret`, and everything else (frontend checkout,
  signature verification) stays the same. Free events (`ticketPrice == 0`) skip payment
  entirely and confirm immediately.

## 7. Vendors module

A `Vendor` (business) can list many `VendorService` line items (e.g. "Balloon
Decoration", "Floral Art"). This powers a public `/vendors` page.

**Business switcher UI:** since you currently have two real vendors seeded (Shree Event
Management / TNCP, and SE Shree Events Parner), the `/vendors` page renders them as a
**toggle switch** — "Business 1" / "Business 2" — rather than a flat list. Each button
shows that business's own themed section: its own tagline, service badges (English +
Marathi), address/taluka/district, and phone/Instagram contact, styled with a distinct
color theme per business (Business 1: saffron/maroon like the TNCP flyer; Business 2:
purple/gold like the SE Shree Events flyer). Business 1 and Business 2 are simply the
first two vendors by ID — if you add a third vendor later via the admin API, you'd want
to switch this from a 2-way toggle to a scrollable tab list (happy to build that when you
get there).

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/vendors/public/all` | public |
| GET | `/api/vendors/public/by-city?city=Parner` | public |
| GET | `/api/vendors/{id}` | authenticated |
| POST | `/api/admin/vendors` | ADMIN only |
| DELETE | `/api/admin/vendors/{id}` | ADMIN only |

## 8. Key API endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public |
| GET | `/api/events/public/all` | public |
| GET | `/api/events/customized` | logged-in user (personalized) |
| GET | `/api/events/{id}` | authenticated |
| POST | `/api/bookings` | authenticated |
| GET | `/api/bookings/my` | authenticated |
| PUT | `/api/bookings/{id}/cancel` | authenticated (owner or admin, 12h rule) |
| POST | `/api/payments/create-order/{bookingId}` | authenticated |
| POST | `/api/payments/verify` | authenticated |
| POST/PUT/DELETE | `/api/admin/events/**` | ADMIN only |
| GET | `/api/admin/bookings`, `/api/admin/users`, `/api/admin/categories` | ADMIN only |

## 8. Next steps you may want to add

- Email/SMS booking confirmations.
- Real Razorpay webhook handling for async payment status updates.
- Pagination/search/filter on the events list.
- Refund automation tied into `PaymentStatus.REFUNDED` when a paid booking is cancelled
  within the window.
- Change-password / forgot-password endpoints.
