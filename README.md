# Climate Data Analysis Platform

A comprehensive platform for analyzing climate data from various repositories and datasets.

## Features

1. **Search Data Repositories**: Find climate datasets from multiple sources with filtering options
2. **Explore Data**: Visualize and analyze climate data through interactive tables, charts, and maps
3. **Multiple Visualization Options**: View data as tables, cards, charts, or geographic maps

## Data Sources

This platform provides access to climate data from various sources:

1. **WorldClim** - Global climate data for current conditions, future projections, and past climate
2. **NOAA** - National Oceanic and Atmospheric Administration climate datasets
3. **NASA** - Earth observation and climate data from NASA
4. **ERA5** - ECMWF Reanalysis v5 climate data
5. **User-contributed** - Community-contributed climate datasets

## Technology Stack

1. **Strudel Kit** - A framework for building scientific web applications
2. **React** - For building the user interface
3. **Material UI** - For component styling and layout
4. **TypeScript** - For type-safe code

## Getting Started

### Prerequisites

1. Node.js (v14 or higher)
2. npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/oilsinwater/climate-study.git
cd climate-study
```

1. Install dependencies:

```bash
npm install
```

1. Start the development server:

```bash
npm run dev
```

1. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `/src` - Source code
  - `/components` - Reusable UI components
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
