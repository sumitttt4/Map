Map component improvements
==========================

This file documents the small, production-focused improvements added to the map components.

invalidateSize and ResizeObserver
- If your map container can resize (responsive layout, sidebar show/hide), call `map.invalidateSize()` after the container changes size. In this codebase the `MapWithMarkers` component should call `map.invalidateSize()` via a ResizeObserver watching the map container. If you need a manual call, you can get the map instance (the component exposes a ref) and call `map.invalidateSize()`.

Icon caching
- Marker icons are created using `L.divIcon`. Creating these repeatedly in render is expensive. The recent changes add module-level caches (`iconCache`) for `CoffeeMarker` and `NumberedMarker` so icons are reused across renders.

Hover and touch interactions
- A new hook `src/hooks/useMapInteractions.js` centralizes hover-to-fly behavior, debounced restore, and touch/click behavior. Hover auto-zooms on non-touch devices with a 120ms debounce and offsets the target so the marker is slightly left of center. On touch devices, tapping a marker opens a floating card instead of automatic panning.

Animated route
- `src/components/AnimatedRoute.jsx` renders a `Polyline` and uses a CSS class to animate stroke-dashoffset when the route becomes visible. Toggle visibility via the `showRoute` prop or use the hook's `togglePath()` helper.

Exposing map controls
- `MapWithMarkers` exposes some imperative helpers (e.g., `restoreView`, `saveView`) via a forwarded ref; use them for programmatic zoom or resetting the map view.

Testing
- Run the dev server and verify resizing, hover interactions, and toggles for `Show Numbers` and `Show Route` behave as expected.
