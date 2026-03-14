// ESP Calculator JavaScript

// Read URL parameters for data from Airflow Calculator
(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const sf = urlParams.get('sf');
    const af = urlParams.get('af');
    const p = urlParams.get('p');
    
    if (sf !== null || af !== null || p !== null) {
        const dataBox = document.getElementById('airflowData');
        dataBox.style.display = 'block';
        
        if (sf !== null) {
            document.getElementById('displaySF').textContent = parseFloat(sf).toFixed(0) + '%';
        }
        
        if (af !== null) {
            const airflowValue = parseFloat(af);
            document.getElementById('displayAF').textContent = airflowValue.toFixed(2) + ' m³/h';
            
            // Pre-fill the airflow input
            setTimeout(() => {
                const flowValInput = document.getElementById('flowVal');
                const flowUnitSelect = document.getElementById('flowUnit');
                if (flowValInput && flowUnitSelect) {
                    flowUnitSelect.value = 'm3h';
                    flowValInput.value = airflowValue.toFixed(2);
                    // Trigger calculation to update derived values
                    flowValInput.dispatchEvent(new Event('input'));
                }
            }, 100);
        }
        
        if (p !== null) {
            document.getElementById('displayP').textContent = parseFloat(p).toFixed(1) + ' Pa';
        }
    }
})();

// Friction Table Data
const frictionTable = [
    { D: 100, vals: [0.730, 1.507, 2.537, 3.813, 5.332, 7.092, 9.091, 11.327, 13.799] },
    { D: 150, vals: [0.436, 0.904, 1.525, 2.295, 3.213, 4.277, 5.486, 6.838, 8.335] },
    { D: 200, vals: [0.304, 0.631, 1.066, 1.606, 2.250, 2.997, 3.845, 4.794, 5.845] },
    { D: 250, vals: [0.230, 0.478, 0.809, 1.220, 1.709, 2.277, 2.923, 3.646, 4.445] },
    { D: 300, vals: [0.183, 0.382, 0.646, 0.975, 1.367, 1.822, 2.339, 2.918, 3.558] },
    { D: 350, vals: [0.151, 0.316, 0.535, 0.807, 1.132, 1.509, 1.938, 2.418, 2.949] },
    { D: 400, vals: [0.128, 0.268, 0.454, 0.686, 0.962, 1.283, 1.648, 2.056, 2.508] },
    { D: 450, vals: [0.111, 0.232, 0.393, 0.594, 0.834, 1.112, 1.428, 1.783, 2.175] },
    { D: 500, vals: [0.097, 0.204, 0.346, 0.523, 0.734, 0.979, 1.257, 1.569, 1.915] }
];

const velocities = [2, 3, 4, 5, 6, 7, 8, 9, 10];

const Kvalues = {
    GI_PI: { '90_short': 1.0, '90_long': 0.4, '45_short': 0.9, '45_long': 0.4 },
    flex: { '90_short': 1.3, '90_long': 0.6, '45_short': 1.1, '45_long': 0.5 }
};

// Elements
const E = {
    ductType: document.getElementById('ductType'),
    flexQual: document.getElementById('flexQual'),
    ductShape: document.getElementById('ductShape'),
    diaMm: document.getElementById('diaMm'),
    wMm: document.getElementById('wMm'),
    hMm: document.getElementById('hMm'),
    ductLen: document.getElementById('ductLen'),
    flowVal: document.getElementById('flowVal'),
    flowUnit: document.getElementById('flowUnit'),
    paPerM: document.getElementById('paPerM'),
    areaM2: document.getElementById('areaM2'),
    velMs: document.getElementById('velMs'),
    elbow90Type: document.getElementById('elbow90Type'),
    elbow90Qty: document.getElementById('elbow90Qty'),
    elbow90PaPer: document.getElementById('elbow90PaPer'),
    elbow45Type: document.getElementById('elbow45Type'),
    elbow45Qty: document.getElementById('elbow45Qty'),
    elbow45PaPer: document.getElementById('elbow45PaPer'),
    useElbow90: document.getElementById('useElbow90'),
    useElbow45: document.getElementById('useElbow45'),
    useFilter: document.getElementById('useFilter'),
    filterSelect: document.getElementById('filterSelect'),
    filterCustom: document.getElementById('filterCustom'),
    useDamper: document.getElementById('useDamper'),
    damperPa: document.getElementById('damperPa'),
    useOther: document.getElementById('useOther'),
    otherPa: document.getElementById('otherPa'),
    calcBtn: document.getElementById('calcBtn'),
    resetBtn: document.getElementById('resetBtn'),
    espResult: document.getElementById('espResult'),
    breakdownBody: document.getElementById('breakdownBody'),
    breakdownTotal: document.getElementById('breakdownTotal'),
    rowRoundSize: document.getElementById('rowRoundSize'),
    rowRectSize: document.getElementById('rowRectSize'),
    rowFlexQual: document.getElementById('rowFlexQual')
};

