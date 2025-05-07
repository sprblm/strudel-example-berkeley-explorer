# LLM Plan for BCCAH Data and UI Integration

**Objective:** Process baseline datasets (Berkeley City Trees, AirNow API via proxy) and structure user-contributed data to populate the BCCAH application. Ensure data conforms to defined interfaces (`TreeObservation`, `AQReading`) and implement UI interactions (filtering, sorting, exploration, comparison, contribution) as specified for each STRUDEL Task Flow.

**1. Baseline Dataset Strategy:**

* **Berkeley City Trees (2013 Inventory):**
  * **Source:** GeoJSON file from UC Berkeley Library Geodata (`berkeley-s7gq2s`). = -9 s
  * **Role:** Provides the initial static layer of known trees on/near the UC Berkeley campus.
  * **Data Extraction/Preparation:**
    * Parse the GeoJSON features.
    * Filter features to retain only those within the defined UC Berkeley campus boundary (plus a small buffer).
    * For each retained feature, map its properties to the `TreeObservation` interface:
      * `location`: Extract `[longitude, latitude]` from geometry.
      * `species`: Map from `SPP_NAME` or `COMMON_NAM`. Standardize naming if needed.
      * `dbh`: Map from DBH field (ensure numeric).
      * `healthCondition`: Map from `CONDITION` field (standardize to "Good", "Fair", "Poor", or similar defined values).
      * `observationDate`: Set consistently to `"2013-04-30"`.
      * `source`: Set to `"UCB Geodata Library (2013 Inventory)"`.
      * `isBaseline`: Set to `true`.
      * `id`: Generate a unique ID prefixed with `baseline-tree-`.
      * Include optional fields (`height`, `crownSpread`) if available and mapped.
    * **Output:** A clean JSON array of `TreeObservation` objects representing the baseline inventory.

*   **AirNow API:**
    *   **Source:** AirNow API Web Services (`Current Observations By Lat/Lon` and potentially `Historical Observations By Lat/Lon`), accessed via a **secure backend proxy** using the registered API key. The proxy should handle caching. Query using central coordinates for UC Berkeley campus.
    *   **Role:** Provides near real-time and potentially recent historical air quality context (AQI, key pollutant concentrations) *from the nearest reporting station* to campus.
    * **Data Extraction/Preparation (Responsibility of the Backend Proxy):**
    * Parse the JSON response from the AirNow API.
    * For each relevant observation (e.g., PM2.5, OZONE, AQI), map data to the `AQReading` interface:
      * `location`: Use the *actual coordinates* of the reporting station provided in the API response.
      * `timestamp`: Combine `DateObserved` and `HourObserved` into a standard format (e.g., ISO 8601).
      * `parameter`: Map from `ParameterName`.
      * `value`: Use the `AQI` value or concentration value. Ensure numeric.
      * `unit`: Set according to the parameter (e.g., `"AQI"`, `"µg/m³"`).
      * `source`: Set to `"AirNow API (Station: [ReportingArea])"`.
      * `isBaseline`: Set to `true`.
      * `id`: Generate a unique ID prefixed with `baseline-aq-`.
    *   **Output (from Proxy):** A JSON array of `AQReading` objects representing recent conditions at the nearest station.

**2. Public Contribution Data Strategy:**

* **Source:** End-users (students/community) interacting with the `/contribute` Task Flow.
* **Role:** To dynamically enrich the platform with current, hyper-local field observations, updating or supplementing the baseline data.
* **Data Types & Datapoints to Collect:**
  * **Tree Observations (conforming to `TreeObservation`):**
    * `location`: Required (from map click/GPS).
    * `species`: Required (dropdown/autocomplete, potentially allow "Unknown").
    * `dbh`: Required (numeric input, provide guidance).
    * `healthCondition`: Required (simple rating scale: e.g., "Good", "Fair", "Poor", "Dead").
    * `observationDate`: Required (auto-timestamped).
    * `photos`: Optional (URL(s) of uploaded images).
    * `notes`: Optional (text input).
    * `height`: Optional (numeric estimate).
    * `crownSpread`: Optional (numeric estimate).
    * `contributorId`: Required (link to logged-in user, or "anonymous").
    * `source`: Set to `"User Contribution"`.
    * `isBaseline`: Set to `false`.
    * `id`: Generate a unique ID prefixed with `contrib-tree-`.
  * **Spot Air Quality Readings (conforming to `AQReading`):** (If portable sensors are used)
    * `location`: Required (from map click/GPS).
    * `timestamp`: Required (auto-timestamped or manual entry).
    * `parameter`: Required (dropdown: e.g., "PM2.5", "CO2").
    * `value`: Required (numeric input).
    * `unit`: Required (dropdown or auto-set based on parameter).
    * `sensorType`: Optional (text input).
    * `notes`: Optional (text input).
    * `contributorId`: Required (link to logged-in user, or "anonymous").
    * `source`: Set to `"User Contribution"`.
    * `isBaseline`: Set to `false`.
    * `id`: Generate a unique ID prefixed with `contrib-aq-`.
