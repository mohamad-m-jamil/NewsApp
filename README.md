# News Mobile App

A React Native mobile app built with Expo that fetches articles from the [GNews API](https://gnews.io).

## Features

- **Fetch N articles** — choose how many articles to load (1 - 10)
- **Keyword search** — search articles via the GNews API
- **Filter by title** — client-side filtering by article title
- **Filter by author** — client-side filtering by author name
- **Error handling** — friendly messages for failed requests or empty results

## Setup & Run

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/news-mobile-app.git
cd news-mobile-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your API key

Create a `.env` file in the root of the project:

```
EXPO_PUBLIC_GNEWS_API_KEY=your_api_key_here
```

Get a free API key at [https://gnews.io](https://gnews.io).

### 4. Start the app

```bash
npx expo start
```

Then scan the QR code with the **Expo Go** app on your phone, or press `a` for Android emulator / `i` for iOS simulator.
