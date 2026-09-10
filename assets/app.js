const STORAGE = {
  session: "rastropet_session_v2",
  user: "rastropet_user_v2",
  animals: "rastropet_animals_v2",
};

const BLE_SERVICE_UUID = "7d5a1000-7d5a-4d8a-9f5d-4c9a6f5a1000";
const BLE_TELEMETRY_UUID = "7d5a1001-7d5a-4d8a-9f5d-4c9a6f5a1000";
const DEFAULT_CENTER = [-23.5614, -46.6562];
const MAX_SIGNAL_AGE_MS = 5 * 60 * 1000;
const MAX_OFFLINE_AGE_MS = 20 * 60 * 1000;

const DEFAULT_USER = {
  id: "usr-demo",
  name: "Marina Alves",
  email: "demo@rastropet.com",
  password: "rastropet",
};

const DEFAULT_ANIMALS = [
  { id: "pet-luna", name: "Luna" },
  { id: "pet-tobias", name: "Tobias" },
];

let animals = loadAnimals();
let user = loadUser();
let toast = null;
let toastTimer = null;
let activeMap = null;
let activeDetailId = null;
let activeConnection = null;
let modalOpen = false;

const app = document.querySelector("#app");

function icon(name, size = 18) {
  const paths = {
    paw: '<path d="M7.4 9.3c-1.5.2-2.7-.9-2.7-2.4S5.6 4.2 7 4.1c1.4-.1 2.3 1.1 2.4 2.4.1 1.3-.7 2.6-2 2.8Zm7.2 0c1.5.2 2.7-.9 2.7-2.4s-.9-2.7-2.3-2.8c-1.4-.1-2.3 1.1-2.4 2.4-.1 1.3.7 2.6 2 2.8ZM10.3 4.8c1.2.1 2.2-.9 2.2-2.2S11.6.4 10.4.4 8.2 1.4 8.2 2.7s.9 2 2.1 2.1Zm1.3 5.3c-1.1-.7-2.2-.7-3.3 0-1.1.7-3.3 2.9-3.3 4.8 0 1.2 1 2.2 2.2 2.2 1.2 0 2-1 2.8-1 1 0 1.6 1 2.8 1 1.2 0 2.2-1 2.2-2.2-.1-1.9-2.3-4.1-3.4-4.8Z"/>',
    map: '<path d="m9 18-6-3V3l6 3 6-3 6 3v12l-6 3-6-3Z"/><path d="M9 6v12M15 3v15"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.1.1l1.4-1.4a5 5 0 0 0-7.1-7.1L10.6 5.4"/><path d="M14 11a5 5 0 0 0-7.1-.1l-1.4 1.4a5 5 0 0 0 7.1 7.1l.8-.8"/>',
    bluetooth: '<path d="m8 5 8 7-8 7V5Zm0 0 6 5m-6 9 6-5"/>',
    usb: '<path d="M12 3v13m0-13 3 3m-3-3-3 3M12 16l-3 3m3-3 3 3M12 8H7a2 2 0 1 0 0 4h2m3-4h5a2 2 0 1 1 0 4h-2"/>',
    settings:
      '<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="m19.4 15 .1.1a2 2 0 1 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4v.3a2 2 0 1 1-4 0v-.2A2 2 0 0 0 5.8 18l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A2 2 0 0 0 1.6 12a2 2 0 1 1 0-4h.2A2 2 0 0 0 3 4.6l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A2 2 0 0 0 9.2.4V.2a2 2 0 1 1 4 0v.2A2 2 0 0 0 16.6 2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A2 2 0 0 0 20.8 8h.2a2 2 0 1 1 0 4h-.2a2 2 0 0 0-1.4 3Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    back: '<path d="m15 18-6-6 6-6"/><path d="M9 12h10"/>',
    locate:
      '<circle cx="12" cy="12" r="7"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/><circle cx="12" cy="12" r="2"/>',
    battery:
      '<rect width="16" height="10" x="3" y="7" rx="2"/><path d="M21 10v4"/><path d="M6 10h5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    shield:
      '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
    refresh:
      '<path d="M20 11a8 8 0 0 0-14.8-3.7L3 10m0-5v5h5M4 13a8 8 0 0 0 14.8 3.7L21 14m0 5v-5h-5"/>',
    logout:
      '<path d="M10 17l5-5-5-5m5 5H3"/><path d="M14 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>',
    trash: '<path d="M4 7h16m-10 4v6m4-6v6M9 7V4h6v3m-9 0 1 13h10l1-13"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.info}</svg>`;
}

function escapeHTML(value) {
  return String(value ?? "").replace(
    /[&<>'"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        char
      ],
  );
}

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE.user)) || DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}

function normalizeAnimal(raw, index) {
  const oldDemo = raw.connectionType === "simulado" || raw.source === "demo";
  const hasTelemetry =
    raw.updatedAt !== undefined ||
    raw.latitude !== undefined ||
    raw.longitude !== undefined;
  return {
    id: String(raw.id || `pet-${index}-${Date.now()}`),
    name: String(raw.name || `Animal ${index + 1}`),
    latitude: oldDemo || !hasTelemetry ? null : numberOrNull(raw.latitude),
    longitude: oldDemo || !hasTelemetry ? null : numberOrNull(raw.longitude),
    accuracy: oldDemo || !hasTelemetry ? null : numberOrNull(raw.accuracy),
    battery: oldDemo || !hasTelemetry ? null : batteryOrNull(raw.battery),
    updatedAt: oldDemo || !hasTelemetry ? null : timestampOrNull(raw.updatedAt),
    trackerId: oldDemo ? null : raw.trackerId || null,
    deviceId: oldDemo ? null : raw.deviceId || null,
    deviceName: oldDemo ? null : raw.deviceName || null,
    connectionType: oldDemo ? null : raw.connectionType || null,
    connectionState: oldDemo
      ? "disconnected"
      : raw.connectionState || "disconnected",
  };
}

