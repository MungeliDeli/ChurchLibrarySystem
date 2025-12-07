**Table of Contents**

**A. Background and Supplier Guide 4**  
  A1. Background and Vision  
  A2. Supplier Guide  
  A3. Overall Solution and Alternatives

**B. High‑Level Demands 8**  
  B1. Flows  
  B2. Business Goals  
  B3. Early Proof of Concept  
  B4. Minimum Requirements & Selection Criteria  
  B5. Benefit in Dollar (Net Business Value)  
  B6. Selection Criteria: Score Points per Dollar

**C. Tasks to Support 12**  
  Work Area 1: Content Access & Reading  
    C1. Browse Church Library Content  
    C2. Read Church Material  
    C3. Highlight & Annotate Text  
  Work Area 2: User Management & Personalization  
    C4. Register or Authenticate User  
    C5. Manage Reading List or Schedule  
  Work Area 3: Content Administration  
    C6. Upload New Content  
    C7. Edit or Update Existing Content  
  Work Area 4: System Monitoring & Configuration  
    C8. View and Filter Activity Logs  
  Work Area 5: Offline Access Management  
    C9. Download Content for Offline Reading  
  Work Area 6: Analytics & Insights (Future)  
    C10. View Personal Reading Statistics  
  Work Area 7: AI‑Powered Interactions (Future)  
    C11. Ask AI Chatbot a Question

**D. Data to Record 29**  
  D0. Common Fields  
  D1. Library Item  
  D2. Category  
  D3. User  
  D5. Review

**E. Other Functional Requirements 32**  
  E1. System Generated Events (Reminders & Notifications)  
  E2. Reports (Usage & Analytics)  
  E3. Business Rules & Complex Calculations  
  E4. Expansion of the System

**F. Integration with External Systems 34**  
  F1. Google & Facebook OAuth  
  F2. AI Chatbot API (Future)  
  F3. Payment Gateway Integration (Future)  
  F4. Cloud Storage Integration (S3 or Equivalent)

**G. Technical IT Architecture 38**  
  G1. Presentation Layer  
  G2. Application Layer (Module Responsibilities)  
  G3. Domain Layer  
  G4. Infrastructure Layer  
  G5. Data Access Layer  
  G6. External Services

**H. Security 40**  
  H1. Login & Access Rights  
  H2. Protection Against Data Loss  
  H3. Protection Against Unintended Actions  
  H4. Protection Against Threats

**I. Usability and Design 42**  
  I1. Ease‑of‑Learning & Task Efficiency  
  I2. Accessibility & Look‑and‑Feel (WCAG 2.1 AA)

**J. Other Requirements and Deliverables 48**  
  J1. Other Standards to Obey  
  J2. User Training  
  J3. Documentation  
  J4. Data Conversion  
  J5. Installation  
  J6. Testing the System  
  J7. Phasing Out

**K. The Customer's Deliverables -**

**L. Operation, Support, and Maintenance 50**  
  L1. Response Times  
  L2. Availability  
  L3. Data Storage  
  L4. Support  
  L5. Maintenance

**M. Traceability Matrix 52**

# A. Background and Supplier Guide {#a.-background-and-supplier-guide}

A1. Background and Vision  
Currently, the church's library is mostly managed via paper sign‑out
sheets, spreadsheets, and a basic file‑share for digital resources. This
manual approach leads to:

- Lost or overdue books with limited tracking

- Time‑consuming catalog lookups by staff and members

- Fragmented digital content stored in disparate folders

- No self‑service access outside of church hours

The goal is to replace this ad hoc setup with a unified web application
that:

1.  **Improves Accessibility:** 24/7 online catalog browsing and
    self‑service downloads

2.  **Enhances Usability:** Streamlined search, reading, annotation, and
    scheduling workflows

3.  **Supports Staff Efficiency:** Centralized content management,
    automated notifications, and reporting

Below is a high‑level context overview. Double‑border boxes and arrows
indicate the supplier's delivery scope and integrations to be
implemented.

| Actors & Systems                                                                                                                                     |
|------------------------------------------------------------------------------------------------------------------------------------------------------|
| • Members / Guests → Paper sign‑out sheets & phone/email requests → Library Team • Staff → Spreadsheet & file‑share for digital assets → Book Record |

| Actors & Systems                                                                                           |
|------------------------------------------------------------------------------------------------------------|
| • Members / Guests → Church Library App ←→ Library Staff → Admin Console → (Manage content, Logs, Reports) |

- The **Church Library App** (double‑border box) is the supplier's
  primary deliverable.

- **Integrations to deliver** (double‑lined arrows):

This new system will provide a single, cohesive platform for both
digital content, enabling both members and staff to complete their tasks
efficiently and reliably.

### Current vs visioned system

![](media/image1.jpg){width="6.4in" height="7.3in"}

### A2 Supplier guide

Column 1 shows the customer's high‑level demands (from B2 Business Goals
and B1 Flows); Column 2 (in red) is the supplier's concise proposal for
how to meet each; and Column 3 is a shorthand code for tracking and
prioritization.

| Requirement                                                                                                                                          | Supplier Proposal                                                                                                                                                   | Code    |
|------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| BG1. Improve accessibility of church content Make all library materials easily discoverable and usable by members on any device, logged in or guest. | Implement a responsive React Native frontend with full‑text Elasticsearch-powered search, offline download support (PDF/EPUB/MP3) and i18n for UI/content metadata. | BG1 P1  |
| BG2. Provide ease of use of system (Usability) Offer an intuitive, streamlined experience so users accomplish common tasks with minimal training.    | Design "one‑click" workflows in Figma, integrate guided tours, tooltips, and a role‑based dashboard using accessible WCAG 2.1 AA components.                        | BG2 P1  |
| BG3. Efficient support of all user & admin tasks Tasks---from browsing to maintenance---must be quick and reliable without context‑switches.         | Build a RESTful API (Node.js/Express) with RBAC; React Native UI for U1--U19 flows; server‑side pagination & caching; bulk import/export endpoints;                 | BG3 P1  |
| BG4. Maintainability of the system Platform must be modular, well‑documented, and testable for easy updates and extensions.                          | A layered architecture, document all endpoints via, use version control like git hub to keep track of file changes and collaboration.                               | BG4 P1  |
| BG5. Low operational costs of the system Minimize hosting, maintenance, and support expenses.                                                        | Leverage open‑source stack (SQLite, Elasticsearch),                                                                                                                 | BG5 P1  |
| U‑Search: Full‑text search & filters Allow filtering by type, language, availability, etc.                                                           | Index all content in Elasticsearch; expose faceted search API; integrate React InstantSearch for UI components.                                                     | C5‑1 P1 |
| U‑Annotate: Highlight, notes, bookmarks, Read List and Schedule Enable users to mark and comment on passages.                                        | Use a WebSocket‑backed annotation service (e.g. Annotorious) storing metadata in SQLite or Json; UI overlays in the reader component.                               | C7‑2 P2 |
| NFR‑Performance: Response times Search \< 3 s, page loads \< 2 s under 100 concurrent users.                                                         | Benchmark with Locust; deploy Redis caching for hot data; horizontally scale web tier behind a load‑balancer.                                                       | L1 P1   |
| NFR‑Usability: WCAG 2.1 AA compliance Ensure high‑contrast, keyboard nav, ARIA labels.                                                               | Use React‑Aria and ESLint plugin "jsx‑a11y"; conduct axe‑core automated scans in CI.                                                                                | I1 P1   |

## B. High Level Demands {#b.-high-level-demands}

### B1. Flows {#b1.-flows}

Below are the two high‑level flows for the Church Library System

**Notation:**

- **Step** = a logical stage in the overall flow

- **Tasks & Subtasks** = the physical, user‑visible operations that
  fulfill that step

- "(opt)" = optional; "(↻)" = repeatable

**User Flow: Content Discovery & Interaction**

