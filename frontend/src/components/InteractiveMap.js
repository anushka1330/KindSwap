import { Map, NavigationControl, Marker, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LocationService } from '../services/locationService.js';

// SVG Icons for Map Markers
const markerIcons = {
  ngo: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/></svg>`,
  donation: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`,
  pickup: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  delivery: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  match: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>`
};

const typeLabels = {
  ngo: 'Verified NGO',
  donation: 'Available Item',
  pickup: 'Pickup Hub',
  delivery: 'In Delivery',
  match: 'Matched Exchange'
};

const typeColors = {
  ngo: { bg: '#B9A7D8', text: '#3b2d54', ring: '#957ebd' },
  donation: { bg: '#F2C24B', text: '#52463a', ring: '#d5a122' },
  pickup: { bg: '#A9B98A', text: '#2c3a1e', ring: '#82955f' },
  delivery: { bg: '#E29E8C', text: '#52291e', ring: '#cb7a64' },
  match: { bg: '#E8B931', text: '#3f300c', ring: '#c19617' }
};

export class InteractiveMap {
  /**
   * @param {Object} options
   * @param {string|HTMLElement} options.container - Container element or selector ID
   * @param {string} [options.initialState] - e.g. 'Delhi NCR' or 'All India'
   * @param {string} [options.initialType] - 'all' or specific location type
   * @param {Function} [options.onSelectLocation] - Callback when a marker or action is clicked
   * @param {boolean} [options.isCompact] - True for dashboard preview card, false for modal
   */
  constructor({ container, initialState = 'All India', initialType = 'all', onSelectLocation = null, isCompact = false }) {
    this.containerEl = typeof container === 'string' ? document.getElementById(container) : container;
    this.initialState = initialState;
    this.activeType = initialType;
    this.onSelectLocation = onSelectLocation;
    this.isCompact = isCompact;
    this.map = null;
    this.markers = [];
    this.locations = [];
    this.activePopup = null;
    this.isDestroyed = false;

    if (!this.containerEl) {
      console.warn('InteractiveMap: target container not found');
      return;
    }

    this.init();
  }

  async init() {
    try {
      this.locations = await LocationService.getLocations();
    } catch (err) {
      console.warn('Failed to fetch locations, fallback to seed', err);
      this.locations = [];
    }

    this.mountMap();
  }

  mountMap() {
    if (this.isDestroyed || !this.containerEl) return;

    // Check WebGL support
    if (!this.isWebGLSupported()) {
      this.renderFallback('WebGL is not supported in this browser. Please enable hardware acceleration.');
      return;
    }

    // Prepare style
    const customStyleUrl = import.meta.env.VITE_MAP_STYLE_URL;
    const customTilesUrl = import.meta.env.VITE_MAP_TILES_URL;

    let styleConfig;
    if (customStyleUrl) {
      styleConfig = customStyleUrl;
    } else {
      const tileSource = customTilesUrl || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      const tilesArray = customTilesUrl 
        ? [customTilesUrl] 
        : [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
          ];
      styleConfig = {
        version: 8,
        sources: {
          'kindswap-tiles': {
            type: 'raster',
            tiles: tilesArray,
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
          }
        },
        layers: [
          {
            id: 'kindswap-tiles-layer',
            type: 'raster',
            source: 'kindswap-tiles',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      };
    }

    // Determine initial center and zoom
    let center = [78.9629, 22.5937]; // Center of India
    let zoom = this.isCompact ? 4.1 : 4.6;

    if (this.initialState && this.initialState !== 'All India' && this.initialState !== 'India') {
      const st = LocationService.getStateByName(this.initialState);
      if (st) {
        center = [st.lng, st.lat];
        zoom = Math.max(st.zoom - (this.isCompact ? 1.0 : 0.4), 4.5);
      }
    }

    try {
      this.map = new Map({
        container: this.containerEl,
        style: styleConfig,
        center: center,
        zoom: zoom,
        minZoom: 3.2,
        maxZoom: 17,
        maxBounds: [[58.0, 4.0], [102.0, 39.0]], // Keeps focus strictly on India and immediate subcontinent
        attributionControl: !this.isCompact
      });

      // Navigation controls
      this.map.addControl(new NavigationControl({ showCompass: true, showZoom: true }), 'top-right');

      this.map.on('load', () => {
        if (this.isDestroyed) return;
        this.map.resize();
        this.renderMarkers();
      });

      this.map.on('error', (e) => {
        console.warn('MapLibre encountered a load error:', e);
      });

      // Window resize listener
      this.resizeHandler = () => {
        if (this.map && !this.isDestroyed) {
          this.map.resize();
        }
      };
      window.addEventListener('resize', this.resizeHandler);

    } catch (err) {
      console.error('Failed to initialize interactive MapLibre map:', err);
      this.renderFallback('Unable to initialize interactive map. The rest of the site is working properly.');
    }
  }

  isWebGLSupported() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      return false;
    }
  }

  renderFallback(reason) {
    if (!this.containerEl) return;
    this.containerEl.innerHTML = `
      <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f0eadf;padding:24px;text-align:center;">
        <div style="font-size:28px;margin-bottom:8px;">🇮🇳</div>
        <p style="font-weight:700;color:var(--ink);font-size:14px;">KindSwap India Exchange Network</p>
        <p style="font-size:12px;color:var(--muted-ink);max-width:320px;margin-top:4px;">${reason}</p>
        <span style="margin-top:14px;background:#fffdf8;border:1px solid #e5dcce;padding:6px 14px;border-radius:99px;font-size:11px;font-weight:700;color:#8c7347;">
          ✨ 24 active community exchanges live across India
        </span>
      </div>
    `;
  }

  renderMarkers() {
    if (!this.map || this.isDestroyed) return;

    // Clear existing markers
    this.clearMarkers();

    const filtered = this.activeType === 'all' 
      ? this.locations 
      : this.locations.filter(l => l.type === this.activeType);

    filtered.forEach(loc => {
      if (typeof loc.longitude !== 'number' || typeof loc.latitude !== 'number') return;

      const colors = typeColors[loc.type] || typeColors.donation;
      const icon = markerIcons[loc.type] || markerIcons.donation;

      // Custom marker DOM
      const el = document.createElement('div');
      el.className = 'kindswap-marker';
      el.setAttribute('data-id', loc.id);
      el.setAttribute('data-type', loc.type);
      el.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: ${colors.bg};
        color: ${colors.text};
        border: 2.5px solid #fffdf8;
        box-shadow: 0 4px 12px rgba(80, 60, 30, 0.22);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: transform 0.18s cubic-bezier(.23,1,.32,1), box-shadow 0.18s ease;
      `;

      el.innerHTML = icon;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.22) translateY(-3px)';
        el.style.boxShadow = `0 8px 20px ${colors.ring}66`;
        el.style.zIndex = '100';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1) translateY(0)';
        el.style.boxShadow = '0 4px 12px rgba(80, 60, 30, 0.22)';
        el.style.zIndex = '';
      });

      // Custom styled popup
      const popupHtml = `
        <div class="kindswap-map-popup" style="font-family:var(--font-sans, sans-serif); min-width:210px; max-width:260px; padding:4px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="background:${colors.bg}; color:${colors.text}; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; padding:3px 8px; border-radius:99px;">
              ${typeLabels[loc.type] || loc.type}
            </span>
            <span style="font-size:10px; font-weight:700; color:#4a7c3b; background:#ebf4e6; padding:2px 6px; border-radius:99px;">
              ${loc.status}
            </span>
          </div>

          <h4 style="font-family:var(--font-serif, Georgia, serif); font-size:15px; font-weight:700; color:var(--ink, #2f2a27); margin:4px 0 2px; line-height:1.2;">
            ${loc.title}
          </h4>

          <p style="font-size:11px; font-weight:700; color:#7e756a; margin-bottom:6px; display:flex; align-items:center; gap:4px;">
            📍 ${loc.city}, ${loc.state}
          </p>

          <p style="font-size:11.5px; line-height:1.4; color:#5c5245; margin-bottom:10px;">
            ${loc.description || ''}
          </p>

          <div style="border-top:1px solid #f0eade; padding-top:8px; display:flex; align-items:center; justify-content:space-between;">
            <div style="font-size:10px; color:#8d8880;">
              <b>${loc.contactName}</b>
            </div>
            <button class="popup-cta-btn" data-loc-id="${loc.id}" style="background:var(--ink, #2f2a27); color:#fffdf8; font-size:10.5px; font-weight:700; padding:5px 11px; border-radius:99px; cursor:pointer; border:none;">
              Connect →
            </button>
          </div>
        </div>
      `;

      const popup = new Popup({
        offset: 16,
        closeButton: true,
        closeOnClick: true,
        className: 'kindswap-custom-popup'
      }).setHTML(popupHtml);

      popup.on('open', () => {
        this.activePopup = popup;
        const btn = document.querySelector(`.popup-cta-btn[data-loc-id="${loc.id}"]`);
        if (btn) {
          btn.addEventListener('click', () => {
            if (typeof this.onSelectLocation === 'function') {
              this.onSelectLocation(loc);
            }
          });
        }
      });

      const marker = new Marker({ element: el })
        .setLngLat([loc.longitude, loc.latitude])
        .setPopup(popup)
        .addTo(this.map);

      this.markers.push(marker);
    });
  }

  clearMarkers() {
    this.markers.forEach(m => m.remove());
    this.markers = [];
    if (this.activePopup) {
      this.activePopup.remove();
      this.activePopup = null;
    }
  }

  // Filter markers by type: 'all', 'ngo', 'donation', 'pickup', 'delivery', 'match'
  filterByType(type) {
    this.activeType = type;
    this.renderMarkers();
  }

  // Smoothly fly to any Indian state
  flyToState(stateName) {
    if (!this.map || this.isDestroyed) return;

    if (!stateName || stateName === 'All India' || stateName === 'India') {
      this.map.flyTo({
        center: [78.9629, 22.5937],
        zoom: this.isCompact ? 4.1 : 4.6,
        essential: true,
        duration: 1600
      });
      return;
    }

    const st = LocationService.getStateByName(stateName);
    if (st) {
      this.map.flyTo({
        center: [st.lng, st.lat],
        zoom: Math.max(st.zoom - (this.isCompact ? 0.9 : 0.3), 5.0),
        essential: true,
        duration: 1600
      });
    }
  }

  // Clean up resources on unmount
  destroy() {
    this.isDestroyed = true;
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    this.clearMarkers();
    if (this.map) {
      try {
        this.map.remove();
      } catch {
        // ignore
      }
      this.map = null;
    }
  }
}
