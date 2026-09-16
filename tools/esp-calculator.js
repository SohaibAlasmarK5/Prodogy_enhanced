// ESP Calculator JavaScript

// Read URL parameters for data from Airflow Calculator
(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const sf = urlParams.get('sf');
    const af = urlParams.get('af');
    const p = urlParams.get('p');
    const room = urlParams.get('room');

    if (sf !== null || af !== null || p !== null || room !== null) {
        const dataBox = document.getElementById('airflowData');
        dataBox.style.display = 'block';

        if (sf !== null) {
            document.getElementById('displaySF').textContent = decodeURIComponent(sf);
        }

        if (af !== null) {
            const airflowValue = parseFloat(af);
            dataBox.dataset.rawAirflowM3h = airflowValue;
            // Convert m³/h to CFM for display
            const airflowCFM = airflowValue * 0.59;
            document.getElementById('displayAF').textContent = airflowCFM.toFixed(1) + ' CFM';

            // Pre-fill the airflow input
            setTimeout(() => {
                const flowValInput = document.getElementById('flowVal');
                const flowUnitSelect = document.getElementById('flowUnit');
                if (flowValInput && flowUnitSelect) {
                    flowUnitSelect.value = 'cfm';
                    flowValInput.value = airflowCFM.toFixed(2);
                    // Trigger calculation to update derived values
                    flowValInput.dispatchEvent(new Event('input'));
                }
            }, 100);
        }

        if (p !== null) {
            dataBox.dataset.rawPressure = parseFloat(p);
            document.getElementById('displayP').textContent = parseFloat(p).toFixed(1) + ' Pa';
        }

        if (room !== null) {
            dataBox.dataset.roomType = decodeURIComponent(room);
        }
    }
})();
document.getElementById('flowUnit').addEventListener('change', function () {
    const unit = this.value;
    const airflowInput = document.getElementById('flowVal'); // change to your actual input id

    if (unit === 'cfm') {
        // convert m³/h to CFM
        airflowInput.value = (parseFloat(airflowInput.value) / 1.699).toFixed(2);
    } else if (unit === 'm3h') {
        // convert CFM to m³/h
        airflowInput.value = (parseFloat(airflowInput.value) * 1.699).toFixed(2);
    }
});
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

// Technical specs for models reachable via the Airflow → ESP handoff
const FAN_TECH_SPECS = {
    'HS-100P': { airflow: 198, voltage: '220-240V-/50Hz', rpm: 2200, power: 26, amps: 0.12, noise: 31 },
    'HS-150P': { airflow: 530, voltage: '220-240V-/50Hz', rpm: 2550, power: 54, amps: 0.22, noise: 33 },
    'HS-200P': { airflow: 840, voltage: '220-240V-/50Hz', rpm: 2450, power: 128, amps: 0.53, noise: 63 },
    'HS-250P': { airflow: 1405, voltage: '220-240V-/50Hz', rpm: 2450, power: 225, amps: 1.20, noise: 66 },
    'HS-315P': { airflow: 2206, voltage: '220-240V-/50Hz', rpm: 2350, power: 390, amps: 1.90, noise: 69 },
    'MS-100M': { airflow: 310, voltage: '220-240V-/50Hz', rpm: 2350, power: 85, amps: 0.32, noise: 52 },
    'MS-150M': { airflow: 720, voltage: '220-240V-/50Hz', rpm: 2400, power: 105, amps: 0.45, noise: 53 },
    'MS-200M': { airflow: 1120, voltage: '220-240V-/50Hz', rpm: 2450, power: 160, amps: 0.72, noise: 60 },
    'MS-250M': { airflow: 1320, voltage: '220-240V-/50Hz', rpm: 2450, power: 182, amps: 0.83, noise: 62 },
    'MS-315M': { airflow: 1900, voltage: '220-240V-/50Hz', rpm: 2450, power: 260, amps: 0.84, noise: 65 }
};

// "MS-200M" -> "MS200" / "HS-100P" -> "HS100P" (matches keys in FAN_DATA)
function toFanDataKey(name) {
    let k = name.replace('-', '');
    if (k.startsWith('MS')) k = k.replace(/M$/, '');
    return k;
}