<table>
<colgroup>
<col style="width: 26%" />
<col style="width: 73%" />
</colgroup>
<thead>
<tr class="header">
<th>Step</th>
<th>Tasks &amp; Subtasks</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>1. Access App</td>
<td>• Open mobile app (browse UI loads) (U1)</td>
</tr>
<tr class="even">
<td>2. Browse or Sign‑In</td>
<td>• Browse anonymously (U2)• Sign in / register (email, password,
OAuth) (U3)</td>
</tr>
<tr class="odd">
<td>3. Language Selection (opt)</td>
<td>• Choose Book language (dropdown or profile setting) (U4)</td>
</tr>
<tr class="even">
<td>4. Browse Catalog</td>
<td>• Navigate categories: Books, Bible, Leaflets (U5)• View “New
Arrivals,” “Staff Picks,” “Most Read” (U6)</td>
</tr>
<tr class="odd">
<td>5. Read Content (↻)</td>
<td>• Open reader view for chosen item (U7)• Page‑turn or scroll through
text (U8)</td>
</tr>
<tr class="even">
<td>6. Search Specific Content (opt)</td>
<td>• Enter keyword/phrase (title, verse, topic) (U9)• Apply filters
(type, date, language) (U10)• Jump to result (U11)</td>
</tr>
<tr class="odd">
<td>7. Annotate &amp; Save (opt, ↻)</td>
<td>• Highlight passages (U12)• Write/edit personal notes (U13)•
Bookmark or “Save for later” (U14)</td>
</tr>
<tr class="even">
<td>8. Download Content (opt, ↻)</td>
<td>• Download Content(Make available offline) (U15)</td>
</tr>
<tr class="odd">
<td>9. Create Reading Schedule (opt)</td>
<td>• Define schedule (dates, reminders) (U16)• Notification reminders
(U17)</td>
</tr>
<tr class="even">
<td>10. Request for a Bible Study(opt)</td>
<td><ul>
<li><p>Fill in request form (U18)</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>11. Logout / Exit (opt)</td>
<td>• Sign out (U19) / Close App (U20)</td>
</tr>
</tbody>
</table>

**Notes:**

- Steps 3, 6--9 are optional---users may skip language selection,
  searching, annotating, downloading, or scheduling.

- Steps 5 and 7 can repeat any number of times during a session (↻).

**Admin Flow: Content & Log Management**

| Step                           | Tasks & Subtasks                                                                                             |
|--------------------------------|--------------------------------------------------------------------------------------------------------------|
| 1\. Admin Sign‑In              | • Authenticate via secure login (2FA optional) (A1)                                                          |
| 2\. Dashboard & Logs           | • View system activity logs (A2)• Filter/search logs by user, date, action (A3)• Export or archive logs (A4) |
| 3\. Content Upload (opt)       | • Upload new Books, Bible editions, Leaflets (A5)• Bulk import via CSV/XML (A6)                              |
| 4\. Content Update (opt)       | • Edit metadata (title, author, ISBN, language) (A7)• Replace file / update cover image (A8)                 |
| 5\. Content Deletion (opt)     | • Soft‑delete or purge items (A9)• Manage status (A10)                                                       |
| 6\. System Configuration (opt) | • Download limits, UI text & languages (A11)• Manage user roles & permissions (A12)                          |
| 7\. Admin Sign‑Out             | • Securely log out (A13)                                                                                     |

**Notes:**

- Steps 3--6 are optional and may be invoked in any order based on daily
  operations.

- Viewing logs (Step 2) and content management (Steps 3--5) can repeat
  as needed.

### B2. Business goals {#b2.-business-goals}

| Business Goal                                     | Solution Vision                                                                                                                                                           | Related Requirements                                                                                                                                                                                                                                                                                                            | Deadline                                |
|---------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| BG1. Improve accessibility of church content      | Make all library materials (books, Bible, leaflets) easily discoverable and usable by every member of the congregation, whether on desktop or mobile, logged in or guest. | • Responsive UI supporting desktop, tablet, mobile (WCAG‑inspired) (NFR‑Usability) • Anonymous browsing of catalog (U2) • Full‑text search across all content types (F‑Search) • Downloadable for offline access (F‑Download) • content metadata (U4, F‑Metadata)                                                               | Launch (4 months)                       |
| BG 2. Provide ease of use of system (Usability)   | Offer an intuitive, streamlined experience so that both members and staff can accomplish common tasks with minimal clicks and training.                                   | • Clean, consistent navigation & clear CTAs (NFR‑Usability) • "One‑click" borrow/read/download workflows (U7, U15) • In‑app help/tooltips and searchable FAQ (F‑Help) • Bookmarking, highlighting, and note tools with easy access (U12--U14) • Role‑based dashboards tuned to user needs (U5, A2, A6)                          | Launch (4 months)                       |
| BG 3. Efficient support of all user & admin tasks | Ensure every routine task---from searching maintenance and reporting---can be completed quickly and reliably without switching systems.                                   | • RBAC with streamlined user and admin flows (U3, A1, A12) • Fast search responses \< 3 s, page loads \< 5 s (NFR‑Performance) • Bulk import/export for book, bible or leaflet and member data (A6, F‑Import) • Automated notifications (due reminders, holds ready) (F‑Notifications) • In‑app logging & audit trails (A2, A3) | MVP (4 months)                          |
| BG4. Maintainability of the system                | Build a modular, well‑documented platform that can be easily updated, extended, and tested by the development and operations teams.                                       | • API‑first architecture with clear • Automated unit, integration, and end‑to‑end tests (NFR‑Quality) • Modular codebase and layered architecture or plugin components (NFR‑Maintainability)                                                                                                                                    | Ongoing; review at 4 months post‑launch |
| BG5. Low operational costs of the system          | Keep hosting, maintenance, and support expenses minimal by leveraging cloud services, open‑source components, and efficient resource usage.                               | • Auto‑scaling infrastructure (NFR‑Scalability) • Use of open‑source libraries and databases (NFR‑Cost) • Automated backups and monitoring to reduce manual overhead (A4, NFR‑Reliability) • Budget tracking & alerts in admin dashboard (A11)                                                                                  | Budget cycle Q3 2025                    |

### B3. Early proof of concept {#b3.-early-proof-of-concept}

Early Proof‑of‑Concept plan for the highest‑risk aspects of the System

| Proof ID | Area / What to Prove          | Proof of Concept / Test                                                                                                                                                                                                             | Requirements Reference                                       | Deadline |
|----------|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|----------|
| B3‑1     | UI & Core Content Interaction | Develop clickable prototype (HTML or Figma) of home screen → browse/catalog → reader (with highlight, notes, bookmark) → download → schedule flows. Have 5 representative users "think aloud" while stepping through U1--U19 tasks. | U1--U19 (User Flow steps 1--10), NFR‑Usability               | 93 days  |
| B3‑2     | Usability End‑to‑End          | Conduct moderated usability test (5--8 members & 2 staff) on prototype screens covering search, read, annotate, download, schedule. Measure task success rate, time on task, SUS ≥75.                                               | All I1 usability requirements (clean nav, tooltips, WCAG AA) | 93 days  |

# C Tasks to support

## Work Area 1: Content Access & Reading {#work-area-1-content-access-reading}

**Purpose:** Enable church members and guests to browse, search, read,
and interact with church materials.

**Primary Users:**

- **Registered Users:** Church members or regular readers with accounts.

- **Anonymous Users:** Visitors who can browse and preview content
  without logging in.

**Environment:**

- Mobile apps (Android/iOS)

- Web front-end

- Varying device sizes and internet availability

### C1. Browse Church Library Content {#c1.-browse-church-library-content}

**Introduction:**  
This task allows users to explore available church content based on
categories, topics, languages, or popularity. It begins when the user
lands on the content dashboard and ends when they exit browsing or
select a content item to read.

**Start:**

- User opens app or web page

- Landing page or search panel loads

**End:**

- User exits browsing

- OR selects an item to read

**Frequency:**

- Per user: Multiple times per session