function loadAnimals() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE.animals));
    if (Array.isArray(saved)) return saved.map(normalizeAnimal);
  } catch {
    // A corrupted local record is safely replaced below.
  }
  return DEFAULT_ANIMALS.map(normalizeAnimal);
}

function saveAnimals() {
  localStorage.setItem(STORAGE.animals, JSON.stringify(animals));
}

function saveUser() {
  localStorage.setItem(STORAGE.user, JSON.stringify(user));
}

function numberOrNull(value) {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function batteryOrNull(value) {
  const number = numberOrNull(value);
  return number === null
    ? null
    : Math.min(100, Math.max(0, Math.round(number)));
}

function timestampOrNull(value) {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  if (Number.isFinite(number)) return number < 1e12 ? number * 1000 : number;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : null;
}

function hasLocation(animal) {
  return Number.isFinite(animal.latitude) && Number.isFinite(animal.longitude);
}

function signalState(animal) {
  if (!animal.updatedAt && !hasLocation(animal)) return "waiting";
  if (
    animal.connectionState === "disconnected" &&
    ["Bluetooth", "Arduino USB"].includes(animal.connectionType) &&
    !activeConnectionFor(animal.id)
  )
    return "offline";
  const age = animal.updatedAt ? Date.now() - animal.updatedAt : Infinity;
  if (age > MAX_OFFLINE_AGE_MS) return "offline";
  if (age > MAX_SIGNAL_AGE_MS) return "stale";
  return "online";
}

function signalLabel(animal) {
  return {
    online: "Sinal recebido",
    stale: "Sinal desatualizado",
    waiting: "Aguardando sinal",
    offline: "Sem sinal",
  }[signalState(animal)];
}

function statusClass(animal) {
  return `status-${signalState(animal)}`;
}

function connectionLabel(animal) {
  if (
    activeConnectionFor(animal.id)?.type === "bluetooth" ||
    animal.connectionType === "Bluetooth"
  )
    return "Bluetooth";
  if (
    activeConnectionFor(animal.id)?.type === "serial" ||
    animal.connectionType === "Arduino USB"
  )
    return "Arduino USB";
  return "Sem dispositivo";
}

function lastSeenLabel(animal) {
  if (!animal.updatedAt)
    return signalState(animal) === "offline"
      ? "Sem conexão"
      : "Aguardando primeiro sinal";
  const diff = Math.max(0, Date.now() - animal.updatedAt);
  if (diff < 60_000) return "Atualizado agora";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `Atualizado há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Atualizado há ${hours} h`;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(animal.updatedAt);
}

function exactDateLabel(animal) {
  return animal.updatedAt
    ? new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(animal.updatedAt)
    : "Ainda não recebido";
}

function formatCoordinates(animal) {
  return hasLocation(animal)
    ? `${animal.latitude.toFixed(5)}°, ${animal.longitude.toFixed(5)}°`
    : "Sem coordenadas";
}

function currentSession() {
  return localStorage.getItem(STORAGE.session) === "1";
}

function showToast(message, tone = "info") {
  toast = { message, tone };
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast = null;
    render();
  }, 6000);
  render();
}

function clearToast() {
  toast = null;
  clearTimeout(toastTimer);
  render();
}

function navigate(hash) {
  window.location.hash = hash;
}

function route() {
  const raw = window.location.hash.replace(/^#/, "") || "/painel";
  const parts = raw.split("/").filter(Boolean);
  if (parts[0] === "animal" && parts[1])
    return { page: "detail", id: decodeURIComponent(parts[1]) };
  if (parts[0] === "configuracoes") return { page: "settings" };
  return { page: "dashboard" };
}

function updateAnimal(id, patch) {
  animals = animals.map((animal) =>
    animal.id === id ? { ...animal, ...patch } : animal,
  );
  saveAnimals();
}

function activeConnectionFor(id) {
  return activeConnection?.animalId === id ? activeConnection : null;
}

function renderStatusPill(animal) {
  return `<span class="status-pill ${statusClass(animal)}">${signalLabel(animal)}</span>`;
}

function renderToast() {
  if (!toast) return "";
  return `<div class="toast ${toast.tone}" role="status">
    ${icon(toast.tone === "error" ? "info" : toast.tone === "success" ? "shield" : "info", 17)}
    <span>${escapeHTML(toast.message)}</span>
    <button class="toast-close" data-action="dismiss-toast" aria-label="Fechar">${icon("close", 15)}</button>
  </div>`;
}

function renderSidebar(active) {
  const firstName = escapeHTML(user.name.split(" ")[0]);
  const initials = escapeHTML(
    user.name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),
  );
  return `<aside class="sidebar">
    <a class="brand" href="#/painel" aria-label="RastroPet">
      <span class="brand-mark">${icon("paw", 21)}</span>
      <span class="brand-name">rastro<span>pet</span></span>
    </a>
    <p class="sidebar-caption">monitoramento</p>
    <nav class="nav" aria-label="Navegação principal">
      <a class="nav-link ${active === "dashboard" ? "active" : ""}" href="#/painel">${icon("map", 17)} Visão geral</a>
      <a class="nav-link ${active === "settings" ? "active" : ""}" href="#/configuracoes">${icon("settings", 17)} Configurações</a>
    </nav>
    <div class="sidebar-bottom">
      <div class="connection-mini"><span class="dot"></span><span><strong>Sistema local ativo</strong><br>Os dados ficam salvos neste dispositivo.</span></div>
      <div class="sidebar-user">
        <span class="avatar">${initials}</span>
        <span class="user-copy"><strong>${firstName}</strong><span>${escapeHTML(user.email)}</span></span>
        <button class="icon-button" data-action="logout" title="Sair">${icon("logout", 15)}</button>
      </div>
    </div>
  </aside>`;
}

