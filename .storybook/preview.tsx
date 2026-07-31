import type { Preview } from "@storybook/nextjs";
import { withThemeByClassName } from "@storybook/addon-themes";

import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    // The app toggles dark mode with a `dark` class on <html>, so stories are
    // themed the same way.
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
      parentSelector: "html",
    }),
    (Story) => (
      <div className="bg-background p-8 text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default preview;
