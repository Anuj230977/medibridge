# UML Diagrams - Medical Appointment & SMS Notification System

## Project Overview
This document contains complete UML diagrams for the Medical Appointment System with SMS notifications. The system allows patients to book appointments with doctors and receive SMS confirmations via Twilio.

---

## 1. CLASS DIAGRAM
Shows the structure of all classes and their relationships.

```mermaid
classDiagram
    class User {
        -name: String
        -email: String
        -password: String
        -role: String (patient/doctor)
        -phone: String
        -dob: Date
        -gender: String
        -address: String
        +register()
        +login()
        +updateProfile()
        +getAppointments()
    }
    
    class Doctor {
        -name: String
        -email: String
        -password: String
        -phone: String
        -specialization: String
        -role: String
        -schedule: Map<Date, String[]>
        -bookedSlots: Map<Date, String[]>
        -unavailability: Unavailability[]
        +registerSchedule()
        +getAvailableSlots()
        +setUnavailability()
        +viewAppointments()
    }
    
    class Appointment {
        -patient_id: ObjectId
        -doctor_id: ObjectId
        -date: String
        -time_slot: String
        -status: String (Pending/Confirmed/Completed/Cancelled)
        +bookAppointment()
        +confirmAppointment()
        +cancelAppointment()
        +completeAppointment()
    }
    
    class SMSService {
        -accountSid: String
        -authToken: String
        -fromNumber: String
        +sendAppointmentSMS()
        +formatPhoneNumber()
    }
    
    class AuthMiddleware {
        +verifyToken()
        +authenticate()
    }
    
    class Unavailability {
        -fromDate: Date
        -toDate: Date
        -reason: String
    }
    
    User "1" -- "*" Appointment: books
    Doctor "1" -- "*" Appointment: provides
    Doctor "1" -- "*" Unavailability: has
    Appointment "*" -- "1" SMSService: triggers
    AuthMiddleware --> User: validates
```

### Class Relationships:
- **User (1) -- (*) Appointment**: One user can have multiple appointments
- **Doctor (1) -- (*) Appointment**: One doctor can have multiple appointments
- **Doctor (1) -- (*) Unavailability**: One doctor can have multiple unavailability periods
- **Appointment (*) --> (1) SMSService**: Appointments trigger SMS notifications
- **AuthMiddleware --> User**: Validates user authentication

---

## 2. USE CASE DIAGRAM
Shows all interactions between actors (Patient/Doctor) and the system.

```mermaid
graph TB
    subgraph Actors
        Patient["👤 Patient"]
        Doctor["👨‍⚕️ Doctor"]
    end
    
    subgraph System["Medical Appointment System"]
        Register["Register Account"]
        Login["Login"]
        ViewDoctors["View Doctors"]
        ViewAvailableSlots["View Available Slots"]
        BookAppointment["Book Appointment"]
        ViewAppointments["View Appointments"]
        CancelAppointment["Cancel Appointment"]
        ReceiveSMS["Receive SMS Notification"]
        ManageSchedule["Manage Schedule"]
        ViewPatientAppointments["View Patient Appointments"]
        SetUnavailability["Set Unavailability"]
        UpdateProfile["Update Profile"]
    end
    
    Patient --> Register
    Patient --> Login
    Patient --> ViewDoctors
    Patient --> ViewAvailableSlots
    Patient --> BookAppointment
    Patient --> ViewAppointments
    Patient --> CancelAppointment
    Patient --> ReceiveSMS
    Patient --> UpdateProfile
    
    Doctor --> Register
    Doctor --> Login
    Doctor --> ManageSchedule
    Doctor --> ViewPatientAppointments
    Doctor --> SetUnavailability
    Doctor --> UpdateProfile
    
    BookAppointment --> ReceiveSMS
    CancelAppointment --> ReceiveSMS
```

### Patient Use Cases:
- Register Account
- Login
- View Doctors
- View Available Slots
- Book Appointment
- View Appointments
- Cancel Appointment
- Receive SMS Notification
- Update Profile

### Doctor Use Cases:
- Register Account
- Login
- Manage Schedule
- View Patient Appointments
- Set Unavailability
- Update Profile

---

## 3. SEQUENCE DIAGRAM
Shows the step-by-step flow of booking an appointment.