* **Validation:** Implement rules specified in `prd_updated.md` (Sec 4.2): location geofencing (campus area), required fields, numeric range checks.

**3. UI Interaction Strategy per STRUDEL Task Flow:**

*   **General Principle:** Clearly differentiate data sources visually (e.g., baseline trees = grey icons, contributed trees = green icons; AirNow station = distinct symbol, contributed AQ points = another symbol). Use tooltips/popups to show data source and timestamp/observation date.

*   **Search Repositories (`/search`):**
    *   **Data Displayed:** Primarily focuses on *trees* (both baseline and contributed). The map shows tree locations. A list view provides details. AirNow data isn't the primary search target but provides context.
    *   **Filtering:** Allow users to filter the combined tree dataset by:
      *   `species`: Multi-select dropdown or autocomplete.
      *   `dbh`: Range slider or min/max input.
      *   `healthCondition`: Checkboxes or multi-select dropdown.
      *   `source`: Checkboxes ("Baseline Inventory", "User Contributions").
      *   `observationDate`/`contributionDate`: Date range picker.
      *   *Location*: Implicitly via map view extent, or explicitly via search box for campus landmarks/addresses.
    *   **Sorting:** Allow sorting the results list by:
      *   Distance (from map center or clicked point).
      *   Species name (A-Z).
      *   DBH (Smallest/Largest).
      *   Observation/Contribution Date (Newest/Oldest).
    *   **Exploration:** Clicking a result (map pin or list item) should provide a preview (popup/panel) with key attributes and potentially a link to the `/explore` view centered on that tree.

*   **Explore Data (`/explore`):**
    *   **Data Displayed:** Interactive campus map showing:
      *   Baseline Trees (e.g., grey icons, size potentially reflects DBH).
      *   Contributed Trees (e.g., green icons).
      *   AirNow Data: A symbol at the nearest station's location, color-coded by current AQI (fetched via backend proxy). Clicking could show recent trend/details.
      *   Contributed AQ Readings: Distinct symbols at their specific locations.
    *   **Filtering:** Dynamic filters panel affecting the map view:
      *   Tree filters: `species`, `dbh`, `healthCondition`, `source`, `observationDate` (as in Search).
      *   AQ filters: `parameter` (for contributed AQ points), `timestamp` (date range for contributed AQ), `source` ("AirNow", "User Contributions").
    *   **Exploration:**
      *   Clicking map features opens popups with full attributes (species, DBH, health, AQ value, timestamp, source, photo thumbnail if available).
      *   Hover effects to highlight features.
      *   Potential for basic time-series chart displaying AirNow history (if fetched) or aggregated contributed AQ readings over selected time.
      *   Layer controls to toggle visibility of different data types (baseline trees, contributed trees, AirNow, contributed AQ).

*   **Compare Data (`/compare`):**
    *   **Data Displayed:** Side-by-side comparison interface. Users select either:
      *   Two distinct spatial areas (polygons drawn/selected on the campus map).
      *   Two distinct time periods (using date range pickers).
    *   **Comparison Logic:**
      *   *Spatial Comparison:* For each selected area, calculate and display summary statistics based on the *combined* tree data (baseline + contributed) within that area: tree count, species diversity index (simple), average DBH, distribution of health conditions. Display average/peak AirNow AQI from nearest station relevant to the areas (might be the same station for both). Show count of contributed AQ readings within each area.
      *   *Temporal Comparison:* For each selected time period, display statistics: count of tree *contributions* during the period, average/peak AirNow AQI, count/average of contributed AQ readings during the period.
    *   **Exploration:** Present results in clear summary tables or comparative charts (e.g., bar charts for health distribution, line charts for AQ trends if comparing time).

*   **Contribute Data (`/contribute`):**
    *   **Data Input:** Forms optimized for mobile use, matching the structures defined in section 2.
      *   Map interface for pinning location accurately (defaulting to device GPS if available).
      *   Intuitive inputs: dropdowns for species/health/parameter, numeric inputs with clear labels/units, photo upload button.
      *   Provide inline guidance (e.g., "How to measure DBH" link/popup).
    *   **Interaction:**
      *   Perform client-side validation (required fields, basic formats) before submission.
      *   Backend performs stricter validation (geofencing, range checks).
      *   Provide clear feedback on successful submission or errors.
      *   Submitted data should become visible relatively quickly in `/search` and `/explore` views (after passing validation).
—