function renderTopbar() {
  return `<header class="topbar"><div class="mobile-brand"><span class="brand-mark">${icon("paw", 17)}</span><span class="brand-name">rastro<span>pet</span></span></div><span class="topbar-spacer"></span><span class="system-state"><span class="dot"></span> armazenamento local protegido</span></header>`;
}

function renderShell(active, content) {
  return `<div class="app-shell">${renderSidebar(active)}<div class="main">${renderTopbar()}<main class="page">${content}</main></div></div>${renderToast()}${modalOpen ? renderConnectionModal() : ""}`;
}

function renderDashboard() {
  const online = animals.filter(
    (animal) => signalState(animal) === "online",
  ).length;
  const attention = animals.filter((animal) =>
    ["waiting", "stale", "offline"].includes(signalState(animal)),
  ).length;
  const located = animals.filter(hasLocation);
  const selectedId = located[0]?.id || animals[0]?.id || "";
  return renderShell(
    "dashboard",
    `<div class="hero">
    <div><p class="eyebrow">visão geral</p><h1>Seus animais,<br>sob cuidado.</h1><p class="subtitle">Acompanhe dados reais da coleira, sem posições demonstrativas.</p></div>
    <div class="hero-actions"><button class="button button-primary" data-action="focus-add">${icon("plus", 16)} Adicionar animal</button>${located.length ? `<button class="button button-quiet" data-action="refresh-map">${icon("refresh", 15)} Atualizar mapa</button>` : ""}</div>
  </div>
  <div class="stats">
    <div class="stat-card"><div class="stat-head"><span>animais</span><span class="stat-icon">${icon("paw", 16)}</span></div><div class="stat-value">${animals.length}</div><div class="stat-note">cadastrados no seu espaço</div></div>
    <div class="stat-card"><div class="stat-head"><span>com sinal</span><span class="stat-icon green">${icon("shield", 16)}</span></div><div class="stat-value">${online}</div><div class="stat-note">telemetria nos últimos 5 minutos</div></div>
    <div class="stat-card"><div class="stat-head"><span>atenção</span><span class="stat-icon amber">${icon("info", 16)}</span></div><div class="stat-value">${attention}</div><div class="stat-note">sem sinal ou desatualizados</div></div>
  </div>
  <div class="dashboard-grid">
    <section class="map-card">
      <div class="map-card-header"><div><div class="map-title"><span class="status-dot ${located.length ? "" : "amber"}"></span> localizações das coleiras</div><p class="map-subtitle">Mapa real · atualiza quando chega uma mensagem válida</p></div><select id="dashboard-animal-select" class="map-select" aria-label="Animal no mapa">${animals.length ? animals.map((animal) => `<option value="${escapeHTML(animal.id)}" ${animal.id === selectedId ? "selected" : ""}>${escapeHTML(animal.name)}${hasLocation(animal) ? "" : " · sem sinal"}</option>`).join("") : "<option>Nenhum animal</option>"}</select></div>
      <div class="map-frame"><div id="dashboard-map" class="leaflet-map"></div>${located.length ? "" : `<div class="map-empty"><strong>${animals.length ? "Aguardando a primeira localização" : "Adicione um animal para começar"}</strong><span>${animals.length ? "Conecte uma coleira e receba um pacote de telemetria para aparecer no mapa." : "O mapa será ativado assim que você cadastrar seu primeiro animal."}</span></div>`}<div class="map-footer"><div><div class="map-footer-label">animal selecionado</div><div id="dashboard-map-coordinates" class="map-coordinates">${formatCoordinates(animals.find((animal) => animal.id === selectedId) || {})}</div></div><span class="map-link">${located.length ? "OpenStreetMap · mapa real" : "sem posição recebida"}</span></div></div>
    </section>
    <aside class="side-stack">
      <section class="panel soft" id="add-animal"><div class="panel-heading"><span class="panel-heading-icon">${icon("plus", 18)}</span><div><h2>Adicionar animal</h2><p>Cadastre o nome e conecte a coleira depois.</p></div></div><form id="add-animal-form"><label class="field-label" for="animal-name">Nome do animal</label><input id="animal-name" class="text-input" placeholder="Ex.: Mel" autocomplete="off" required><button class="button button-dark" style="width:100%;margin-top:11px" type="submit">${icon("plus", 15)} Adicionar ao grupo</button></form></section>
      <section class="panel"><div class="panel-heading"><span class="panel-heading-icon green">${icon("link", 18)}</span><div><h2>Protocolo conectado</h2><p>O app aceita o mesmo pacote no Bluetooth e no Arduino USB.</p></div></div><div class="protocol-list"><div class="protocol-row"><span>formato</span><strong>JSON UTF-8</strong></div><div class="protocol-row"><span>campos mínimos</span><strong>id · lat · lon</strong></div><div class="protocol-row"><span>atualização</span><strong>push / notificação</strong></div></div><button class="button button-quiet button-small" style="margin-top:15px;width:100%" data-action="open-settings">Ver protocolo completo ${icon("arrow", 14)}</button></section>
    </aside>
  </div>
  <div class="section-heading"><div><h2>Seu grupo</h2><p>Selecione um animal para acompanhar sua coleira.</p></div><span class="count">${animals.length} ${animals.length === 1 ? "animal" : "animais"}</span></div>
  ${animals.length ? `<div class="animal-grid">${animals.map(renderAnimalCard).join("")}</div>` : '<div class="empty-state"><strong>O grupo está vazio</strong><p>Adicione seu primeiro animal para começar a receber localização.</p></div>'}`,
  );
}

