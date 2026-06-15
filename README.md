# GeoScape 3D

GeoScape 3D is a Next.js + TypeScript web application designed to make geographic exploration intuitive, informative, and visually immersive.

The objective of the app is to provide a clear, interactive platform for discovering global locations, visualizing network topologies, and understanding the relationship between satellite coverage, regional PoPs, and gateway assignments.

The goal is to help users navigate the globe naturally while exposing the underlying spatial structure of the mapped network, so that every selected cell, PoP, or gateway feels meaningful and contextually connected.

## App Functionality

GeoScape 3D renders a fully interactive 3D globe that combines smooth motion, layered geographic visuals, and detail-driven location discovery.

Users can:

- rotate, zoom, and pan across the globe surface with responsive gesture controls
- view country borders, city markers, and name overlays that appear as you explore
- inspect location details for selected countries, capitals, or major regions in a side panel
- focus on specific geographic cells, PoPs, and gateway relationships from the globe topology
- access contextual information and insight summaries without leaving the main view

The UI is optimized for fluid interaction and includes a modern dark-themed presentation with clear information hierarchy, supporting both exploration and analysis.

## Core Features

- **Interactive Globe Rendering**: A Three.js-based globe with smooth camera controls and responsive user input handling.
- **Geographic Overlays**: Country boundary rendering and location markers provide visual context on the globe.
- **Location Detail Panel**: A right-side details panel shows selected location metadata, status, and descriptive information.
- **Responsive Controls**: Custom globe controls make it easy to zoom, reset view, and explore the map.
- **Static App Behavior**: The current version does not depend on external cloud-hosting tooling and runs with local data sources.
- **High-Fidelity LEO Mesh**: A Starlink-style "Main Shell" visualization using a procedural 53-degree inclined orbital mesh with optimized node density. For visualization purposes, the system maintains a high-density constellation where a select group of satellites are active interactive assets, while the remainder serve as inactive mesh nodes to illustrate network topology.
- **Collision-Free Orbital Physics**: Implementation of Walker Delta phasing to ensure realistic, non-intersecting satellite trajectories across all orbital planes.
- **Dynamic Inter-Satellite Links (ISL)**: Real-time visualization of network topology with active red connection lines between grid neighbors (Top/Bottom/Left/Right).
- **Network Intelligence Overlays**: Interactive hover tooltips and selection windows displaying satellite telemetry, orbital velocity, and automatic ground-node (PoP) identification.
- **Physically Accurate Simulation**: Precision simulation of a 90-minute LEO orbital cycle with smooth, performance-tuned 3D movement.

## Application Structure

- `src/app` — base layout and app entry points.
- `src/components/Globe` — globe rendering, controls, and location details.
- `src/components/ui` — reusable UI primitives and design system components.
- `src/lib` — utility functions, data sources, and shared app logic.

## Running the App Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the app in your browser:

   ```
   http://localhost:9002
   ```

## Build and Start in Production

```bash
npm run build
npm start
```

## Notes

- This project is built with Next.js 15 and TypeScript.
- The app is designed to run as a standalone web application with local dependency management.

## Blueprint

# **App Name**: GeoScape 3D

## Core Features:

- Interactive 3D Globe: Render and interact with a responsive 3D globe, allowing users to rotate, zoom, and pan for global exploration.
- Country Borders & Names Display: Accurately display all country borders and overlay their names directly onto the globe surface.
- Capital & Major City Markers: Dynamically show capital and major city locations as interactive markers, appearing when the user zooms in on specific regions.
- On-Demand Location Details: Provide a clean pop-up or panel to display essential information about a country or city (e.g., official name, capital) when selected by the user.
- Location Insights: Generate concise and engaging factual insights or historical context for selected countries and major cities.

## Style Guidelines:

- Dark background color: #232528. This provides a deep, immersive canvas that enhances the visual impact of the 3D globe and data overlays, evoking a sense of discovery and high-tech exploration.
- Primary interactive color: #8ABBEB. A serene, yet distinct blue is chosen for interactive elements, highlights, and country selection, offering clarity and a sense of calm amidst data-rich visuals.
- Accent color: #26CCA2. This vibrant, analogous accent color is used sparingly for call-to-action elements, city markers, and headers, providing energetic contrast and guiding user attention.
- Headline and main labels font: 'Space Grotesk', a sans-serif typeface. Its modern, technical aesthetic perfectly complements the digital 3D mapping experience.
- Body and detail text font: 'Inter', a sans-serif typeface. Chosen for its excellent readability at various sizes, it provides a clean and neutral foundation for displaying geographic details and insights.
- Use minimalist, vector-based icons for UI controls (e.g., zoom, rotate) to maintain a clean and sophisticated aesthetic.
- Subtle, smooth transition animations for globe rotation, zoom actions, and the appearance of location detail panels, enhancing the fluidity and premium feel of the user experience.

## Satellite, PoP, Gateway, and Cell Relationship

- Satellites in low Earth orbit (LEO) serve as dynamic coverage layers above the globe. Each satellite is associated with a set of geographic regions and can provide high-bandwidth links to nearby ground infrastructure.
- Designated Points of Presence (PoPs) are ground anchor locations on the map where network access is aggregated. PoPs are the central hubs for connecting satellite traffic into the local network and routing data toward user endpoints.
- Gateways around PoPs are the physical or logical edge access points that bridge the satellite uplink/downlink with the PoP’s local network. These gateways handle handoffs, manage signal quality, and ensure that the satellite connection is delivered to the correct region.
- The globe’s cell grid assigns each visible region or cell to a specific PoP and gateway cluster. When a user selects a cell on the globe, the app can show which low orbit satellites and nearby ground gateways are responsible for that cell.
- This relationship is designed so that:
  - a selected cell maps to a nearest PoP,
  - the PoP is supported by one or more local gateways,
  - and those gateways are in turn serviced by satellites currently covering that region.
- In practice, this means the globe map is not just geographic data; it is also a network topology view where satellite coverage, PoP connectivity, and gateway assignment are visually connected to each cell.
