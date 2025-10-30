import './style.css';

/**
 * App State and Initialization
 */
const app = {
  // A simple router to load different tools. For now, it just loads the base converter.
  init() {
    this.renderNavbar();
    this.renderFooter();
    this.router.navigateTo('base-converter');
  },
  
  // Simple client-side router
  router: {
    routes: {
      'base-converter': renderBaseConverter,
      // You can add more tools here in the future
      // 'another-tool': renderAnotherTool,
    },
    navigateTo(route) {
      const container = document.getElementById('app-container');
      container.innerHTML = ''; // Clear previous content
      if (this.routes[route]) {
        this.routes[route](container);
      } else {
        container.innerHTML = `<h1>404 - Tool Not Found</h1>`;
      }
    }
  },

  renderNavbar() {
    const navContainer = document.getElementById('navbar-container');
    navContainer.innerHTML = `
      <div class="nav-container">
        <a href="#base-converter" class="nav-link active">Base Converter</a>
      </div>
    `;
    // Add event listeners for nav links if more tools are added
  },

  renderFooter() {
    const footerContainer = document.getElementById('footer-container');
    const currentYear = new Date().getFullYear();
    footerContainer.innerHTML = `
      <p>GhostBlade Web Tools &copy; ${currentYear}</p>
      <p>A collection of simple, fast, and open-source web utilities.</p>
    `;
  }
};

/**
 * Base Converter Tool
 */
function renderBaseConverter(container) {
  // The <button id="resetBtn"> element has been removed from this HTML string.
  container.innerHTML = `
    <section id="base-converter-tool">
      <div class="converter-header">
        <h1>Base Converter</h1>
      </div>
      <div class="converter-wrapper">
        <div class="base-row">
          <span class="base-label">DEC</span>
          <input type="text" class="base-input" id="dec-input" data-base="10" placeholder="0">
        </div>
        <div class="base-row">
          <span class="base-label">HEX</span>
          <input type="text" class="base-input" id="hex-input" data-base="16" placeholder="0">
        </div>
        <div class="base-row">
          <span class="base-label">BIN</span>
          <input type="text" class="base-input" id="bin-input" data-base="2" placeholder="0">
        </div>
        <div class="base-row">
          <span class="base-label">OCT</span>
          <input type="text" class="base-input" id="oct-input" data-base="8" placeholder="0">
        </div>
      </div>
    </section>
  `;

  const inputs = {
    dec: document.getElementById('dec-input'),
    hex: document.getElementById('hex-input'),
    bin: document.getElementById('bin-input'),
    oct: document.getElementById('oct-input'),
  };

  const validationRegex = {
    10: /^[0-9]*$/,
    16: /^[0-9a-fA-F]*$/,
    2: /^[01]*$/,
    8: /^[0-7]*$/,
  };

  const clearAllInputs = () => {
    Object.values(inputs).forEach(input => {
      input.value = '';
      input.classList.remove('invalid');
    });
  };

  const handleInputChange = (e) => {
    const sourceInput = e.target;
    const sourceBase = parseInt(sourceInput.dataset.base);
    const sourceValue = sourceInput.value.trim();

    // If input is empty, clear all other inputs and exit
    if (sourceValue === '') {
      clearAllInputs();
      return;
    }

    // Validate input
    if (!validationRegex[sourceBase].test(sourceValue)) {
      sourceInput.classList.add('invalid');
      return;
    }
    sourceInput.classList.remove('invalid');

    // Convert to decimal first
    const decimalValue = BigInt(`0${sourceBase === 16 ? 'x' : sourceBase === 8 ? 'o' : sourceBase === 2 ? 'b' : ''}${sourceValue}`);

    // Update all other inputs
    Object.values(inputs).forEach(input => {
      if (input !== sourceInput) {
        const targetBase = parseInt(input.dataset.base);
        if (decimalValue === 0n) {
          input.value = '';
        } else {
          input.value = decimalValue.toString(targetBase).toUpperCase();
        }
        input.classList.remove('invalid');
      }
    });
  };

  Object.values(inputs).forEach(input => {
    input.addEventListener('input', handleInputChange);
  });
  
  // The code block for selecting and adding an event listener to #resetBtn has been removed.
}


// Start the application
app.init();
