# ReactNativeDiplomski

KomunalniProblemiApp

## Project Description

KomunalniProblemiApp is a React Native application designed to help users report and resolve communal problems in their vicinity. The app offers the following functionalities:

- **User Registration**: Users can register with a username and password.
- **GPS Tracking**: The app continuously tracks the user's location using GPS and displays their position on a map.
- **Add Objects**: Users can add objects (communal problems) on the map with a text description.
- **Select and Resolve Objects**: Users can select objects within their radius and mark them as resolved. The status of communal problems can be:
  - Active
  - Resolved
  - Stale (older than 30 days)
- **Problem Table**: Communal problems are also displayed in a table on a separate screen.
- **Active Users List**: Users can view a list of currently active users within the app.
- **Search Functionality**: Users can search for objects on the map based on description, type, status, or by user radius.
- **Notification System**: When you come close to problem that is Active on the map

## How to Run the React Native App

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Start the Metro Bundler**:

   ```bash
   npm start
   ```

3. **Run on Android**:

   ```bash
   npm run android
   ```

4. **Run on iOS**:
   ```bash
   npm run ios
   ```

Make sure you have an Android emulator or iOS simulator running, or a physical device connected.
