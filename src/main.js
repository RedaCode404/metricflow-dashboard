import Chart from 'chart.js/auto';

// 1. État global de l'application
const state = {
  logs: [],
  filter: 'ALL',
  theme: localStorage.getItem('theme') || 'dark',
};

// 2. Initialisation du graphique Chart.js
const ctx = document.getElementById('latencyChart').getContext('2d');
const latencyChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Latence (ms)',
        data: [],
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        tension: 0.2,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, beginAtZero: true },
    },
    plugins: {
      legend: { display: false },
    },
  },
});

// 3. Simulation réseau asynchrone (Promesse + async/await)
async function simulateNetworkRequest() {
  const endpoints = ['/api/auth', '/api/users', '/api/orders', '/api/products'];
  const methods = ['GET', 'POST', 'PUT'];

  // Simulation d'un délai réseau réaliste
  await new Promise((resolve) => setTimeout(resolve, 200));

  const status = Math.random() > 0.12 ? 200 : 503;
  const latency = Math.floor(Math.random() * 280) + 20;

  return {
    id: crypto.randomUUID(),
    time: new Date().toLocaleTimeString(),
    method: methods[Math.floor(Math.random() * methods.length)],
    endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
    status: status,
    latency: latency,
  };
}

// 4. Calcul et affichage des indicateurs KPI
function updateKPIs() {
  const total = state.logs.length;
  if (total === 0) return;

  const successCount = state.logs.filter((log) => log.status === 200).length;
  const uptime = ((successCount / total) * 100).toFixed(1);
  const avgLatency = Math.round(
    state.logs.reduce((sum, log) => sum + log.latency, 0) / total
  );

  document.getElementById('kpi-uptime').textContent = `${uptime}%`;
  document.getElementById('kpi-total').textContent = total.toString();
  document.getElementById('kpi-latency').textContent = `${avgLatency} ms`;

  const statusElem = document.getElementById('latency-status');
  if (avgLatency < 120) {
    statusElem.textContent = 'Performance nominale';
    statusElem.style.color = 'var(--success)';
  } else {
    statusElem.textContent = 'Latence élevée';
    statusElem.style.color = 'var(--warning)';
  }
}

// 5. Rendu du tableau des requêtes (DOM natif)
function renderTable() {
  const tbody = document.getElementById('logs-body');

  const filtered = state.logs.filter((log) => {
    if (state.filter === '200') return log.status === 200;
    if (state.filter === 'ERROR') return log.status !== 200;
    return true;
  });

  tbody.innerHTML = filtered
    .slice(0, 8)
    .map((log) => {
      const isOk = log.status === 200;
      return `
        <tr>
          <td>${log.time}</td>
          <td><strong>${log.method}</strong></td>
          <td><code>${log.endpoint}</code></td>
          <td><span class="tag ${isOk ? 'tag-200' : 'tag-error'}">${log.status}</span></td>
          <td>${log.latency} ms</td>
        </tr>
      `;
    })
    .join('');
}

// 6. Mise à jour de la courbe
function updateChart() {
  const slice = state.logs.slice(0, 15).reverse();
  latencyChart.data.labels = slice.map((l) => l.time);
  latencyChart.data.datasets[0].data = slice.map((l) => l.latency);
  latencyChart.update('none');
}

// 7. Cycle de vie des données
async function triggerTick() {
  const entry = await simulateNetworkRequest();
  state.logs.unshift(entry);

  if (state.logs.length > 40) {
    state.logs.pop();
  }

  updateKPIs();
  renderTable();
  updateChart();
}

// 8. Écouteurs d'événements
document.getElementById('btn-refresh').addEventListener('click', () => {
  triggerTick();
});

document.getElementById('filter-status').addEventListener('change', (e) => {
  state.filter = e.target.value;
  renderTable();
});

const themeBtn = document.getElementById('btn-theme');
themeBtn.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('theme', state.theme);
});

// Démarrage initial
document.documentElement.setAttribute('data-theme', state.theme);

for (let i = 0; i < 5; i++) {
  triggerTick();
}

// Simulation continue toutes les 3,5 secondes
setInterval(triggerTick, 3500);