// Load a same-origin image and return a base64 data URL usable by jsPDF
function loadImageAsDataURL(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.getContext('2d').drawImage(img, 0, 0);

            try {
                resolve(canvas.toDataURL('image/png'));
            } catch (e) {
                reject(e);
            }
        };
        img.onerror = reject;
        img.src = src;
    });
}


// Catmull-Rom spline: turns sparse data points into a smooth curve
function smoothPoints(points, segments = 12) {
    if (points.length < 3) return points;
    const result = [];
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;
        for (let t = 0; t < segments; t++) {
            const tt = t / segments;
            const tt2 = tt * tt;
            const tt3 = tt2 * tt;
            const x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * tt + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * tt2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * tt3);
            const y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * tt + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * tt2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * tt3);
            result.push({ x, y });
        }
    }
    result.push(points[points.length - 1]);
    return result;
}

// Draws the pressure-vs-airflow curve directly with jsPDF vector calls (no chart library needed in the PDF)
function drawPerformanceChart(doc, x, y, w, h, points, maxX, maxY, selected) {
    const padL = 12, padB = 10, padT = 4, padR = 4;
    const plotX = x + padL, plotY = y + padT;
    const plotW = w - padL - padR, plotH = h - padT - padB;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.rect(plotX, plotY, plotW, plotH);

    doc.setFontSize(6);
    doc.setTextColor(130, 130, 130);
    for (let i = 0; i <= 4; i++) {
        const gy = plotY + (plotH * i / 4);
        doc.setDrawColor(230, 230, 230);
        doc.line(plotX, gy, plotX + plotW, gy);
        doc.text(String(Math.round(maxY - (maxY * i / 4))), plotX - 2, gy + 1, { align: 'right' });
    }
    for (let i = 0; i <= 4; i++) {
        const gx = plotX + (plotW * i / 4);
        doc.text(String(Math.round(maxX * i / 4)), gx, plotY + plotH + 4, { align: 'center' });
    }

    doc.setFontSize(6.5);
    doc.setTextColor(90, 90, 90);
    doc.text('Air volume (m³/h)', plotX + plotW / 2, plotY + plotH + 8, { align: 'center' });
    doc.text('Pa', plotX - 8, plotY - 1);

    const smooth = smoothPoints(points);

    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.6);
    for (let i = 0; i < smooth.length - 1; i++) {
        doc.line(
            plotX + (smooth[i].x / maxX) * plotW, plotY + plotH - (smooth[i].y / maxY) * plotH,
            plotX + (smooth[i + 1].x / maxX) * plotW, plotY + plotH - (smooth[i + 1].y / maxY) * plotH
        );
    }

    if (selected) {
        doc.setFillColor(30, 30, 30);
        doc.circle(plotX + (selected.x / maxX) * plotW, plotY + plotH - (selected.y / maxY) * plotH, 1.2, 'F');
    }
}

