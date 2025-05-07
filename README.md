# Berkeley Environmental Health Explorer (BEHE)

A modern web platform for exploring and analyzing environmental and climate data on the UC Berkeley campus and beyond.

## Features

- **Interactive Campus Map**: Visualizes Berkeley's tree inventory, air quality sensors, and overlays environmental data points on a dynamic map.
- **Environmental Data Comparison**: Compare air quality, tree diversity, and other environmental factors between campus locations.
- **Data Search & Filtering**: Quickly search, filter, and explore available datasets by property, category, or source.
- **Robust Error Handling**: Gracefully handles missing or incomplete data files and provides user-friendly notifications/fallbacks.
- **Static Data Loading**: Loads all data directly from static JSON/GeoJSON/CSV files for speed and reliability—no backend required.
- **User-Contributed Datasets**: Supports community-uploaded datasets for extensibility and collaboration.

## Data Sources & Static Data Approach

- **Berkeley City Tree Inventory (GeoJSON, 2013)**: Official tree census data for the UC Berkeley campus and city.
- **AirNow API (Historical Air Quality)**: Hourly/daily air quality data for Berkeley, pre-fetched and stored as JSON using a Python script.
- **User-Contributed/Community Data**: Additional datasets in CSV or JSON format, uploaded or curated by users.

> **Note:** All data is pre-compiled and placed in the `public/data/` directory. The frontend loads these files directly—no backend or live API calls are required at runtime.

## Technology Stack

- **React** (with TypeScript) — UI and application logic
- **Vite** — Fast development/build tool
- **Material UI (MUI)** — Component library and styling
- **Plotly.js** & **react-plotly.js** — Data visualization (charts, radar plots)
- **Leaflet** — Interactive mapping
- **Custom TypeScript Types** — Enforced type safety for all data and UI structures
- **Python** (for data pre-processing only; not part of the deployed frontend)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation & Development
1. Clone the repository:
   ```bash
   git clone https://github.com/oilsinwater/ueh-platform.git
   cd ueh-platform
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Data Files
- Place static data files in `public/data/` (e.g., `public/data/airnow/`, `public/data/processed/`).
- To update air quality data, run the provided Python script and copy the resulting JSON into the appropriate directory.

## Project Structure

- `/src` - Source code
  - `/components` - Shared and reusable UI components (maps, charts, panels)
  - `/pages` - Page-level React components (Home, Explore, Compare, etc.)
  - `/services/data-sources` - Data adapters for static files
  - `/types` - TypeScript types and interfaces
- `/public/data/` - Static JSON and CSV data files

## Contributing

Contributions are welcome! Please open issues or pull requests for bug fixes, features, or data improvements.

## License

MIT License

---

**Contact:** [Project Maintainer](mailto:your-email@berkeley.edu)
  - `/pages` - Application pages
  - `/services` - API and data services
  - `/utils` - Utility functions
  - `/types` - TypeScript type definitions

## Key Workflows

### Search Data Repositories Flow

The Search Data Repositories flow allows users to:

1. Search for climate datasets across multiple sources
2. Filter results by various criteria
3. View detailed information about each dataset

### Explore Data Flow

The Explore Data flow allows users to:

1. View data in multiple formats (table, cards, charts, maps)
2. Filter and search within datasets
3. Create interactive visualizations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Strudel Science](https://strudel.science) for the Strudel Kit framework
- All the climate data providers whose APIs and datasets are used in this application
