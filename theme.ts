// theme.ts
import { createTheme } from "@shopify/restyle";

const palette = {
    night: "#121212", // Dark background for immersive reading
    eerieBlack: "#1E1E1E", // Slightly lighter than main background
    white: "#FFFFFF", // High contrast text for readability
    cadetGray: "#A0A0A0", // Dimmed text for metadata or secondary info
    green: "#00dc64", // Highlight color for actions (e.g., likes, bookmarks)
    jet: "#2C2C2C", // Subtle borders for separation
    black: "rgba(0,0,0,0.5)", // For modals or dimmed backgrounds
};

// const palette = {
//   white: "#FFFFFF", // Light background
//   snow: "#FAFAFA", // Slightly darker than white for cards
//   black: "#121212", // Main text color
//   davysGray: "#595959", // Secondary/dimmed text
//   bittersweet: "#00dc64", // Accent color remains the same
//   lightGray: "#E0E0E0", // Border color
//   overlay: "rgba(0,0,0,0.1)", // Light overlay
// };

const theme = createTheme({
    colors: {
        background: palette.night,
        cardBackground: palette.eerieBlack,
        textPrimary: palette.white,
        textSecondary: palette.cadetGray,
        accent: palette.green,
        border: palette.jet,
        overlay: palette.black,
    },
    // colors: {
    //   background: palette.white,
    //   cardBackground: palette.snow,
    //   textPrimary: palette.black,
    //   textSecondary: palette.davysGray,
    //   accent: palette.bittersweet,
    //   border: palette.lightGray,
    //   overlay: palette.overlay,
    // },
    spacing: {
        none: 0,
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 48,
        xxl: 96,
    },
    borderRadii: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 20,
    },
    textVariants: {
        defaults: {
            fontFamily: "System",
            color: "textPrimary",
            fontSize: 16,
        },
        header: {
            fontSize: 24,
            fontWeight: "bold",
            color: "textPrimary",
        },
        subtitle: {
            fontSize: 18,
            fontWeight: "600",
            color: "textSecondary",
        },
        body: {
            fontSize: 16,
            color: "textPrimary",
        },
        caption: {
            fontSize: 14,
            color: "textSecondary",
        },
        button: {
            fontSize: 18,
            color: "textPrimary",
            fontWeight: "bold",
        },
    },
    breakpoints: {
        phone: 0,
        tablet: 768,
    },
});

export type Theme = typeof theme;
export default theme;