function renderAnimalCard(animal) {
  return `<a class="animal-card" href="#/animal/${encodeURIComponent(animal.id)}" data-animal-card="${escapeHTML(animal.id)}"><div class="animal-card-top"><span class="animal-avatar">${icon("paw", 22)}</span>${renderStatusPill(animal)}</div><div class="animal-main"><h3>${escapeHTML(animal.name)}</h3><p>${escapeHTML(lastSeenLabel(animal))}</p></div><div class="animal-card-bottom"><span class="battery ${animal.battery !== null && animal.battery < 35 ? "low" : ""}">${icon("battery", 14)} ${animal.battery === null ? "—" : `${animal.battery}%`}</span><span class="connection-type">${escapeHTML(connectionLabel(animal))}</span></div></a>`;
}

function renderDetail(id) {
  const animal = animals.find((item) => item.id === id);
  if (!animal)
    return renderShell(
      "dashboard",
      `<div class="empty-state"><strong>Animal não encontrado</strong><p>Esse cadastro pode ter sido removido.</p><button class="button button-primary" style="margin-top:18px" data-action="back-dashboard">Voltar ao painel</button></div>`,
    );
  activeDetailId = id;
  const signal = signalState(animal);
  const current = activeConnectionFor(id);
  const isConnected = Boolean(current);
  const statusDot =
    signal === "online" ? "" : signal === "stale" ? "amber" : "red";
  return renderShell(
    "dashboard",
    `<button class="detail-back" data-action="back-dashboard">${icon("back", 16)} Voltar para visão geral</button><div class="detail-header"><div><p class="eyebrow">acompanhamento individual</p><h1>${escapeHTML(animal.name)}</h1><p class="subtitle">A localização abaixo só muda quando a coleira envia telemetria válida.</p></div>${renderStatusPill(animal)}</div>
    <div class="detail-grid"><section class="detail-map-card"><div class="map-card-header"><div><div class="map-title"><span class="status-dot ${statusDot}"></span> ${escapeHTML(signalLabel(animal))}</div><p class="map-subtitle">${escapeHTML(exactDateLabel(animal))}</p></div><button class="button button-quiet button-small" data-action="center-detail">${icon("locate", 14)} Centralizar</button></div><div class="map-frame"><div id="detail-map" class="leaflet-map"></div>${hasLocation(animal) ? "" : `<div class="map-empty"><strong>${signal === "offline" ? "Sinal ausente" : "Aguardando sinal"}</strong><span>${signal === "offline" ? "Reconecte a coleira para receber uma nova posição." : "A conexão está pronta, mas ainda não chegou um pacote GPS."}</span></div>`}<div class="map-footer"><div><div class="map-footer-label">última coordenada válida</div><div class="map-coordinates">${formatCoordinates(animal)}</div></div>${hasLocation(animal) ? `<a class="map-link" href="https://www.openstreetmap.org/?mlat=${animal.latitude}&mlon=${animal.longitude}#map=17/${animal.latitude}/${animal.longitude}" target="_blank" rel="noreferrer">Abrir no mapa ${icon("arrow", 13)}</a>` : '<span class="map-link">nenhuma recebida</span>'}</div></div></section>
      <aside class="detail-sidebar"><section class="info-card"><div class="info-kicker">última atualização</div><div class="last-seen"><span class="info-icon">${icon("clock", 19)}</span><div><strong>${escapeHTML(lastSeenLabel(animal))}</strong><span>${escapeHTML(exactDateLabel(animal))}</span></div></div><div class="info-divider"><span>bateria</span><strong class="${animal.battery !== null && animal.battery < 35 ? "low" : ""}">${animal.battery === null ? "—" : `${animal.battery}%`}</strong></div>${animal.accuracy !== null ? `<div class="info-divider"><span>precisão estimada</span><strong>${Math.round(animal.accuracy)} m</strong></div>` : ""}</section>
      <section class="info-card connection-card"><div class="info-kicker">conexão</div><h2>${isConnected ? `Via ${escapeHTML(connectionLabel(animal))}` : "Nenhum dispositivo ativo"}</h2><p>${isConnected ? `Dispositivo ${escapeHTML(animal.deviceName || "reconhecido")} conectado. O app está ouvindo notificações.` : signal === "waiting" ? "Escolha Bluetooth ou Arduino USB para começar a receber dados reais." : "O dispositivo não está conectado. A última posição continua visível, mas pode ficar desatualizada."}</p>${animal.trackerId ? `<span class="source-badge">coleira: ${escapeHTML(animal.trackerId)}</span>` : ""}<div class="connection-actions">${isConnected ? `<button class="button button-danger" data-action="disconnect">${icon("link", 15)} Desconectar dispositivo</button>` : `<button class="button button-primary" data-action="open-connect">${icon("link", 15)} Conectar coleira</button>`}</div></section>
      <section class="info-card"><div class="info-kicker">protocolo</div><h2 style="margin-top:7px">Validar uma mensagem</h2><p style="margin-top:8px">Teste o mesmo formato usado pelo hardware, sem inventar uma posição no mapa.</p><form id="manual-packet-form"><textarea id="manual-packet" class="text-area" spellcheck="false">${escapeHTML(JSON.stringify({ trackerId: animal.trackerId || "coleira-exemplo", latitude: -23.5614, longitude: -46.6562, battery: 82, timestamp: new Date().toISOString(), accuracy: 12 }, null, 2))}</textarea><button class="button button-quiet" style="width:100%;margin-top:9px" type="submit">${icon("shield", 15)} Validar e aplicar pacote</button></form><details class="details"><summary>Como o hardware deve enviar</summary><p>Bluetooth: notificação na característica GATT definida. Arduino: uma linha JSON por mensagem na porta serial a 9600 baud.</p><code class="code-chip">{"trackerId":"coleira-01","latitude":-23.56,"longitude":-46.65,"battery":82,"timestamp":"2026-09-10T16:00:00Z"}</code></details></section></aside>
    </div>`,
  );
}

