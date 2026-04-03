# MediBridge — DFD Visual Diagrams (Mermaid)

## 0-Level DFD (Context Diagram)

```mermaid
graph LR
    Patient["👤 PATIENT<br/>(User)<br/>─────────<br/>Registration<br/>Login<br/>Book Appointment<br/>Receive SMS"]
    
    System["🔄 MEDBRIDGE<br/>APPOINTMENT<br/>SMS SYSTEM"]
    
    Doctor["👨‍⚕️ DOCTOR<br/>─────────<br/>Login<br/>Update Status<br/>Manage Schedule<br/>Send Updates"]
    
    Patient -->|Registration<br/>Login<br/>Booking| System
    System -->|Status<br/>Responses| Patient
    
    Doctor -->|Login<br/>Status Update| System
    System -->|Appointment<br/>Updates| Doctor
    
    System -->|SMS Trigger| Patient
    
    style Patient fill:#87CEEB,stroke:#000,stroke-width:3px,color:#000
    style System fill:#90EE90,stroke:#000,stroke-width:3px,color:#000
    style Doctor fill:#87CEEB,stroke:#000,stroke-width:3px,color:#000
```

---

## 1-Level DFD (Main Processes & Data Stores)

```mermaid
graph LR
    Patient["👤 PATIENT<br/>────────<br/>Registration<br/>Login<br/>Book Apt<br/>Cancel Apt<br/>Receive SMS"]
    
    subgraph Processes["CORE PROCESSES"]
        P1["<b>1.0</b><br/>Auth<br/>Mgmt"]
        P2["<b>2.0</b><br/>Appt<br/>Mgmt"]
        P3["<b>3.0</b><br/>SMS<br/>Notify"]
    end
    
    subgraph DataStores["DATA STORES"]
        DB1[("D1: Users")]
        DB2[("D2: Doctors")]
        DB3[("D3: Appts")]
    end
    
    Doctor["👨‍⚕️ DOCTOR<br/>────────<br/>Login<br/>Update Appts<br/>Manage Schedule<br/>View Updates<br/>SMS Alerts"]
    
    Patient -->|Register/Login| P1
    Patient -->|Book/Cancel| P2
    P2 -->|Trigger| P3
    P3 -->|SMS| Patient
    
    Doctor -->|Login/Auth| P1
    Doctor -->|Manage| P2
    P2 -->|Updates| Doctor
    
    P1 <-->|User/Doctor Data| DB1
    P1 <-->|Doctor Info| DB2
    P2 <-->|Appointment Data| DB3
    P3 -->|Fetch Phone| DB1
    P3 -->|Fetch Details| DB3
    
    style Patient fill:#87CEEB,stroke:#000,stroke-width:2px
    style Doctor fill:#87CEEB,stroke:#000,stroke-width:2px
    style P1 fill:#FFE4B5,stroke:#000,stroke-width:2px
    style P2 fill:#FFE4B5,stroke:#000,stroke-width:2px
    style P3 fill:#FFE4B5,stroke:#000,stroke-width:2px
    style DB1 fill:#F0F8FF,stroke:#000,stroke-width:2px
    style DB2 fill:#F0F8FF,stroke:#000,stroke-width:2px
    style DB3 fill:#F0F8FF,stroke:#000,stroke-width:2px
```

---

## 2-Level DFD - Process 1.0 (Auth Management)

