# Met de Trein - Dutch Train Station Finder

A production-ready web application that helps users find stores, restaurants, gyms, and other venues near Dutch train stations. Built with React, TypeScript, and integrated with live OpenStreetMap data via the Overpass API.

## 🚀 Live Features

- 🚂 **80+ Dutch Train Stations**: Complete coverage of major intercity, regional, and local stations
- 🌐 **Live OpenStreetMap Data**: Real-time venue information via Overpass API
- 🔍 **13 Venue Categories**: Restaurants, supermarkets, gyms, pharmacies, banks, and more
- 📍 **Interactive Map**: View locations with custom markers, search radius, and detailed popups
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- 🎨 **Professional UI**: Modern design with Dutch Railways (NS) branding
- 📏 **Flexible Distance**: Configurable search radius from 0.5km to 10km
- 🔄 **Online/Offline Detection**: Graceful fallbacks when APIs are unavailable
- ⚡ **Production Ready**: Optimized builds, error handling, and comprehensive documentation

## 🗺️ Data Sources

- **Train Stations**: Comprehensive Dutch railway database (80+ stations with real NS codes)
- **Venue Data**: Live OpenStreetMap data via Overpass API
- **Mapping**: OpenStreetMap with Leaflet integration
- **Fallbacks**: Demo data when external APIs are unavailable

## 🏗️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom NS color theme
- **Mapping**: Leaflet with React-Leaflet integration
- **Data**: Overpass API for OpenStreetMap integration
- **Icons**: Lucide React for consistent iconography
- **Build**: Create React App with production optimizations

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/janwillemkeizer/metdetrein.git
cd metdetrein
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder, ready for deployment.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── SearchForm.tsx   # Search form with filters and station selection
│   ├── ResultsList.tsx  # Live results display with venue details
│   └── MapView.tsx      # Interactive map with markers and popups
├── data/               # Static data
│   └── trainStations.ts # 80+ Dutch train stations with real coordinates
├── services/           # API and business logic
│   └── api.ts          # Overpass API integration and data processing
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces and data structures
├── App.tsx             # Main application with state management
├── index.tsx           # Application entry point
└── index.css           # Global styles and Tailwind configuration
```

## 🚂 Train Station Coverage

The application includes **80+ Dutch train stations** across all categories:

### Major Intercity Stations
- Amsterdam Centraal (ASD), Amsterdam Zuid (ASZ)
- Rotterdam Centraal (RTD), Rotterdam Alexander (RTA)
- Den Haag Centraal (GVC), Den Haag HS (GVH)
- Utrecht Centraal (UT), Utrecht Lunetten (UTL)
- Eindhoven Centraal (EHV), Tilburg (TB)

### Regional & Local Stations
- Delft, Leiden, Haarlem, Alkmaar
- Groningen, Assen, Zwolle, Deventer
- Maastricht, Venlo, Roermond
- And 50+ more stations with accurate coordinates

## 🏪 Venue Categories

The application searches for **13 different venue types**:

1. **Restaurants & Cafés** - Dining and food establishments
2. **Supermarkets** - Grocery stores and markets
3. **Gyms & Fitness** - Sports and fitness facilities
4. **Pharmacies** - Healthcare and medical services
5. **Banks & ATMs** - Financial services
6. **Shopping Centers** - Retail and shopping venues
7. **Gas Stations** - Fuel and convenience stores
8. **Hotels** - Accommodation options
9. **Cinemas** - Entertainment venues
10. **Libraries** - Educational and cultural facilities
11. **Post Offices** - Postal and shipping services
12. **Hospitals** - Medical facilities
13. **Schools** - Educational institutions

## 🗺️ Map Features

- **Custom Markers**: Distinct icons for train stations (blue) and venues (category-specific)
- **Search Radius**: Visual circle showing selected distance range
- **Interactive Popups**: Detailed information for each location
- **Auto-centering**: Map automatically focuses on selected station and results
- **Responsive Controls**: Touch-friendly controls for mobile devices

## 🔧 API Integration

### Overpass API Integration
The application uses the Overpass API to query OpenStreetMap data in real-time:

```typescript
// Example API query for restaurants near a train station
const query = `
[out:json][timeout:25];
(
  node["amenity"="restaurant"](around:1000,52.3676,4.9041);
  way["amenity"="restaurant"](around:1000,52.3676,4.9041);
);
out geom;
`;
```

### Error Handling
- Multiple API endpoints with automatic failover
- Graceful degradation to demo data when APIs are unavailable
- Network status detection and user notifications
- Retry logic for failed requests

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload build folder to Netlify
```

### Custom Server
```bash
npm run build
# Serve build folder with any static file server
```

See `PRODUCTION_DEPLOYMENT.md` for detailed deployment instructions.

## 📊 Performance

- **Fast Load Times**: Optimized React build with code splitting
- **Efficient API Calls**: Debounced searches and request caching
- **Responsive Design**: Mobile-first approach with touch optimization
- **Error Recovery**: Robust error handling and user feedback
- **Accessibility**: WCAG compliant design patterns

## 🔮 Future Enhancements

- **Real-time Train Data**: Integration with NS API for live schedules
- **Route Planning**: Door-to-door journey planning
- **User Accounts**: Save favorite stations and searches
- **Reviews & Ratings**: User-generated content integration
- **Mobile App**: React Native version for iOS/Android
- **Offline Support**: Progressive Web App capabilities

## 🛠️ Development

### Available Scripts

- `npm start` - Development server with hot reloading
- `npm test` - Test runner with watch mode
- `npm run build` - Production build with optimizations
- `npm run eject` - Eject from Create React App (irreversible)

### Testing the Application

1. **Station Selection**: Choose from 80+ available stations
2. **Category Filtering**: Select venue types to find
3. **Distance Adjustment**: Use slider to set search radius
4. **Live Results**: View real OpenStreetMap data on map and in list
5. **Map Interaction**: Click markers for detailed venue information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Nederlandse Spoorwegen (NS)** for inspiration and branding
- **OpenStreetMap Community** for comprehensive mapping data
- **Overpass API** for powerful OSM query capabilities
- **React Team** for the amazing framework
- **Leaflet** for excellent mapping library
- **Tailwind CSS** for rapid, responsive styling