// Functions
function toM3s(value, unit) {
    const v = parseFloat(value) || 0;
    if (unit === 'm3h') return v / 3600;
    if (unit === 'cfm') return v * 0.00047194745;
    return v;
}

function areaFromShape() {
    if (E.ductShape.value === 'round') {
        const d = parseFloat(E.diaMm.value) || 0;
        return d > 0 ? Math.PI * (d / 1000 / 2) ** 2 : 0;
    } else {
        const w = parseFloat(E.wMm.value) || 0;
        const h = parseFloat(E.hMm.value) || 0;
        return (w > 0 && h > 0) ? (w / 1000) * (h / 1000) : 0;
    }
}

function hydraulicDiameter() {
    if (E.ductShape.value === 'round') return parseFloat(E.diaMm.value) || 0;
    const w = parseFloat(E.wMm.value) || 0;
    const h = parseFloat(E.hMm.value) || 0;
    return (2 * w * h) / (w + h);
}

function velocity(Q, A) {
    return A > 0 ? Q / A : 0;
}

function interpFriction(D, V) {
    let low = null, high = null;
    for (let i = 0; i < frictionTable.length; i++) {
        if (frictionTable[i].D === D) return frictionTable[i].vals[Math.min(Math.max(Math.round(V) - 2, 0), 8)];
        if (frictionTable[i].D < D) low = frictionTable[i];
        else if (frictionTable[i].D > D && !high) high = frictionTable[i];
    }
    if (!low) low = frictionTable[0];
    if (!high) high = frictionTable[frictionTable.length - 1];
    const vals = [];
    for (let j = 0; j < velocities.length; j++) {
        vals[j] = low.vals[j] + (high.vals[j] - low.vals[j]) * (D - low.D) / (high.D - low.D);
    }
    const idx = Math.min(Math.max(Math.round(V) - 2, 0), 8);
    return vals[idx];
}

function getElbowK(angle, type, ductType) {
    let key = type === 'without_vanes' ? 'short' : 'long';
    if (ductType === 'flex') return Kvalues.flex[`${angle}_${key}`] || 0;
    return Kvalues.GI_PI[`${angle}_${key}`] || 0;
}

function updateDerivedAndFriction() {
    const Qm3s = toM3s(E.flowVal.value, E.flowUnit.value);
    const A = areaFromShape();
    const V = velocity(Qm3s, A);
    E.areaM2.value = A ? A.toFixed(4) : '';
    E.velMs.value = V ? V.toFixed(2) : '';
    const Dh = hydraulicDiameter();
    let paPerM = interpFriction(Dh, V);

    if (E.ductType.value === 'flex') {
        const qualFactor = parseFloat(E.flexQual.value) || 2;
        paPerM *= qualFactor;
    }

    E.paPerM.value = paPerM ? paPerM.toFixed(2) : '0';

    const ductTypeKey = E.ductType.value === 'PI' || E.ductType.value === 'GI' ? 'GI_PI' : 'flex';
    const k90 = getElbowK('90', E.elbow90Type.value, ductTypeKey);
    const pa90 = k90 * 0.5 * 1.2 * V * V;
    E.elbow90PaPer.textContent = pa90.toFixed(1) + ' Pa';
    const k45 = getElbowK('45', E.elbow45Type.value, ductTypeKey);
    const pa45 = k45 * 0.5 * 1.2 * V * V;
    E.elbow45PaPer.textContent = pa45.toFixed(1) + ' Pa';
}

