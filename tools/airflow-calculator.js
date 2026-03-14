// Airflow Calculator JavaScript

// Room ACH Data
const roomACH = {
    "Basements": [3, 4],
    "Bathrooms": [6, 7],
    "Bedrooms": [5, 6],
    "Kitchens": [7, 8],
    "Laundry": [8, 9],
    "Living": [6, 8],
    "Offices": [6, 8],
    "Conference": [8, 12],
    "Server": [10, 14],
    "Break": [7, 8],
    "Retail": [6, 10],
    "Restaurant": [8, 10],
    "CommercialKitchen": [14, 18],
    "PublicRestrooms": [10, 12],
    "Auditorium": [12, 14]
};

// Fan Data
const fansData = {
    hs: [
        { name: "HS-100P", data: [[0, 156], [50, 135], [100, 98], [125, 90], [150, 69], [175, 40], [198, 0]] },
        { name: "HS-150P", data: [[0, 300], [90, 200], [180, 180], [270, 165], [360, 135], [450, 55], [530, 0]] },
        { name: "HS-200P", data: [[0, 352], [100, 280], [200, 245], [300, 210], [400, 195], [500, 175], [600, 140], [700, 100], [840, 0]] },
        { name: "HS-250P", data: [[0, 488], [200, 420], [400, 355], [600, 300], [800, 255], [1200, 160], [1405, 0]] },
        { name: "HS-315P", data: [[0, 693], [220, 600], [440, 500], [660, 400], [880, 315], [1100, 275], [1320, 220], [1540, 180], [1760, 120], [1980, 50], [2206, 0]] }
    ],
    ms: [
        { name: "MS-100M", data: [[0, 315], [62, 295], [124, 270], [155, 250], [186, 224], [217, 180], [248, 125], [310, 0]] },
        { name: "MS-150M", data: [[0, 443], [112, 415], [224, 385], [336, 357], [448, 320], [560, 240], [672, 62], [720, 0]] },
        { name: "MS-200M", data: [[0, 580], [250, 555], [500, 500], [625, 455], [750, 400], [875, 315], [1000, 155], [1120, 0]] },
        { name: "MS-250M", data: [[0, 670], [250, 650], [500, 610], [750, 540], [1000, 440], [1125, 350], [1250, 225], [1320, 0]] },
        { name: "MS-315M", data: [[0, 700], [250, 685], [500, 655], [750, 635], [1000, 580], [1250, 520], [1500, 430], [1750, 275], [1900, 0]] }
    ]
};

// Fan Ranges
const fansRanges = {
    ms: [
        { name: "MS-100M", minCFM: 0, maxCFM: 160, minPa: 50 },
        { name: "MS-150M", minCFM: 161, maxCFM: 359, minPa: 160 },
        { name: "MS-200M", minCFM: 360, maxCFM: 500, minPa: 300 },
        { name: "MS-250M", minCFM: 501, maxCFM: 691, minPa: 300 },
        { name: "MS-315M", minCFM: 692, maxCFM: 1100, minPa: 300 }
    ],
    hs: [
        { name: "HS-100P", minCFM: 1, maxCFM: 100, minPa: 30 },
        { name: "HS-150P", minCFM: 101, maxCFM: 221, minPa: 120 },
        { name: "HS-200P", minCFM: 222, maxCFM: 336, minPa: 150 },
        { name: "HS-250P", minCFM: 337, maxCFM: 607, minPa: 200 },
        { name: "HS-315P", minCFM: 608, maxCFM: 1297, minPa: 200 }
    ]
};

let chart;

// Interpolation function
function interpolate(xArr, yArr, x) {
    for (let i = 0; i < xArr.length - 1; i++) {
        if (x >= xArr[i] && x <= xArr[i + 1]) {
            const slope = (yArr[i + 1] - yArr[i]) / (xArr[i + 1] - xArr[i]);
            return yArr[i] + slope * (x - xArr[i]);
        }
    }
    return 0;
}

// Select fan based on airflow
function selectFan(material, airflow_cfm) {
    const airflow_m3h = airflow_cfm * 1.699;
    const ranges = fansRanges[material];
    const fans = fansData[material];
    
    for (let fanRange of ranges) {
        if (airflow_cfm >= fanRange.minCFM && airflow_cfm <= fanRange.maxCFM) {
            const fanObj = fans.find(f => f.name === fanRange.name);
            const P = interpolate(
                fanObj.data.map(p => p[0]),
                fanObj.data.map(p => p[1]),
                airflow_m3h
            );
            
            if (P >= fanRange.minPa) {
                return { name: fanRange.name, pressure: P, airflow_m3h };
            }
        }
    }
    
    return { name: 'No suitable fan', pressure: 0, airflow_m3h };
}