function renderSettings() {
  const bluetooth = "bluetooth" in navigator;
  const serial = "serial" in navigator;
  return renderShell(
    "settings",
    `<div class="hero"><div><p class="eyebrow">preferências</p><h1>Configurações</h1><p class="subtitle">Confira o protocolo, o suporte do navegador e os dados deste dispositivo.</p></div></div>
    <div class="settings-grid"><div class="settings-stack"><section class="settings-card"><div class="card-head"><span class="card-head-icon">${icon("user", 18)}</span><div><h2>Dados da conta</h2><p>Esta versão não envia seus dados para um servidor.</p></div></div><form id="account-form" class="settings-form"><div><label class="field-label" for="settings-name">nome</label><input class="text-input" id="settings-name" value="${escapeHTML(user.name)}" required></div><div><label class="field-label" for="settings-email">e-mail</label><input class="text-input" id="settings-email" type="email" value="${escapeHTML(user.email)}" required></div><button class="button button-primary" type="submit">Salvar dados</button></form></section><section class="settings-card"><div class="card-head"><span class="card-head-icon">${icon("link", 18)}</span><div><h2>Contrato de telemetria</h2><p>Um contrato único para Bluetooth GATT e Arduino USB.</p></div></div><div class="protocol-list" style="margin-top:18px"><div class="protocol-row"><span>serviço GATT</span><strong>${BLE_SERVICE_UUID}</strong></div><div class="protocol-row"><span>característica</span><strong>${BLE_TELEMETRY_UUID}</strong></div><div class="protocol-row"><span>serial</span><strong>9600 baud · UTF-8</strong></div><div class="protocol-row"><span>framing</span><strong>1 JSON por linha/notificação</strong></div></div><code class="code-chip" style="margin-top:16px">{"trackerId":"coleira-01","latitude":-23.5614,"longitude":-46.6562,"battery":82,"timestamp":"2026-09-10T16:00:00Z","accuracy":12}</code><p style="margin-top:11px">Campos obrigatórios: <strong>latitude</strong> entre -90 e 90 e <strong>longitude</strong> entre -180 e 180. O identificador opcional <strong>trackerId</strong> fica associado ao animal no primeiro pacote.</p></section></div><aside class="settings-stack"><section class="settings-card"><div class="card-head"><span class="card-head-icon">${icon("shield", 18)}</span><div><h2>Compatibilidade</h2><p>O acesso ao hardware depende do navegador e de HTTPS.</p></div></div><div class="support-list"><div class="support-row"><span>Bluetooth Web</span><span class="support-value ${bluetooth ? "ok" : ""}">${bluetooth ? "disponível" : "indisponível"}</span></div><div class="support-row"><span>USB Serial</span><span class="support-value ${serial ? "ok" : ""}">${serial ? "disponível" : "indisponível"}</span></div><div class="support-row"><span>mapa OpenStreetMap</span><span class="support-value ok">ativo</span></div><div class="support-row"><span>persistência local</span><span class="support-value ok">ativa</span></div></div><p style="margin-top:16px">Use Chrome ou Edge em um endereço HTTPS para conectar dispositivos físicos. O site continua navegável sem hardware, mas não mostra uma localização inventada.</p></section><section class="settings-card"><div class="card-head"><span class="card-head-icon">${icon("trash", 18)}</span><div><h2>Dados locais</h2><p>Remova apenas posições e vínculos salvos neste navegador.</p></div></div><button class="button button-danger" style="width:100%;margin-top:17px" data-action="clear-data">${icon("trash", 15)} Limpar telemetria local</button></section></aside></div>`,
  );
}

function renderLogin() {
  return `<div class="login-shell"><div class="login-card"><section class="login-story"><a class="brand" href="#"><span class="brand-mark">${icon("paw", 21)}</span><span class="brand-name">rastro<span>pet</span></span></a><div class="login-story-copy"><p class="eyebrow" style="color:#c09be9">monitoramento real</p><h1>Mais perto de quem importa.</h1><p>Receba a localização enviada pela coleira, acompanhe o sinal em um mapa real e saiba quando a conexão ficou desatualizada.</p><div class="login-feature-list"><div class="login-feature"><span>${icon("map", 13)}</span> Mapa real com a última coordenada válida</div><div class="login-feature"><span>${icon("link", 13)}</span> Bluetooth GATT ou Arduino por USB</div><div class="login-feature"><span>${icon("shield", 13)}</span> Sem posição demonstrativa ou dado inventado</div></div></div><span style="position:relative;z-index:1;color:#9485a8;font-size:10px">RastroPet · telemetria local</span></section><section class="login-form-wrap"><form id="login-form" class="login-form"><p class="eyebrow">bem-vinda de volta</p><h2>Entrar no RastroPet</h2><p class="subtitle">Acesse seu painel para conectar uma coleira.</p><div class="login-fields"><label class="login-label" for="login-email">e-mail<input id="login-email" class="login-input" type="email" value="demo@rastropet.com" autocomplete="email" required></label><label class="login-label" for="login-password">senha<input id="login-password" class="login-input" type="password" value="rastropet" autocomplete="current-password" required></label></div><p id="login-error" class="form-error" hidden></p><button class="button button-primary login-submit" type="submit">Entrar ${icon("arrow", 15)}</button><div class="demo-access"><strong>Acesso local de demonstração</strong><br>demo@rastropet.com · rastropet</div></form></section></div></div>`;
}

