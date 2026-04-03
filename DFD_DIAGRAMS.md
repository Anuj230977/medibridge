# MediBridge — Data Flow Diagrams (DFD)

## 0-LEVEL DFD (Context Diagram)

```
                          Registration/Login
                    Booking/Cancellation
     ┌──────────────┐ Appointment Status ┌──────────────┐
     │   Patient    │                    │   Doctor     │
     │   (User)     ├────────────────────┤              │
     │              │                    │   Updates    │
     │   ◄──────────┤                    │   Status     │
     │              │    ╭─────────────╮ │              │
     │              ├───→│  MediBridge  │←┤              │
     │              │    │ Appointment  │ │              │
     │   Book       │    │  SMS System  │ │ Status       │
     │   Appt    ◄──┤    │              │ │ Updates      │
     │              │    ╰─────────────╯ │              │
     │   Receive    │         ▼          │              │
     │   SMS ◄──────┼─────────────────── │              │
     │              │   SMS Notification │              │
     │              │  via Twilio SMS    │              │
     │              │    Gateway         │              │
     └──────────────┘                    └──────────────┘
```

### External Entities:
- **Patient (Left)**: Registration, Login, Book Appointment, Receive SMS
- **MediBridge System (Middle Circle)**: Core appointment and SMS management
- **Doctor (Right)**: Login, Update Appointment Status
- **Twilio SMS Gateway**: External service for sending notifications

---

## 1-LEVEL DFD (Main Processes)

```
     Registration/          Booking/Cancel
     Login Data            Appointment Data
         ↓                       ↓
    ┌────────────┐         ┌──────────────┐
    │  1.0       │         │   2.0        │
    │ Auth       │         │ Appointment  │
    │ Management │         │ Management   │
    │            │         │              │
    └────────────┘         └──────────────┘
         ↓                       ↓
    User/Doctor Info    Appointment Details
         ↓                       ↓
    ┌────────────────────────────────────┐
    │         Database (MongoDB)         │
    │  - Users  - Doctors  - Appointments│
    └────────────────────────────────────┘
         ↑                       ↑
         └───────────┬───────────┘
                     ↓
            ┌──────────────────┐
            │  3.0 Notification│
            │  SMS Service     │
            │  (Twilio)        │
            └──────────────────┘
                     ↓
              SMS Alert to Patient
```

### Processes:
- **1.0 Auth Management**: User registration, doctor login, authentication
- **2.0 Appointment Management**: Book, cancel, update appointment status
- **3.0 Notification Service**: Send SMS alerts based on appointment status

### Data Stores:
- **D1**: Users Database
- **D2**: Doctors Database
- **D3**: Appointments Database

---

## 2-LEVEL DFD (Process 1.0 — Auth Management)

```
        User/Doctor
       Registration
             │
             ↓
     ┌──────────────┐
     │  1.1 Register│
     │  User/Doctor │
     └──────────────┘
             │
             ├─→ Hashed Password
             │
             ↓
     ┌──────────────┐
     │  1.2 Validate│
     │  Credentials │
     │  (Login)     │
     └──────────────┘
             │
             ├─→ JWT Token Generated
             │
             ↓
     ┌──────────────┐
     │  1.3 Store/  │
     │  Retrieve    │
     │  User Data   │
     └──────────────┘
             │
             ↓
         User DB
     (D1: Users Table)
```

### Sub-Processes:
- **1.1 Register**: Hash password, validate email, store new user/doctor
- **1.2 Validate Credentials**: Check password, validate JWT token
- **1.3 Store/Retrieve Data**: CRUD operations on user profiles

---

## 2-LEVEL DFD (Process 2.0 — Appointment Management)

```
       Patient/Doctor
       Request Data
             │
             ├──────────────┬──────────────┐
             ↓              ↓              ↓
     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
     │  2.1 Book    │ │  2.2 Update  │ │  2.3 Cancel  │
     │  Appointment │ │  Status      │ │  Appointment │
     │              │ │  (Confirmed/ │ │              │
     │              │ │   Completed) │ │              │
     └──────────────┘ └──────────────┘ └──────────────┘
             │              │              │
             ├──────────────┴──────────────┘
             │
             ↓
     ┌──────────────────────────┐
     │ Validate Slot Availability
     │ Check Doctor Schedule    │
     └──────────────────────────┘
             │
             ↓
     ┌──────────────────────────┐
     │ Store/Update Appointment │
     │ Data in Database         │
     └──────────────────────────┘
             │
             ↓
         Appointment DB
     (D3: Appointments Table)
             │
             ├─→ Appointment Details
             │
             ↓
         Trigger 3.0
      (SMS Notification)
```

### Sub-Processes:
- **2.1 Book Appointment**: Validate slot availability, create appointment record
- **2.2 Update Status**: Change status to Confirmed/Completed by doctor
- **2.3 Cancel Appointment**: Mark as cancelled, trigger cancellation SMS

---

## 2-LEVEL DFD (Process 3.0 — Notification Service)