- Total: Hundreds per day across the user base

**Difficult:**

- When filters don't return expected results or categories are
  overloaded

**Users:**

- Anonymous users

- Registered users

**Subtasks & Variants**

| Subtask / Variant / Problem                              | Example Solution                                       |
|----------------------------------------------------------|--------------------------------------------------------|
| 1\. Display all available content                        | System fetches paginated list from DB                  |
| 2\. Filter by category (e.g., Prophecy, Sabbath Keeping) | User selects filter from dropdown                      |
| 3\. Filter by language (e.g., English, Bemba)            | System shows only language-matched items               |
| 4\. Display "New Arrivals" and "Most Read"               | System calculates based on metadata                    |
| 5\. Allow anonymous browsing                             | System enables guest access with limited interactivity |
| 6p. Problem: Overloaded or ambiguous categories          | Admin reviews category design for better UX            |
| 7\. View brief description or metadata                   | System shows title, summary, author, etc.              |
| 8\. Select an item to read → transitions to Task C2      | System passes item ID to reader view                   |

###  C2. Read Church Material {#c2.-read-church-material}

**Introduction:**  
This task enables users to open a selected material and read it using a
built-in reader view. It starts when a user clicks on an item and ends
when they exit the reader.

**Start:**

- User selects content from browse or search results

**End:**

- User exits reader view or closes the app

**Frequency:**

- Per user: Once per item per session

- System-wide: High daily use

**Difficult:**

- When long texts are hard to scroll or render on smaller screens

**Users:**

- Registered & anonymous users

**Subtasks & Variants**

| Subtask / Variant / Problem                                  | Example Solution                                     |
|--------------------------------------------------------------|------------------------------------------------------|
| 1\. Load content into reader view                            | System fetches full text from DB or file             |
| 2\. Render pages or continuous scroll                        | User can swipe/scroll vertically or horizontally     |
| 3\. Toggle font size                                         | UI provides accessibility settings                   |
| 4\. Adapt document layout for device size                    | System uses responsive design (HTML/EPUB conversion) |
| 5p. Problem: Original files are only in PDF and hard to read | System converts PDFs to HTML/EPUB for mobile         |
| 6\. Exit reader                                              | User taps \"Back\" or closes app                     |

### 

###  C3. Highlight & Annotate Text {#c3.-highlight-annotate-text}

**Introduction:**  
This task allows users to highlight scripture or passages and attach
personal notes. It starts when a user selects a portion of text and ends
when they save, cancel, or exit the interaction.

**Start:**

- User taps and selects a passage in reader view

**End:**

- Highlight or note is saved

- OR user cancels or exits

**Frequency:**

- Per user: Occasionally, based on reading patterns

**Difficult:**

- On smaller screens or with long passages

**Users:**

- Registered users only (data tied to user profile)

**Subtasks & Variants**

| Subtask / Variant / Problem                              | Example Solution                             |
|----------------------------------------------------------|----------------------------------------------|
| 1\. Select a text passage                                | User taps-and-holds or drags over text       |
| 2\. Choose highlight color                               | UI shows color palette                       |
| 3\. Add/edit personal note                               | Text input box appears with save option      |
| 4\. Save highlight & note to profile                     | Data is stored in user-specific DB table     |
| 5\. View existing highlights                             | Reader loads user annotations per content ID |
| 6p. Problem: Confusion between personal and public notes | System clearly marks annotations as private  |
| 7\. Remove or edit highlights                            | User accesses "My Annotations" menu          |

**Requirement Notes (C3):**

- Notes and highlights should sync with user profiles and be stored
  securely.

- Anonymous users cannot access this feature.

- Each annotation should be tied to a specific content ID and passage
  location.

## Work Area 2: User Management & Personalization {#work-area-2-user-management-personalization}

**Purpose:** Handle registration, login, authentication, and personal
content tracking.

**Primary Users:**

- **New Users:** First-time visitors registering manually or via social
  login**.**

- **Returning Users:** Regular readers who manage personal reading
  preferences.

**Environment:**

- Mobile

- Secure authentication endpoints

### C4. Register or Authenticate User {#c4.-register-or-authenticate-user}

**Introduction:**  
This task enables users to access protected and personalized features by
registering or signing into the system. It begins when a user lands on
the authentication screen and ends upon successful login or account
creation.

**Start:**

- User clicks "Login" or "Register"

**End:**

- User is authenticated and redirected to dashboard

**Frequency:**

- Per user: 1--2 times per session (rarely repeated after session
  persists)

- System-wide: Moderate, especially on new sessions/devices

**Difficult:**

- When third-party (Google/Facebook) auth fails or internet is unstable

**Users:**

- All app users requiring personalization (notes, highlights, reading
  lists)

**Subtasks & Variants**

| Subtask / Variant / Problem                                | Example Solution                                         |
|------------------------------------------------------------|----------------------------------------------------------|
| 1\. Display login/registration form                        | System loads login UI with option tabs                   |
| 2\. Enter email/password or choose social login            | User fills in credentials or taps Google/Facebook button |
| 3a. Authenticate via email/password                        | System validates user via secure backend                 |
| 3b. Authenticate via OAuth (Google/Facebook)               | OAuth token exchanged and verified                       |
| 3p. Problem: Third-party login fails due to network issues | System retries and shows fallback option                 |
| 4\. Redirect user to personalized dashboard                | Session is initialized; token is stored securely         |
| 5\. Log out securely                                       | Token/session is destroyed and user is redirected        |

### C5. Manage Reading List or Schedule {#c5.-manage-reading-list-or-schedule}

**Introduction:**  
This task allows users to create, update, or delete a list of materials
they plan to read later or on a schedule. It starts when the user enters
the reading list interface and ends when the list is saved, modified, or
exited.

**Start:**

- User navigates to "My Reading List" or "Reading Plan"

**End:**

- List is updated or the user exits

**Frequency:**

- Varies by user --- typically weekly or bi-weekly interaction

- Important for spiritual growth and planning

**Difficult:**

- When managing a long list across devices or syncing issues occur

**Users:**

- Registered users only

**Subtasks & Variants**

| Subtask / Variant / Problem                      | Example Solution                                             |
|--------------------------------------------------|--------------------------------------------------------------|
| 1\. View current reading list                    | System fetches list from user profile                        |
| 2\. Add a new book to the list                   | User taps "Add to Reading List" on book page                 |
| 3\. Remove or reorder items                      | Drag/drop interface or delete button                         |
| 4\. Set reading schedule/reminders               | User inputs timeframes or selects presets                    |
| 4a. Sync schedule with calendar (future feature) | System uses Google Calendar API or device-native integration |
| 5p. Problem: User loses list after logout        | System persists list in secure cloud storage                 |
| 6\. Save changes                                 | System validates and stores updated list                     |

**Requirement Notes (C5):**

- Reading list should sync across devices using user's unique ID.

- List should be stored in cloud DB with optional offline caching.

- Reading reminders can be integrated with notification services.

## Work Area 3: Content Administration

**Purpose:** Internal staff upload, manage, categorize, and maintain
content in the library system.

**Primary Users:**

- **Library Admins:** Full control over content, users, categories,
  system settings.

- **Content Managers/Curators:** May have limited permissions to
  upload/edit.

**Environment:**

- Admin Web Portal

- Office setting with stable internet and full-screen interface

### C6. Upload New Content {#c6.-upload-new-content}

**Introduction:**  
This task allows admins to upload new books, Bible versions, leaflets,
or church documents into the library system. It starts when an admin
accesses the upload panel and ends when the new item is successfully
published.

**Start:**

- Admin clicks "Upload Content" in backend portal

**End:**

- Content is published and indexed in the library system

**Frequency:**

- Weekly uploads depending on church publishing cadence

**Difficult:**

- When file formats are inconsistent or metadata is incomplete

**Users:**

- Admins

- Content managers

**Subtasks & Variants**

