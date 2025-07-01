# Dutch Train Station Finder

A modern web application that helps users find stores, restaurants, gyms, and other venues near Dutch train stations. Built with React, TypeScript, and Leaflet for interactive mapping.

## Features

- 🚂 **Train Station Selection**: Choose from major Dutch train stations
- 🔍 **Smart Search**: Find specific types of venues with customizable filters
- 📍 **Interactive Map**: View locations and stations on an interactive map with OpenStreetMap
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface with Dutch Railways (NS) branding colors
- 📏 **Distance Control**: Configurable search radius from 0.5km to 10km

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom NS color theme
- **Mapping**: Leaflet with React-Leaflet integration
- **Icons**: Lucide React for beautiful, consistent icons
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dutch-train-station-finder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Project Structure

```
src/
├── components/          # React components
│   ├── SearchForm.tsx   # Search and filter form
│   ├── ResultsList.tsx  # Results display component
│   └── MapView.tsx      # Interactive map component
├── data/               # Static data
│   └── trainStations.ts # Dutch train stations dataset
├── services/           # API and business logic
│   └── api.ts          # Search and data services
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Features in Detail

### Train Stations
The app includes major Dutch train stations including:
- Amsterdam Centraal
- Rotterdam Centraal
- Den Haag Centraal
- Utrecht Centraal
- Eindhoven Centraal
- And 10 more major stations

### Search Categories
- Restaurants & Food
- Supermarkets & Shopping
- Sports & Fitness venues
- Entertainment (cinemas, etc.)
- Pharmacies & Healthcare
- Banking & Services

### Map Integration
- Interactive map powered by OpenStreetMap
- Custom markers for train stations (blue) and search results (red)
- Popup information for detailed venue information
- Automatic map centering based on selected station and results

## Future Enhancements

This is a demo application. In a production environment, it would integrate with:

- **Real APIs**: 
  - Overpass API for OpenStreetMap data
  - Google Places API for comprehensive business listings
  - Foursquare API for venue details and ratings
  - NS API for real-time train information

- **Additional Features**:
  - Real-time train schedules
  - Route planning integration
  - User reviews and ratings
  - Favorites and saved searches
  - Push notifications for delays
  - Offline support

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Dutch Railways (NS) for inspiration and color scheme
- OpenStreetMap for mapping data
- React and the amazing React ecosystem
- Tailwind CSS for rapid styling