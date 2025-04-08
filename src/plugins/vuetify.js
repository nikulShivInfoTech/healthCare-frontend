// Import necessary modules from Vuetify
import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Define the light theme


// Create the Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
});

// Export the Vuetify instance
export default vuetify;