function renderConnectionModal() {
  const bluetooth = "bluetooth" in navigator;
  const serial = "serial" in navigator;
  return `<div class="modal-backdrop" role="presentation"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="connect-title"><div class="modal-head"><div><h2 id="connect-title">Conectar ${escapeHTML(animals.find((animal) => animal.id === activeDetailId)?.name || "animal")}</h2><p>Escolha a entrada que sua coleira usa. O app só confirma a conexão depois de receber telemetria.</p></div><button class="modal-close" data-action="close-modal" aria-label="Fechar">${icon("close", 16)}</button></div><div class="connection-actions" style="margin-top:20px"><button class="button button-primary" ${bluetooth ? "" : "disabled"} data-action="connect-bluetooth">${icon("bluetooth", 17)} ${bluetooth ? "Conectar via Bluetooth GATT" : "Bluetooth indisponível neste navegador"}</button><button class="button button-quiet" ${serial ? "" : "disabled"} data-action="connect-serial">${icon("usb", 17)} ${serial ? "Conectar Arduino / USB Serial" : "USB Serial indisponível neste navegador"}</button></div><div class="notice info" style="margin-top:15px">${icon("info", 16)}<span>Protocolo: serviço <strong>${BLE_SERVICE_UUID}</strong> e característica <strong>${BLE_TELEMETRY_UUID}</strong>; no Arduino, uma linha JSON a 9600 baud.</span></div></div></div>`;
}

function render() {
  if (activeMap) {
    activeMap.remove();
    activeMap = null;
  }
  if (!currentSession()) {
    app.innerHTML = renderLogin();
    bindEvents();
    return;
  }
  const currentRoute = route();
  app.innerHTML =
    currentRoute.page === "detail"
      ? renderDetail(currentRoute.id)
      : currentRoute.page === "settings"
        ? renderSettings()
        : renderDashboard();
  bindEvents();
  requestAnimationFrame(() => {
    if (currentRoute.page === "detail") initMap("detail-map", currentRoute.id);
    if (currentRoute.page === "dashboard")
      initMap(
        "dashboard-map",
        document.querySelector("#dashboard-animal-select")?.value,
      );
  });
}

function createMarkerIcon() {
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="marker-wrap"><div class="marker-dot">${icon("paw", 18)}</div></div>`,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
    popupAnchor: [0, -21],
  });
}

function initMap(containerId, selectedId) {
  const container = document.getElementById(containerId);
  if (!container || !window.L) return;
  activeMap = L.map(container, {
    zoomControl: true,
    scrollWheelZoom: true,
  }).setView(DEFAULT_CENTER, 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(activeMap);
  const locations = animals.filter(hasLocation);
  const bounds = [];
  locations.forEach((animal) => {
    const marker = L.marker([animal.latitude, animal.longitude], {
      icon: createMarkerIcon(),
    }).addTo(activeMap);
    marker.bindPopup(
      `<strong>${escapeHTML(animal.name)}</strong><br><span>${escapeHTML(signalLabel(animal))}<br>${escapeHTML(formatCoordinates(animal))}</span>`,
    );
    marker.on("click", () => {
      if (containerId === "dashboard-map")
        navigate(`#/animal/${encodeURIComponent(animal.id)}`);
    });
    bounds.push([animal.latitude, animal.longitude]);
  });
  const selected = animals.find(
    (animal) => animal.id === selectedId && hasLocation(animal),
  );
  if (selected) {
    activeMap.setView([selected.latitude, selected.longitude], 16, {
      animate: false,
    });
    const marker = L.marker([selected.latitude, selected.longitude], {
      icon: createMarkerIcon(),
    }).addTo(activeMap);
    marker
      .bindPopup(
        `<strong>${escapeHTML(selected.name)}</strong><br>${escapeHTML(formatCoordinates(selected))}`,
      )
      .openPopup();
  } else if (bounds.length > 1) {
    activeMap.fitBounds(bounds, { padding: [38, 38], maxZoom: 16 });
  }
  setTimeout(() => activeMap?.invalidateSize(), 80);
}