async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const fanName = document.getElementById('displaySF').textContent.trim();
    const airflow = document.getElementById('displayAF').textContent;
    const fanPressure = parseFloat(document.getElementById('displayP').textContent) || 0;
    const espTotal = parseFloat(E.breakdownTotal.textContent) || 0;
    const pressureAfterESP = Math.max(0, fanPressure - espTotal).toFixed(1);
    const dataBox = document.getElementById('airflowData');
    const rawAirflowM3h = parseFloat(dataBox.dataset.rawAirflowM3h) || 0;
    const roomType = dataBox.dataset.roomType || '';

    // Header
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Prodigy Ventilation Systems', 15, 13);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Fan Selection Report', 15, 23);
    doc.setFontSize(10);
    doc.text(new Date().toLocaleDateString(), 195, 23, { align: 'right' });

    // Selected Fan Data
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Selected Fan Data', 15, 45);
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.8);
    doc.line(15, 47, 195, 47);

    const rows = [
        ['Fan Name', fanName],
        ['Airflow', airflow],
        ['Fan Pressure', fanPressure.toFixed(1) + ' Pa'],
        ['Total ESP', espTotal.toFixed(1) + ' Pa'],
        ['Pressure After ESP Resistance', pressureAfterESP + ' Pa'],
    ];

    let y = 58;
    doc.setFontSize(11);
    rows.forEach(([label, value], i) => {
        if (i % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(15, y - 6, 180, 10, 'F');
        }
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(80, 80, 80);
        doc.text(label + ':', 18, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 30, 30);
        doc.text(value, 105, y);
        y += 14;
    });

    // ---- Technical Data — same page, directly below ----
    const spec = FAN_TECH_SPECS[fanName];
    if (spec) {
        const techTitleY = y + 12;
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Technical Data', 15, techTitleY);
        doc.setDrawColor(220, 38, 38);
        doc.setLineWidth(0.8);
        doc.line(15, techTitleY + 2, 195, techTitleY + 2);

        const cols = [
            { label: 'Model', w: 25 }, { label: 'Airflow (m³/h)', w: 30 },
            { label: 'Voltage (V-/Hz)', w: 40 }, { label: 'Speed (RPM)', w: 25 },
            { label: 'Input power (W)', w: 25 }, { label: 'AMPS (A)', w: 20 }, { label: 'Noise (dB)', w: 15 }
        ];
        const tableX = 15, tableY = techTitleY + 15;
        doc.setFillColor(230, 230, 230); doc.rect(tableX, tableY - 5, 180, 8, 'F');
        doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 30, 30);
        let cx = tableX + 2;
        cols.forEach(c => { doc.text(c.label, cx, tableY); cx += c.w; });

        const values = [fanName, spec.airflow, spec.voltage, spec.rpm, spec.power, spec.amps.toFixed(2), spec.noise];
        doc.setFillColor(245, 245, 245); doc.rect(tableX, tableY + 3, 180, 8, 'F');
        doc.setFont('helvetica', 'normal'); cx = tableX + 2;
        cols.forEach((c, i) => { doc.text(String(values[i]), cx, tableY + 8); cx += c.w; });

        const imgBoxY = tableY + 25;

        // IMAGE — fixed square, keeps original proportions
        try {
            const ext = fanName.toLowerCase().startsWith("ms") ? "PNG" : "JPG";

            const imgData = await loadImageAsDataURL(`../Media/${fanName}/1.${ext}`);
            const format = imgData.startsWith('data:image/png') ? 'PNG' : 'JPEG';

            // Square image area
            const imgX = 20;
            const imgY = imgBoxY;
            const imgSize = 55;

            doc.addImage(
                imgData,
                format,
                imgX,
                imgY,
                imgSize,
                imgSize,
                undefined,
                'FAST'
            );

        } catch (e) {
            console.error('Fan image failed to embed in PDF:', e);
        }

        doc.setFontSize(8); doc.setTextColor(90, 90, 90);
        doc.text(`Figure 1. ${fanName}`, 47.5, imgBoxY + 62, { align: 'center' });

        const fanCurve = (typeof FAN_DATA !== 'undefined') ? FAN_DATA[toFanDataKey(fanName)] : null;
        if (fanCurve) {
            try {
                const dataset = fanCurve.datasets[0];
                drawPerformanceChart(doc, 90, imgBoxY, 100, 60, dataset.data, fanCurve.maxX, fanCurve.maxY,
                    rawAirflowM3h ? { x: rawAirflowM3h, y: fanPressure } : null);
                doc.setFontSize(8);
                doc.setTextColor(90, 90, 90);
                doc.text(`Figure 2. Performance Curve ${fanName}`, 140, imgBoxY + 65, { align: 'center' });
            } catch (e) {
                console.error('Chart draw failed:', e);
            }
        }

        // Note: room usage line (only shown if a room type came through)
        if (roomType) {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(30, 30, 30);
            doc.text(`Note: Fan selected to use in ${roomType}`, 15, imgBoxY + 78);
        }
    }

    // Footer
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 280, 210, 17, 'F');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'normal');
    doc.text('Prodigy Ventilation Systems — info@prodigysystems.ae — +971 9 228 9674', 105, 290, { align: 'center' });

    doc.save(`Fan-Report-${fanName}.pdf`);
}