```
    Appointment
    Status Change
    Trigger Event
             │
             ↓
     ┌──────────────────┐
     │  3.1 Check       │
     │  Appointment     │
     │  Status          │
     └──────────────────┘
             │
             ├─→ Status ∈ {Confirmed, Cancelled, Completed}
             │
             ↓
     ┌──────────────────┐
     │  3.2 Fetch       │
     │  Patient Phone & │
     │  Appointment     │
     │  Details         │
     └──────────────────┘
             │
             ↓
    Appointment DB (D3)
    User DB (D1)
             │
             ↓
     ┌──────────────────┐
     │  3.3 Format SMS  │
     │  Message         │
     │  (Status-based)  │
     └──────────────────┘
             │
             ↓
     ┌──────────────────┐
     │  3.4 Send SMS    │
     │  via Twilio API  │
     │                  │
     └──────────────────┘
             │
             ↓
    SMS Gateway
    (Twilio Service)
             │
             ↓
         Patient
      SMS Notification
```

### Sub-Processes:
- **3.1 Check Status**: Validate appointment status trigger
- **3.2 Fetch Data**: Retrieve patient phone number and appointment details
- **3.3 Format SMS**: Create message based on status (Confirmation/Cancellation/Completion)
- **3.4 Send SMS**: Call Twilio API to send SMS to patient

---

## 3-LEVEL DFD (Process 2.1 — Book Appointment)

```
        Patient
        Booking
        Request
             │
             ├─→ Patient ID, Date, Time Slot
             │
             ↓
     ┌─────────────────────┐
     │ 2.1.1 Authenticate  │
     │ Patient JWT Token   │
     │                     │
     └─────────────────────┘
             │
             ↓
     ┌─────────────────────┐
     │ 2.1.2 Find Doctor   │
     │ by Email            │
     │                     │
     └─────────────────────┘
             │
             ↓
        Doctor DB (D2)
             │
             ↓
     ┌─────────────────────┐
     │ 2.1.3 Check Slot    │
     │ Availability        │
     │ (Query Appointments)│
     └─────────────────────┘
             │
             ├─→ Slot Available?
             │   ├─ YES ↓
             │   └─ NO  ↓ Error
             │
             ↓ (If Available)
     ┌─────────────────────┐
     │ 2.1.4 Create        │
     │ Appointment Record  │
     │ Status: Pending     │
     └─────────────────────┘
             │
             ↓
     ┌─────────────────────┐
     │ 2.1.5 Store in      │
     │ Database            │
     │                     │
     └─────────────────────┘
             │
             ↓
       Appointment DB (D3)
             │
             ↓
      Success Response
     + Appointment ID
     + Booking Details
```

---

## 3-LEVEL DFD (Process 3.4 — Send SMS via Twilio)

```
       SMS Message
       + Phone Number
             │
             ↓
     ┌─────────────────────┐
     │ 3.4.1 Format        │
     │ Phone Number        │
     │ (Add Country Code)  │
     │                     │
     └─────────────────────┘
             │
             ↓
     ┌─────────────────────┐
     │ 3.4.2 Call Twilio   │
     │ Messaging API       │
     │ (sendAppointmentSMS)│
     └─────────────────────┘
             │
             ↓
        Twilio Service
        (Cloud SMS Gateway)
             │
             ├─→ Status Check
             │   ├─ Delivered ✓
             │   ├─ Failed ✗
             │   └─ Queued ⧖
             │
             ↓
     ┌─────────────────────┐
     │ 3.4.3 Log SMS       │
     │ Status to System    │
     │ (Optional: DB)      │
     └─────────────────────┘
             │
             ↓
      System Log / SMS Log
```

---

## Data Store Summary

| Store | Entity | Contains |
|-------|--------|----------|
| **D1: Users DB** | Patient/User | Email, Password (hashed), Phone, Name, Profile |
| **D2: Doctors DB** | Doctor | Email, Password (hashed), Name, Schedule, Booked Slots |
| **D3: Appointments DB** | Appointment | Patient ID, Doctor ID, Date, Time Slot, Status, Created Date |

---

## Data Flow Summary

| Data Flow | Source | Destination | Data |
|-----------|--------|-------------|------|
| **Registration Data** | Patient | D1 (Users DB) | Email, Password, Phone, Name |
| **Login Data** | Patient/Doctor | Auth (1.0) | Email, Password |
| **JWT Token** | Auth (1.0) | Client | Token, Expiry |
| **Booking Data** | Patient | Appointment (2.0) | Patient ID, Date, Time Slot |
| **Slot Availability** | D3 | Appointment (2.0) | Existing Appointments |
| **Status Update** | Doctor | Appointment (2.0) | Appointment ID, New Status |
| **Appointment Details** | D3 | Notification (3.0) | Date, Time, Doctor Name |
| **Patient Contact** | D1 | Notification (3.0) | Phone Number, Name |
| **SMS Message** | Notification (3.0) | Twilio | Message, Phone Number, Status |
| **SMS Notification** | Twilio | Patient | Confirmation/Cancellation/Completion |

---

## Key Processes at a Glance

1. **Registration & Authentication** → Secure user/doctor account creation
2. **Appointment Booking** → Slot validation and booking management
3. **Status Updates** → Doctor updates appointment status
4. **SMS Notifications** → Automated patient alerts via Twilio
5. **Cancellation** → Patient/Doctor can cancel with notification

