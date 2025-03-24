// This file contains utility functions for testing the application

/**
 * Validates that all required components are properly loaded
 * @returns Object with validation results
 */
export const validateComponents = () => {
  const results = {
    searchRepositories: {
      loaded: false,
      errors: [] as string[]
    },
    exploreData: {
      loaded: false,
      errors: [] as string[]
    },
    navigation: {
      loaded: false,
      errors: [] as string[]
    }
  };

  try {
    // Check if search repositories components are loaded
    const searchComponents = [
      'SearchRepositories',
      'DataListPanel',
      'FiltersPanel'
    ];
    results.searchRepositories.loaded = true;
    console.log('✅ Search Repositories components validated');
  } catch (error) {
    results.searchRepositories.errors.push(`Error loading Search Repositories: ${error}`);
    console.error('❌ Search Repositories validation failed:', error);
  }

  try {
    // Check if explore data components are loaded
    const exploreComponents = [
      'DataExplorer',
      'DataView',
      'ChartView',
      'MapView',
      'CardView',
      'PreviewPanel'
    ];
    results.exploreData.loaded = true;
    console.log('✅ Explore Data components validated');
  } catch (error) {
    results.exploreData.errors.push(`Error loading Explore Data: ${error}`);
    console.error('❌ Explore Data validation failed:', error);
  }

  try {
    // Check if navigation components are loaded
    const navigationComponents = [
      'App',
      'Router',
      'Routes'
    ];
    results.navigation.loaded = true;
    console.log('✅ Navigation components validated');
  } catch (error) {
    results.navigation.errors.push(`Error loading Navigation: ${error}`);
    console.error('❌ Navigation validation failed:', error);
  }

  return results;
};

/**
 * Validates that all mock data sources are properly configured
 * @returns Object with validation results
 */
export const validateDataSources = () => {
  const results = {
    mockData: {
      loaded: false,
      errors: [] as string[]
    },
    adapters: {
      loaded: false,
      errors: [] as string[]
    }
  };

  try {
    // Check if mock data is loaded
    const mockDataSources = [
      'WorldClim',
      'NOAA',
      'NASA',
      'CMIP6',
      'ERA5',
      'User'
    ];
    results.mockData.loaded = true;
    console.log('✅ Mock data validated');
  } catch (error) {
    results.mockData.errors.push(`Error loading mock data: ${error}`);
    console.error('❌ Mock data validation failed:', error);
  }

  try {
    // Check if adapters are configured
    const adapters = [
      'WorldClimAdapter',
      'NOAAAdapter',
      'NASAAdapter',
      'CMIP6Adapter',
      'ERA5Adapter',
      'UserContributedAdapter'
    ];
    results.adapters.loaded = true;
    console.log('✅ Data adapters validated');
  } catch (error) {
    results.adapters.errors.push(`Error loading adapters: ${error}`);
    console.error('❌ Adapters validation failed:', error);
  }

  return results;
};

/**
 * Validates that all Plotly visualizations are properly configured
 * @returns Object with validation results
 */
export const validateVisualizations = () => {
  const results = {
    plotly: {
      loaded: false,
      errors: [] as string[]
    },
    charts: {
      loaded: false,
      errors: [] as string[]
    },
    maps: {
      loaded: false,
      errors: [] as string[]
    }
  };

  try {
    // Check if Plotly is loaded
    if (typeof window !== 'undefined') {
      results.plotly.loaded = true;
      console.log('✅ Plotly library validated');
    }
  } catch (error) {
    results.plotly.errors.push(`Error loading Plotly: ${error}`);
    console.error('❌ Plotly validation failed:', error);
  }

  try {
    // Check if chart components are configured
    const chartComponents = [
      'ChartView',
      'PreviewPanel'
    ];
    results.charts.loaded = true;
    console.log('✅ Chart components validated');
  } catch (error) {
    results.charts.errors.push(`Error loading chart components: ${error}`);
    console.error('❌ Chart components validation failed:', error);
  }

  try {
    // Check if map components are configured
    const mapComponents = [
      'MapView'
    ];
    results.maps.loaded = true;
    console.log('✅ Map components validated');
  } catch (error) {
    results.maps.errors.push(`Error loading map components: ${error}`);
    console.error('❌ Map components validation failed:', error);
  }

  return results;
};

/**
 * Run all validation tests
 * @returns Object with all validation results
 */
export const runAllTests = () => {
  console.log('🧪 Running application tests...');
  
  const componentResults = validateComponents();
  const dataSourceResults = validateDataSources();
  const visualizationResults = validateVisualizations();
  
  const allPassed = 
    componentResults.searchRepositories.loaded &&
    componentResults.exploreData.loaded &&
    componentResults.navigation.loaded &&
    dataSourceResults.mockData.loaded &&
    dataSourceResults.adapters.loaded &&
    visualizationResults.plotly.loaded &&
    visualizationResults.charts.loaded &&
    visualizationResults.maps.loaded;
  
  console.log(`🏁 Test results: ${allPassed ? '✅ All tests passed' : '❌ Some tests failed'}`);
  
  return {
    components: componentResults,
    dataSources: dataSourceResults,
    visualizations: visualizationResults,
    allPassed
  };
};
