import type { Preview } from "@storybook/react";
import '../src/index.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'base',
      values: [
      {
        name: 'base',
        value: '#1A1A1A'
      },
      {
        name: 'sidebar',
        value: '#2B2B2B'
      },
    ]
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