| Subtask / Variant / Problem                          | Example Solution                                       |
|------------------------------------------------------|--------------------------------------------------------|
| 1\. Select file to upload (PDF, EPUB, DOCX, etc.)    | Admin browses and selects file from device             |
| 2\. Enter metadata (title, author, date, etc.)       | Form includes validations and dropdowns                |
| 3\. Select category (e.g., Doctrine, History)        | Category pulled from predefined or dynamic list        |
| 4\. Assign language                                  | Admin selects from language dropdown                   |
| 5\. Upload cover image                               | Image file is added via drag-and-drop or selector      |
| 6\. Submit and publish item                          | System processes file and indexes content              |
| 6p. Problem: File upload fails due to size or format | System validates file and shows detailed error message |
| 7\. Receive confirmation or error feedback           | System displays success or error message with details  |

**Requirement Notes (C6):**

- File upload size and format validation must be enforced
  pre-submission.

- Admins must be able to preview uploaded content before final
  publishing.

- Cover image should be optional but recommended for UX.

### C7. Edit or Update Existing Content {#c7.-edit-or-update-existing-content}

**Introduction:**  
This task enables admins to update existing entries in the library ---
either by changing metadata, replacing content files, or correcting
categorization errors. It starts when an item is selected and ends when
changes are saved.

**Start:**

- Admin searches or navigates to a specific item

**End:**

- Metadata or file is updated and saved

**Frequency:**

- As needed --- typically after content audits or correction requests

**Difficult:**

- When data inconsistency or file versioning creates confusion

**Users:**

- Admins

**Subtasks & Variants**

| Subtask / Variant / Problem                                      | Example Solution                               |
|------------------------------------------------------------------|------------------------------------------------|
| 1\. Search for or browse to content                              | Admin uses search bar or filters               |
| 2\. Open metadata editor                                         | System loads form pre-filled with current data |
| 3\. Edit fields (title, author, date, etc.)                      | Admin updates and saves specific fields        |
| 4\. Replace content file                                         | New version is uploaded, replacing the old one |
| 5\. Replace cover image                                          | Updated image is uploaded and previewed        |
| 6\. Save changes                                                 | System validates and applies updates           |
| 6p. Problem: Changes not reflected due to caching or sync delays | System clears cache or triggers re-indexing    |
| 7\. Option to revert to previous version (future enhancement)    | Version history or undo capability considered  |

**Requirement Notes (C7):**

- Edits should be audit-logged for traceability.

- File replacements must preserve item ID and user bookmarks where
  possible.

- Cover images should have resolution guidelines for quality control.

## Work Area 4: System Monitoring & Configuration {#work-area-4-system-monitoring-configuration}

**Purpose:** View logs, adjust system behavior, and manage user
permissions and roles.

**Primary Users:**

- **System Administrators**

- **IT Support/Library Supervisor**

**Environment:**

- Admin Portal (Restricted access)

- Requires audit logging, high-level oversight

### C8. View and Filter Activity Logs {#c8.-view-and-filter-activity-logs}

**Introduction:**  
This task enables admins to monitor and filter system activity such as
user logins, content uploads, and reading activity. It begins when an
admin opens the audit log panel and ends after viewing, exporting, or
closing the log view.

**Start:**

- Admin accesses "System Logs" section in backend

**End:**

- Admin exits the view or exports results

**Frequency:**

- Periodically (e.g., weekly or monthly) or in response to an issue

**Difficult:**

- When logs are too large or unfiltered

**Users:**

- System administrators

- Library supervisors

**Subtasks & Variants**

| Subtask / Variant / Problem                      | Example Solution                         |
|--------------------------------------------------|------------------------------------------|
| 1\. Open system logs dashboard                   | Admin navigates from backend menu        |
| 2\. Filter by user, date, or event type          | Filters available at top of log view     |
| 3\. Search by keyword (e.g., "upload", "delete") | Text search across logs                  |
| 4\. View details of an individual event          | Expandable rows or modal pop-ups         |
| 5\. Export filtered logs (CSV, PDF)              | Export button triggers file download     |
| 6p. Problem: Logs load slowly when large         | System paginates and compresses data     |
| 7\. Archive or clear old logs (admin only)       | Option to archive by date or size policy |

**Requirement Notes (C8):**

- Logs must include timestamp, actor ID, action type, and affected
  resource.

- Access control: Only users with Admin or Supervisor role should access
  this module.

- Exported logs must be readable and compatible with compliance reviews

## Work Area 5: Offline Access Management

**Purpose:** Enable offline availability of content, manage downloads
and local storage.

**Primary Users:**

- **Mobile App Users** in low-connectivity environments

- **Field Ministry Members** needing access on the go

**Environment:**

- Mobile Devices with SQLite/local storage

- Offline-first design philosophy

### C9. Download Content for Offline Reading {#c9.-download-content-for-offline-reading}

**Introduction:**  
This task allows users to selectively download church materials and
store them locally. It begins when a user selects a title for offline
use and ends when the file is successfully stored or the user cancels
the action.

**Start:**

- User taps "Download" on content detail screen

**End:**

- File is available offline

- OR download is canceled/failed

**Frequency:**

- High in low-bandwidth regions

- Low where connectivity is consistent

**Difficult:**

- When files are large or device storage is low

**Users:**

- Registered users

**Subtasks & Variants**

| Subtask / Variant / Problem                              | Example Solution                                   |
|----------------------------------------------------------|----------------------------------------------------|
| 1\. Tap "Download" on item                               | System prompts confirmation                        |
| 2\. Verify available device storage                      | System checks space before download                |
| 3\. Store file in local SQLite or file storage           | Files saved with encrypted path                    |
| 4\. Notify user of success/failure                       | Toast or modal feedback shown                      |
| 5\. View downloaded content offline                      | "Offline Library" UI displays locally cached files |
| 6\. Manage/delete downloaded items                       | User selects item \> tap delete                    |
| 7p. Problem: Download interrupted by unstable connection | Retry mechanism + partial download support         |
| 8\. Pre-filter downloads by language                     | System only shows items in selected language       |

## Work Area 6: Analytics & Insights {#work-area-6-analytics-insights}

**Purpose:** Provide individual and global content engagement metrics.

**Primary Users:**

- **Readers:** Want to see personal reading progress

- **Admins:** Need system-wide statistics

**Environment:**

- Reader dashboard, Admin dashboard

- Connected to backend analytics services

### C10. View Personal Reading Statistics {#c10.-view-personal-reading-statistics}

**Introduction:**  
This task allows a user to see their engagement metrics like completed
books, reading frequency, bookmarked items, and top-read categories. It
begins when a user opens the "My Stats" dashboard and ends when they
exit.

**Start:**

- User taps "My Statistics" from profile menu

**End:**

- User exits or finishes reviewing data

**Frequency:**

- Weekly/monthly use by motivated readers

**Difficult:**

- When insights are not visual or easy to interpret

**Users:**

- Registered users only

**Subtasks & Variants**

| Subtask / Variant / Problem                                | Example Solution                                  |
|------------------------------------------------------------|---------------------------------------------------|
| 1\. Load user reading statistics                           | Backend fetches user activity data                |
| 2\. Display books read & completed                         | System shows card/grid list                       |
| 3\. Show highlights/bookmarks count                        | List or badge count summary                       |
| 4\. Visualize daily/weekly reading trends                  | Line/bar chart per time window                    |
| 5p. Problem: Charts are too complex on mobile              | Use compact sparkline or toggle chart views       |
| 6\. Compare personal stats to community average (optional) | Display comparative badge (e.g., "Top 5% Reader") |
| 7\. Navigate to "Most Highlighted" or "In Progress" items  | Click-throughs to content                         |

**Requirement Notes (C10):**

- Stats must be calculated from user interaction logs.

- Privacy: All data shown must be visible **only** to the owner.

- Admin stats view is separate and more aggregated (not covered in this
  task)

## Work Area 7: AI-Powered Interactions (Future)

**Purpose:** Enable users to query church materials via an AI chatbot.

