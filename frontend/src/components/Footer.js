export const Footer = {
  render() {
    return `
      <footer class="app-footer">
        <div class="footer-content">
          <div class="footer-logo">
            <div class="logo-icon">💬🔄</div>
            <h2>KindSwap</h2>
            <p>Sharing resources, building community.</p>
          </div>
          <div class="footer-links">
            <div>
              <h4>Platform</h4>
              <a href="#">Give Items</a>
              <a href="#">Request Items</a>
              <a href="#">How it Works</a>
            </div>
            <div>
              <h4>Community</h4>
              <a href="#">Impact</a>
              <a href="#">Guidelines</a>
              <a href="#">Support</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} KindSwap. All rights reserved.</p>
        </div>
      </footer>
    `;
  }
};