function bindEvents() {
  document.querySelectorAll('[data-action="logout"]').forEach((button) =>
    button.addEventListener("click", async () => {
      await disconnectActiveConnection(true);
      localStorage.removeItem(STORAGE.session);
      navigate("#/painel");
      render();
    }),
  );
  document
    .querySelectorAll(
      '[data-action="back-dashboard"], [data-action="open-settings"]',
    )
    .forEach((button) =>
      button.addEventListener("click", () =>
        navigate(
          button.dataset.action === "open-settings"
            ? "#/configuracoes"
            : "#/painel",
        ),
      ),
    );
  document
    .querySelectorAll('[data-action="dismiss-toast"]')
    .forEach((button) => button.addEventListener("click", clearToast));
  document
    .querySelector('[data-action="focus-add"]')
    ?.addEventListener("click", () =>
      document.querySelector("#animal-name")?.focus(),
    );
  document
    .querySelector('[data-action="refresh-map"]')
    ?.addEventListener("click", () => {
      render();
      showToast("Mapa atualizado com as posições recebidas.", "success");
    });
  document
    .querySelector("#dashboard-animal-select")
    ?.addEventListener("change", (event) => {
      const animal = animals.find((item) => item.id === event.target.value);
      const label = document.querySelector("#dashboard-map-coordinates");
      if (label) label.textContent = formatCoordinates(animal || {});
      const located = animal && hasLocation(animal);
      if (located && activeMap)
        activeMap.setView([animal.latitude, animal.longitude], 16, {
          animate: true,
        });
    });
  document
    .querySelector("#add-animal-form")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document.querySelector("#animal-name");
      const name = input.value.trim();
      if (!name) return;
      const animal = normalizeAnimal(
        { id: `pet-${Date.now().toString(36)}`, name },
        animals.length,
      );
      animals = [...animals, animal];
      saveAnimals();
      input.value = "";
      showToast(
        `${name} foi adicionado. Agora conecte a coleira para receber a primeira posição.`,
        "success",
      );
    });
  document
    .querySelector('[data-action="open-connect"]')
    ?.addEventListener("click", () => {
      modalOpen = true;
      render();
    });
  document
    .querySelector('[data-action="close-modal"]')
    ?.addEventListener("click", () => {
      modalOpen = false;
      render();
    });
  document
    .querySelector(".modal-backdrop")
    ?.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal-backdrop")) {
        modalOpen = false;
        render();
      }
    });
  document
    .querySelector('[data-action="connect-bluetooth"]')
    ?.addEventListener("click", async () => {
      modalOpen = false;
      render();
      await connectBluetooth(activeDetailId);
    });
  document
    .querySelector('[data-action="connect-serial"]')
    ?.addEventListener("click", async () => {
      modalOpen = false;
      render();
      await connectSerial(activeDetailId);
    });
  document
    .querySelector('[data-action="disconnect"]')
    ?.addEventListener("click", async () => {
      await disconnectActiveConnection();
      showToast(
        "Dispositivo desconectado. A última posição válida foi preservada.",
        "info",
      );
    });
  document
    .querySelector('[data-action="center-detail"]')
    ?.addEventListener("click", () => {
      const animal = animals.find((item) => item.id === activeDetailId);
      if (animal && hasLocation(animal) && activeMap)
        activeMap.setView([animal.latitude, animal.longitude], 17, {
          animate: true,
        });
      else
        showToast(
          "Ainda não há uma coordenada válida para centralizar.",
          "info",
        );
    });
  document
    .querySelector("#manual-packet-form")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document.querySelector("#manual-packet");
      const result = applyTelemetry(input.value, {
        animalId: activeDetailId,
        type: "manual",
        deviceName: "validação manual",
      });
      if (result.ok)
        showToast(
          "Pacote válido aplicado. O mapa foi atualizado com a coordenada recebida.",
          "success",
        );
      else showToast(result.error, "error");
    });
  document.querySelector("#login-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document
      .querySelector("#login-email")
      .value.trim()
      .toLowerCase();
    const password = document.querySelector("#login-password").value;
    const error = document.querySelector("#login-error");
    if (email !== user.email.toLowerCase() || password !== user.password) {
      error.textContent =
        "E-mail ou senha incorretos. Confira seus dados e tente novamente.";
      error.hidden = false;
      return;
    }
    localStorage.setItem(STORAGE.session, "1");
    navigate("#/painel");
    render();
  });
  document
    .querySelector("#account-form")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();
      user = {
        ...user,
        name: document.querySelector("#settings-name").value.trim(),
        email: document.querySelector("#settings-email").value.trim(),
      };
      saveUser();
      showToast("Dados da conta atualizados neste dispositivo.", "success");
    });
  document
    .querySelector('[data-action="clear-data"]')
    ?.addEventListener("click", () => {
      animals = animals.map((animal) =>
        normalizeAnimal({ id: animal.id, name: animal.name }, 0),
      );
      saveAnimals();
      showToast(
        "Telemetria e vínculos locais foram removidos. Os animais continuam cadastrados.",
        "success",
      );
    });
}

function parseTelemetry(raw) {
  let packet;
  try {
    packet = typeof raw === "string" ? JSON.parse(raw.trim()) : raw;
  } catch {
    throw new Error(
      "Mensagem inválida: envie um objeto JSON completo em uma única linha.",
    );
  }
  if (!packet || typeof packet !== "object" || Array.isArray(packet))
    throw new Error("Mensagem inválida: o pacote precisa ser um objeto JSON.");
  const latitude = numberOrNull(packet.latitude ?? packet.lat);
  const longitude = numberOrNull(packet.longitude ?? packet.lon ?? packet.lng);
  if (latitude === null || latitude < -90 || latitude > 90)
    throw new Error("Latitude inválida: use um número entre -90 e 90.");
  if (longitude === null || longitude < -180 || longitude > 180)
    throw new Error("Longitude inválida: use um número entre -180 e 180.");
  const updatedAt = timestampOrNull(
    packet.timestamp ?? packet.ts ?? Date.now(),
  );
  if (!updatedAt || updatedAt > Date.now() + 5 * 60 * 1000)
    throw new Error("Timestamp inválido ou adiantado demais.");
  const batteryValue =
    packet.battery ?? packet.batteryPercent ?? packet.bateria;
  const battery =
    batteryValue === undefined ? null : batteryOrNull(batteryValue);
  if (batteryValue !== undefined && battery === null)
    throw new Error("Bateria inválida: use um número entre 0 e 100.");
  const accuracy =
    packet.accuracy === undefined ? null : numberOrNull(packet.accuracy);
  if (packet.accuracy !== undefined && (accuracy === null || accuracy < 0))
    throw new Error("Precisão inválida.");
  return {
    trackerId:
      String(packet.trackerId ?? packet.deviceId ?? packet.id ?? "").trim() ||
      null,
    latitude,
    longitude,
    battery,
    accuracy,
    updatedAt,
  };
}

function applyTelemetry(raw, meta) {
  try {
    const packet = parseTelemetry(raw);
    const target = animals.find((animal) => animal.id === meta.animalId);
    if (!target) throw new Error("Animal não encontrado.");
    if (
      target.trackerId &&
      packet.trackerId &&
      target.trackerId !== packet.trackerId
    )
      throw new Error(
        `Pacote recusado: pertence à coleira ${packet.trackerId}, mas este animal está vinculado a ${target.trackerId}.`,
      );
    updateAnimal(target.id, {
      ...packet,
      trackerId: target.trackerId || packet.trackerId,
      connectionType:
        meta.type === "bluetooth"
          ? "Bluetooth"
          : meta.type === "serial"
            ? "Arduino USB"
            : "Validação manual",
      connectionState: meta.type === "manual" ? "manual" : "connected",
      deviceId: meta.deviceId || target.deviceId,
      deviceName: meta.deviceName || target.deviceName,
    });
    if (activeDetailId === target.id) render();
    return { ok: true, packet };
  } catch (error) {
    return {
      ok: false,
      error: error.message || "Não foi possível validar a mensagem.",
    };
  }
}

