import { definePreview } from '@storybook/react-vite';
import addonDocs from '@storybook/addon-docs';
import localAddon from '../dist/index.js';

export default definePreview({
  addons: [addonDocs(), localAddon()],
  parameters: {},
  initialGlobals: {
    background: { value: 'light' },
  },
});
