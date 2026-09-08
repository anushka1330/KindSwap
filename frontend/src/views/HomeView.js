import { AuthService } from '../services/authService.js';
import { INDIA_SVG_PATH } from '../assets/indiaPath.js';
import { LocationService } from '../services/locationService.js';
import { InteractiveMap } from '../components/InteractiveMap.js';

// SVG Icons matching Lucide
const icons = {
  swap: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>`,
  overview: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
  mapPin: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  message: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
  users: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  heartHandshake: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/></svg>`,
  settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  chevronDown: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  bell: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
  circleHelp: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`,
  plus: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  gift: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`,
  bookOpen: `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>`,
  shirt: `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`,
  package: `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  search: `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  menu: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  star: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
};

// State store
let activeNav = 'Overview';
let activeRole = 'Donor';
let activeExchangeTab = 'give';
let activeLocation = 'Delhi NCR, India';
let isSidebarOpen = false;
let dashboardMapInstance = null;
let modalMapInstance = null;
let activeMapFilter = 'all';


export const HomeView = {
  render() {
    const user = window.currentUser;
    const displayName = user ? (user.name || user.email.split('@')[0]) : 'Alex';
    const userInitials = user ? (user.name ? user.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) : user.email.slice(0,2).toUpperCase()) : 'AM';
    const userRoleDesc = user ? (user.role === 'ngo' ? 'NGO Partner' : user.role === 'admin' ? 'Community Admin' : 'Trusted member · 4.9') : 'Trusted member · 4.9';

    return `
      <div class="app-shell">
        <!-- Sidebar -->
        <aside class="sidebar ${isSidebarOpen ? 'sidebar-open' : ''}" id="app-sidebar">
          <div class="sidebar-top">
            <div class="flex items-center gap-2.5" style="display:flex;align-items:center;gap:10px;">
              <div class="logo-mark">
                ${icons.swap}
              </div>
              <span class="font-display text-[21px] font-bold text-ink" style="font-size:21px;font-weight:700;letter-spacing:-0.04em;">kindswap</span>
            </div>
            <button class="mobile-close" id="sidebar-close-btn" aria-label="Close menu">
              ${icons.close}
            </button>
          </div>

          <!-- Community Switcher -->
          <div class="community-switcher" id="community-switcher-card">
            <div class="community-avatar">IN</div>
            <div style="min-width:0;flex:1;">
              <p style="font-size:12px;font-weight:600;color:var(--ink);line-height:1.2;">India Community Circle</p>
              <p style="font-size:11px;color:var(--muted-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Delhi & NCR exchange hub</p>
            </div>
            <div style="color:var(--muted-ink);">${icons.chevronDown}</div>
          </div>

          <!-- Workspace Nav Section -->
          <nav style="margin-top:28px;">
            <p class="nav-label">Workspace</p>
            <div style="display:flex;flex-direction:column;gap:4px;">
              <button class="nav-item ${activeNav === 'Overview' ? 'nav-item-active' : ''}" data-nav="Overview">
                ${icons.overview}
                <span>Overview</span>
              </button>
              <button class="nav-item ${activeNav === 'My exchange' ? 'nav-item-active' : ''}" data-nav="My exchange">
                ${icons.swap}
                <span>My exchange</span>
              </button>
              <button class="nav-item ${activeNav === 'Community map' ? 'nav-item-active' : ''}" data-nav="Community map">
                ${icons.mapPin}
                <span>Community map</span>
              </button>
              <button class="nav-item ${activeNav === 'Messages' ? 'nav-item-active' : ''}" data-nav="Messages">
                ${icons.message}
                <span>Messages</span>
                <span class="nav-count">3</span>
              </button>
            </div>
          </nav>

          <!-- Your Circle Nav Section -->
          <div class="sidebar-bottom">
            <p class="nav-label">Your circle</p>
            <div style="display:flex;flex-direction:column;gap:4px;">
              <button class="nav-item ${activeNav === 'Community members' ? 'nav-item-active' : ''}" data-nav="Community members">
                ${icons.users}
                <span>Community members</span>
              </button>
              <button class="nav-item ${activeNav === 'Impact history' ? 'nav-item-active' : ''}" data-nav="Impact history">
                ${icons.heartHandshake}
                <span>Impact history</span>
              </button>
            </div>

            <!-- Difference Note -->
            <div class="sidebar-note">
              ${icons.heartHandshake}
              <div>
                <p style="font-weight:700;color:var(--ink);">You’re making a difference</p>
                <p style="margin-top:4px;line-height:1.4;color:var(--muted-ink);">3 swaps completed this month.</p>
              </div>
            </div>

            <button class="nav-item ${activeNav === 'Settings' ? 'nav-item-active' : ''}" data-nav="Settings">
              ${icons.settings}
              <span>Settings</span>
            </button>

            <!-- User Profile Row -->
            <div class="profile-row" id="profile-row-btn" title="Click for account options">
              <div class="profile-avatar">${userInitials}</div>
              <div style="min-width:0;flex:1;">
                <p style="font-size:13px;font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${user ? displayName : 'Alex Morgan'}</p>
                <p style="font-size:11px;color:var(--muted-ink);">${userRoleDesc}</p>
              </div>
              <div style="color:var(--muted-ink);">${icons.chevronDown}</div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
          <!-- Topbar -->
          <header class="topbar">
            <button class="menu-button" id="mobile-menu-btn" aria-label="Open menu">
              ${icons.menu}
            </button>
            
            <div class="mobile-logo">
              <div class="logo-mark">${icons.swap}</div>
              <span class="font-display font-bold text-ink">kindswap</span>
            </div>

            <!-- Location Dropdown: Supports all Indian States & Union Territories + Add State option -->
            <div class="topbar-location">
              ${icons.mapPin}
              <select id="location-select" aria-label="Location">
                ${HomeView.renderLocationOptions()}
              </select>
              ${icons.chevronDown}
            </div>

            <!-- Topbar Actions -->
            <div class="topbar-actions">
              <button class="icon-button" id="notif-btn" title="Notifications" aria-label="Notifications">
                ${icons.bell}
                <span class="notification-dot"></span>
              </button>
              <button class="help-button" id="help-btn">
                ${icons.circleHelp}
                <span>Help</span>
              </button>
            </div>
          </header>

          <!-- Content Wrapper -->
          <div class="content-wrap" id="main-view-content">
            ${HomeView.renderOverviewContent(displayName)}
          </div>
        </main>


        <!-- Toast Notification Container -->
        <div class="toast-container" id="toast-container"></div>
      </div>
    `;
  },

  renderOverviewContent(displayName) {
    return `
      <!-- Page Heading / Hero -->
      <div class="page-heading">
        <div>
          <p class="eyebrow">Tuesday, September 8, 2026</p>
          <h1 class="font-display text-ink" style="font-size: clamp(32px, 3.5vw, 42px); font-weight: 700; line-height: 1.05; letter-spacing: -0.05em;">
            Good morning, ${displayName} <span class="wave">✦</span>
          </h1>
          <p style="margin-top: 12px; max-width: 580px; font-size: 15px; line-height: 1.6; color: var(--muted-ink);">
            Small swaps make a big difference. Here’s what’s happening in your community today.
          </p>
        </div>

        <!-- Hero Illustration -->
        <img class="hero-illustration" src="/kindswap-community.png" alt="Two neighbors exchanging books and a sweater" />

        <button class="primary-button" id="hero-start-exchange-btn">
          ${icons.plus}
          <span>Start an exchange</span>
        </button>
      </div>

      <!-- Role Toggle Pill -->
      <div class="role-toggle">
        <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted-ink); padding-left: 8px; padding-right: 4px;">Viewing as</span>
        <button class="${activeRole === 'Donor' ? 'role-active' : ''}" data-role="Donor">Donor</button>
        <button class="${activeRole === 'NGO partner' ? 'role-active' : ''}" data-role="NGO partner">NGO partner</button>
      </div>

      <!-- 4 Stats Cards Grid -->
      <section class="stats-grid">
        <!-- Card 1 -->
        <div class="stat-card stat-yellow">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div class="stat-icon">${icons.gift}</div>
            <span style="font-size:12px; font-weight:700; color:#7e756a;">↗ 8%</span>
          </div>
          <div style="margin-top:20px;">
            <p style="font-size:13px; font-weight:600; color:#7e756a;">Items available</p>
            <p class="font-display text-ink" style="font-size:31px; font-weight:700; letter-spacing:-0.05em; margin-top:2px;">24</p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="stat-card stat-lavender">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div class="stat-icon">${icons.heartHandshake}</div>
            <span style="font-size:12px; font-weight:700; color:#7e756a;">↗ 3 new</span>
          </div>
          <div style="margin-top:20px;">
            <p style="font-size:13px; font-weight:600; color:#7e756a;">Active requests</p>
            <p class="font-display text-ink" style="font-size:31px; font-weight:700; letter-spacing:-0.05em; margin-top:2px;">12</p>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="stat-card stat-sage">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div class="stat-icon">${icons.users}</div>
            <span style="font-size:12px; font-weight:700; color:#7e756a;">↗ 12 online</span>
          </div>
          <div style="margin-top:20px;">
            <p style="font-size:13px; font-weight:600; color:#7e756a;">Nearby helpers</p>
            <p class="font-display text-ink" style="font-size:31px; font-weight:700; letter-spacing:-0.05em; margin-top:2px;">48</p>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="stat-card stat-sand">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div class="stat-icon">${icons.swap}</div>
            <span style="font-size:12px; font-weight:700; color:#7e756a;">↗ +4 swaps</span>
          </div>
          <div style="margin-top:20px;">
            <p style="font-size:13px; font-weight:600; color:#7e756a;">Your impact</p>
            <p class="font-display text-ink" style="font-size:31px; font-weight:700; letter-spacing:-0.05em; margin-top:2px;">16</p>
          </div>
        </div>
      </section>

      <!-- Content Grid: Meaningful Matches & Community Map -->
      <div class="content-grid">
        <!-- Left: Meaningful matches -->
        <section class="section-card matches-card">
          <div class="section-header">
            <div>
              <p class="eyebrow">Based on your circle</p>
              <h2 class="section-title">Meaningful matches</h2>
            </div>
            <button class="text-button" id="see-all-matches-btn">
              <span>See all</span>
              <span>→</span>
            </button>
          </div>

          <div class="item-list">
            <!-- Item 1 -->
            <button class="item-row" data-item="Children's books">
              <div class="item-icon lavender">${icons.bookOpen}</div>
              <div style="min-width:0; flex:1; text-align:left;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <p style="font-size:14px; font-weight:700; color:var(--ink);">Children's books</p>
                  <span class="match-pill">Great match</span>
                </div>
                <p style="font-size:12px; color:var(--muted-ink); margin-top:2px;">12 items · 1.2 km away</p>
              </div>
              <div style="color:var(--muted-ink);">${icons.swap}</div>
            </button>

            <!-- Item 2 -->
            <button class="item-row" data-item="Warm winter coats">
              <div class="item-icon butter">${icons.shirt}</div>
              <div style="min-width:0; flex:1; text-align:left;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <p style="font-size:14px; font-weight:700; color:var(--ink);">Warm winter coats</p>
                  <span class="match-pill">Needed nearby</span>
                </div>
                <p style="font-size:12px; color:var(--muted-ink); margin-top:2px;">4 items · 2.4 km away</p>
              </div>
              <div style="color:var(--muted-ink);">${icons.swap}</div>
            </button>

            <!-- Item 3 -->
            <button class="item-row" data-item="Pantry staples">
              <div class="item-icon sage">${icons.package}</div>
              <div style="min-width:0; flex:1; text-align:left;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <p style="font-size:14px; font-weight:700; color:var(--ink);">Pantry staples</p>
                  <span class="match-pill">Fresh request</span>
                </div>
                <p style="font-size:12px; color:var(--muted-ink); margin-top:2px;">8 items · 3.1 km away</p>
              </div>
              <div style="color:var(--muted-ink);">${icons.swap}</div>
            </button>
          </div>

          <!-- Banner -->
          <div class="exchange-banner">
            <div class="banner-orb">${icons.swap}</div>
            <div>
              <p style="font-size:13px; font-weight:700; color:var(--ink);">Every item has a next chapter.</p>
              <p style="font-size:12px; color:var(--muted-ink); margin-top:2px;">Give what you can, get what you need.</p>
            </div>
            <button class="banner-button" id="how-it-works-banner-btn">How it works</button>
          </div>
        </section>

        <!-- Right: Community Map of India -->
        <section class="section-card map-card">
          <div class="section-header">
            <div>
              <p class="eyebrow">Live across India</p>
              <h2 class="section-title">Community map</h2>
            </div>
            <button class="round-button" id="expand-map-btn" title="Explore India map" aria-label="Explore map">
              ${icons.mapPin}
            </button>
          </div>

          <!-- Map Visual Canvas: Interactive MapLibre WebGL Canvas with Category Filters -->
          <div class="map-filter-bar" id="dashboard-filter-bar" style="margin:12px -22px 0;">
            <button class="map-filter-chip active" data-filter="all">All</button>
            <button class="map-filter-chip chip-donation" data-filter="donation">🎁 Donations</button>
            <button class="map-filter-chip chip-ngo" data-filter="ngo">🤝 NGOs</button>
            <button class="map-filter-chip chip-pickup" data-filter="pickup">📍 Pickups</button>
            <button class="map-filter-chip chip-delivery" data-filter="delivery">📦 Deliveries</button>
            <button class="map-filter-chip chip-match" data-filter="match">⚡ Matches</button>
          </div>

          <div class="map-visual" id="dashboard-interactive-map" style="height:275px;position:relative;margin:0 -22px 0;">
            <!-- Interactive MapLibre Canvas Mounts Here -->
          </div>

          <!-- Map Footer -->
          <div class="map-footer">
            <div style="display:flex; margin-right:6px;" class="-space-x-2">
              <span class="mini-avatar" style="background:#F2C24B; margin-right:-6px;">P</span>
              <span class="mini-avatar" style="background:#B9A7D8; margin-right:-6px;">G</span>
              <span class="mini-avatar" style="background:#A9B98A; margin-right:-6px;">A</span>
              <span class="mini-avatar more-avatar">+18</span>
            </div>
            <span><b>24</b> active exchanges across India</span>
            <button id="explore-map-link">
              <span>Explore map</span>
              <span>→</span>
            </button>
          </div>
        </section>
      </div>

      <!-- Action Banner Section: What would you like to do? -->
      <section class="section-card exchange-card">
        <div class="section-header">
          <div>
            <p class="eyebrow">Make a little magic</p>
            <h2 class="section-title">What would you like to do?</h2>
          </div>
          <div class="exchange-tabs">
            <button class="${activeExchangeTab === 'give' ? 'exchange-active' : ''}" data-tab="give">
              ${icons.gift}
              <span>Give items</span>
            </button>
            <button class="${activeExchangeTab === 'get' ? 'exchange-active' : ''}" data-tab="get">
              ${icons.package}
              <span>Get items</span>
            </button>
          </div>
        </div>

        <div class="exchange-options" id="exchange-options-container">
          ${HomeView.renderExchangeOptions()}
        </div>
      </section>

      <!-- Footer Note -->
      <footer class="footer-note">
        <span>Made for kinder neighborhoods.</span>
        <span style="display:flex; align-items:center; gap:5px;">
          ${icons.star}
          <span>Trusted by 1,240 community members</span>
        </span>
      </footer>
    `;
  },

  renderExchangeOptions() {
    if (activeExchangeTab === 'give') {
      return `
        <button id="opt-list-item">
          <div class="option-icon option-yellow">${icons.plus}</div>
          <div>
            <b>List something to share</b>
            <p>Books, clothes, pantry goods…</p>
          </div>
          <span>→</span>
        </button>
        <button id="opt-find-needy">
          <div class="option-icon option-lavender">${icons.search}</div>
          <div>
            <b>Find someone who needs it</b>
            <p>See what’s moving nearby.</p>
          </div>
          <span>→</span>
        </button>
        <button id="opt-chat-community">
          <div class="option-icon option-sage">${icons.message}</div>
          <div>
            <b>Chat with your community</b>
            <p>Say hello before you swap.</p>
          </div>
          <span>→</span>
        </button>
      `;
    } else {
      return `
        <button id="opt-request-item">
          <div class="option-icon option-yellow">${icons.plus}</div>
          <div>
            <b>Request an item</b>
            <p>Tell your community what you need.</p>
          </div>
          <span>→</span>
        </button>
        <button id="opt-browse-available">
          <div class="option-icon option-lavender">${icons.search}</div>
          <div>
            <b>Browse available items</b>
            <p>See what’s moving nearby.</p>
          </div>
          <span>→</span>
        </button>
        <button id="opt-chat-community">
          <div class="option-icon option-sage">${icons.message}</div>
          <div>
            <b>Chat with your community</b>
            <p>Say hello before you swap.</p>
          </div>
          <span>→</span>
        </button>
      `;
    }
  },

  attachEvents(navigate, refreshApp) {
    // Mobile menu toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');
    const sidebar = document.getElementById('app-sidebar');

    menuBtn?.addEventListener('click', () => {
      isSidebarOpen = true;
      sidebar?.classList.add('sidebar-open');
    });

    closeBtn?.addEventListener('click', () => {
      isSidebarOpen = false;
      sidebar?.classList.remove('sidebar-open');
    });

    // Sidebar navigation buttons
    document.querySelectorAll('.nav-item[data-nav]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const nav = btn.getAttribute('data-nav');
        activeNav = nav;
        isSidebarOpen = false;
        sidebar?.classList.remove('sidebar-open');

        if (nav === 'Overview') {
          HomeView.showToast('Overview', 'Welcome to your community exchange overview.');
          refreshApp();
        } else if (nav === 'My exchange') {
          HomeView.openMyExchangeModal(navigate);
        } else if (nav === 'Community map') {
          HomeView.openMapModal();
        } else if (nav === 'Messages') {
          HomeView.openMessagesModal();
        } else if (nav === 'Community members') {
          HomeView.openMembersModal();
        } else if (nav === 'Impact history') {
          HomeView.openImpactModal();
        } else if (nav === 'Settings') {
          HomeView.openSettingsModal(navigate, refreshApp);
        }
      });
    });

    // Community switcher card
    document.getElementById('community-switcher-card')?.addEventListener('click', () => {
      HomeView.showToast('India Community Circle', `Currently active in ${activeLocation} exchange hub.`);
    });

    // Location selector with dynamic state navigation & custom state adding
    const locSelect = document.getElementById('location-select');
    locSelect?.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (selected === '__add_custom_state__') {
        locSelect.value = activeLocation;
        HomeView.openAddStateModal();
        return;
      }
      activeLocation = selected;
      HomeView.showToast('Location updated', `Switched community circle to ${activeLocation}.`);
      if (dashboardMapInstance) {
        dashboardMapInstance.flyToState(activeLocation);
      }
      const switcherSub = document.querySelector('#community-switcher-card p:last-child');
      if (switcherSub) {
        switcherSub.textContent = `${activeLocation} exchange hub`;
      }
    });

    // Mount Interactive Dashboard Map
    if (dashboardMapInstance) {
      dashboardMapInstance.destroy();
      dashboardMapInstance = null;
    }
    const dashboardMapEl = document.getElementById('dashboard-interactive-map');
    if (dashboardMapEl) {
      dashboardMapInstance = new InteractiveMap({
        container: dashboardMapEl,
        initialState: activeLocation,
        initialType: activeMapFilter,
        isCompact: true,
        onSelectLocation: (loc) => {
          HomeView.openLocationDetailModal(loc);
        }
      });
    }

    // Dashboard map filter chips
    document.querySelectorAll('#dashboard-filter-bar button[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#dashboard-filter-bar button[data-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        activeMapFilter = filter;
        if (dashboardMapInstance) {
          dashboardMapInstance.filterByType(filter);
        }
      });
    });

    // Notification bell
    document.getElementById('notif-btn')?.addEventListener('click', () => {
      HomeView.showToast('No new notifications', "You're all caught up.");
    });

    // Help button
    document.getElementById('help-btn')?.addEventListener('click', () => {
      HomeView.openHowItWorksModal();
    });

    // Role toggle
    document.querySelectorAll('.role-toggle button[data-role]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeRole = btn.getAttribute('data-role');
        document.querySelectorAll('.role-toggle button[data-role]').forEach(b => {
          b.classList.toggle('role-active', b.getAttribute('data-role') === activeRole);
        });
        HomeView.showToast(`Viewing as ${activeRole}`, `Dashboard adapted for ${activeRole} perspective.`);
      });
    });

    // Primary CTA: Start an exchange
    document.getElementById('hero-start-exchange-btn')?.addEventListener('click', () => {
      HomeView.openCreateExchangeModal(navigate);
    });

    // Meaningful matches rows
    document.querySelectorAll('.item-row[data-item]').forEach(row => {
      row.addEventListener('click', () => {
        const item = row.getAttribute('data-item');
        HomeView.openItemDetailModal(item);
      });
    });

    // See all matches
    document.getElementById('see-all-matches-btn')?.addEventListener('click', () => {
      HomeView.openMyExchangeModal(navigate);
    });

    // How it works banner button
    document.getElementById('how-it-works-banner-btn')?.addEventListener('click', () => {
      HomeView.openHowItWorksModal();
    });

    document.getElementById('expand-map-btn')?.addEventListener('click', () => {
      HomeView.openMapModal();
    });

    document.getElementById('explore-map-link')?.addEventListener('click', () => {
      HomeView.openMapModal();
    });

    // Exchange tabs: Give items vs Get items
    document.querySelectorAll('.exchange-tabs button[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeExchangeTab = btn.getAttribute('data-tab');
        document.querySelectorAll('.exchange-tabs button[data-tab]').forEach(b => {
          b.classList.toggle('exchange-active', b.getAttribute('data-tab') === activeExchangeTab);
        });
        const container = document.getElementById('exchange-options-container');
        if (container) {
          container.innerHTML = HomeView.renderExchangeOptions();
          HomeView.attachExchangeOptionEvents(navigate);
        }
      });
    });

    HomeView.attachExchangeOptionEvents(navigate);

    // Profile row
    document.getElementById('profile-row-btn')?.addEventListener('click', () => {
      HomeView.openAccountModal(navigate, refreshApp);
    });

  },

  attachExchangeOptionEvents(navigate) {
    document.getElementById('opt-list-item')?.addEventListener('click', () => {
      HomeView.openCreateExchangeModal(navigate);
    });

    document.getElementById('opt-request-item')?.addEventListener('click', () => {
      HomeView.openCreateExchangeModal(navigate, true);
    });

    document.getElementById('opt-find-needy')?.addEventListener('click', () => {
      HomeView.openMyExchangeModal(navigate);
    });

    document.getElementById('opt-browse-available')?.addEventListener('click', () => {
      HomeView.openMyExchangeModal(navigate);
    });

    document.getElementById('opt-chat-community')?.addEventListener('click', () => {
      HomeView.openMessagesModal();
    });
  },

  // ─── Toast System ────────────────────────────────────────────────────────
  showToast(title, description) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">✦</div>
      <div>
        <p class="toast-title">${title}</p>
        ${description ? `<p class="toast-desc">${description}</p>` : ''}
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hiding');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  // ─── Interactive Modals ──────────────────────────────────────────────────
  openCreateExchangeModal(navigate, isRequest = false) {
    HomeView.showModal(`
      <div class="modal-header">
        <div>
          <p class="eyebrow">${isRequest ? 'Community Request' : 'List Item to Share'}</p>
          <h2 class="section-title" style="font-size:22px;">${isRequest ? 'Request an item' : 'Start a new exchange'}</h2>
        </div>
        <button class="modal-close" onclick="document.getElementById('active-modal').remove()">✕</button>
      </div>
      <form id="create-exchange-form" style="display:flex;flex-direction:column;gap:14px;">
        <div class="form-group">
          <label>Category</label>
          <select class="form-select" id="exchange-category" required>
            <option value="Books">Books & Education</option>
            <option value="Clothes">Clothes & Wearables</option>
            <option value="Pantry">Pantry & Food Staples</option>
            <option value="Electronics">Electronics & Tools</option>
            <option value="Household">Household & Furniture</option>
          </select>
        </div>
        <div class="form-group">
          <label>${isRequest ? 'Item Needed' : 'Item Title'}</label>
          <input type="text" class="form-input" id="exchange-title" placeholder="e.g. Warm winter coats, Children's encyclopedia" required />
        </div>
        <div class="form-group">
          <label>Details / Condition</label>
          <textarea class="form-textarea" id="exchange-details" placeholder="Briefly describe the item, quantity, and pickup neighborhood..." required></textarea>
        </div>
        <div class="form-group">
          <label>Neighborhood / Location</label>
          <input type="text" class="form-input" id="exchange-loc" value="${activeLocation}" />
        </div>
        <button type="submit" class="primary-button" style="justify-content:center;margin-top:10px;padding:12px;">
          <span>${isRequest ? 'Submit Request' : 'Publish to Circle'}</span>
        </button>
      </form>
    `, () => {
      document.getElementById('create-exchange-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('exchange-title')?.value;
        document.getElementById('active-modal')?.remove();
        HomeView.showToast(
          isRequest ? 'Request published!' : 'Item shared successfully!',
          `"${title}" is now visible to helpers in ${activeLocation}.`
        );
      });
    });
  },

  openHowItWorksModal() {
    HomeView.showModal(`
      <div class="modal-header">
        <div>
          <p class="eyebrow">Community Guide</p>
          <h2 class="section-title" style="font-size:22px;">How KindSwap Works</h2>
        </div>
        <button class="modal-close" onclick="document.getElementById('active-modal').remove()">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;margin-top:10px;">
        <div style="background:#faf6ee;border:1px solid #eee7dc;border-radius:14px;padding:14px;display:flex;gap:12px;">
          <div style="width:32px;height:32px;border-radius:50%;background:var(--butter);color:var(--ink);display:grid;place-items:center;font-weight:800;font-size:12px;flex-shrink:0;">1</div>
          <div>
            <b style="font-size:13px;color:var(--ink);">Give what you can</b>
            <p style="font-size:12px;color:var(--muted-ink);margin-top:2px;">List books, clothes, pantry goods, or essentials you no longer need.</p>
          </div>
        </div>
        <div style="background:#faf6ee;border:1px solid #eee7dc;border-radius:14px;padding:14px;display:flex;gap:12px;">
          <div style="width:32px;height:32px;border-radius:50%;background:var(--lavender);color:#745b91;display:grid;place-items:center;font-weight:800;font-size:12px;flex-shrink:0;">2</div>
          <div>
            <b style="font-size:13px;color:var(--ink);">Meaningful matching</b>
            <p style="font-size:12px;color:var(--muted-ink);margin-top:2px;">Our circle matches available goods with nearby neighbors and NGO requests.</p>
          </div>
        </div>
        <div style="background:#faf6ee;border:1px solid #eee7dc;border-radius:14px;padding:14px;display:flex;gap:12px;">
          <div style="width:32px;height:32px;border-radius:50%;background:var(--sage);color:#59714b;display:grid;place-items:center;font-weight:800;font-size:12px;flex-shrink:0;">3</div>
          <div>
            <b style="font-size:13px;color:var(--ink);">Connect & exchange</b>
            <p style="font-size:12px;color:var(--muted-ink);margin-top:2px;">Chat safely in your neighborhood and arrange zero-waste pickups.</p>
          </div>
        </div>
      </div>
      <button class="primary-button" style="width:100%;justify-content:center;margin-top:22px;padding:12px;" onclick="document.getElementById('active-modal').remove()">
        <span>Got it, let's exchange</span>
      </button>
    `);
  },

  openItemDetailModal(itemName) {
    HomeView.showModal(`
      <div class="modal-header">
        <div>
          <p class="eyebrow">Item in Circle</p>
          <h2 class="section-title" style="font-size:22px;">${itemName}</h2>
        </div>
        <button class="modal-close" onclick="document.getElementById('active-modal').remove()">✕</button>
      </div>
      <div style="background:#f8f6f1;border-radius:14px;padding:18px;margin-bottom:16px;">
        <p style="font-size:13px;color:var(--muted-ink);line-height:1.5;">
          This item was listed by a verified neighbor in your Indian community circle. Verified condition: gently used and sanitized.
        </p>
        <div style="margin-top:12px;display:flex;gap:16px;font-size:12px;color:var(--ink);">
          <span>📍 1.2 km away (Delhi NCR)</span>
          <span>⚡ Available now</span>
          <span>⭐ 4.9 Donor rating</span>
        </div>
      </div>
      <div style="display:flex;gap:10px;">
        <button class="primary-button" style="flex:1;justify-content:center;padding:12px;" id="btn-request-match">
          <span>Request item</span>
        </button>
        <button class="banner-button" style="padding:12px 18px;" onclick="document.getElementById('active-modal').remove()">
          <span>Close</span>
        </button>
      </div>
    `, () => {
      document.getElementById('btn-request-match')?.addEventListener('click', () => {
        document.getElementById('active-modal')?.remove();
        HomeView.showToast('Exchange Request Sent!', `The donor has been notified of your interest in "${itemName}".`);
      });
    });
  },

  openMessagesModal() {
    HomeView.showModal(`
      <div class="modal-header">
        <div>
          <p class="eyebrow">Neighborhood Chat</p>
          <h2 class="section-title" style="font-size:22px;">Messages (3)</h2>
        </div>
        <button class="modal-close" onclick="document.getElementById('active-modal').remove()">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="background:#faf7f2;border:1px solid #eee7dc;border-radius:12px;padding:12px;display:flex;gap:10px;align-items:center;cursor:pointer;">
          <div style="width:34px;height:34px;border-radius:50%;background:#F2C24B;display:grid;place-items:center;font-weight:700;font-size:11px;">PS</div>
          <div style="flex:1;">
            <b style="font-size:12px;color:var(--ink);">Pooja S.</b>
            <p style="font-size:11px;color:var(--muted-ink);">"Sure, I can leave the winter coat for pickup in Connaught Place!"</p>
          </div>
          <small style="font-size:10px;color:var(--muted-ink);">10m ago</small>
        </div>
        <div style="background:#faf7f2;border:1px solid #eee7dc;border-radius:12px;padding:12px;display:flex;gap:10px;align-items:center;cursor:pointer;">
          <div style="width:34px;height:34px;border-radius:50%;background:#B9A7D8;display:grid;place-items:center;font-weight:700;font-size:11px;">GJ</div>
          <div style="flex:1;">
            <b style="font-size:12px;color:var(--ink);">Goonj NGO</b>
            <p style="font-size:11px;color:var(--muted-ink);">"Thank you for the school book donation batch!"</p>
          </div>
          <small style="font-size:10px;color:var(--muted-ink);">1h ago</small>
        </div>
        <div style="background:#faf7f2;border:1px solid #eee7dc;border-radius:12px;padding:12px;display:flex;gap:10px;align-items:center;cursor:pointer;">
          <div style="width:34px;height:34px;border-radius:50%;background:#A9B98A;display:grid;place-items:center;font-weight:700;font-size:11px;">AM</div>
          <div style="flex:1;">
            <b style="font-size:12px;color:var(--ink);">Aarav M.</b>
            <p style="font-size:11px;color:var(--muted-ink);">"We have extra organic grains and pantry supplies in Indiranagar."</p>
          </div>
          <small style="font-size:10px;color:var(--muted-ink);">3h ago</small>
        </div>
      </div>
      <button class="primary-button" style="width:100%;justify-content:center;margin-top:18px;padding:12px;" onclick="document.getElementById('active-modal').remove()">
        <span>Close</span>
      </button>
    `);
  },

  renderLocationOptions() {
    const states = LocationService.getAllStates();
    let html = `
      <option value="All India" ${activeLocation === 'All India' ? 'selected' : ''}>🇮🇳 All India Circle</option>
    `;
    states.forEach(st => {
      const val = `${st.name}, India`;
      const isSel = activeLocation === val || activeLocation === st.name;
      html += `<option value="${val}" ${isSel ? 'selected' : ''}>${st.name}</option>`;
    });
    html += `
      <option disabled>──────────</option>
      <option value="__add_custom_state__">➕ Add Any State / Region...</option>
    `;
    return html;
  },

  openMapModal() {
    if (modalMapInstance) {
      modalMapInstance.destroy();
      modalMapInstance = null;
    }

    const states = LocationService.getAllStates();
    let stateOptions = `<option value="All India">🇮🇳 All India (National View)</option>`;
    states.forEach(s => {
      const isSel = activeLocation.includes(s.name);
      stateOptions += `<option value="${s.name}" ${isSel ? 'selected' : ''}>${s.name}</option>`;
    });

    HomeView.showModal(`
      <div class="modal-header">
        <div>
          <p class="eyebrow">Pan-India Circle</p>
          <h2 class="section-title" style="font-size:22px;">India Community Exchange Map</h2>
        </div>
        <button class="modal-close" id="modal-map-close-btn">✕</button>
      </div>

      <!-- Modal Filter Bar -->
      <div class="map-filter-bar" id="modal-map-filter-bar" style="background:#fffdf8;border-radius:14px 14px 0 0;padding:8px 12px;">
        <button class="map-filter-chip active" data-filter="all">All</button>
        <button class="map-filter-chip chip-donation" data-filter="donation">🎁 Donations</button>
        <button class="map-filter-chip chip-ngo" data-filter="ngo">🤝 NGOs</button>
        <button class="map-filter-chip chip-pickup" data-filter="pickup">📍 Pickups</button>
        <button class="map-filter-chip chip-delivery" data-filter="delivery">📦 Deliveries</button>
        <button class="map-filter-chip chip-match" data-filter="match">⚡ Matches</button>
        <div style="margin-left:auto;display:flex;align-items:center;gap:6px;">
          <span style="font-size:11px;font-weight:700;color:var(--muted-ink);">State:</span>
          <select id="modal-filter-state-select" style="font-size:11px;font-weight:700;padding:4px 10px;border-radius:99px;border:1px solid #eee7dc;background:#fffdf8;color:var(--ink);cursor:pointer;">
            ${stateOptions}
          </select>
        </div>
      </div>

      <!-- Full Interactive Map in Modal -->
      <div id="modal-map-canvas" style="height:380px;width:100%;background:#f0eadf;position:relative;border-radius:0 0 14px 14px;overflow:hidden;"></div>

      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:14px;">
        <span style="font-size:12px;color:var(--muted-ink);">
          ✨ Zoom, pan, and click any marker to inspect or connect.
        </span>
        <button class="primary-button" style="padding:10px 18px;" id="modal-map-done-btn">
          <span>Done</span>
        </button>
      </div>
    `, () => {
      modalMapInstance = new InteractiveMap({
        container: 'modal-map-canvas',
        initialState: activeLocation,
        isCompact: false,
        onSelectLocation: (loc) => {
          HomeView.openLocationDetailModal(loc);
        }
      });

      // Filter chips in modal
      document.querySelectorAll('#modal-map-filter-bar button[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#modal-map-filter-bar button[data-filter]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.getAttribute('data-filter');
          if (modalMapInstance) {
            modalMapInstance.filterByType(filter);
          }
        });
      });

      // State selector in modal
      const stateSel = document.getElementById('modal-filter-state-select');
      stateSel?.addEventListener('change', (e) => {
        const selectedState = e.target.value;
        if (modalMapInstance) {
          modalMapInstance.flyToState(selectedState);
        }
      });

      const closeAction = () => {
        if (modalMapInstance) {
          modalMapInstance.destroy();
          modalMapInstance = null;
        }
        document.getElementById('active-modal')?.remove();
      };

      document.getElementById('modal-map-close-btn')?.addEventListener('click', closeAction);
      document.getElementById('modal-map-done-btn')?.addEventListener('click', closeAction);
    });
  },

  openAddStateModal() {
    HomeView.showModal(`
      <div class="modal-header">
        <div>
          <p class="eyebrow">Expand KindCircle</p>
          <h2 class="section-title" style="font-size:22px;">Add Indian State or Region</h2>
        </div>
        <button class="modal-close" onclick="document.getElementById('active-modal').remove()">✕</button>
      </div>
      <form id="add-state-form" style="display:flex;flex-direction:column;gap:14px;">
        <p style="font-size:12.5px;color:var(--muted-ink);line-height:1.4;">
          Add any state, union territory, or district across India to your active community circles.
        </p>
        <div class="form-group">
          <label>State or Region Name</label>
          <input type="text" class="form-input" id="new-state-name" placeholder="e.g. Goa, Kerala, Himachal Pradesh, Ladakh..." required />
        </div>
        <div class="form-group">
          <label>Primary City Hub (Optional)</label>
          <input type="text" class="form-input" id="new-state-city" placeholder="e.g. Panaji, Kochi, Shimla..." />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div class="form-group">
            <label>Approx. Longitude (optional)</label>
            <input type="number" step="any" class="form-input" id="new-state-lng" placeholder="Auto / 78.96" />
          </div>
          <div class="form-group">
            <label>Approx. Latitude (optional)</label>
            <input type="number" step="any" class="form-input" id="new-state-lat" placeholder="Auto / 22.59" />
          </div>
        </div>
        <button type="submit" class="primary-button" style="justify-content:center;margin-top:8px;padding:12px;">
          <span>Add to Community Circles</span>
        </button>
      </form>
    `, () => {
      document.getElementById('add-state-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('new-state-name')?.value?.trim();
        const lng = document.getElementById('new-state-lng')?.value;
        const lat = document.getElementById('new-state-lat')?.value;
        if (!name) return;

        const added = LocationService.addCustomState({
          name,
          lng: lng ? parseFloat(lng) : undefined,
          lat: lat ? parseFloat(lat) : undefined,
          zoom: 7.5,
          type: 'Custom State'
        });

        document.getElementById('active-modal')?.remove();

        // Refresh dropdown
        const locSelect = document.getElementById('location-select');
        if (locSelect) {
          locSelect.innerHTML = HomeView.renderLocationOptions();
          locSelect.value = `${added.name}, India`;
        }

        activeLocation = `${added.name}, India`;
        HomeView.showToast(`Circle Added: ${added.name}`, `Your community map is now connected to ${added.name}.`);

        if (dashboardMapInstance) {
          dashboardMapInstance.flyToState(added.name);
        }
      });
    });
  },

  openLocationDetailModal(loc) {
    if (!loc) return;
    const colors = {
      ngo: '#5c4779',
      donation: '#8c6c1c',
      pickup: '#4a633b',
      delivery: '#8a3f2b',
      match: '#856108'
    };
    const badges = {
      ngo: 'Verified NGO Partner',
      donation: 'Available Donation Item',
      pickup: 'Verified Community Pickup Hub',
      delivery: 'Active Delivery Route',
      match: 'Matched Neighborhood Exchange'
    };

    HomeView.showModal(`
      <div class="modal-header">
        <div>
          <span style="font-size:10px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:${colors[loc.type] || 'var(--muted-ink)'};">
            ${badges[loc.type] || loc.type}
          </span>
          <h2 class="section-title" style="font-size:22px;margin-top:3px;">${loc.title}</h2>
        </div>
        <button class="modal-close" onclick="document.getElementById('active-modal').remove()">✕</button>
      </div>
      <div style="background:#f8f6f1;border-radius:14px;padding:18px;margin-bottom:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <span style="font-size:12px;font-weight:700;color:var(--ink);">
            📍 ${loc.city}, ${loc.state}
          </span>
          <span style="font-size:11px;font-weight:800;background:#e9f4e4;color:#3b6a2c;padding:3px 8px;border-radius:99px;text-transform:capitalize;">
            ${loc.status}
          </span>
        </div>
        <p style="font-size:13px;color:var(--muted-ink);line-height:1.5;">
          ${loc.description}
        </p>
        <div style="margin-top:14px;border-top:1px solid #e8e1d5;padding-top:10px;display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:var(--ink);">
          <span>🏷️ Category: <b>${loc.category}</b></span>
          <span>👤 Contact: <b>${loc.contactName}</b></span>
          ${loc.contactPhone ? `<span>📞 <b>${loc.contactPhone}</b></span>` : ''}
        </div>
      </div>
      <div style="display:flex;gap:10px;">
        <button class="primary-button" style="flex:1;justify-content:center;padding:12px;" id="btn-connect-loc">
          <span>Connect with ${loc.type === 'ngo' ? 'NGO' : 'Member'}</span>
        </button>
        <button class="banner-button" style="padding:12px 18px;" onclick="document.getElementById('active-modal').remove()">
          <span>Close</span>
        </button>
      </div>
    `, () => {
      document.getElementById('btn-connect-loc')?.addEventListener('click', () => {
        document.getElementById('active-modal')?.remove();
        HomeView.showToast('Connection Requested!', `Your message has been sent to ${loc.contactName}.`);
      });
    });
  },

  openMembersModal() {
    HomeView.showModal(`
      <div class="modal-header">
        <div>
          <p class="eyebrow">Circle Members</p>
          <h2 class="section-title" style="font-size:22px;">Trusted Neighbors in India</h2>
        </div>
        <button class="modal-close" onclick="document.getElementById('active-modal').remove()">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;border-bottom:1px solid #eee7dc;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:32px;height:32px;border-radius:50%;background:#F2C24B;display:grid;place-items:center;font-size:11px;font-weight:800;">PS</div>
            <div>
              <b style="font-size:13px;color:var(--ink);">Pooja S.</b>
              <p style="font-size:11px;color:var(--muted-ink);">Donor · 18 items shared · Delhi NCR</p>
            </div>
          </div>
          <span style="font-size:11px;color:#4a7c3b;font-weight:700;">★ 5.0</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;border-bottom:1px solid #eee7dc;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:32px;height:32px;border-radius:50%;background:#B9A7D8;display:grid;place-items:center;font-size:11px;font-weight:800;">GJ</div>
            <div>
              <b style="font-size:13px;color:var(--ink);">Goonj NGO</b>
              <p style="font-size:11px;color:var(--muted-ink);">Verified NGO Partner · Mumbai & Delhi</p>
            </div>
          </div>
          <span style="font-size:11px;color:#4a7c3b;font-weight:700;">★ 4.9</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:32px;height:32px;border-radius:50%;background:#A9B98A;display:grid;place-items:center;font-size:11px;font-weight:800;">AM</div>
            <div>
              <b style="font-size:13px;color:var(--ink);">Aarav M.</b>
              <p style="font-size:11px;color:var(--muted-ink);">Community Helper · 12 swaps · Bengaluru</p>
            </div>
          </div>
          <span style="font-size:11px;color:#4a7c3b;font-weight:700;">★ 4.8</span>
        </div>
      </div>
      <button class="primary-button" style="width:100%;justify-content:center;margin-top:16px;padding:12px;" onclick="document.getElementById('active-modal').remove()">
        <span>Done</span>
      </button>
    `);
  },

  openImpactModal() {
    HomeView.showModal(`
      <div class="modal-header">
        <div>
          <p class="eyebrow">Circle Sustainability</p>
          <h2 class="section-title" style="font-size:22px;">Impact History</h2>
        </div>
        <button class="modal-close" onclick="document.getElementById('active-modal').remove()">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="background:#f8e5a3;padding:14px;border-radius:14px;">
          <p style="font-size:11px;color:#7e756a;font-weight:600;">CO2 Prevented</p>
          <h3 class="font-display" style="font-size:24px;font-weight:700;color:var(--ink);margin-top:4px;">142 kg</h3>
        </div>
        <div style="background:#e8def4;padding:14px;border-radius:14px;">
          <p style="font-size:11px;color:#7e756a;font-weight:600;">Items Rehomed</p>
          <h3 class="font-display" style="font-size:24px;font-weight:700;color:var(--ink);margin-top:4px;">38 items</h3>
        </div>
      </div>
      <p style="font-size:12px;color:var(--muted-ink);line-height:1.5;">
        Every swap on KindSwap keeps usable items out of landfills and gets them directly into the hands of neighbors who need them.
      </p>
      <button class="primary-button" style="width:100%;justify-content:center;margin-top:18px;padding:12px;" onclick="document.getElementById('active-modal').remove()">
        <span>Keep Swapping</span>
      </button>
    `);
  },

  openMyExchangeModal(navigate) {
    HomeView.showModal(`
      <div class="modal-header">
        <div>
          <p class="eyebrow">Active Circle</p>
          <h2 class="section-title" style="font-size:22px;">My Exchanges</h2>
        </div>
        <button class="modal-close" onclick="document.getElementById('active-modal').remove()">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="background:#faf7f2;border:1px solid #eee7dc;border-radius:14px;padding:14px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <b style="font-size:13px;color:var(--ink);">Children's books (Set of 12)</b>
            <p style="font-size:11px;color:var(--muted-ink);margin-top:2px;">Requested by Oak Street NGO · Pending handover</p>
          </div>
          <span style="background:var(--butter);color:var(--ink);font-size:10px;font-weight:700;padding:4px 8px;border-radius:99px;">Active</span>
        </div>
        <div style="background:#faf7f2;border:1px solid #eee7dc;border-radius:14px;padding:14px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <b style="font-size:13px;color:var(--ink);">Warm fleece sweater</b>
            <p style="font-size:11px;color:var(--muted-ink);margin-top:2px;">Swapped with Maya R. · Completed Sep 4</p>
          </div>
          <span style="background:#dfead4;color:#466538;font-size:10px;font-weight:700;padding:4px 8px;border-radius:99px;">Completed</span>
        </div>
      </div>
      <div style="display:flex;gap:10px;margin-top:18px;">
        <button class="primary-button" style="flex:1;justify-content:center;padding:12px;" id="btn-modal-new-swap">
          <span>+ Start New Exchange</span>
        </button>
      </div>
    `, () => {
      document.getElementById('btn-modal-new-swap')?.addEventListener('click', () => {
        document.getElementById('active-modal')?.remove();
        HomeView.openCreateExchangeModal(navigate);
      });
    });
  },

  openSettingsModal(navigate, refreshApp) {
    HomeView.showModal(`
      <div class="modal-header">
        <div>
          <p class="eyebrow">Preferences</p>
          <h2 class="section-title" style="font-size:22px;">Circle Settings</h2>
        </div>
        <button class="modal-close" onclick="document.getElementById('active-modal').remove()">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div class="form-group">
          <label>Default Neighborhood</label>
          <input type="text" class="form-input" value="${activeLocation}" readonly />
        </div>
        <div class="form-group">
          <label>Exchange Radius</label>
          <select class="form-select">
            <option>Within 5 km</option>
            <option selected>Within 10 km</option>
            <option>Within 25 km</option>
          </select>
        </div>
        <div style="padding-top:10px;border-top:1px solid #eee7dc;display:flex;gap:10px;">
          <button class="primary-button" style="flex:1;justify-content:center;padding:12px;" onclick="document.getElementById('active-modal').remove()">
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    `);
  },

  openAccountModal(navigate, refreshApp) {
    const user = window.currentUser;
    if (user) {
      HomeView.showModal(`
        <div class="modal-header">
          <div>
            <p class="eyebrow">Account</p>
            <h2 class="section-title" style="font-size:22px;">${user.name || user.email}</h2>
          </div>
          <button class="modal-close" onclick="document.getElementById('active-modal').remove()">✕</button>
        </div>
        <div style="background:#faf7f2;border:1px solid #eee7dc;border-radius:14px;padding:16px;margin-bottom:16px;">
          <p style="font-size:12px;color:var(--muted-ink);">Email: <strong style="color:var(--ink);">${user.email}</strong></p>
          <p style="font-size:12px;color:var(--muted-ink);margin-top:6px;">Role: <strong style="color:var(--ink);text-transform:capitalize;">${user.role}</strong></p>
          <p style="font-size:12px;color:var(--muted-ink);margin-top:6px;">Status: <strong style="color:#4a7c3b;">Authenticated</strong></p>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <button class="primary-button" style="justify-content:center;padding:12px;background:#b33a2b;" id="modal-logout-btn">
            <span>Sign Out</span>
          </button>
        </div>
      `, () => {
        document.getElementById('modal-logout-btn')?.addEventListener('click', async () => {
          try {
            await AuthService.logout();
          } catch { /* ignore */ }
          window.currentUser = null;
          document.getElementById('active-modal')?.remove();
          HomeView.showToast('Signed out', 'You are now browsing as guest.');
          refreshApp();
        });
      });
    } else {
      HomeView.showModal(`
        <div class="modal-header">
          <div>
            <p class="eyebrow">Sign In</p>
            <h2 class="section-title" style="font-size:22px;">Join your Circle</h2>
          </div>
          <button class="modal-close" onclick="document.getElementById('active-modal').remove()">✕</button>
        </div>
        <p style="font-size:13px;color:var(--muted-ink);margin-bottom:18px;">
          Sign in or register to connect with local donors, request items, and track your community impact.
        </p>
        <button class="primary-button" style="width:100%;justify-content:center;padding:12px;" id="modal-goto-login">
          <span>Go to Sign In / Register</span>
        </button>
      `, () => {
        document.getElementById('modal-goto-login')?.addEventListener('click', () => {
          document.getElementById('active-modal')?.remove();
          navigate('login');
        });
      });
    }
  },

  showModal(contentHtml, afterAttach = null) {
    document.getElementById('active-modal')?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'active-modal';
    overlay.innerHTML = `
      <div class="modal-dialog">
        ${contentHtml}
      </div>
    `;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    document.body.appendChild(overlay);
    if (typeof afterAttach === 'function') {
      afterAttach();
    }
  }
};