async function disconnectActiveConnection(silent = false) {
  const connection = activeConnection;
  if (!connection) return;
  activeConnection = null;
  try {
    if (connection.type === "bluetooth") {
      connection.characteristic?.removeEventListener(
        "characteristicvaluechanged",
        connection.handler,
      );
      if (connection.device?.gatt?.connected)
        connection.device.gatt.disconnect();
    }
    if (connection.type === "serial") {
      connection.stopRequested = true;
      await connection.reader?.cancel();
      connection.reader?.releaseLock();
      await connection.port?.close();
    }
  } catch {
    // The physical device may already have closed; local state remains consistent.
  }
  if (animals.some((animal) => animal.id === connection.animalId))
    updateAnimal(connection.animalId, { connectionState: "disconnected" });
  if (!silent) render();
}

async function connectBluetooth(animalId) {
  if (!animalId || !navigator.bluetooth) {
    showToast(
      "Bluetooth Web não está disponível. Use Chrome ou Edge em HTTPS.",
      "error",
    );
    return;
  }
  try {
    await disconnectActiveConnection(true);
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [BLE_SERVICE_UUID],
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(BLE_SERVICE_UUID);
    const characteristic = await service.getCharacteristic(BLE_TELEMETRY_UUID);
    const handler = (event) => {
      const raw = new TextDecoder().decode(event.target.value);
      const result = applyTelemetry(raw, {
        animalId,
        type: "bluetooth",
        deviceId: device.id,
        deviceName: device.name || "coleira Bluetooth",
      });
      if (!result.ok) showToast(result.error, "error");
      else
        showToast(
          `Telemetria recebida de ${device.name || "coleira Bluetooth"}.`,
          "success",
        );
    };
    await characteristic.startNotifications();
    characteristic.addEventListener("characteristicvaluechanged", handler);
    activeConnection = {
      type: "bluetooth",
      animalId,
      device,
      characteristic,
      handler,
    };
    device.addEventListener("gattserverdisconnected", () => {
      if (activeConnection?.device?.id !== device.id) return;
      activeConnection = null;
      updateAnimal(animalId, { connectionState: "disconnected" });
      showToast(
        "A coleira Bluetooth foi desconectada. A última posição continua salva.",
        "error",
      );
    });
    updateAnimal(animalId, {
      connectionType: "Bluetooth",
      connectionState: "connected",
      deviceId: device.id,
      deviceName: device.name || "coleira Bluetooth",
    });
    showToast(
      `Conectado a ${device.name || "coleira Bluetooth"}. Aguardando o primeiro sinal GPS.`,
      "success",
    );
  } catch (error) {
    const message =
      error?.name === "NotFoundError"
        ? "Nenhum dispositivo foi selecionado."
        : error?.message?.includes("getPrimaryService")
          ? "Dispositivo conectado, mas não expôs o serviço GATT do RastroPet."
          : `Não foi possível conectar via Bluetooth: ${error.message || "operação cancelada"}.`;
    showToast(message, "error");
  }
}

async function connectSerial(animalId) {
  if (!animalId || !navigator.serial) {
    showToast(
      "USB Serial não está disponível. Use Chrome ou Edge em HTTPS.",
      "error",
    );
    return;
  }
  try {
    await disconnectActiveConnection(true);
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    const decoder = new TextDecoderStream();
    const inputDone = port.readable.pipeTo(decoder.writable).catch(() => {});
    const reader = decoder.readable.getReader();
    const connection = {
      type: "serial",
      animalId,
      port,
      reader,
      inputDone,
      buffer: "",
      stopRequested: false,
    };
    activeConnection = connection;
    updateAnimal(animalId, {
      connectionType: "Arduino USB",
      connectionState: "connected",
      deviceName: "Arduino / USB Serial",
    });
    showToast(
      "Arduino conectado em 9600 baud. Aguardando linhas JSON.",
      "success",
    );
    (async () => {
      try {
        while (!connection.stopRequested) {
          const { value, done } = await reader.read();
          if (done) break;
          connection.buffer += value;
          const lines = connection.buffer.split(/\r?\n/);
          connection.buffer = lines.pop() || "";
          for (const line of lines.filter(Boolean)) {
            const result = applyTelemetry(line, {
              animalId,
              type: "serial",
              deviceName: "Arduino / USB Serial",
            });
            if (!result.ok) showToast(result.error, "error");
            else showToast("Telemetria recebida do Arduino.", "success");
          }
        }
      } catch (error) {
        if (!connection.stopRequested)
          showToast(
            `Leitura serial interrompida: ${error.message || "dispositivo indisponível"}.`,
            "error",
          );
      } finally {
        if (activeConnection === connection) {
          activeConnection = null;
          updateAnimal(animalId, { connectionState: "disconnected" });
          render();
        }
      }
    })();
  } catch (error) {
    showToast(
      error?.name === "NotFoundError"
        ? "Nenhuma porta serial foi selecionada."
        : `Não foi possível conectar o Arduino: ${error.message || "operação cancelada"}.`,
      "error",
    );
  }
}

window.addEventListener("hashchange", () => {
  modalOpen = false;
  render();
});
window.addEventListener("storage", () => {
  animals = loadAnimals();
  user = loadUser();
  render();
});
setInterval(() => {
  if (currentSession() && animals.some((animal) => animal.updatedAt)) render();
}, 60_000);

render();
