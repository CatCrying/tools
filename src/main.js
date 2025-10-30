import './style.css';

const appContainer = document.getElementById('app-container');
const navbarContainer = document.getElementById('navbar-container');
const footerContainer = document.getElementById('footer-container');

// --- DATA & CONFIG ---

const routes = {
  '#base-converter': {
    name: 'Base Converter',
    render: renderBaseConverter,
  },
  '#value-converter': {
    name: 'Value Converter',
    render: renderValueConverter,
  },
};

const valueConverterDataTypes = {
    'Int8': { size: 1, setter: 'setInt8', type: 'int' },
    'Uint8': { size: 1, setter: 'setUint8', type: 'int' },
    'Int16 (short)': { size: 2, setter: 'setInt16', type: 'int' },
    'Uint16 (short)': { size: 2, setter: 'setUint16', type: 'int' },
    'Int32 (long)': { size: 4, setter: 'setInt32', type: 'int' },
    'Uint32 (long)': { size: 4, setter: 'setUint32', type: 'int' },
    'BigInt64 (long long)': { size: 8, setter: 'setBigInt64', type: 'bigint' },
    'BigUint64 (long long)': { size: 8, setter: 'setBigUint64', type: 'bigint' },
    'Float32 (float)': { size: 4, setter: 'setFloat32', type: 'float' },
    'Float64 (double)': { size: 8, setter: 'setFloat64', type: 'float' },
};

// --- ROUTER & APP SHELL ---

function router() {
  const path = window.location.hash || '#base-converter';
  const route = routes[path] || routes['#base-converter'];
  
  appContainer.innerHTML = ''; // Clear previous content
  route.render(appContainer);
  updateNavLinks(path);
}

function updateNavLinks(activePath) {
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === activePath) {
            link.style.color = 'var(--primary-text-color)';
            link.style.borderBottomColor = 'var(--accent-color)';
        } else {
            link.style.color = 'var(--secondary-text-color)';
            link.style.borderBottomColor = 'transparent';
        }
    });
}

function renderNavbar() {
    const navLinks = Object.entries(routes).map(([path, { name }]) => 
        `<a href="${path}" class="nav-link">${name}</a>`
    ).join('');

    navbarContainer.innerHTML = `
        <div class="nav-container">
            ${navLinks}
        </div>
    `;
}

function renderFooter() {
    footerContainer.innerHTML = `
        <span>GhostBlade Web Tools - A collection of simple utilities for developers.</span>
        <span>&copy; ${new Date().getFullYear()}</span>
    `;
}

// --- TOOL: BASE CONVERTER ---

function renderBaseConverter(container) {
    container.innerHTML = `
        <div class="converter-header">
            <h1>Base Converter</h1>
            <button id="resetBtn">Reset</button>
        </div>
        <div class="converter-wrapper">
            <div class="base-row">
                <span class="base-label">DEC</span>
                <input type="text" class="base-input" id="dec-input" data-base="10" placeholder="Decimal">
            </div>
            <div class="base-row">
                <span class="base-label">HEX</span>
                <input type="text" class="base-input" id="hex-input" data-base="16" placeholder="Hexadecimal">
            </div>
            <div class="base-row">
                <span class="base-label">BIN</span>
                <input type="text" class="base-input" id="bin-input" data-base="2" placeholder="Binary">
            </div>
            <div class="base-row">
                <span class="base-label">OCT</span>
                <input type="text" class="base-input" id="oct-input" data-base="8" placeholder="Octal">
            </div>
        </div>
    `;
    setupBaseConverterListeners();
}

function setupBaseConverterListeners() {
    const inputs = document.querySelectorAll('.base-input');
    const wrapper = document.querySelector('.converter-wrapper');
    const resetBtn = document.getElementById('resetBtn');

    const validationPatterns = {
        10: /^-?[0-9]+$/,
        16: /^[0-9a-fA-F]+$/,
        2: /^[01]+$/,
        8: /^[0-7]+$/
    };

    const prefixes = { 16: '0x', 2: '0b', 8: '0o' };

    wrapper.addEventListener('input', (e) => {
        if (!e.target.classList.contains('base-input')) return;

        const sourceInput = e.target;
        const sourceBase = parseInt(sourceInput.dataset.base, 10);
        const sourceValue = sourceInput.value.trim();

        if (sourceValue === '') {
            clearAllInputs();
            return;
        }

        const isValid = validationPatterns[sourceBase]?.test(sourceValue);
        sourceInput.classList.toggle('invalid', !isValid);

        if (!isValid) return;

        try {
            const bigIntValue = BigInt((prefixes[sourceBase] || '') + sourceValue);

            inputs.forEach(input => {
                if (input === sourceInput) return;
                const targetBase = parseInt(input.dataset.base, 10);
                input.value = bigIntValue.toString(targetBase).toUpperCase();
                input.classList.remove('invalid');
            });
        } catch (error) {
            sourceInput.classList.add('invalid');
        }
    });

    const clearAllInputs = () => {
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('invalid');
        });
    };

    resetBtn.addEventListener('click', clearAllInputs);
}