```mermaid
sequenceDiagram
    actor Patient
    participant Frontend
    participant AppRoute as Appointment Route
    participant AppModel as Appointment Model
    participant SMSService
    participant TwilioAPI
    participant Database
    
    Patient->>Frontend: Fill Booking Form
    Patient->>Frontend: Submit Appointment
    Frontend->>AppRoute: POST /api/appointments/book
    AppRoute->>AppModel: Create Appointment
    AppModel->>Database: Save Appointment
    Database-->>AppModel: Return Appointment ID
    AppRoute->>SMSService: sendAppointmentSMS()
    SMSService->>TwilioAPI: Send SMS with Details
    TwilioAPI-->>SMSService: Message SID
    SMSService-->>AppRoute: Success Response
    AppRoute-->>Frontend: Confirmation (200 OK)
    Frontend-->>Patient: Show Success Message
    Patient->>Patient: Receive SMS Notification
```

### Flow Steps:
1. Patient fills the booking form
2. Frontend submits POST request to API
3. Appointment Route processes the request
4. Appointment is created in the model
5. Data is saved to MongoDB
6. SMS Service is triggered
7. Twilio API sends SMS to patient's phone
8. Success response is returned to frontend
9. Patient receives confirmation message and SMS

---

## 4. SYSTEM ARCHITECTURE DIAGRAM
Shows the overall system architecture and component layers.

```mermaid
graph TB
    subgraph Client["Frontend Layer"]
        HTML["HTML Pages<br/>Login, Dashboard<br/>Booking, Profile"]
        JS["JavaScript<br/>Session Manager<br/>Event Handlers"]
    end
    
    subgraph Server["Backend Server<br/>Express.js"]
        Routes["Routes<br/>- Auth Routes<br/>- Appointment Routes<br/>- Doctor Routes"]
        Middleware["Middleware<br/>- Auth Verification<br/>- CORS"]
        Controllers["Controllers<br/>- User Management<br/>- Appointment Logic<br/>- Doctor Management"]
    end
    
    subgraph Data["Data Layer"]
        Models["Models<br/>- User<br/>- Doctor<br/>- Appointment"]
        MongoDB["MongoDB<br/>MediBridge DB"]
    end
    
    subgraph External["External Services"]
        Twilio["Twilio API<br/>SMS Service"]
    end
    
    HTML -->|HTTP/REST| Middleware
    JS -->|API Calls| Routes
    Routes --> Controllers
    Controllers --> Models
    Models --> MongoDB
    Controllers -->|Trigger| Twilio
    Twilio -->|Send SMS| Client
    
    style Client fill:#e1f5ff
    style Server fill:#f3e5f5
    style Data fill:#e8f5e9
    style External fill:#fff3e0
```

### Architecture Layers:
1. **Frontend Layer**: HTML pages and JavaScript logic
2. **Backend Server**: Express.js with routes, middleware, and controllers
3. **Data Layer**: MongoDB models and database
4. **External Services**: Third-party APIs (Twilio for SMS)

---

## 5. ENTITY RELATIONSHIP DIAGRAM (ERD)
Shows database schema and relationships.

```mermaid
erDiagram
    USER ||--o{ APPOINTMENT : books
    DOCTOR ||--o{ APPOINTMENT : provides
    DOCTOR ||--o{ UNAVAILABILITY : has
    
    USER {
        ObjectId _id PK
        String name
        String email UK
        String password
        String role
        String phone
        Date dob
        String gender
        String address
        DateTime createdAt
        DateTime updatedAt
    }
    
    DOCTOR {
        ObjectId _id PK
        String name
        String email UK
        String password
        String phone
        String specialization
        String role
        Map schedule
        Map bookedSlots
        DateTime createdAt
        DateTime updatedAt
    }
    
    APPOINTMENT {
        ObjectId _id PK
        ObjectId patient_id FK
        ObjectId doctor_id FK
        String date
        String time_slot
        String status
        DateTime createdAt
        DateTime updatedAt
    }
    
    UNAVAILABILITY {
        ObjectId _id PK
        Date fromDate
        Date toDate
        String reason
        DateTime createdAt
    }
```

### Database Tables:

#### USER Table
- **_id**: Primary Key (ObjectId)
- **name**: User's full name
- **email**: User's email (Unique)
- **password**: Hashed password
- **role**: "patient" or "doctor"
- **phone**: User's phone number
- **dob**: Date of birth
- **gender**: Male/Female/Other
- **address**: User's address
- **createdAt**: Record creation timestamp
- **updatedAt**: Record last update timestamp