function calculateESP() {
    updateDerivedAndFriction();
    const L = parseFloat(E.ductLen.value) || 0;
    const friction = parseFloat(E.paPerM.value) || 0;
    const V = parseFloat(E.velMs.value) || 0;
    const ductTypeKey = E.ductType.value === 'PI' || E.ductType.value === 'GI' ? 'GI_PI' : 'flex';
    let breakdown = [];
    let totalESP = friction * L;
    
    breakdown.push({ 
        name: `Friction Loss (${L} m)`, 
        details: `${friction.toFixed(2)} Pa/m`, 
        loss: (friction * L).toFixed(1) 
    });
    
    if (E.useElbow90.checked) {
        const k = getElbowK('90', E.elbow90Type.value, ductTypeKey);
        const qty = parseFloat(E.elbow90Qty.value) || 0;
        const loss = (k * 0.5 * 1.2 * V * V) * qty;
        totalESP += loss;
        breakdown.push({ 
            name: '90° Elbow', 
            details: `Qty: ${qty}, Type: ${E.elbow90Type.value}`, 
            loss: loss.toFixed(1) 
        });
    }
    
    if (E.useElbow45.checked) {
        const k = getElbowK('45', E.elbow45Type.value, ductTypeKey);
        const qty = parseFloat(E.elbow45Qty.value) || 0;
        const loss = (k * 0.5 * 1.2 * V * V) * qty;
        totalESP += loss;
        breakdown.push({ 
            name: '45° Elbow', 
            details: `Qty: ${qty}, Type: ${E.elbow45Type.value}`, 
            loss: loss.toFixed(1) 
        });
    }
    
    if (E.useFilter.checked) {
        const fPa = parseFloat(E.filterCustom.value) || parseFloat(E.filterSelect.value) || 0;
        totalESP += fPa;
        breakdown.push({ 
            name: 'Filter', 
            details: `${fPa} Pa`, 
            loss: fPa.toFixed(1) 
        });
    }
    
    if (E.useDamper.checked) {
        const dPa = parseFloat(E.damperPa.value) || 0;
        totalESP += dPa;
        breakdown.push({ 
            name: 'Damper', 
            details: `${dPa} Pa`, 
            loss: dPa.toFixed(1) 
        });
    }
    
    if (E.useOther.checked) {
        const oPa = parseFloat(E.otherPa.value) || 0;
        totalESP += oPa;
        breakdown.push({ 
            name: 'Other', 
            details: `${oPa} Pa`, 
            loss: oPa.toFixed(1) 
        });
    }
    
    E.espResult.textContent = `ESP = ${totalESP.toFixed(1)} Pa`;
    E.breakdownBody.innerHTML = breakdown.map(b => 
        `<tr><td>${b.name}</td><td>${b.details}</td><td>${b.loss}</td></tr>`
    ).join('');
    E.breakdownTotal.textContent = totalESP.toFixed(1);
}

// Event Listeners
E.ductShape.addEventListener('change', () => {
    if (E.ductShape.value === 'round') {
        E.rowRoundSize.style.display = 'grid';
        E.rowRectSize.style.display = 'none';
    } else {
        E.rowRoundSize.style.display = 'none';
        E.rowRectSize.style.display = 'grid';
    }
    calculateESP();
});

E.ductType.addEventListener('change', () => {
    if (E.ductType.value === 'flex') {
        E.rowFlexQual.style.display = 'grid';
    } else {
        E.rowFlexQual.style.display = 'none';
    }
    calculateESP();
});

const allInputs = [
    E.diaMm, E.wMm, E.hMm, E.ductLen, E.flowVal, E.flowUnit, 
    E.ductType, E.ductShape, E.elbow90Type, E.elbow90Qty, 
    E.useElbow90, E.elbow45Type, E.elbow45Qty, E.useElbow45, 
    E.filterSelect, E.filterCustom, E.useFilter, E.damperPa, 
    E.useDamper, E.otherPa, E.useOther, E.flexQual
];

allInputs.forEach(el => {
    const eventType = el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input';
    el.addEventListener(eventType, calculateESP);
});

E.calcBtn.addEventListener('click', calculateESP);

E.resetBtn.addEventListener('click', () => {
    document.querySelectorAll('input').forEach(i => {
        if (i.type === 'number' || i.type === 'text') i.value = '';
        if (i.type === 'checkbox') i.checked = false;
    });
    document.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
    E.rowFlexQual.style.display = 'none';
    updateDerivedAndFriction();
    calculateESP();
});

// Initialize
calculateESP();