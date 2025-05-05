# Suggested React Native Tech Stack (Minimal)

Based on the provided `package.json` examples and aiming for a minimal yet modern React Native setup using Expo:

##### Core Framework & UI:

- **React Native (0.79+) & React (19.0+)**: The foundation for building native apps using React.
- **Expo SDK (53+)**: Provides a framework and platform for React Native development, simplifying builds, updates, and access to native APIs.
- **TypeScript (5+)**: For static typing, improving code quality and developer experience.

##### Navigation:

- **Expo Router (5+)**: File-based routing for universal React Native apps, simplifying navigation setup. Requires `react-native-screens` and `react-native-safe-area-context`.

##### Styling:

- **NativeWind (4+) & Tailwind CSS (3+)**: Utility-first CSS framework adapted for React Native, enabling rapid UI development consistent with web Tailwind practices.

##### Development Tooling & Linting:

- **Expo CLI**: Essential command-line tool for managing and running Expo projects.
- **ESLint (9+) & `eslint-config-expo`**: For code linting and enforcing code style, integrating well with the Expo ecosystem. (Alternatively, `Biome` could be used as seen in the `mobile-olas` example for formatting and linting).

This stack provides a solid, minimal starting point for building a modern React Native application with Expo, focusing on core functionalities like UI rendering, navigation, styling, and type safety.
