# Espresso World Map

An interactive web application showcasing Espresso events worldwide.

## Features

- Interactive world map with event locations
- Filter events by type (All, Upcoming, Past)
- Custom branded markers and styling
- Responsive design for web embedding

## Color Palette

- **Primary Brown**: #8B4513 (Saddle Brown)
- **Secondary Brown**: #A0522D (Sienna)
- **Accent Orange**: #D2691E (Chocolate)
- **Dark Brown**: #654321 (Dark Brown)
- **Background**: #F4E4BC to #E6CCB2 (Light Coffee Gradient)
- **Text**: #3E2723 (Dark Brown)
- **Cream**: #FFF8DC (Cream)

## Logo

The logo uses a coffee cup emoji (☕) with "Espresso" in serif italic font.

## How to Run

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open http://localhost:5174 in your browser

## Build for Production

```bash
npm run build
npm run preview
```

## Technologies Used

- React 18
- Vite
- Leaflet (mapping)
- React-Leaflet

## Event Data

Events are stored in `src/data/events.js` with the following structure:
- id: unique identifier
- name: event name
- location: [latitude, longitude]
- date: event date and time
- type: 'upcoming' or 'past'