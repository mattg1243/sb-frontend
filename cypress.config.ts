import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    specPattern: 'src/**/*.test.{js,jsx,ts,tsx}',
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
    video: false,
    watchForFileChanges: true,
    experimentalInteractiveRunEvents: true,
    viewportHeight: 1080,
    viewportWidth: 1920,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
  },
});