```mermaid
graph LR
    Input["INPUT<br/>────────<br/>Email<br/>Password<br/><br/>Profile<br/>Data"]
    
    subgraph Process["PROCESS 1.0 - AUTH"]
        P11["<b>1.1</b><br/>Register"]
        P12["<b>1.2</b><br/>Validate<br/>Creds"]
        P13["<b>1.3</b><br/>Store/<br/>Retrieve"]
        HASH["Hash<br/>Pwd"]
        JWT["Generate<br/>JWT"]
    end
    
    subgraph DataStores["DATABASES"]
        DB1[("D1: Users")]
        DB2[("D2: Doctors")]
    end
    
    Output["OUTPUT<br/>────────<br/>Success ✓<br/>JWT Token<br/>User ID<br/><br/>Error ✗"]
    
    Input -->|New User| P11
    P11 --> HASH
    HASH --> P13
    P13 -->|Store| DB1
    
    Input -->|New Doctor| P11
    P11 --> HASH
    HASH --> P13
    P13 -->|Store| DB2
    
    Input -->|Existing| P12
    DB1 -->|Fetch| P12
    DB2 -->|Fetch| P12
    P12 -->|Valid| JWT
    JWT --> Output
    P12 -->|Invalid| Output
    P13 --> Output
    
    style Input fill:#87CEEB,stroke:#000,stroke-width:2px
    style Output fill:#90EE90,stroke:#000,stroke-width:2px
    style P11 fill:#FFFACD,stroke:#000,stroke-width:2px
    style P12 fill:#FFFACD,stroke:#000,stroke-width:2px
    style P13 fill:#FFFACD,stroke:#000,stroke-width:2px
    style HASH fill:#EEE8AA
    style JWT fill:#EEE8AA
    style DB1 fill:#F0F8FF
    style DB2 fill:#F0F8FF
```

---

## 2-Level DFD - Process 2.0 (Appointment Management)

```mermaid
graph LR
    Input["INPUT<br/>────────<br/>Patient ID<br/>Date<br/>Time Slot<br/><br/>Doctor ID<br/>New Status"]
    
    subgraph Process["PROCESS 2.0 - APPT MGMT"]
        P21["<b>2.1</b><br/>Book<br/>Appt"]
        P22["<b>2.2</b><br/>Update<br/>Status"]
        P23["<b>2.3</b><br/>Cancel<br/>Appt"]
        VALIDATE["Validate<br/>Avail"]
        CHECK["Check<br/>Schedule"]
        NOTIFY["Trigger<br/>SMS 3.0"]
    end
    
    DB3[("D3:<br/>Appointments")]
    
    Output["OUTPUT<br/>────────<br/>Booked ✓<br/>Appt ID<br/><br/>Updated ✓<br/>Cancelled ✓<br/><br/>Error ✗"]
    
    Input -->|Book| P21
    Input -->|Update| P22
    Input -->|Cancel| P23
    
    P21 --> VALIDATE
    P22 --> VALIDATE
    P23 --> VALIDATE
    
    VALIDATE --> CHECK
    DB3 -->|Query| CHECK
    
    CHECK -->|Available| P21
    CHECK -->|Available| P22
    CHECK -->|Exists| P23
    
    P21 -->|Create| DB3
    P22 -->|Update| DB3
    P23 -->|Cancel| DB3
    
    P21 --> NOTIFY
    P22 --> NOTIFY
    P23 --> NOTIFY
    
    DB3 --> Output
    
    style Input fill:#87CEEB,stroke:#000,stroke-width:2px
    style Output fill:#90EE90,stroke:#000,stroke-width:2px
    style P21 fill:#FFE4C4,stroke:#000,stroke-width:2px
    style P22 fill:#FFE4C4,stroke:#000,stroke-width:2px
    style P23 fill:#FFE4C4,stroke:#000,stroke-width:2px
    style VALIDATE fill:#F5DEB3
    style CHECK fill:#F5DEB3
    style NOTIFY fill:#FFB6C1
    style DB3 fill:#F0F8FF,stroke:#000,stroke-width:2px
```

---

## 2-Level DFD - Process 3.0 (Notification Service)