**Primary Users:**

- **Readers** seeking answers to questions about doctrine, policy, etc.

- **Admins** feeding documents and managing bot scope

**Environment:**

- Chatbot interface on web/mobile

- Requires controlled document embedding

### 

### C11. Ask AI Chatbot a Question {#c11.-ask-ai-chatbot-a-question}

**Introduction:**  
This task enables users to query the AI assistant about spiritual
matters based solely on church-provided materials. It starts when the
user opens the chatbot interface and ends when a meaningful answer is
received or the session ends.

**Start:**

- User taps "Ask the Library" or similar entry point

**End:**

- AI responds or user exits the session

**Frequency:**

- On-demand; expected spike during Bible study or group preparation

**Difficult:**

- When user input is vague or documents lack depth

**Users:**

- Registered users

**Subtasks & Variants**

| Subtask / Variant / Problem                                   | Example Solution                                              |
|---------------------------------------------------------------|---------------------------------------------------------------|
| 1\. Open chatbot interface                                    | Chat window slides in or loads                                |
| 2\. Enter a question                                          | User types or speaks input                                    |
| 3\. System queries AI model scoped to church docs             | Embedding/querying powered by vector search (e.g., LangChain) |
| 4\. Display AI response with cited sources                    | AI highlights answer and document references                  |
| 5p. Problem: AI hallucinates or references unapproved content | Restrict model context to uploaded PDFs only                  |
| 6\. Refine or follow-up the question                          | Context maintained in ongoing session                         |
| 7\. Exit or clear chat history                                | Data cleared from device/session                              |

## D. Data to Record {#d.-data-to-record}

The system must store the following data to support library operations,
user interactions, and material management. Data can be created, viewed,
and modified via tasks in Chapter C.

### Data Model (E/R)

*Overview of key entities and relationships*:

- **Library Item**: Core entity for all materials (books, articles,
  audiobooks).

- **Category**: Hierarchical classification of items (e.g., Theology,
  History, Devotionals).

- **User**: Registered library members.

- **Review**: User-generated feedback on items.

Relationships:

- Each Library Item belongs to one or more Categories.

### D0. Common Fields {#d0.-common-fields}

*All tables include these fields for tracking changes*:

| Field         | Description                                | Example Solution       |
|---------------|--------------------------------------------|------------------------|
| 1. ChangeTime | Date/time of record creation/modification. | Auto-filled by system. |
| 2. ChangedBy  | User/system triggering the change.         | User ID or \"System\". |
| 3. History    | Link to previous versions of the record.   | Version history log.   |

### D1. Library Item {#d1.-library-item}

*Represents physical/digital materials in the library*.  
**Examples**: *\"Holy Bible (NIV)\"*, *\"Early Church History
Audiobook\"*.  
**Data Source**: Added by librarians during cataloging; metadata
auto-fetched from ISBN/DOIs.  
**Data Use**: Browsing, searching, recommendations.  
**Data Volume**: \~10,000 items initially; \~500 new items/year.

| Field              | Description                           | Example Solution            |
|--------------------|---------------------------------------|-----------------------------|
| 1. ItemID          | Unique identifier (e.g., ISBN, UUID). | Auto-generated.             |
| 2. Title           | Full title of the item.               | Field length: 200 chars.    |
| 3. Authors         | List of authors/editors.              | Array of names.             |
| 4. Description     | Summary/content overview.             | Text field (max 500 chars). |
| 5. PublicationDate | Release year.                         | YYYY format.                |
| 6. Format          | Physical, eBook, PDF, Audiobook, etc. | Predefined list.            |
| 7. FileURL         | Path to digital file (if applicable). | Cloud storage link.         |
| 8. Categories      | Related categories (see D2).          | Array of D2 references.     |

### D2. Category {#d2.-category}

