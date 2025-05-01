# Berkeley Campus & Community Canopy-Air Quality Hub (BCCAH) Development Tasks

## Overall Development Tasks (Educational Focus)

-   [x] Set up development environment
-   [x] Initialize STRUDEL Kit project (`strudel create-app bccah`) [4]
-   [ ] **Phase 1: Load Baseline Data**
    -   [ ] Obtain and process UCB Campus Tree Inventory data (if available)
    -   [ ] Identify and integrate nearby BAQMD air quality station data
    -   [ ] Define mock data structures for initial development [1]
-   [ ] **Phase 1: Implement Core Task Flows (Minimum Viable Educational Tool)**
    -   [ ] Implement Search Repositories (basic map search, filter by species/location) [1]
    -   [ ] Implement Explore Data (basic map visualization of trees & AQ points) [1]
    -   [ ] Implement Contribute Data (Tree observations primarily, mobile-friendly form) [1]
-   [ ] **Phase 2: Enhance Functionality**
    -   [ ] Implement Compare Data flow (side-by-side zone/time comparison) [1]
    -   [ ] Add Air Quality spot measurement contribution
    -   [ ] Improve visualizations (time series charts, better map layers) [1]
    -   [ ] Refine search filters and explore interactions
    -   [ ] Implement basic user accounts (for tracking student contributions)
-   [ ] **Phase 3: Refine & Integrate**
    -   [ ] Add educational content snippets/links
    -   [ ] Implement data export for student reports
    -   [ ] Conduct usability testing with students
    -   [ ] Refine UI based on feedback
    -   [ ] (Optional) Develop instructor review features
-   [ ] Deploy and integrate into course structure

### Mock Data Implementation (Campus Focus)

#### Phase 1: Structure & Baseline Simulation

1.  **Mock Data Architecture**
    *   [x] Define JSON structure for campus trees and AQ points [1]
    *   [x] Establish directory structure (`src/mocks/campus-data`) [1]
    *   [x] Create index files [1]
    *   [x] Add TypeScript interfaces (TreeObservation, AQReading) [1]
2.  **Core Dataset Simulation**
    *   [x] Create small mock Urban Tree Inventory dataset representative of campus species/locations [1]
    *   [x] Create mock Air Quality Measurements dataset simulating nearby station data [1]
    *   [ ] Ensure metadata consistency (units, field names) [1]
3.  **Mock API Implementation**
    *   [x] Basic mock initialization [1]
    *   [ ] Set up mock API routes for retrieving campus data (filtered by location/species/time) [1]
    *   [ ] Implement basic pagination for search results [1]
    *   [ ] Add mock endpoint for *receiving* student contributions (initially just log them)

#### Phase 2: Integration with Components

1.  **Search Integration**
    *   [ ] Connect campus search filters to mock data retrieval [1]
    *   [ ] Display mock tree/AQ points on search results map/list [1]
2.  **Visualization Integration**
    *   [ ] Use mock data to populate Explore map (tree locations, AQ points) [1]
    *   [ ] Implement basic time series chart using mock AQ data [1]
3.  **Contribution Simulation**
    *   [ ] Ensure Contribute form data can be captured and sent to mock 'submit' endpoint
    *   [ ] (Later) Visualize submitted mock contributions on the Explore map

### Search Repositories Page (Campus Focus)

#### Phase 1: Core Campus Search

1.  **Search Interface Foundation**
    *   [x] Basic search form component [1]
    *   [ ] Implement map interface centered on Berkeley campus [1]
    *   [ ] Add basic filters (Tree species dropdown, location search input) [1]
2.  **Interactive Campus Map**
    *   [ ] Integrate map component (e.g., Leaflet, Mapbox GL JS) [1]
    *   [ ] Define campus boundaries/zones for context [1]
    *   [ ] Implement basic map controls (zoom, pan) [1]
3.  **Search Results Display**
    *   [x] Results list component [1]
    *   [ ] Display results as pins on the map [1]
    *   [ ] Implement basic pagination if many results [1]

#### Phase 2: Advanced Features

1.  **Data Preview**
    *   [x] Create preview cards/popups for search results [1]
    *   [ ] Show key attributes (species, health, AQ value) [1]
2.  **Integration**
    *   [ ] Link search results to Explore Data view

### Explore Data Page (Campus Focus)

-   [ ] Complete visualization components:
    *   [ ] Tree location map overlays (color/size by attribute) [1]
    *   [ ] Air quality data point display [1]
-   [ ] Implement filtering linked to map:
    *   [ ] Tree species/health filters [1]
    *   [ ] Time period selection for AQ data [1]
-   [ ] Add UI components:
    *   [ ] Interactive campus map [1]
    *   [ ] Simple time series chart [1]
    *   [ ] Filter controls panel [1]

### Contribute Data Flow (Campus Focus)

1.  **Data Contribution Interface (Mobile First)**
    *   [ ] Create Tree Inventory submission form (location picker, species, DBH, health, photo) [1]
    *   [ ] Implement Air Quality spot data upload form [1]
    *   [ ] Ensure forms are responsive and easy to use on phones [1]
2.  **Basic Validation**
    *   [ ] Implement campus geofencing for location input [1]
    *   [ ] Add required field validation [1]
    *   [ ] Basic data format checks (numeric inputs) [1]
3.  **Contribution Handling**
    *   [ ] Link contribution to logged-in user (Phase 2)
    *   [ ] Send data to mock API endpoint

### Cross-Flow Integration (Campus Focus)

1.  **Data Flow**
    *   [ ] Allow selecting a search result to view it in the Explore map [1]
    *   [ ] Allow selecting map features in Explore to potentially compare them (Phase 2) [1]
2.  **User Features (Phase 2/3)**
    *   [ ] Saved map views or locations (optional) [1]
    *   [ ] Display user's own contributions

## Implementation Notes (Educational Focus)

-   **Prioritize simplicity and ease of use** for students learning the concepts and the tool.
-   Focus on **mobile-friendliness for the Contribute flow** to support field data collection.
-   Provide clear instructions and context within the UI, especially for measurement techniques (like DBH).
-   Start with mock data, then integrate real baseline data. Student contributions are key.
-   Ensure visual distinction between baseline data and student-contributed data.

Next immediate task: Obtain or create realistic mock baseline data for UCB campus trees.