```mermaid
graph LR
    Trigger["TRIGGER<br/>────────<br/>Status<br/>Changed<br/>to:<br/>Confirmed<br/>Cancelled<br/>Completed"]
    
    subgraph Process["PROCESS 3.0 - SMS NOTIFY"]
        P31["<b>3.1</b><br/>Check<br/>Status"]
        P32["<b>3.2</b><br/>Fetch<br/>Data"]
        P33["<b>3.3</b><br/>Format<br/>Message"]
        P34["<b>3.4</b><br/>Send<br/>SMS"]
    end
    
    subgraph DataStores["DATA STORES"]
        DB1[("D1: Users")]
        DB3[("D3: Appts")]
    end
    
    Output["OUTPUT<br/>────────<br/>SMS Sent ✓<br/>Delivered<br/><br/>Failed ✗<br/>Queued ⧖<br/><br/>Patient<br/>Notified"]
    
    Trigger --> P31
    P31 -->|Validate| P32
    DB3 -->|Appt Data| P32
    DB1 -->|Phone| P32
    P32 -->|Data| P33
    P33 -->|Formatted| P34
    P34 --> Output
    
    style Trigger fill:#87CEEB,stroke:#000,stroke-width:2px
    style Output fill:#90EE90,stroke:#000,stroke-width:2px
    style P31 fill:#FFE4C4,stroke:#000,stroke-width:2px
    style P32 fill:#FFE4C4,stroke:#000,stroke-width:2px
    style P33 fill:#FFE4C4,stroke:#000,stroke-width:2px
    style P34 fill:#FFE4C4,stroke:#000,stroke-width:2px
    style DB1 fill:#F0F8FF
    style DB3 fill:#F0F8FF
```

---

## 3-Level DFD - Process 2.1 (Book Appointment)

```mermaid
graph LR
    Input["INPUT<br/>────────<br/>Patient ID<br/>Date<br/>Time Slot<br/><br/>JWT Token"]
    
    subgraph Process["PROCESS 2.1.1→2.1.5"]
        P211["<b>2.1.1</b><br/>Auth<br/>JWT"]
        P212["<b>2.1.2</b><br/>Find<br/>Doctor"]
        P213["<b>2.1.3</b><br/>Check<br/>Slot"]
        P214["<b>2.1.4</b><br/>Create<br/>Record"]
        P215["<b>2.1.5</b><br/>Store<br/>DB"]
    end
    
    subgraph DataStores["DATA STORES"]
        DB2[("D2:<br/>Doctors")]
        DB3[("D3:<br/>Appts")]
    end
    
    Output["OUTPUT<br/>────────<br/>Booked ✓<br/>Appt ID<br/>Details<br/><br/>Error ✗<br/>Slot Full<br/>Invalid Token"]
    
    Input --> P211
    P211 -->|Valid| P212
    P211 -->|Invalid| Output
    P212 -->|Find| DB2
    DB2 -->|Info| P212
    P212 --> P213
    P213 -->|Query| DB3
    P213 -->|Available| P214
    P213 -->|Full| Output
    P214 --> P215
    P215 -->|Save| DB3
    DB3 --> Output
    
    style Input fill:#87CEEB,stroke:#000,stroke-width:2px
    style Output fill:#90EE90,stroke:#000,stroke-width:2px
    style P211 fill:#F0E68C,stroke:#000,stroke-width:2px
    style P212 fill:#F0E68C,stroke:#000,stroke-width:2px
    style P213 fill:#F0E68C,stroke:#000,stroke-width:2px
    style P214 fill:#F0E68C,stroke:#000,stroke-width:2px
    style P215 fill:#F0E68C,stroke:#000,stroke-width:2px
    style DB2 fill:#F0F8FF
    style DB3 fill:#F0F8FF
```

---

## 3-Level DFD - Process 3.4 (Send SMS via Twilio)