*Hierarchical tags for filtering items (e.g., \"Theology \>
Apologetics\")*.  
**Examples**: *\"Sermons\"*, *\"Children\'s Resources\"*.  
**Data Source**: Defined by librarians; imported from standard
taxonomies.  
**Data Use**: Browsing, search filters, personalized recommendations.  
**Data Volume**: \~50 categories

| Field          | Description                            | Example Solution            |
|----------------|----------------------------------------|-----------------------------|
| 1. CategoryID  | Unique ID.                             | Auto-increment.             |
| 2. Name        | Category name (e.g., \"Biographies\"). | Field length: 50 chars.     |
| 4. Description | Purpose/scope of the category.         | Text field (max 200 chars). |
|                |                                        |                             |

### D3. User {#d3.-user}

*Registered members of the library*.  
**Examples**: *Congregation members, guests*.  
**Data Source**: Self-registration or admin input.  
**Data Use**: Authentication, reviews, notifications.  
**Data Volume**: \~2,000 users initially; 5--10 new/day.

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 48%" />
<col style="width: 28%" />
</colgroup>
<thead>
<tr class="header">
<th><h3 id="field">Field</h3></th>
<th><h3 id="description">Description</h3></th>
<th><h3 id="example-solution">Example Solution</h3></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><h3 id="userid">1. UserID</h3></td>
<td><h3 id="unique-identifier.">Unique identifier.</h3></td>
<td><h3 id="email-or-uuid.">Email or UUID.</h3></td>
</tr>
<tr class="even">
<td><h3 id="fullname">2. FullName</h3></td>
<td><h3 id="users-full-name.">User’s full name.</h3></td>
<td><h3 id="field-length-100-chars.">Field length: 100 chars.</h3></td>
</tr>
<tr class="odd">
<td><h3 id="email">3. Email</h3></td>
<td><h3 id="contactnotifications.">Contact/notifications.</h3></td>
<td><h3 id="validated-format.">Validated format.</h3></td>
</tr>
<tr class="even">
<td><h3 id="passwordhash">4. PasswordHash</h3></td>
<td><h3 id="secured-authentication.">Secured authentication.</h3></td>
<td><h3 id="bcrypt-encryption.">Bcrypt encryption.</h3></td>
</tr>
<tr class="odd">
<td><h3 id="role">5. Role</h3></td>
<td><h3 id="permissions-member-librarian-admin.">Permissions (Member,
Librarian, Admin).</h3></td>
<td><h3 id="predefined-roles.">Predefined roles.</h3></td>
</tr>
</tbody>
</table>

### D5. Review {#d5.-review}

*User ratings and feedback on items*.  
**Data Source**: Submitted by users via library interface.  
**Data Use**: Item recommendations, quality insights.  
**Data Volume**: \~5,000 reviews; 10--20 new/day.

| Field         | Description                      | Example Solution            |
|---------------|----------------------------------|-----------------------------|
| 1. ReviewID   | Unique review record.            | Auto-increment.             |
| 2. User       | Reviewer (reference to D3).      | D3 UserID.                  |
| 3. Item       | Reviewed item (reference to D1). | D1 ItemID.                  |
| 4. Rating     | 1--5 star rating.                | Integer (1--5).             |
| 5. Comment    | Detailed feedback (optional).    | Text field (max 300 chars). |
| 6. ReviewDate | Date submitted.                  | Auto-filled.                |

## Entity: LibraryItem

| Attribute       | Data Type      | Constraints / Notes                                           |
|-----------------|----------------|---------------------------------------------------------------|
| ItemID          | UUID / VARCHAR | Primary Key, unique identifier (e.g., ISBN or generated UUID) |
| Title           | VARCHAR(200)   | Not null                                                      |
| Authors         | TEXT\[\]       | Array of author/editor names                                  |
| Description     | TEXT           | Max 500 characters                                            |
| PublicationDate | DATE           | Format: YYYY-MM-DD                                            |
| Format          | ENUM           | E.g., Physical, PDF, EPUB, Audiobook                          |
| FileURL         | TEXT           | URL/path to the file stored in cloud                          |
| Categories      | TEXT\[\]       | Array of associated category names or IDs                     |
| CoverImageURL   | TEXT           | Optional -- path to image for display                         |

**Entity: Category**

| Attribute        | Data Type   | Constraints / Notes           |
|------------------|-------------|-------------------------------|
| CategoryID       | INT / UUID  | Primary Key                   |
| Name             | VARCHAR(50) | Must be unique                |
| Description      | TEXT        | Max 200 characters            |
| ParentCategoryID | INT / UUID  | Nullable -- for subcategories |

**Entity: User**

| Attribute          | Data Type    | Constraints / Notes                    |
|--------------------|--------------|----------------------------------------|
| UserID             | UUID / INT   | Primary Key                            |
| FullName           | VARCHAR(100) | Required                               |
| Email              | VARCHAR(255) | Must be unique and valid format        |
| PasswordHash       | TEXT         | Stored securely with bcrypt            |
| Role               | ENUM         | E.g., Member, Admin, Librarian         |
| RegisteredViaOAuth | BOOLEAN      | TRUE if signed in with Google/Facebook |

**Entity: Review**

| Attribute  | Data Type  | Constraints / Notes            |
|------------|------------|--------------------------------|
| ReviewID   | INT        | Primary Key                    |
| UserID     | UUID / INT | Foreign Key to User            |
| ItemID     | UUID / INT | Foreign Key to LibraryItem     |
| Rating     | INT (1--5) | Required                       |
| Comment    | TEXT       | Optional -- Max 300 characters |
| ReviewDate | DATE       | Auto-filled on submission      |

**Entity: ReadingList**

| Attribute    | Data Type   | Constraints / Notes                    |
|--------------|-------------|----------------------------------------|
| ListID       | UUID / INT  | Primary Key                            |
| UserID       | UUID / INT  | Foreign Key                            |
| ItemID       | UUID / INT  | Foreign Key                            |
| Status       | ENUM        | Planned, Reading, Completed            |
| ReminderSet  | BOOLEAN     | Whether reminders are enabled          |
| ScheduleDate | DATE / NULL | Optional -- used for scheduled reading |

**Entity: Annotation**

| Attribute      | Data Type   | Constraints / Notes                   |
|----------------|-------------|---------------------------------------|
| AnnotationID   | UUID / INT  | Primary Key                           |
| UserID         | UUID / INT  | Foreign Key                           |
| ItemID         | UUID / INT  | Foreign Key                           |
| TextLocation   | TEXT        | Encoded string to mark page/paragraph |
| HighlightColor | VARCHAR(10) | E.g., \#FFFF00                        |
| Note           | TEXT        | Optional personal comment             |
| Timestamp      | DATETIME    | Time of annotation                    |

**Entity: ActivityLog**

| Attribute        | Data Type   | Constraints / Notes                   |
|------------------|-------------|---------------------------------------|
| LogID            | UUID / INT  | Primary Key                           |
| ActorID          | UUID / INT  | User/system that triggered the action |
| ActionType       | VARCHAR(50) | E.g., Login, Upload, Download, Delete |
| AffectedResource | TEXT        | E.g., ItemID, UserID, or a FileURL    |
| Timestamp        | DATETIME    | Event time                            |
| IPAddress        | VARCHAR(45) | Optional -- for audit logs            |

### **Entity: Download**

| **Attribute**     | **Data Type** | **Constraints / Notes**                |
|-------------------|---------------|----------------------------------------|
| DownloadID        | UUID / INT    | Primary Key                            |
| UserID            | UUID / INT    | Foreign Key                            |
| ItemID            | UUID / INT    | Foreign Key                            |
| Status            | ENUM          | Pending, Completed, Failed             |
| DeviceStoragePath | TEXT / NULL   | Local path used on mobile device       |
| DownloadDate      | DATETIME      | Date of download attempt or completion |

## E. Other functional requirements {#e.-other-functional-requirements}

This section captures functional requirements that go beyond the core
user tasks such as login, search, or reading. These requirements define
how the system should behave in specific scenarios, support automation,
analytics, and align with administrative rules that help enhance user
experience and also allow for system scalability.

### E1. System generated events (Reminders & notifications)  {#e1.-system-generated-events-reminders-notifications}

### System Generated Events: Automatic actions such as notifications, reminders, and alerts based on user behavior or system thresholds (e.g., inactivity or storage limits). {#system-generated-events-automatic-actions-such-as-notifications-reminders-and-alerts-based-on-user-behavior-or-system-thresholds-e.g.-inactivity-or-storage-limits.}

| Requirement                                                                     | Example solutions                                                      |
|---------------------------------------------------------------------------------|------------------------------------------------------------------------|
| E1-1. Remind user to finish a book if unread after certain number of days.      | Admin configures the number of days System sends push/email reminders. |
| E1-2. Notify users when new materials in preferred language/topic is available. | Notifications sent when admin uploads.                                 |

### E2. Reports (Usage & analytics) {#e2.-reports-usage-analytics}

Reports (Usage & Analytics): Requirements for generating visual or
downloadable reports on user activity, material popularity, and
administrative oversight.

| Requirement                                     | Example solutions                             |
|-------------------------------------------------|-----------------------------------------------|
| E2-1. Per-user reading statistics.              | Dashboard chart; CSV export.                  |
| E2-2. Most-read materials overall/per language. | Top 10 report by read-count; PDF & on-screen. |
| E2-3. Ad-hoc data exploration.                  | Built-in report builder; export filters.      |

### E3. Business rules & complex calculations {#e3.-business-rules-complex-calculations}

Business Rules & Complex Calculations: Logical constraints and
calculations that govern system behavior such as progress tracking,
access controls, and search result filtering based on user preferences.

| Requirement                                                   | Example solutions                      |
|---------------------------------------------------------------|----------------------------------------|
| E3-1. Enforce language and category filter on search results. |                                        |
| E3-2. Calculate reading progress percentage.                  | Compute (pages_read/total_pages)\*100. |
| E3-3. Limit highlight count per user/material to Y.           | Configurable limit; reject excess.     |

### E4. Expansion of the system {#e4.-expansion-of-the-system}

Expansion of the System: Future-facing features that anticipate
integration with AI or enhanced interactivity beyond the initial
deployment.

| Requirement                      | Example solutions             |
|----------------------------------|-------------------------------|
| E4-1. Future AI Q&A integration. | API endpoints for AI service. |

## 

# F. Integration with External Systems {#f.-integration-with-external-systems}

This section outlines the necessary integrations between the Church
Library System and various external applications or services. Each
integration is defined by its purpose, the data exchanged, and any
relevant technical considerations or constraints. These integrations are
crucial for extending the functionality of the Church Library System and
ensuring its seamless operation within the church\'s existing digital
ecosystem.

## F.1. Google and Facebook OAuth {#f.1.-google-and-facebook-oauth}

- **Purpose (Problem Solved):**

  - Requiring users to create a new, separate account with a unique
    password for the Church Library System can be a barrier to adoption
    and increase password fatigue.

  - Users prefer the convenience and familiarity of signing in with
    existing social media or email accounts.

- **Data Exchange Details:**

  - **What data is exchanged:** User authentication tokens, basic
    profile information (i.e., email, user ID, name) upon successful
    authentication.

  - **Direction of flow:** Unidirectional (authentication from
    Google/Facebook to Church Library System).

  - **Frequency of exchange:** On-demand (each time a user attempts to
    sign in via OAuth).

  - **Trigger of exchange:** User selecting \"Sign in with Google\" or
    \"Sign in with Facebook\" option.

- **Interface Specifications/Constraints:**

  - Standard OAuth 2.0 protocols will be used for secure authentication.

  - Requires registration of the Church Library System application with
    Google and Facebook developer platforms.

## F.2. AI Chatbot API (Future Integration) {#f.2.-ai-chatbot-api-future-integration}

- **Purpose (Problem Solved):**

  - Provides an interactive, AI-powered way to ask questions and receive
    answers directly from the content within the church library.

  - Manually searching for answers to specific doctrinal or historical
    questions across multiple documents can be time-consuming for users.

- **Data Exchange Details:**

  - **What data is exchanged:** User queries (text), system context
    (relevant passages from uploaded church materials), AI-generated
    responses.

  - **Direction of flow:** Bidirectional (user query to Gemini API, AI
    response back to user).

  - **Frequency of exchange:** On-demand (whenever a user interacts with
    the chatbot).

  - **Trigger of exchange:** User initiates a query to the AI chatbot.

- **Interface Specifications/Constraints:**

  - Requires the use of Google Gemini or OpenAI API.

  - The AI chatbot must be strictly confined to the knowledge base of
    the uploaded church materials to prevent hallucination.

  - Requires uploading of PDF documents and policies into the AI for
    querying.

### F.3. Payment Gateway Integration (Future Feature) {#f.3.-payment-gateway-integration-future-feature}

- **Purpose (Problem Solved):**

  - Enables monetization of premium digital library materials.

  - Facilitates secure online payments for users who wish to purchase or
    access restricted content (e.g., exclusive books, digital archives).

- **Data Exchange Details:**

  - **What data is exchanged:** Payment transaction data (amount, user
    ID, content ID), payment confirmation tokens, and error/failure
    responses.

  - **Direction of flow:** Bidirectional (Church Library System sends
    payment request; gateway returns success/failure).

  - **Frequency of exchange:** On-demand (whenever a user initiates a
    purchase).

  - **Trigger of exchange:** User clicks \"Buy\" or \"Unlock\" on a paid
    item.

- **Interface Specifications/Constraints:**

  - Integration via secure APIs (e.g., Stripe, PayPal) following PCI-DSS
    compliance standards.

  - Payment transactions must be verified using secure tokens and
    receipts.

  - Backend must support payment callbacks and status synchronization.

### F.4. Cloud Storage Integration (Amazon S3 or Equivalent) {#f.4.-cloud-storage-integration-amazon-s3-or-equivalent}

- **Purpose (Problem Solved):**

  - Ensures reliable, scalable, and secure storage of digital content
    (books, leaflets, images) outside of the core application server.

  - Reduces server load and improves performance by offloading large
    static assets.

- **Data Exchange Details:**

  - **What data is exchanged:** Uploaded files (PDFs, EPUBs, images),
    metadata (e.g., file path, MIME type), signed URL requests for
    downloads.

  - **Direction of flow:** Bidirectional (upload from admin to S3;
    download to user devices).

  - **Frequency of exchange:** High --- during all upload and download
    operations.

  - **Trigger of exchange:** Admin uploads a file or user requests to
    read/download an item.

- **Interface Specifications/Constraints:**

  - Uses AWS S3 REST API or equivalent cloud storage service.

  - File upload/download operations should use pre-signed URLs to ensure
    security.

  - Storage bucket access must be restricted and encrypted; files should
    follow a clear naming/versioning convention.

### Context Diagram

![](media/image2.jpeg){width="6.5in" height="5.159722222222222in"}

## G. Technical IT Architecture {#g.-technical-it-architecture}

The system must meet performance, scalability, and reliability
requirements under the constraints below. Choose **one** alternative
based on your operational model.

## Key Modules & Responsibilities {#key-modules-responsibilities}

### Presentation Layer

- **Mobile App (React Native)**

  - Browse, read, annotate, download, AI chat

- **Admin Web Portal (React)**

  - Upload/manage content, logs, user roles

### Application Layer

| Module               | Responsibilities                                            |
|----------------------|-------------------------------------------------------------|
| User Management      | Register/login, Google OAuth, session handling              |
| Content Browsing     | Category browsing, filtering, search suggestions            |
| Reader Module        | Text rendering, highlighting, annotations, bookmarking      |
| Download Manager     | Offline caching                                             |
| Admin Control        | Upload, edit, delete content, manage languages/categories   |
| Statistics Engine    | Reading logs, personal dashboards                           |
| AI Chat Orchestrator | Embeds context, queries AI, returns response with citations |
| Logging & Monitoring | Tracks user/admin activity, exports system logs             |

### External Services Integration

| Service          | Layer                | Purpose                                                 |
|------------------|----------------------|---------------------------------------------------------|
| Google OAuth     | Infrastructure Layer | Sign-in via Google, token exchange                      |
| Cloud Storage    | Infrastructure Layer | Upload/download PDFs, covers, metadata                  |
| AI API           | Infrastructure Layer | Answering doctrinal queries based on document embedding |
| Payment (future) | Infrastructure Layer | Paid content, checkout flow, user entitlements          |

### Architecture Diagram

![](media/image3.jpeg){width="6.5in" height="4.205555555555556in"}

## H. Security {#h.-security}

Security requirements ensure that only authorized users can access
system functionality, and that personal and sensitive content is
protected against unauthorized access, loss, or corruption. These
measures maintain the integrity and confidentiality of digital library
operations, especially since user activity, highlights, and reading
materials may include sensitive or proprietary information.

### H1. Login and access rights for users {#h1.-login-and-access-rights-for-users}

Authentication mechanisms (e.g., email/password or Google sign-in),
session control, and role-based access enforcement for admins,
librarians, and members.

| Subtask                               | Example solutions                           |
|---------------------------------------|---------------------------------------------|
| H1-1. Email/password authentication.  | Login form; password hashing and encryption |
| H1-2. Optional sign up via Google.    | Authentication integration.                 |
| H1-3. Session timeout after X period. | "Keep me logged in" option available        |
| H1-4. Enforce password strength.      | Client/server validation.                   |

### 

### 

### 

### H2. Protection against data loss {#h2.-protection-against-data-loss}

Regular and on-demand backup requirements to safeguard against
accidental or malicious data loss.

| Requirement                     | Example solutions                   |
|---------------------------------|-------------------------------------|
| H2-1. monthly automated backup. |                                     |
| H2-2. On-demand backup trigger. | Admin portal \"Backup now\" button. |

### 

### 

### H3. Protection against unintended actions {#h3.-protection-against-unintended-actions}

Confirmation prompts and soft-delete options that help prevent
irreversible or unintended user behavior.

| Requirement                                           | Example solutions              |
|-------------------------------------------------------|--------------------------------|
| H3-1. Confirm delete actions.                         | Modal confirmation; two-step.  |
| H3-2. Soft-delete from reading list with recycle bin. | Can be restored within 30 day. |

### 

### H4. Protection against threats {#h4.-protection-against-threats}

Technical defenses such as login throttling, enforced HTTPS, and
potential future expansion to firewall rules and monitoring.

| Requirement                      | Example solutions       |
|----------------------------------|-------------------------|
| H4-1. Rate-limit login attempts. | IP throttling; captcha. |
| H4-2. Enforce HTTPS.             |                         |

# Part I Usability and design

The Usability & Design requirements (Section I) for the Church Library
System tailored for a React‑JS frontend.

## I1. Ease‑of‑Learning and Task Efficiency {#i1.-easeoflearning-and-task-efficiency}

| Requirement (I1‑X)                                                                                                                                                                                | Example Solution                                                                                                                                                                                                               | Code    |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| I1‑1. Critical usability problems Any *critical* usability problem (observed in ≥2 users) must be logged, treated as a system error, and fixed according to defect‑priority rules.                | Conduct early think‑aloud tests on Figma/React mockups of key flows (browse, search, read, annotate). Route each critical issue into the support ticket system (e.g. Jira) for triage and repair before development continues. | I1‑1 P1 |
| I1‑2. Early usability testing UI must be usability‑tested and all critical problems found must be resolved before coding begins.                                                                  | Assemble 5 representative users; run moderated tests on React mockups covering U1--U19 flows; iterate designs until zero critical issues remain.                                                                               | I1‑2 P1 |
| I1‑3. Post‑training competence After a 1‑hour super‑user demo, ≥90 % of ordinary users must complete all Chapter C tasks (browse, search, annotate, download) with ≤2 critical issues in testing. | Deliver a 60‑min interactive tutorial and verify via follow‑up sessions that users can perform U1--U19 tasks; cap at 2 critical usability problems per 10 users.                                                               | I1‑3 P2 |
| I1‑4. Error‑message clarity During usability tests, when shown any error message, ≥85 % of users must correctly interpret its meaning and next step.                                              | Curate all reader and system errors; display them to users in tests; collect explanations and refine text. Use React‑Intl for contextual messaging.                                                                            | I1‑4 P2 |
| I1‑6. Super‑user trainability A designated super‑user (staff librarian) must be able to master all admin functions (A1--A13) and train others within 2 days.                                      | Provide a 2‑day instructor‑led workshop and interactive "Admin Guide" built in Storybook; track completion with quizzes.                                                                                                       | I1‑6 P2 |
| I1‑7. Frequent‑user efficiency After 1 week of regular use, a member must be able to search, highlight, bookmark, and download 5 items in ≤5 minutes.                                             |                                                                                                                                                                                                                                | I1‑7 P2 |

### Mock up screens

![](media/image4.png){width="3.8859590988626422in"
height="8.584530839895013in"}

![](media/image5.png){width="3.8859590988626422in"
height="8.563695319335084in"}![](media/image6.png){width="3.8859590988626422in"
height="8.574113079615048in"}![](media/image7.png){width="3.8859590988626422in"
height="8.563695319335084in"}

# J. Other Requirements and Deliverables {#j.-other-requirements-and-deliverables}

### J1. Documentation {#j1.-documentation}

| Requirements                                                                                                    | Example Solutions                                                     | Code |
|-----------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|------|
| 1\. Before system delivery, course material must be made available for super users to use in onboarding others. | Delivered in editable PowerPoint and PDF format.                      | J1-1 |
| 2\. A month after delivery, user-facing documentation for mobile and admin workflows must be provided.          | Includes annotated screenshots and short how-to guides.               | J1-2 |
| 3\. Basic IT documentation for server setup and content management must be provided at delivery.                | Includes environment variables, database schema, and backup strategy. | J1-3 |
| 4\. All documentation must be in electronic form and editable by the customer.                                  | Delivered via shared folder (PDF + editable docs).                    | J1-4 |

### J2. Installation {#j2.-installation}

| Requirements                                                                                       | Example Solutions                              | Code     |
|----------------------------------------------------------------------------------------------------|------------------------------------------------|----------|
| 1\. The supplier must install the backend, frontend, and database on the chosen cloud environment. | Target stack: Node.js, PostgreSQL, and AWS S3. | **J2**-1 |
| 2\. The supplier must deploy the initial mobile app build to Play Store                            |                                                | **J2**-2 |

### J3. Testing the System {#j3.-testing-the-system}

| Requirements                                                                           | Example Solutions                                         | Code |
|----------------------------------------------------------------------------------------|-----------------------------------------------------------|------|
| 1\. The customer wants to review supplier's test coverage prior to delivery.           | Supplier provides test case index and test plan document. | J3-1 |
| 2\. Regression testing must be performed after major updates.                          |                                                           | J3-2 |
| 3\. Customer will conduct final acceptance testing with a test build and real content. | Supplier provides a UAT environment with seeded data.     | J3-3 |

### 

## L. Operation, support, and maintenance {#l.-operation-support-and-maintenance}

This section outlines non-functional requirements related to the
system's runtime behavior, performance expectations, support structure,
and long-term maintainability. These are critical to ensuring the system
remains reliable, responsive, and sustainable over time, especially when
serving a large church community with varied digital literacy levels.

### L1. Response times {#l1.-response-times}

The system\'s performance benchmarks under typical usage conditions,
including page loads, content streaming, and UI responsiveness.

| Task                         | Response time  |
|------------------------------|----------------|
| Search query                 | ≤ 3 s for 95%  |
| Material load                | ≤ 20 s for 98% |
| Reading mode scroll behavior | ≤ 0.2s for 98% |

### 

### L2. Availability {#l2.-availability}

Required uptime guarantees during business hours and off-hours to ensure
uninterrupted access to resources.

| Period        | Availability |
|---------------|--------------|
| Weekdays 24/7 | ≥ 99.5%      |

### 

### L3. Data storage {#l3.-data-storage}

Retention policies for uploaded materials and mechanisms to archive or
restore content as needed.

| Requirement                        | Example solutions                     |
|------------------------------------|---------------------------------------|
| Active materials retained 5 years. | DB & object store retention policies. |
| Archive older materials            |                                       |

### L4. Support {#l4.-support}

Levels of support responsiveness for user queries or system issues, and
communication channels available

| Requirement                             | Example solutions     |
|-----------------------------------------|-----------------------|
| L4-1. First-level support response ≤4h. |                       |
| L4-2. Second-level support ≤24h.        | Escalation procedure. |

### 

# M.Requirement Traceability Matrix {#m.requirement-traceability-matrix}

| Req ID | Short Description                                     | BG1 | BG2 | BG3 | BG4 | BG5 |
|--------|-------------------------------------------------------|-----|-----|-----|-----|-----|
| C1     | Browse Church Library Content                         | X   | X   | X   |     |     |
| C2     | Read Church Material                                  | X   | X   | X   |     |     |
| C3     | Highlight & Annotate Text                             |     | X   | X   |     |     |
| C4     | Register/Authenticate User                            | X   |     | X   |     |     |
| C5     | Manage Reading List or Schedule                       |     | X   | X   |     |     |
| C6     | Upload New Content                                    |     |     | X   | X   |     |
| C7     | Edit/Update Existing Content                          |     |     | X   | X   |     |
| C8     | View and Filter Activity Logs                         |     |     | X   | X   |     |
| C9     | Download Content for Offline Reading                  | X   | X   | X   |     |     |
| C10    | View Personal Reading Statistics                      |     | X   |     |     |     |
| C11    | Ask AI Chatbot a Question                             | X   | X   | X   |     |     |
| E1‑1   | Remind user to finish a book after X days             |     | X   | X   |     |     |
| E2‑1   | Per‑user reading statistics report                    |     | X   | X   |     |     |
| E2‑2   | Most‑read materials overall                           |     | X   | X   |     |     |
| E3‑2   | Calculate reading progress percentage                 |     | X   | X   |     |     |
| E4‑1   | Future AI Q&A integration ready                       | X   | X   | X   | X   |     |
| F1     | Google & Facebook OAuth                               | X   |     | X   |     |     |
| F2     | AI Chatbot API                                        | X   | X   | X   |     |     |
| F3     | Payment Gateway Integration                           |     |     | X   |     |     |
| F4     | Cloud Storage Integration                             | X   |     | X   | X   | X   |
| H1‑1   | Email/password & Google sign‑in                       | X   |     | X   |     |     |
| H2‑1   | Monthly automated backup                              |     |     | X   |     |     |
| H3‑1   | Confirm delete actions                                |     | X   | X   |     |     |
| H4‑1   | Rate‑limit login attempts                             |     |     | X   |     |     |
| I1‑2   | Early usability testing on mockups                    |     | X   |     | X   |     |
| I1‑4   | Errormessage clarity ≥ 85 % interpretability          |     | X   |     | X   |     |
| I2     | WCAG 2.1 AA compliance                                | X   | X   |     |     |     |
| J1‑1   | Data protection & privacy best practices              | X   |     | X   |     |     |
| J2‑1   | Train 10 super users                                  |     | X   |     |     |     |
| J3‑2   | User‑facing documentation delivered 1 mo post‑go‑live |     | X   |     |     |     |
| J5‑1   | Install on chosen cloud environment                   |     |     | X   | X   |     |
| J6‑2   | Regression testing in CI/CD                           |     |     | X   | X   |     |
| L1     | Response times: Search ≤ 3 s, pages ≤ 2 s             |     |     | X   |     |     |
| L2     | ≥ 99.5% availability 24/7                             |     |     | X   |     |     |
| L4‑1   | 1st‑level support ≤ 4 h                               |     |     | X   |     | X   |
