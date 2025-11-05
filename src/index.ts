import { definePreviewAddon } from 'storybook/internal/csf';

import addonAnnotations from './preview';
import type { CssResource } from './types';

export default () =>
  definePreviewAddon<{
    parameters: {
      cssresources?: CssResource[];
    };
  }>(addonAnnotations);
