import { ListConfig, CardFields, TaskflowConfig } from './taskflow.types';

export const taskflow: TaskflowConfig = {
  data: {
    /**
     * Data definition for the initial items list
     */
    list: {
      /**
       * Source of the data for the initial list of items on the main page.
       */
      source: '/api/datasets',
      /**
       * Key-value object of params that should always be included in the query URL
       */
      staticParams: {
        limit: 10,
        offset: 0,
      },
      /**
       * Field name for the unique ID in the data source.
       */
      idField: 'id',
      /**
       * Method by which data should be filtered, either client or server.
       */
      queryMode: 'server',
    },
    /**
     * Data definition for the item detail page
     */
    detail: {
      source: '/api/dataset',
      staticParams: null,
      idField: 'id',
      queryMode: 'client',
    },
    /**
     * Available repositories that can be searched
     */
    repositories: [
      { id: 'noaa', name: 'NOAA Climate Data Online', enabled: true },
      { id: 'nasa', name: 'NASA Earth Observations', enabled: true },
      { id: 'worldclim', name: 'WorldClim', enabled: true },
      { id: 'cmip6', name: 'CMIP6 Climate Model Outputs', enabled: true },
      { id: 'era5', name: 'ERA5 Reanalysis Data', enabled: true },
      { id: 'user', name: 'User-contributed datasets', enabled: true },
    ],
  },
  cards: {
    /**
     * Field name for the title in the data source.
     */
    titleField: 'name',
    /**
     * Field name for the content in the data source.
     */
    contentField: 'description',
  },
  pages: {
    index: {
      /**
       * Title to appear at the top of the main page.
       */
      title: 'Climate Data Repository Search',
      /**
       * Text to appear underneath the title at the top of the main page.
       */
      description:
        'Search across multiple climate data repositories to find relevant datasets for your research',
      /**
       * Map of card sections to property names in the data source.
       * This determines the content of the cards on the main page.
       */
      cardFields: {
        title: 'name',
        content: 'description',
        tags: 'keywords',
        source: 'source',
        quality: 'quality',
        resolution: 'resolution',
        temporal_coverage: 'temporal_coverage',
        spatial_coverage: 'spatial_coverage',
        variables: 'variables',
        thumbnail: 'thumbnail_url',
        citation: 'citation',
        download_url: 'download_url',
      },
      /**
       * List of filters to display on the main page and use to filter the main data cards.
       * Each filter has a definition object to determine how it renders and functions.
       */
      cardFilters: [
        {
          /**
           * Repository filter
           */
          field: 'source',
          label: 'Data Source',
          operator: 'contains-one-of',
          filterComponent: 'CheckboxList',
          filterProps: {
            options: [
              { label: 'NOAA', value: 'noaa' },
              { label: 'NASA', value: 'nasa' },
            ],
          },
        },
        {
          /**
           * Climate variables filter
           */
          field: 'variables',
          label: 'Climate Variables',
          operator: 'contains-one-of',
          filterComponent: 'CheckboxList',
          filterProps: {
            options: [
              { label: 'Temperature', value: 'Temperature' },
              { label: 'Precipitation', value: 'Precipitation' },
              { label: 'Humidity', value: 'Humidity' },
              { label: 'Wind Speed', value: 'Wind Speed' },
              { label: 'Pressure', value: 'Pressure' },
              { label: 'Solar Radiation', value: 'Solar Radiation' },
              { label: 'Cloud Cover', value: 'Cloud Cover' },
              { label: 'Sea Level', value: 'Sea Level' },
              {
                label: 'Sea Surface Temperature',
                value: 'Sea Surface Temperature',
              },
              { label: 'Snow Cover', value: 'Snow Cover' },
              { label: 'Soil Moisture', value: 'Soil Moisture' },
            ],
          },
        },
        {
          /**
           * Geographic region filter
           */
          field: 'spatial_coverage',
          label: 'Geographic Region',
          operator: 'contains-one-of',
          filterComponent: 'CheckboxList',
          filterProps: {
            options: [
              { label: 'Global', value: 'Global' },
              { label: 'North America', value: 'North America' },
              { label: 'South America', value: 'South America' },
              { label: 'Europe', value: 'Europe' },
              { label: 'Asia', value: 'Asia' },
              { label: 'Africa', value: 'Africa' },
              { label: 'Australia/Oceania', value: 'Australia/Oceania' },
              { label: 'Arctic', value: 'Arctic' },
              { label: 'Antarctic', value: 'Antarctic' },
              { label: 'Pacific Ocean', value: 'Pacific Ocean' },
              { label: 'Atlantic Ocean', value: 'Atlantic Ocean' },
              { label: 'Indian Ocean', value: 'Indian Ocean' },
            ],
          },
        },
        {
          /**
           * Time period filter
           */
          field: 'temporal_coverage',
          label: 'Time Period',
          operator: 'between-dates-inclusive',
          filterComponent: 'DateRange',
          filterProps: {
            minDate: '1850-01-01',
            maxDate: '2100-12-31',
          },
        },
        {
          /**
           * Resolution filter (spatial)
           */
          field: 'spatial_resolution',
          label: 'Spatial Resolution',
          operator: 'contains-one-of',
          filterComponent: 'CheckboxList',
          filterProps: {
            options: [
              { label: 'High (<1km)', value: 'high' },
              { label: 'Medium (1-10km)', value: 'medium' },
              { label: 'Low (>10km)', value: 'low' },
            ],
          },
        },
        {
          /**
           * Resolution filter (temporal)
           */
          field: 'temporal_resolution',
          label: 'Temporal Resolution',
          operator: 'contains-one-of',
          filterComponent: 'CheckboxList',
          filterProps: {
            options: [
              { label: 'Hourly', value: 'hourly' },
              { label: 'Daily', value: 'daily' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Monthly', value: 'monthly' },
              { label: 'Annual', value: 'annual' },
              { label: 'Decadal', value: 'decadal' },
            ],
          },
        },
        {
          /**
           * Data type filter
           */
          field: 'type',
          label: 'Data Type',
          operator: 'contains-one-of',
          filterComponent: 'CheckboxList',
          filterProps: {
            options: [
              { label: 'Observed/Measured', value: 'observed' },
              { label: 'Reanalysis', value: 'reanalysis' },
              { label: 'Model Output', value: 'model' },
              { label: 'Projected/Future', value: 'projected' },
            ],
          },
        },
        {
          /**
           * Publication date filter (when the dataset was published)
           */
          field: 'publication_date',
          label: 'Publication Date',
          operator: 'between-dates-inclusive',
          filterComponent: 'DateRange',
        },
        {
          /**
           * Data quality filter
           */
          field: 'quality',
          label: 'Quality Rating',
          operator: 'greater-than-or-equal',
          filterComponent: 'Slider',
          filterProps: {
            min: 1,
            max: 5,
            step: 1,
            marks: [
              { value: 1, label: '1' },
              { value: 2, label: '2' },
              { value: 3, label: '3' },
              { value: 4, label: '4' },
              { value: 5, label: '5' },
            ],
          },
        },
        {
          /**
           * Category filter (kept from original)
           */
          field: 'category',
          label: 'Category',
          operator: 'contains-one-of',
          filterComponent: 'CheckboxList',
          filterProps: {
            options: [
              { label: 'Groundwater', value: 'Groundwater' },
              { label: 'Fires', value: 'Fires' },
              { label: 'Floods', value: 'Floods' },
              { label: 'Earthquakes', value: 'Earthquakes' },
              { label: 'Drought', value: 'Drought' },
              { label: 'Sea Level Rise', value: 'Sea Level Rise' },
              { label: 'Extreme Weather', value: 'Extreme Weather' },
              { label: 'Air Quality', value: 'Air Quality' },
            ],
          },
        },
        {
          /**
           * Tags filter (kept from original but expanded)
           */
          field: 'tags',
          label: 'Tags',
          operator: 'contains-one-of',
          filterComponent: 'CheckboxList',
          filterProps: {
            options: [
              { label: 'Boreal forest', value: 'Boreal forest' },
              {
                label: 'Carbon and greenhouse gas emissions',
                value: 'Carbon and greenhouse gas emissions',
              },
              { label: 'Ecology', value: 'Ecology' },
              { label: 'Climate Change', value: 'Climate Change' },
              { label: 'Global Warming', value: 'Global Warming' },
              { label: 'Biodiversity', value: 'Biodiversity' },
              { label: 'Urban Climate', value: 'Urban Climate' },
              { label: 'Coastal', value: 'Coastal' },
              { label: 'Agriculture', value: 'Agriculture' },
              { label: 'Water Resources', value: 'Water Resources' },
            ],
          },
        },
      ],
      /**
       * Settings for geographical search interface
       */
      mapSearch: {
        enabled: true,
        defaultCenter: [0, 0],
        defaultZoom: 1,
        maxBounds: [
          [-90, -180],
          [90, 180],
        ],
      },
      /**
       * Settings for search history tracking
       */
      searchHistory: {
        enabled: true,
        maxEntries: 20,
      },
      /**
       * Settings for saved searches
       */
      savedSearches: {
        enabled: true,
        maxSavedSearches: 10,
      },
    },
  },
};

export const getListConfig = () => taskflow.data.list;
export const getCardFields = () => taskflow.cards;
