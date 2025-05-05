# Arabic Words

[![Project Status: In Development](https://img.shields.io/badge/status-in%20development-yellow)](https://shields.io/)

A mobile application for seamless bidirectional translation between English and Lebanese Arabic (or other Levantine dialects).

## Table of Contents

1.  [Project Description](#project-description)
2.  [Tech Stack](#tech-stack)
3.  [Getting Started Locally](#getting-started-locally)
4.  [Available Scripts](#available-scripts)
5.  [Project Scope](#project-scope)
6.  [Project Status](#project-status)
7.  [License](#license)

## Project Description

The **Arabic Words** app aims to bridge the communication gap for expats and residents in Levantine countries, starting with Lebanon, by providing accurate translations between English and the local dialect (Lebanese Arabic). Unlike many existing tools that focus on Standard Arabic, this app uses a pre-verified dictionary specific to the Lebanese dialect and employs caching for fast search results.

Future iterations plan to include a paid feature allowing users to download the dictionary for offline access.

## Tech Stack

This project is built using the Expo framework and leverages the following technologies:

- **Core:** React Native (0.79+), React (19.0+), Expo SDK (53+)
- **Language:** TypeScript (5+)
- **Navigation:** Expo Router (5+)
- **Styling:** NativeWind (4+), Tailwind CSS (3+)
- **Linting:** ESLint (9+), `eslint-config-expo`

## Getting Started Locally

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Git
- (Optional but recommended for native development) Android Studio or Xcode setup for device/simulator testing.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd arabicwords
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Run the application:**
    - Start the development server: `npm start` or `yarn start`
    - Run on Android: `npm run android` or `yarn android`
    - Run on iOS: `npm run ios` or `yarn ios`
    - Run in a web browser: `npm run web` or `yarn web`

## Available Scripts

In the project directory, you can run the following scripts:

- `npm start`: Runs the app in development mode using Expo Go.
- `npm run android`: Runs the app on a connected Android device or emulator.
- `npm run ios`: Runs the app on an iOS simulator or device (macOS only).
- `npm run web`: Runs the app in a web browser.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run reset-project`: Resets the project state (specific functionality defined in `scripts/reset-project.js`).

## Project Scope

### Included (MVP)

- Real-time bidirectional word translation (English <-> Lebanese Arabic).
- Utilizes a pre-verified dictionary for accuracy.
- Caching mechanism for optimized search performance.
- Future: Secure payment integration to unlock offline dictionary download.
- Future: Basic secure user authentication for paid features.

### Excluded (Initially)

- Full offline translation functionality (only dictionary _download_ will be available post-payment).
- Support for dialects other than Lebanese Arabic.
- Advanced features like continuous dictionary synchronization or extensive user profiling.

## Project Status

The project is currently **in development**. The initial focus is on delivering the core translation functionality for the Lebanese dialect and implementing the mechanism for the paid offline dictionary download feature.

## License

This project is currently private (`"private": true` in `package.json`). A specific open-source license may be chosen in the future if the project becomes public.