#### DOCTOR Table
- **_id**: Primary Key (ObjectId)
- **name**: Doctor's name
- **email**: Doctor's email (Unique)
- **password**: Hashed password
- **phone**: Doctor's phone
- **specialization**: Medical specialization
- **role**: Always "doctor"
- **schedule**: Map of available slots per date
- **bookedSlots**: Map of booked slots per date
- **createdAt**: Record creation timestamp
- **updatedAt**: Record last update timestamp

#### APPOINTMENT Table
- **_id**: Primary Key (ObjectId)
- **patient_id**: Foreign Key to USER
- **doctor_id**: Foreign Key to DOCTOR
- **date**: Appointment date
- **time_slot**: Appointment time
- **status**: Pending/Confirmed/Completed/Cancelled
- **createdAt**: Record creation timestamp
- **updatedAt**: Record last update timestamp

#### UNAVAILABILITY Table
- **_id**: Primary Key (ObjectId)
- **fromDate**: Start of unavailable period
- **toDate**: End of unavailable period
- **reason**: Reason for unavailability
- **createdAt**: Record creation timestamp

---

## 6. DATA FLOW DIAGRAM

```mermaid
graph LR
    Patient["Patient"]
    BookingApp["Booking Application"]
    AuthAPI["Authentication<br/>API"]
    AppointmentAPI["Appointment<br/>API"]
    DocumentDB["MongoDB<br/>Database"]
    SMSGateway["SMS Service<br/>Twilio"]
    
    Patient -->|Login Credentials| AuthAPI
    AuthAPI -->|Returns Token| Patient
    Patient -->|Booking Request| BookingApp
    BookingApp -->|API Call| AppointmentAPI
    AppointmentAPI -->|Save Data| DocumentDB
    DocumentDB -->|Acknowledgment| AppointmentAPI
    AppointmentAPI -->|Patient Details| SMSGateway
    SMSGateway -->|SMS Notification| Patient
    SMSGateway -->|Delivery Status| AppointmentAPI
```

---

## How to Use These Diagrams

### Option 1: View in Markdown Viewer
- Copy the Mermaid code blocks
- Paste into any Markdown viewer that supports Mermaid (GitHub, GitLab, Notion, etc.)

### Option 2: Generate Images
1. Visit [Mermaid Live Editor](https://mermaid.live/)
2. Copy each diagram code
3. Paste into the editor
4. Export as PNG or SVG
5. Save to your documentation folder

### Option 3: In VS Code
1. Install "Markdown Preview Mermaid Support" extension
2. Open this file in VS Code
3. Preview the markdown to see rendered diagrams

### Option 4: In Word Document
1. Use an online Mermaid to image converter
2. Run images through a Word document template
3. Add text descriptions from this file

---

## Key Components Summary

| Component | Purpose | Technology |
|-----------|---------|-----------|
| **User Model** | Stores patient and doctor information | MongoDB + Mongoose |
| **Doctor Model** | Manages doctor profiles, schedules, and availability | MongoDB + Mongoose |
| **Appointment Model** | Tracks appointment bookings and status | MongoDB + Mongoose |
| **Auth Middleware** | Verifies user authentication on API routes | Node.js/Express |
| **SMS Service** | Sends appointment notifications to patients | Twilio API |
| **Frontend** | User interface for booking and profile management | HTML/CSS/JavaScript |
| **Express Server** | REST API backend | Node.js + Express |

---

## API Endpoints

```
POST   /api/auth/register          - Register new account
POST   /api/auth/login             - User login
GET    /api/appointments           - Get user's appointments
POST   /api/appointments/book      - Book new appointment
PUT    /api/appointments/:id       - Update appointment
DELETE /api/appointments/:id       - Cancel appointment
GET    /api/doctor                 - Get all doctors
PUT    /api/doctor/schedule        - Update doctor schedule
POST   /api/doctor/unavailability  - Set unavailable dates
```

---

## Document Information
- **Project**: Medical Appointment & SMS Notification System
- **Created**: February 2026
- **Database**: MongoDB (MediBridge)
- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + JavaScript
- **External Service**: Twilio API for SMS

---

## Notes for Documentation
- All diagrams are in Mermaid format for easy editing and conversion
- Use the Class Diagram for technical documentation
- Use the Use Case Diagram for stakeholder presentations
- Use the Sequence Diagram for technical workflows
- Use the ERD for database documentation
- All diagrams include detailed descriptions below each one
