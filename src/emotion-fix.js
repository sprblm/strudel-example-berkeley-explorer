// This is a temporary fix for the emotion/hoist-non-react-statics issue
// It provides a shim for the missing default export

import * as hoistNonReactStatics from 'hoist-non-react-statics/dist/hoist-non-react-statics.js';

// Create a default export that matches what emotion expects
const hoistWithDefault = Object.assign(hoistNonReactStatics.default || hoistNonReactStatics, {
  default: hoistNonReactStatics.default || hoistNonReactStatics
});

export default hoistWithDefault;