// --- TOOL: VALUE CONVERTER ---

function renderValueConverter(container) {
    const dataTypeOptions = Object.keys(valueConverterDataTypes).map(name => 
        `<option value="${name}">${name}</option>`
    ).join('');

    container.innerHTML = `
        <div class="card">
            <h2 class="card-title">Value to Hex Converter</h2>
            
            <div class="form-group">
                <label for="vc_inputValue" class="form-label">Input Value</label>
                <input type="text" id="vc_inputValue" class="form-input" placeholder="e.g., 12345 or 3039">
            </div>

            <div id="valueInputsContainer">
                <div class="form-group">
                    <label class="form-label">Input Type</label>
                    <div class="radio-group">
                        <label><input type="radio" name="inputType" value="dec" checked> Decimal</label>
                        <label><input type="radio" name="inputType" value="hex"> Hexadecimal</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Data Type</label>
                    <select id="vc_dataType" class="form-select">${dataTypeOptions}</select>
                </div>
                <div class="form-group">
                    <label class="form-label">Endianness</label>
                    <div class="radio-group">
                        <label><input type="radio" name="endianness" value="little" checked> Little Endian</label>
                        <label><input type="radio" name="endianness" value="big"> Big Endian</label>
                    </div>
                </div>
            </div>

            <button id="convertBtn" class="action-btn-gradient">Convert to Hex</button>

            <div class="result-group">
                <label class="form-label">Hex Result (Click to copy)</label>
                <div class="result-wrapper">
                    <input type="text" id="resultInput" class="base-input" readonly placeholder="Result will appear here">
                </div>
            </div>
        </div>
    `;
    setupValueConverterListeners();
}

function setupValueConverterListeners() {
    const convertBtn = document.getElementById('convertBtn');
    const resultInput = document.getElementById('resultInput');

    convertBtn.addEventListener('click', () => {
        const inputValue = document.getElementById('vc_inputValue').value.trim();
        const inputType = document.querySelector('input[name="inputType"]:checked').value;
        const dataTypeName = document.getElementById('vc_dataType').value;
        const isLittleEndian = document.querySelector('input[name="endianness"]:checked').value === 'little';
        const dataType = valueConverterDataTypes[dataTypeName];

        if (inputValue === '') {
            resultInput.value = 'Error: Input value is empty.';
            return;
        }

        let num;
        try {
            if (dataType.type === 'float') {
                num = parseFloat(inputValue);
                 if (isNaN(num)) throw new Error('Invalid float number');
            } else if (dataType.type === 'bigint') {
                num = BigInt(inputType === 'hex' ? '0x' + inputValue : inputValue);
            } else { // int
                num = BigInt(inputType === 'hex' ? '0x' + inputValue : inputValue);
            }
        } catch (e) {
            resultInput.value = `Error: Invalid ${inputType} value.`;
            return;
        }

        try {
            const buffer = new ArrayBuffer(dataType.size);
            const view = new DataView(buffer);
            
            // DataView expects a Number for non-BigInt setters
            const valueToSet = dataType.type.includes('bigint') ? num : Number(num);
            
            view[dataType.setter](0, valueToSet, isLittleEndian);

            const hexResult = Array.from(new Uint8Array(buffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
            
            resultInput.value = '0x' + hexResult.toUpperCase();

        } catch (e) {
            resultInput.value = `Error: ${e.message}. Value may be out of range.`;
        }
    });

    resultInput.addEventListener('click', () => {
        if (!resultInput.value || resultInput.value.startsWith('Error:')) return;
        
        navigator.clipboard.writeText(resultInput.value).then(() => {
            const originalValue = resultInput.value;
            resultInput.value = 'Copied!';
            resultInput.classList.add('copied-feedback');
            setTimeout(() => {
                resultInput.value = originalValue;
                resultInput.classList.remove('copied-feedback');
            }, 1000);
        });
    });
}

// --- INITIALIZATION ---

function init() {
    renderNavbar();
    renderFooter();
    router();
    window.addEventListener('hashchange', router);
}

init();