```mermaid
graph LR
    Input["INPUT<br/>────────<br/>Message<br/>Phone<br/>Number<br/><br/>Country<br/>Code<br/>Status<br/>Flag"]
    
    subgraph Process["PROCESS 3.4.1→3.4.3"]
        P341["<b>3.4.1</b><br/>Format<br/>Phone<br/>+Code"]
        P342["<b>3.4.2</b><br/>Call<br/>Twilio<br/>API"]
        P343["<b>3.4.3</b><br/>Log<br/>Status"]
    end
    
    Twilio["TWILIO<br/>SMS GATEWAY<br/>────────<br/>Cloud Service<br/>SMS Delivery"]
    
    Output["OUTPUT<br/>────────<br/>Delivered ✓<br/><br/>Failed ✗<br/>Queued ⧖<br/><br/>Patient<br/>SMS<br/>Notified"]
    
    Input --> P341
    P341 -->|Formatted| P342
    P342 -->|API Call| Twilio
    Twilio -->|Response| P343
    P343 --> Output
    Twilio -->|Delivered| Output
    
    style Input fill:#87CEEB,stroke:#000,stroke-width:2px
    style Output fill:#90EE90,stroke:#000,stroke-width:2px
    style P341 fill:#FFC0CB,stroke:#000,stroke-width:2px
    style P342 fill:#FFC0CB,stroke:#000,stroke-width:2px
    style P343 fill:#FFC0CB,stroke:#000,stroke-width:2px
    style Twilio fill:#FFB6C1,stroke:#000,stroke-width:2px
```

---

## Complete Data Flow Mapping (All Levels Summary)

```mermaid
graph LR
    Patient["👤 PATIENT<br/>────────<br/>Register<br/>Login<br/>Book Apt<br/>Cancel<br/>Get Updates"]
    
    subgraph CoreSystem["🔄 MEDBRIDGE SYSTEM"]
        P1["1.0<br/>AUTH"]
        P2["2.0<br/>APPT<br/>MGMT"]
        P3["3.0<br/>SMS<br/>NOTIFY"]
    end
    
    subgraph AllData["📊 ALL DATA STORES"]
        D1[("D1:<br/>Users")]
        D2[("D2:<br/>Doctors")]
        D3[("D3:<br/>Appts")]
    end
    
    Doctor["👨‍⚕️ DOCTOR<br/>────────<br/>Login<br/>View Schedule<br/>Update Status<br/>Manage Appts<br/>Receive Alerts"]
    
    Patient -->|Register/Login| P1
    Patient -->|Book/Cancel| P2
    P2 -->|Trigger| P3
    P3 -->|Notify| Patient
    
    Doctor -->|Auth| P1
    Doctor -->|Manage| P2
    P2 -->|Update| Doctor
    
    P1 <-->|Users| D1
    P1 <-->|Doctors| D2
    P2 <-->|Appointments| D3
    P3 -->|Query| D1
    P3 -->|Query| D3
    
    style Patient fill:#87CEEB,stroke:#000,stroke-width:3px
    style Doctor fill:#87CEEB,stroke:#000,stroke-width:3px
    style P1 fill:#FFFACD,stroke:#000,stroke-width:2px
    style P2 fill:#FFFACD,stroke:#000,stroke-width:2px
    style P3 fill:#FFE4C4,stroke:#000,stroke-width:2px
    style D1 fill:#E6F3FF,stroke:#000,stroke-width:2px
    style D2 fill:#E6F3FF,stroke:#000,stroke-width:2px
    style D3 fill:#E6F3FF,stroke:#000,stroke-width:2px
```

---

## Process Description Table

| Process | Input | Output | Data Stores |
|---------|-------|--------|-------------|
| **1.0 Auth** | Email, Password | JWT Token / User ID | D1, D2 |
| **2.1 Book** | Patient ID, Date, Slot | Appointment ID | D2, D3 |
| **2.2 Update** | Appointment ID, Status | Updated Record | D3 |
| **2.3 Cancel** | Appointment ID | Cancelled Record | D3 |
| **3.1 Check** | Status Trigger | Status Validation | D3 |
| **3.2 Fetch** | Appointment ID | Patient + Appt Data | D1, D3 |
| **3.3 Format** | Status + Data | SMS Message | - |
| **3.4 Send** | Phone + Message | SMS Sent Status | Twilio |