// Calculate Airflow
function calculateAirflow() {
    const l = parseFloat(document.getElementById('length').value);
    const w = parseFloat(document.getElementById('width').value);
    const h = parseFloat(document.getElementById('height').value);
    const room = document.getElementById('room').value;
    const material = document.getElementById('material').value;
    const safetyFactor = parseFloat(document.getElementById('safetyFactor').value) || 0;
    
    if (isNaN(l) || isNaN(w) || isNaN(h)) {
        alert('Please enter valid dimensions.');
        return;
    }
    
    const volume = l * w * h;
    const ach = (roomACH[room][0] + roomACH[room][1]) / 2;
    let airflow_m3h = volume * ach;
    
    // Apply safety factor
    if (safetyFactor > 0) {
        airflow_m3h = airflow_m3h * (1 + safetyFactor / 100);
    }
    
    const airflow_cfm = airflow_m3h / 1.699;
    
    // Display results
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3 style="margin-bottom: 1rem;">Calculation Results</h3>
        <div class="result-value">Safety Factor: ${safetyFactor.toFixed(0)}%</div>
        <div class="result-value">Room Volume: ${volume.toFixed(2)} m³</div>
        <div class="result-value">Recommended ACH: ${ach.toFixed(1)}</div>
        <div class="result-value">Required Airflow: ${airflow_m3h.toFixed(2)} m³/h (${airflow_cfm.toFixed(1)} CFM)</div>
    `;
    
    document.getElementById('cfmInput').value = airflow_cfm.toFixed(1);
    document.getElementById('selector').style.display = 'block';
    
    renderChart(material, airflow_m3h);
}

// Render Chart
function renderChart(material, airflow_m3h) {
    const ctx = document.getElementById('fanChart').getContext('2d');
    if (chart) chart.destroy();
    
    const fans = fansData[material];
    const colors = ["#dc2626", "#ff7f0e", "#2ca02c", "#1f77b4", "#9467bd"];
    
    const datasets = fans.map((fan, i) => ({
        label: fan.name,
        data: fan.data.map(p => ({ x: p[0], y: p[1] })),
        borderColor: colors[i % colors.length],
        backgroundColor: 'transparent',
        borderWidth: 3,
        fill: false,
        tension: 0.3,
        pointRadius: 0
    }));

    const airflow_cfm = document.getElementById('customCheck').checked
        ? parseFloat(document.getElementById('customCFM').value) || airflow_m3h / 1.699
        : airflow_m3h / 1.699;
    
    const selected = selectFan(material, airflow_cfm);

    let selectedFanPoint = null;
    if (selected.name !== 'No suitable fan') {
        selectedFanPoint = { x: selected.airflow_m3h, y: selected.pressure };
    }
    
    if (selectedFanPoint) {
        datasets.push({
            label: "Selected Airflow",
            data: [selectedFanPoint],
            borderColor: "#000",
            pointBackgroundColor: "#000",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 8,
            showLine: false
        });
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: { datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            parsing: { xAxisKey: 'x', yAxisKey: 'y' },
            scales: {
                x: {
                    type: 'linear',
                    title: { display: true, text: 'Airflow (m³/h)', font: { size: 14, weight: 'bold' } },
                    min: 0,
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }
                },
                y: {
                    title: { display: true, text: 'Pressure (Pa)', font: { size: 14, weight: 'bold' } },
                    min: 0,
                    max: 700,
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 15, font: { size: 12 } }
                }
            }
        }
    });

    const fanInfo = document.getElementById('selectedFan');
    if (selectedFanPoint) {
        fanInfo.innerHTML = `
            <strong>Selected Fan:</strong> ${selected.name} &nbsp;&nbsp;&nbsp;&nbsp;
            <strong>Airflow:</strong> ${(selectedFanPoint.x / 1.699).toFixed(1)} CFM &nbsp;&nbsp;&nbsp;&nbsp;
            <strong>Pressure:</strong> ${selectedFanPoint.y.toFixed(1)} Pa
        `;
    } else {
        fanInfo.innerHTML = 'No suitable fan found for this airflow';
    }
}

// Update chart when material changes
function updateChart() {
    const material = document.getElementById('material').value;
    const cfmInput = document.getElementById('cfmInput').value;
    
    if (cfmInput) {
        const airflow_m3h = parseFloat(cfmInput) * 1.699;
        renderChart(material, airflow_m3h);
    }
}

// Event Listeners
document.getElementById('material').addEventListener('change', updateChart);

document.getElementById('customCheck').addEventListener('change', function () {
    const customCFMGroup = document.getElementById('customCFMGroup');
    const customCFM = document.getElementById('customCFM');
    
    if (this.checked) {
        customCFMGroup.style.display = 'block';
        customCFM.disabled = false;
    } else {
        customCFMGroup.style.display = 'none';
        customCFM.disabled = true;
    }
    
    updateChart();
});

document.getElementById('customCFM').addEventListener('input', updateChart);

// Send data to ESP Calculator
function sendToESP() {
    const safetyFactor = parseFloat(document.getElementById('safetyFactor').value) || 0;
    const cfmInput = document.getElementById('cfmInput').value;
    const fanInfoText = document.getElementById('selectedFan').innerHTML;
    
    // Extract pressure from the fan info
    let pressure = 0;
    const pressureMatch = fanInfoText.match(/Pressure:<\/strong>\s*([\d.]+)\s*Pa/);
    if (pressureMatch) {
        pressure = parseFloat(pressureMatch[1]);
    }
    
    if (!cfmInput) {
        alert('Please calculate airflow first before sending to ESP Calculator.');
        return;
    }
    
    // Convert CFM to m³/h for ESP calculator
    const airflow_m3h = parseFloat(cfmInput) * 1.699;
    
    // Build URL with parameters
    const url = `esp-calculator.html?sf=${safetyFactor}&af=${airflow_m3h.toFixed(2)}&p=${pressure.toFixed(1)}`;
    window.location.href = url;
}