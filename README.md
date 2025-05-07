# Berkeley Environmental Health Explorer (BEHE)

A modern web platform for exploring and analyzing environmental and climate data on the UC Berkeley campus and beyond.

## Features

- **Campus Data Map**: Interactive map showing trees, air quality sensors, and environmental factors.
- **Compare Data**: Visualize and compare tree diversity, air quality, and other factors between locations.
- **Search & Explore**: Find and filter datasets by type, source, and environmental category.
- **User-Contributed Data**: Support for uploading and exploring community datasets.
- **Multiple Visualization Options**: Tables, cards, charts, and geographic maps (Plotly, Leaflet, MUI).

## Data Sources & Approach

- **Berkeley Tree Inventory (GeoJSON, 2013)**: Static dataset of campus trees.
- **AirNow API (Historical Air Quality)**: Data fetched via Python script, pre-compiled into JSON for frontend use.
- **User/Community Data**: CSV/JSON files contributed by users.

**Static Data Workflow:**
- No backend API. All data is pre-processed and stored as static JSON/CSV files in the `public/data/` directory.
- The frontend loads these files directly for fast and scalable data access.

## Technology Stack

- **React** (w/ TypeScript)
- **Material UI (MUI)** for UI components
- **Vite** for rapid development
- **Plotly.js** and **react-plotly.js** for charts
- **Leaflet** for maps
- **Custom Types** for strong type safety

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
