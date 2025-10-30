import './style.css';

// --- DOM Elements ---
const navbarContainer = document.getElementById('navbar-container');
const appContainer = document.getElementById('app-container');
const footerContainer = document.getElementById('footer-container');

// --- Tool: Value to Hex Converter (Upgraded) ---

const renderValueToHex = () => {
  appContainer.innerHTML = `
    <div class="card">
      <h2 class="card-title">Value to Hex Converter</h2>
      <div class="form-group">
        <label for="inputValue" class="form-label">Input Value</label>
        <input type="text" id="inputValue" class="form-input" placeholder="e.g., 42, 3.14, or 9007199254740991">
      </div>
      <div class="form-group">
        <label class="form-label">Data Type</label>
        <div class="radio-group" id="dataType">
          <label><input type="radio" name="type" value="short"> Short (Int16)</label>
          <label><input type="radio" name="type" value="int" checked> Integer (Int32)</label>
          <label><input type="radio" name="type" value="long"> Long (BigInt64)</label>
          <label><input type="radio" name="type" value="float"> Float (Float32)</label>
          <label><input type="radio" name="type" value="double"> Double (Float64)</label>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Endianness</label>
        <div class="radio-group" id="endianness">
          <label><input type="radio" name="endian" value="little"> Little Endian</label>
          <label><input type="radio" name="endian" value="big" checked> Big Endian</label>
        </div>
      </div>
      <button id="convertBtn" class="action-btn-gradient">Convert to Hex</button>
      <div class="result-group">
        <label class="form-label">Hex Result</label>
        <div class="result-wrapper">
          <input type="text" id="resultInput" class="base-input" readonly placeholder="Hex output will appear here...">
        </div>
      </div>
    </div>
  `;

  // --- Event Listeners for Value to Hex ---
  const convertBtn = document.getElementById('convertBtn');
  const resultInput = document.getElementById('resultInput');
  const inputValue = document.getElementById('inputValue');

  const performConversion = () => handleValueToHexConversion();

  convertBtn.addEventListener('click', performConversion);
  inputValue.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      performConversion();
    }
  });

  resultInput.addEventListener('click', () => {
    if (!resultInput.value || resultInput.value.startsWith('Error:')) return;
    navigator.clipboard.writeText(resultInput.value).then(() => {
      const originalText = resultInput.value;
      resultInput.value = 'Copied to clipboard!';
      resultInput.classList.add('copied-feedback');
      setTimeout(() => {
        resultInput.value = originalText;
        resultInput.classList.remove('copied-feedback');
      }, 1500);
    });
  });
};

const handleValueToHexConversion = () => {
  const valueStr = document.getElementById('inputValue').value.trim();
  const type = document.querySelector('input[name="type"]:checked').value;
  const isLittleEndian = document.querySelector('input[name="endian"]:checked').value === 'little';
  const resultInput = document.getElementById('resultInput');

  if (valueStr === '') {
    resultInput.value = 'Error: Input value is empty.';
    return;
  }

  let buffer;
  let view;
  let value;

  try {
    switch (type) {
      case 'short': // Int16 (New)
        buffer = new ArrayBuffer(2);
        view = new DataView(buffer);
        value = parseInt(valueStr, 10);
        if (isNaN(value)) throw new Error('Invalid integer for Short');
        view.setInt16(0, value, isLittleEndian);
        break;

      case 'int': // Int32
        buffer = new ArrayBuffer(4);
        view = new DataView(buffer);
        value = parseInt(valueStr, 10);
        if (isNaN(value)) throw new Error('Invalid integer for Int');
        view.setInt32(0, value, isLittleEndian);
        break;

      case 'long': // BigInt64 (New)
        buffer = new ArrayBuffer(8);
        view = new DataView(buffer);
        value = BigInt(valueStr);
        view.setBigInt64(0, value, isLittleEndian);
        break;

      case 'float': // Float32
        buffer = new ArrayBuffer(4);
        view = new DataView(buffer);
        value = parseFloat(valueStr);
        if (isNaN(value)) throw new Error('Invalid number for Float');
        view.setFloat32(0, value, isLittleEndian);
        break;

      case 'double': // Float64 (New)
        buffer = new ArrayBuffer(8);
        view = new DataView(buffer);
        value = parseFloat(valueStr);
        if (isNaN(value)) throw new Error('Invalid number for Double');
        view.setFloat64(0, value, isLittleEndian);
        break;
      
      default:
        throw new Error('Unknown data type');
    }

    const hexString = Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    resultInput.value = `0x${hexString.toUpperCase()}`;

  } catch (error) {
    resultInput.value = `Error: ${error.message}.`;
  }
};


