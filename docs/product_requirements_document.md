# Product Requirements Document

## Berkeley Campus & Community Canopy-Air Quality Hub (BCCAH)

### Document Information

- **Project Name**: Berkeley Campus & Community Canopy-Air Quality Hub (BCCAH)
- **Document Version**: 1.1 (Educational Focus)
- **Date**: April 30, 2025
- **Framework**: STRUDEL Kit

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Product Vision](#2-product-vision)
   - [2.1 Vision Statement](#21-vision-statement)
   - [2.2 Target Users](#22-target-users)
   - [2.3 User Needs Addressed](#23-user-needs-addressed)
3. [Task Flows Implementation (Campus Focus)](#3-task-flows-implementation-campus-focus)
   - [3.1 Search Repositories](#31-search-repositories)
   - [3.2 Explore Data](#32-explore-data)
   - [3.3 Compare Data](#33-compare-data)
   - [3.4 Contribute Data](#34-contribute-data)
4. [Technical Requirements](#4-technical-requirements)
   - [4.1 Data Structure](#41-data-structure)
   - [4.2 Data Validation](#42-data-validation)
   - [4.3 Performance Requirements](#43-performance-requirements)
5. [User Interface Design](#5-user-interface-design)
   - [5.1 Key Screens](#51-key-screens)
   - [5.2 Mobile Support](#52-mobile-support)
6. [Implementation Phases (Course-Focused)](#6-implementation-phases-course-focused)
   - [6.1 Phase 1: Core Classroom Tool](#61-phase-1-core-classroom-tool)
   - [6.2 Phase 2: Enhanced Analysis & Contribution](#62-phase-2-enhanced-analysis--contribution)
   - [6.3 Phase 3: Educational Integration](#63-phase-3-educational-integration)
7. [Success Metrics (Educational Context)](#7-success-metrics-educational-context)
   - [7.1 Engagement Metrics](#71-engagement-metrics)
   - [7.2 Educational Impact](#72-educational-impact)

---

## 1. Executive Summary

The Berkeley Campus & Community Canopy-Air Quality Hub (BCCAH) is an educational web application built using STRUDEL Kit. It serves as a learning tool for UC Berkeley students to collect, analyze, and understand the relationship between tree canopy and air quality specifically on and immediately around the Berkeley campus. The platform leverages STRUDEL task flows to create a hands-on, user-centered experience for working with hyper-local environmental data.

---

## 2. Product Vision

### 2.1 Vision Statement

To create an engaging, educational platform where Berkeley students can actively learn about and contribute to the understanding of the micro-environmental interplay between tree canopy and air quality on and around campus, utilizing robust data practices and user-centered design principles facilitated by the STRUDEL Kit.

### 2.2 Target Users

- **UC Berkeley Students**: Primarily undergraduates and graduates in environmental science, data science, geography, urban planning, and related fields using the tool for coursework.
- **UC Berkeley Instructors/Educators**: Utilizing the platform for teaching environmental monitoring, data visualization, and citizen science principles.
- **Campus Facilities/Sustainability Office**: Potential users for accessing student-collected data to supplement campus management efforts.
- **Interested Local Community Members**: Exploring environmental conditions on campus.

### 2.3 User Needs Addressed

- Easy access to existing tree inventory and air quality data specific to the UC Berkeley campus.
- Intuitive, mobile-friendly tools for contributing new tree measurements and air quality observations during class exercises or fieldwork.
- Simple visualization tools to explore patterns and relationships between trees and air quality in familiar campus locations.
- A practical platform for learning data collection, validation, and analysis techniques in an urban environmental context.

---

## 3. Task Flows Implementation (Campus Focus)

### 3.1 Search Repositories

#### 3.1.1 Description

Enables users to find specific trees, locations, or datasets within the UC Berkeley campus and immediate vicinity.

#### 3.1.2 User Stories

- As a student, I want to find all Coast Redwood trees near Doe Library to observe them for my botany class.
- As an instructor, I want my students to search for air quality data near Sproul Plaza during specific event times (e.g., noon rallies).
- As a campus user, I want to quickly check the recorded health status of a specific landmark tree.

#### 3.1.3 Requirements

1. Map-based search interface centered on the UC Berkeley campus map.
2. Filtering options:
   - Tree characteristics (species, recorded health, DBH range) available in the dataset.
   - Air quality parameters from nearby stations or student contributions.
   - Campus locations (building names, quads, landmarks).
   - Time periods relevant to coursework or campus events.
3. Search results display:
   - List or map pins showing individual trees or data points.
   - Basic metadata preview (species, date, measurement value).
   - Link to explore data in more detail.

### 3.2 Explore Data

#### 3.2.1 Description

Enables users to visualize and understand patterns in campus tree data and local air quality.

#### 3.2.2 User Stories

- As a student, I want to see if the density of trees in the Faculty Glade correlates with lower PM2.5 readings compared to Bancroft Way.
- As an instructor, I want to show students the distribution of different tree species across campus on an interactive map.
- As a user, I want to explore how air quality readings near campus change throughout the day based on available data.

#### 3.2.3 Requirements

- Interactive map visualization:
  - Campus map showing tree locations, colored/sized by attributes (species, health, DBH).
  - Overlay of nearby air quality data points or interpolated zones (if feasible).
  - Ability to click on features for more information.
- Simple charting:
  - Time series plots for available air quality data points.
  - Basic bar charts showing species distribution or health ratings.
- Filtering controls directly linked to the map/charts (species, health, time).
- Basic data summary statistics for selected areas or datasets.

### 3.3 Compare Data

#### 3.3.1 Description

Enables users to directly compare environmental conditions between different campus areas or time periods.

#### 3.3.2 User Stories

- As a student, I want to compare the average reported health of trees in the sunny Memorial Glade versus the shadier Eucalyptus Grove.
- As an instructor, I want students to compare air quality readings before and after a major campus construction project started near a monitoring point.
- As a user, I want to see how the number of contributed tree observations differs between the north and south sides of campus.

#### 3.3.3 Requirements

- Side-by-side comparison interface:
  - Ability to select two distinct campus zones (via map selection) or two time ranges.
  - Synchronized map views (if comparing zones).
  - Comparative charts (e.g., bar charts of species mix, time series overlays).
  - Simple statistical difference summaries (e.g., average DBH, difference in mean PM2.5).

### 3.4 Contribute Data

#### 3.4.1 Description

Enables students to easily add field observations (tree data, air quality spots) via a web interface, particularly optimized for mobile use during fieldwork.

#### 3.4.2 User Stories

- As a student in the field, I want to quickly add a new tree I measured, including its location, species guess, DBH, and a photo, using my phone.
- As a student with a portable air sensor, I want to upload my collected reading (value, time, location) for a class assignment.
- As an instructor, I want to review student contributions for accuracy and provide feedback.

#### 3.4.3 Requirements

- Data contribution forms (Mobile-first design):
  - Tree inventory form: Map-based location picker (GPS helpful), species selection (dropdown/autocomplete, potentially with image helper link), DBH input (with instructions/diagram), height/spread estimate, health rating (simple scale), photo upload.
  - Air quality spot measurement form: Location picker, timestamp (auto/manual), parameter selection (PM2.5, CO2, etc.), value input, sensor type (optional).
- Basic Validation:
  - Location must be within campus boundaries or immediate vicinity.
  - Required fields must be filled.
  - Numeric ranges for measurements (sanity checks).
- User identification (link contribution to student user, if logged in).
- (Optional Phase 2) Simple review queue/flagging system for instructors.

---

## 4. Technical Requirements

### 4.1 Data Structure

#### 4.1.1 Tree Inventory Data

- Required fields: Location (lat/long), Species (or best guess), DBH, Health condition (e.g., Good, Fair, Poor), Observation Date, Contributor ID (if logged in).
- Optional fields: Height, Crown spread, Photos, Notes.

#### 4.1.2 Air Quality Data

- Required fields: Location (lat/long), Timestamp, Parameter (e.g., PM2.5, PM10, CO2), Value, Unit.
- Optional fields: Contributor ID, Sensor type/ID.

### 4.2 Data Validation

- Geofencing: Ensure contributed coordinates fall within defined campus/near-campus boundaries.
- Input type and basic range checks (e.g., DBH > 0).
- Mark student contributions clearly as distinct from baseline data.

### 4.3 Performance Requirements

- Map interactions (pan, zoom) should be fluid on typical student laptops/phones.
- Contribution form submission should be quick, especially on mobile networks.
- Mobile-friendly rendering is essential for the Contribute flow.

---

## 5. User Interface Design

### 5.1 Key Screens

- **Home Page / Dashboard:** Campus map overview, recent student contributions feed, quick links to Explore/Contribute.
- **Search Interface:** Map focus, simple filter panel, list/map results view.
- **Explore Interface:** Integrated map and chart view, interactive filtering.
- **Compare Interface:** Split view for side-by-side comparison.
- **Contribution Interface:** Clean, simple forms optimized for mobile, clear instructions.

### 5.2 Mobile Support

- Responsive design mandatory, especially for `/contribute`.
- Consider offline data caching strategies for contribution if feasible (Phase 2/3).

---

## 6. Implementation Phases (Course-Focused)

### 6.1 Phase 1: Core Classroom Tool

- Load baseline campus tree/air quality data.
- Implement basic Search (by species/location) and Explore (map view).
- Implement essential Contribute form (tree data primarily, mobile-friendly).
- Basic visualization of contributed data.

### 6.2 Phase 2: Enhanced Analysis & Contribution

- Implement Compare flow.
- Add air quality spot contribution.
- Improve visualizations (time series, basic charts).
- Refine filters and search capabilities.
- Implement user accounts for tracking contributions.

### 6.3 Phase 3: Educational Integration

- Add simple educational content/links.
- Develop instructor review/feedback features (optional).
- Export functionality for student reports.

---

## 7. Success Metrics (Educational Context)

### 7.1 Engagement Metrics

- Number of student contributions per semester/assignment.
- Frequency of use for exploration/analysis tasks.
- Qualitative feedback from students on usability and learning value.

### 7.2 Educational Impact

- Demonstrated student understanding of data collection/visualization concepts.
- Use of the platform in course assignments and projects.
- Quality and coverage of student-contributed data on campus.

---