// --- Tool: Base Converter ---

const renderBaseConverter = () => {
  appContainer.innerHTML = `
    <h1>Base Converter</h1>
    <div class="converter-wrapper">
        <div class="base-row">
            <span class="base-label">DEC</span>
            <input type="text" class="base-input" id="decInput" placeholder="Enter a decimal number...">
        </div>
        <div class="base-row">
            <span class="base-label">HEX</span>
            <input type="text" class="base-input" id="hexInput" placeholder="Enter a hexadecimal number...">
        </div>
        <div class="base-row">
            <span class="base-label">BIN</span>
            <input type="text" class="base-input" id="binInput" placeholder="Enter a binary number...">
        </div>
    </div>
  `;

  const decInput = document.getElementById('decInput');
  const hexInput = document.getElementById('hexInput');
  const binInput = document.getElementById('binInput');
  const inputs = [decInput, hexInput, binInput];

  const updateValues = (sourceId, value) => {
    let decValue;

    try {
      if (sourceId === 'decInput') {
        if (!/^-?\d+$/.test(value)) throw new Error('Invalid decimal');
        decValue = BigInt(value);
      } else if (sourceId === 'hexInput') {
        if (!/^[0-9a-fA-F]+$/.test(value)) throw new Error('Invalid hex');
        decValue = BigInt('0x' + value);
      } else if (sourceId === 'binInput') {
        if (!/^[01]+$/.test(value)) throw new Error('Invalid binary');
        decValue = BigInt('0b' + value);
      } else {
        return;
      }
      
      inputs.forEach(inp => inp.classList.remove('invalid'));

      if (sourceId !== 'decInput') decInput.value = decValue.toString(10);
      if (sourceId !== 'hexInput') hexInput.value = decValue.toString(16).toUpperCase();
      if (sourceId !== 'binInput') binInput.value = decValue.toString(2);
    } catch (e) {
      document.getElementById(sourceId).classList.add('invalid');
    }
  };

  inputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const sourceId = e.target.id;
      const value = e.target.value.trim();
      
      if (value === '') {
        inputs.forEach(inp => {
          inp.value = '';
          inp.classList.remove('invalid');
        });
        return;
      }
      updateValues(sourceId, value);
    });
  });
};

// --- App Structure & Routing ---

const tools = {
  '/': { name: 'Base Converter', render: renderBaseConverter },
  '/value-to-hex': { name: 'Value to Hex', render: renderValueToHex },
};

const renderNavbar = () => {
  const navLinks = Object.entries(tools).map(([path, { name }]) => 
    `<a href="#${path}" class="nav-link">${name}</a>`
  ).join('');
  navbarContainer.innerHTML = `<div class="nav-container">${navLinks}</div>`;
};

const renderFooter = () => {
  footerContainer.innerHTML = `
    <p>&copy; ${new Date().getFullYear()} Web Tools. All rights reserved.</p>
    <p>A collection of simple, client-side developer utilities.</p>
  `;
};

const router = () => {
  const path = window.location.hash.slice(1) || '/value-to-hex'; // Default to Value to Hex
  const tool = tools[path] || tools['/value-to-hex']; 
  
  document.querySelectorAll('.nav-link').forEach(link => {
      const linkPath = link.getAttribute('href').slice(1);
      if (linkPath === path) {
          link.style.color = 'var(--accent-color)';
          link.style.borderBottomColor = 'var(--accent-color)';
      } else {
          link.style.color = '';
          link.style.borderBottomColor = 'transparent';
      }
  });

  tool.render();
};

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
  router(); // Initial route
  window.addEventListener('hashchange', router); // Listen for route changes
});
