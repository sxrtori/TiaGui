const API_BASE_URL = window.SPORTX_API_URL || 'http://localhost:3000';

const STORAGE_KEYS = {
  cart: 'sportx-cart',
  wishlist: 'sportx-wishlist',
  user: 'sportx-current-user',
  token: 'sportx-token',
  localProducts: 'sportx-local-products',
  localReviews: 'sportx-local-reviews',
  orders: 'sportx-local-orders',
  productsUpdated: 'sportx-products-updated'
};

const CATEGORY_MAP = { Masculino: 1, Feminino: 2, 'Calçados': 3, Acessórios: 4, Esportes: 5 };
const CATEGORY_BY_ID = { 1: 'Masculino', 2: 'Feminino', 3: 'Calçados', 4: 'Acessórios', 5: 'Esportes' };

const DEFAULT_PRODUCTS = [
  { id: 1, nome: 'Nike Tênis Velocity Pro', descricao: 'Tênis de corrida com amortecimento responsivo.', preco: 499.9, imagem: 'https://m.media-amazon.com/images/I/81j4AXVz5tL._AC_SY575_.jpg', categoria: 'Calçados', genero: 'Masculino', tamanhos: '38,39,40,41,42', modalidade: 'Corrida', estoque: 15, marca: 'Nike', cashback: 5, desconto: 10, badgeLancamento: true, promocaoAtiva: true, vendedorId: 1, notaMedia: 4.9, totalAvaliacoes: 12, dataCriacao: '2026-03-29T10:00:00.000Z', vendas: 21 },
  { id: 2, nome: 'Adidas Legging Motion Fit', descricao: 'Legging de compressão com secagem rápida.', preco: 189.9, imagem: 'https://static.ativaesportes.com.br/public/ativaesportes/imagens/produtos/calca-adidas-legging-3-stripes-feminina-gb4350-64ef58a2bd551.jpg', categoria: 'Feminino', genero: 'Feminino', tamanhos: 'P,M,G,GG', modalidade: 'Academia', estoque: 24, marca: 'Adidas', cashback: 4, desconto: 0, badgeLancamento: true, promocaoAtiva: false, vendedorId: 1, notaMedia: 4.8, totalAvaliacoes: 18, dataCriacao: '2026-03-25T10:00:00.000Z', vendas: 19 },
  { id: 3, nome: 'Puma Camisa Dry Power', descricao: 'Camisa dry fit para treinos.', preco: 129.9, imagem: 'https://images.puma.com/image/upload/f_auto,q_auto,w_600,b_rgb:FAFAFA/global/526718/51/mod01/fnd/BRA/fmt/png', categoria: 'Masculino', genero: 'Masculino', tamanhos: 'P,M,G,GG', modalidade: 'Academia', estoque: 30, marca: 'Puma', cashback: 3, desconto: 0, badgeLancamento: false, promocaoAtiva: false, vendedorId: 1, notaMedia: 4.7, totalAvaliacoes: 8, dataCriacao: '2026-03-18T10:00:00.000Z', vendas: 11 }
];

const state = { cart: [], wishlist: [], currentUser: null, authToken: '', products: [], localReviews: {} };

const currency = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const discountedPrice = (p) => Number((p.preco * (1 - Number(p.desconto || 0) / 100)).toFixed(2));
const getQuery = (k) => new URLSearchParams(window.location.search).get(k);

function showToast(message) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(showToast.ttl);
  showToast.ttl = setTimeout(() => t.classList.remove('show'), 2500);
}

async function apiRequest(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.authToken) headers.Authorization = `Bearer ${state.authToken}`;
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) throw new Error('API error');
  if (response.status === 204) return null;
  return response.json();
}

function normalizeProduct(p) {
  return {
    id: Number(p.id ?? p.id_produto ?? Date.now()),
    nome: p.nome || 'Produto',
    descricao: p.descricao || '',
    preco: Number(p.preco || 0),
    precoPromocional: Number(p.preco_promocional || 0),
    desconto: Number(p.desconto || 0),
    imagem: p.imagem || 'https://via.placeholder.com/600x600?text=SportX',
    galeria: p.galeria_imagens ? String(p.galeria_imagens).split(',').map((i) => i.trim()).filter(Boolean) : [p.imagem].filter(Boolean),
    categoria: p.categoria || CATEGORY_BY_ID[p.id_categoria] || 'Esportes',
    genero: p.genero || 'Unissex',
    tamanhos: p.tamanhos || p.numeracao || 'Único',
    marca: p.marca || 'SportX',
    estoque: Number(p.estoque || 0),
    cashback: Number(p.cashback || 0),
    badgeLancamento: Boolean(p.badgeLancamento ?? p.lancamento),
    promocaoAtiva: Boolean(p.promocaoAtiva ?? p.promocao_ativa ?? Number(p.desconto || 0) > 0),
    modalidade: p.modalidade || 'Treino',
    vendedorId: Number(p.vendedorId || p.id_vendedor || 0),
    ativo: p.ativo !== false,
    dataCriacao: p.dataCriacao || p.created_at || new Date().toISOString(),
    notaMedia: Number(p.notaMedia || p.media_avaliacao || p.avaliacaoMedia || 0),
    totalAvaliacoes: Number(p.totalAvaliacoes || p.total_avaliacoes || p.quantidadeAvaliacoes || 0),
    vendas: Number(p.vendas || 0),
    source: p.source || 'catalog'
  };
}

async function loadProducts() {
  const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.localProducts) || '[]').map(normalizeProduct);
  let api = [];
  try {
    const data = await apiRequest('/produtos');
    api = (Array.isArray(data) ? data : []).map((p) => normalizeProduct({ ...p, source: 'api' }));
  } catch (_e) {
    api = [];
  }
  const merged = [...DEFAULT_PRODUCTS.map(normalizeProduct), ...api, ...local].reduce((m, p) => (m.set(p.id, p), m), new Map());
  state.products = [...merged.values()].sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
}

function getProductById(id) { return state.products.find((p) => Number(p.id) === Number(id)); }

function renderProductCard(p) {
  const hasDiscount = Number(p.desconto) > 0;
  return `<article class="product-card" data-product-link="${p.id}">
    <div class="product-media">
      <img src="${p.imagem}" alt="${p.nome}" loading="lazy" />
      ${p.badgeLancamento ? '<span class="new-tag">Novo</span>' : ''}
      ${hasDiscount ? `<span class="discount-tag">-${p.desconto}%</span>` : ''}
    </div>
    <div class="product-body">
      <small>${p.marca} • ${p.modalidade}</small>
      <h3>${p.nome}</h3>
      <div class="product-rating-row">⭐ ${p.notaMedia.toFixed(1)} <span>(${p.totalAvaliacoes})</span></div>
      <div class="product-meta"><div class="price-wrap"><strong>${currency(discountedPrice(p))}</strong>${hasDiscount ? `<span class="old-price">${currency(p.preco)}</span>` : ''}</div></div>
      <div class="product-actions"><button class="btn-card btn-dark" data-action="cart" data-id="${p.id}">Adicionar</button><a class="btn-card btn-light" href="produto.html?id=${p.id}">Ver detalhes</a></div>
    </div></article>`;
}

function renderGrid(id, list) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = list.length ? list.map(renderProductCard).join('') : '<div class="empty-state"><h3>Nenhum produto encontrado.</h3></div>';
}

function filterProducts({ search = '', category = '', gender = '', promoOnly = false }) {
  const s = search.trim().toLowerCase();
  return state.products.filter((p) => {
    if (!p.ativo) return false;
    if (promoOnly && !p.promocaoAtiva && Number(p.desconto || 0) <= 0) return false;
    if (category && p.categoria !== category && p.genero !== category) return false;
    if (gender && p.genero !== gender) return false;
    if (s && !`${p.nome} ${p.marca} ${p.modalidade}`.toLowerCase().includes(s)) return false;
    return true;
  });
}

function renderHome() {
  const search = document.getElementById('searchInput')?.value || '';
  const category = document.getElementById('categoryFilter')?.value || '';
  const gender = document.getElementById('genderFilter')?.value || '';
  const base = filterProducts({ search, category, gender });
  renderGrid('productsGrid', base);
  renderGrid('recentProductsGrid', [...state.products].slice(0, 6));
  renderGrid('bestRatedGrid', [...state.products].sort((a, b) => b.notaMedia - a.notaMedia).slice(0, 6));
  renderGrid('bestSellersGrid', [...state.products].sort((a, b) => b.vendas - a.vendas).slice(0, 6));
  const promotions = filterProducts({ promoOnly: true }).slice(0, 8);
  renderGrid('offersGrid', promotions);
  renderGrid('monthlyPromotionsGrid', promotions);
  renderGrid('launchCarousel', state.products.filter((p) => p.badgeLancamento).slice(0, 8));
}

function renderCategoryPage() {
  const category = getQuery('categoria') || '';
  document.getElementById('categoryPageTitle') && (document.getElementById('categoryPageTitle').textContent = category || 'Categoria');
  const list = filterProducts({
    search: document.getElementById('categorysearchInput')?.value || '',
    category: category || document.getElementById('categorycategoryFilter')?.value || '',
    gender: document.getElementById('categorygenderFilter')?.value || ''
  });
  renderGrid('productsGrid', list);
}

async function getReviews(productId) {
  let apiData = null;
  try { apiData = await apiRequest(`/avaliacoes/produto/${productId}`); } catch (_e) { apiData = null; }
  const local = state.localReviews[productId] || [];
  const apiReviews = apiData?.reviews || [];
  const merged = [...apiReviews, ...local].map((r) => ({ ...r, usuario: r.usuario || r.nome_usuario || `Usuário ${r.id_usuario || ''}` }));
  const media = merged.length ? merged.reduce((s, r) => s + Number(r.nota || 0), 0) / merged.length : 0;
  return { reviews: merged, media: Number(media.toFixed(1)), total: merged.length };
}

async function renderProductPage() {
  const id = Number(getQuery('id'));
  const p = getProductById(id);
  const root = document.getElementById('productPageRoot');
  if (!p || !root) return;
  const { reviews, media, total } = await getReviews(id);
  const related = state.products.filter((x) => x.id !== p.id && (x.categoria === p.categoria || x.modalidade === p.modalidade)).slice(0, 4);
  const buyTogether = state.products.filter((x) => x.id !== p.id).slice(0, 3);

  root.innerHTML = `
    <nav class="breadcrumb"> <a href="index.html">Página Inicial</a> / <a href="categoria.html?categoria=${encodeURIComponent(p.genero)}">${p.genero}</a> / <a href="categoria.html?categoria=${encodeURIComponent(p.categoria)}">${p.categoria}</a> / <span>${p.nome}</span> </nav>
    <section class="product-layout">
      <div class="product-gallery">
        <img id="mainProductImage" class="product-main-image" src="${p.imagem}" alt="${p.nome}" />
        <div class="product-thumbs">${[p.imagem, ...p.galeria].filter(Boolean).slice(0,5).map((img) => `<button class="thumb-btn" data-thumb="${img}"><img src="${img}" alt="thumb"></button>`).join('')}</div>
      </div>
      <div class="product-details">
        <h1>${p.nome}</h1>
        <p class="lead">${p.categoria} • ${p.marca} • ${p.modalidade}</p>
        <div class="product-rating-row">⭐ ${media || p.notaMedia} <span>(${total || p.totalAvaliacoes} avaliações)</span></div>
        <div class="product-price-box"><strong>${currency(discountedPrice(p))}</strong>${Number(p.desconto)>0 ? `<span class="old-price">${currency(p.preco)}</span><span class="discount-tag">-${p.desconto}%</span>` : ''}</div>
        <label>Tamanho/Numeração</label>
        <select id="productSize">${String(p.tamanhos).split(',').map((t) => `<option>${t.trim()}</option>`).join('')}</select>
        <div class="product-actions-row"><button class="btn btn-primary" data-action="cart" data-id="${p.id}">Adicionar ao carrinho</button><button class="btn btn-light" data-action="wish" data-id="${p.id}">Favoritar</button></div>
        <div class="frete-box"><label>Calcular frete</label><div class="frete-form"><input id="freteCep" placeholder="Digite o CEP"/><button id="calcFreteBtn" class="btn btn-light">Calcular</button></div><small id="freteResult"></small></div>
      </div>
    </section>
    <section class="section"><h3>Descrição detalhada</h3><p>${p.descricao}</p></section>
    <section class="section"><h3>Avaliações dos compradores</h3><div id="reviewList">${reviews.length ? reviews.map((r) => `<article class="review-item"><header><strong>${r.usuario}</strong><span>⭐ ${r.nota}</span></header><p>${r.comentario}</p><small>${new Date(r.data_criacao || r.data || Date.now()).toLocaleDateString('pt-BR')}</small><button class="btn-link" data-report-review="${r.id_avaliacao || ''}">Denunciar</button></article>`).join('') : '<p>Ainda sem avaliações.</p>'}</div>
      <form id="reviewForm" class="seller-form-pro"><div class="input-group"><label>Nota</label><select id="reviewRate" required><option value="">Selecione</option><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></div><div class="input-group"><label>Comentário</label><textarea id="reviewText" required></textarea></div><button class="btn btn-primary" type="submit">Enviar avaliação</button></form>
    </section>
    <section class="section"><h3>Produtos relacionados</h3><div class="products-grid">${related.map(renderProductCard).join('')}</div></section>
    <section class="section"><h3>Compre junto</h3><div class="products-grid">${buyTogether.map(renderProductCard).join('')}</div></section>
  `;

  root.querySelectorAll('[data-thumb]').forEach((btn) => btn.addEventListener('click', () => { document.getElementById('mainProductImage').src = btn.dataset.thumb; }));
  document.getElementById('calcFreteBtn')?.addEventListener('click', (e) => { e.preventDefault(); document.getElementById('freteResult').textContent = 'Entrega estimada: 4 a 8 dias úteis.'; });

  document.getElementById('reviewForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state.currentUser) return showToast('Faça login para avaliar.');
    const comment = document.getElementById('reviewText').value.trim();
    if (!comment) return showToast('Comentário não pode ser vazio.');
    const userOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || '[]').filter((o) => o.userId === state.currentUser.id_usuario || o.user === state.currentUser.email);
    const purchased = userOrders.some((o) => (o.items || []).some((i) => Number(i.id) === id));
    if (!purchased) return showToast('Somente compradores podem avaliar.');
    const payload = { id_usuario: state.currentUser.id_usuario, id_produto: id, nota: Number(document.getElementById('reviewRate').value), comentario: comment, id_pedido: userOrders[0]?.id };
    try { await apiRequest('/avaliacoes', { method: 'POST', body: JSON.stringify(payload) }); } catch (_e) {
      const list = state.localReviews[id] || [];
      if (list.some((r) => Number(r.id_usuario) === Number(state.currentUser.id_usuario) && Number(r.id_pedido || 0) === Number(payload.id_pedido || 0))) return showToast('Avaliação duplicada para este pedido.');
      list.unshift({ ...payload, usuario: state.currentUser.name || state.currentUser.email, data: new Date().toISOString() });
      state.localReviews[id] = list;
      localStorage.setItem(STORAGE_KEYS.localReviews, JSON.stringify(state.localReviews));
    }
    showToast('Avaliação enviada.');
    renderProductPage();
  });

  root.querySelectorAll('[data-report-review]').forEach((btn) => btn.addEventListener('click', async () => {
    const reviewId = Number(btn.dataset.reportReview);
    if (!reviewId) return showToast('Avaliação local denunciada.');
    try { await apiRequest(`/avaliacoes/${reviewId}/denunciar`, { method: 'PATCH' }); } catch (_e) {}
    showToast('Avaliação denunciada.');
  }));
}

function renderPromotionsPage() {
  const list = filterProducts({ promoOnly: true });
  renderGrid('promotionsGrid', list);
}

function getSellerProducts() {
  if (!state.currentUser) return [];
  return state.products.filter((p) => Number(p.vendedorId || 0) === Number(state.currentUser.id_usuario) || p.source.startsWith('seller'));
}

function renderMyProductsPage() {
  const target = document.getElementById('myProductsGrid');
  if (!target) return;
  const items = getSellerProducts();
  target.innerHTML = items.length ? items.map((p) => `<article class="product-card"><div class="product-media"><img src="${p.imagem}" alt="${p.nome}"></div><div class="product-body"><h3>${p.nome}</h3><p>Estoque: ${p.estoque} • ${p.ativo ? 'Ativo' : 'Inativo'}</p><div class="product-actions"><a class="btn-card btn-light" href="editar-produto.html?id=${p.id}">Editar</a><button class="btn-card btn-light" data-action="toggle-active" data-id="${p.id}">${p.ativo ? 'Desativar' : 'Ativar'}</button><button class="btn-card btn-light" data-action="toggle-promo" data-id="${p.id}">${p.promocaoAtiva ? 'Remover promoção' : 'Colocar promoção'}</button><button class="btn-card btn-dark" data-action="delete-product" data-id="${p.id}">Excluir</button></div></div></article>`).join('') : '<p>Você ainda não publicou produtos.</p>';
}

function fillEditForm() {
  const id = Number(getQuery('id'));
  const p = getProductById(id);
  if (!p) return;
  const map = { sellerProductName: p.nome, sellerProductDescription: p.descricao, sellerProductPrice: p.preco, sellerProductDiscount: p.desconto, sellerProductCategory: p.categoria, sellerProductGender: p.genero, sellerProductSport: p.modalidade, sellerProductBrand: p.marca, sellerProductCashback: p.cashback, sellerProductStock: p.estoque, sellerProductSizes: p.tamanhos, sellerProductImage: p.imagem };
  Object.entries(map).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.value = val; });
  document.getElementById('sellerProductLaunch') && (document.getElementById('sellerProductLaunch').checked = p.badgeLancamento);
  document.getElementById('sellerProductPromotion') && (document.getElementById('sellerProductPromotion').checked = p.promocaoAtiva);
}

async function submitSellerProduct(event) {
  event.preventDefault();
  if (!state.currentUser || state.currentUser.type !== 'vendedor') return showToast('Faça login como vendedor.');
  const isEdit = document.body.dataset.page === 'edit-product';
  const id = isEdit ? Number(getQuery('id')) : Date.now();

  const payload = normalizeProduct({
    id,
    nome: document.getElementById('sellerProductName').value.trim(),
    descricao: document.getElementById('sellerProductDescription').value.trim(),
    preco: Number(document.getElementById('sellerProductPrice').value || 0),
    desconto: Number(document.getElementById('sellerProductDiscount').value || 0),
    categoria: document.getElementById('sellerProductCategory').value,
    genero: document.getElementById('sellerProductGender').value,
    modalidade: document.getElementById('sellerProductSport').value,
    marca: document.getElementById('sellerProductBrand').value,
    cashback: Number(document.getElementById('sellerProductCashback').value || 0),
    estoque: Number(document.getElementById('sellerProductStock').value || 0),
    tamanhos: document.getElementById('sellerProductSizes').value,
    imagem: document.getElementById('sellerProductImage').value || 'https://via.placeholder.com/600x600?text=SportX',
    badgeLancamento: document.getElementById('sellerProductLaunch').checked,
    promocaoAtiva: document.getElementById('sellerProductPromotion').checked,
    vendedorId: state.currentUser.id_usuario,
    ativo: true,
    source: 'seller-local',
    dataCriacao: new Date().toISOString()
  });

  let apiSaved = false;
  const apiPayload = {
    id_categoria: CATEGORY_MAP[payload.categoria] || 5,
    nome: payload.nome,
    descricao: payload.descricao,
    preco: payload.preco,
    estoque: payload.estoque,
    imagem: payload.imagem,
    genero: payload.genero,
    numeracao: payload.tamanhos,
    marca: payload.marca,
    desconto: payload.desconto,
    cashback: payload.cashback,
    modalidade: payload.modalidade,
    lancamento: payload.badgeLancamento,
    promocao_ativa: payload.promocaoAtiva,
    id_vendedor: payload.vendedorId,
    ativo: payload.ativo
  };

  try {
    if (isEdit) await apiRequest(`/produtos/${id}`, { method: 'PATCH', body: JSON.stringify(apiPayload) });
    else {
      const created = await apiRequest('/produtos', { method: 'POST', body: JSON.stringify(apiPayload) });
      payload.id = Number(created.id_produto || payload.id);
      payload.source = 'seller-api';
    }
    apiSaved = true;
  } catch (_e) {}

  const localProducts = JSON.parse(localStorage.getItem(STORAGE_KEYS.localProducts) || '[]').map(normalizeProduct);
  localStorage.setItem(STORAGE_KEYS.localProducts, JSON.stringify([payload, ...localProducts.filter((x) => Number(x.id) !== Number(payload.id))]));
  localStorage.setItem(STORAGE_KEYS.productsUpdated, String(Date.now()));
  showToast(apiSaved ? 'Produto salvo via API.' : 'API falhou. Salvo localmente.');

  if (isEdit) window.location.href = 'meus-produtos.html';
  else document.getElementById('sellerProductForm').reset();
}

function addToCart(id) {
  const curr = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || '[]');
  const item = curr.find((x) => Number(x.id) === Number(id));
  if (item) item.qty += 1; else curr.push({ id: Number(id), qty: 1 });
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(curr));
  showToast('Produto adicionado ao carrinho.');
}

function toggleWish(id) {
  let w = JSON.parse(localStorage.getItem(STORAGE_KEYS.wishlist) || '[]');
  w = w.includes(Number(id)) ? w.filter((x) => x !== Number(id)) : [...w, Number(id)];
  localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(w));
  showToast('Favoritos atualizados.');
}

function handleGlobalClick(e) {
  const action = e.target.closest('[data-action]');
  if (action) {
    const id = Number(action.dataset.id);
    if (action.dataset.action === 'cart') addToCart(id);
    if (action.dataset.action === 'wish') toggleWish(id);
    if (action.dataset.action === 'delete-product') deleteProduct(id);
    if (action.dataset.action === 'toggle-active') quickUpdateProduct(id, (p) => ({ ...p, ativo: !p.ativo }));
    if (action.dataset.action === 'toggle-promo') quickUpdateProduct(id, (p) => ({ ...p, promocaoAtiva: !p.promocaoAtiva, desconto: p.desconto || 10 }));
  }
  const card = e.target.closest('[data-product-link]');
  if (card && !e.target.closest('button,a')) window.location.href = `produto.html?id=${card.dataset.productLink}`;
}

async function quickUpdateProduct(id, transformer) {
  const p = getProductById(id);
  if (!p) return;
  const next = transformer(p);
  try {
    await apiRequest(`/produtos/${id}`, { method: 'PATCH', body: JSON.stringify({ ativo: next.ativo, promocao_ativa: next.promocaoAtiva, desconto: next.desconto }) });
  } catch (_e) {}
  const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.localProducts) || '[]').map(normalizeProduct);
  localStorage.setItem(STORAGE_KEYS.localProducts, JSON.stringify([next, ...local.filter((x) => Number(x.id) !== Number(id))]));
  await loadProducts();
  renderMyProductsPage();
}

async function deleteProduct(id) {
  try { await apiRequest(`/produtos/${id}`, { method: 'DELETE' }); } catch (_e) {}
  const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.localProducts) || '[]').filter((p) => Number(p.id) !== Number(id));
  localStorage.setItem(STORAGE_KEYS.localProducts, JSON.stringify(local));
  await loadProducts();
  renderMyProductsPage();
  showToast('Produto excluído.');
}

function setupFilters() {
  ['searchInput', 'categoryFilter', 'genderFilter', 'categorysearchInput', 'categorycategoryFilter', 'categorygenderFilter', 'promotionOnlyFilter'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', () => {
      if (document.body.dataset.page === 'category') renderCategoryPage();
      if (document.body.dataset.page === 'home') renderHome();
      if (document.body.dataset.page === 'promotions') renderPromotionsPage();
    });
    document.getElementById(id)?.addEventListener('change', () => {
      if (document.body.dataset.page === 'category') renderCategoryPage();
      if (document.body.dataset.page === 'home') renderHome();
      if (document.body.dataset.page === 'promotions') renderPromotionsPage();
    });
  });
}

function loadSession() {
  state.cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || '[]');
  state.wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.wishlist) || '[]');
  state.currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || 'null');
  state.authToken = localStorage.getItem(STORAGE_KEYS.token) || '';
  state.localReviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.localReviews) || '{}');
}

function setupAuthUi() {
  document.getElementById('sellerMenuBtn')?.addEventListener('click', () => (window.location.href = 'vender.html'));
  document.getElementById('openAuthBtn')?.addEventListener('click', () => {
    if (state.currentUser) return;
    const fakeSeller = confirm('Login rápido: OK=vendedor / Cancel=comprador');
    state.currentUser = { id_usuario: Date.now(), name: fakeSeller ? 'Vendedor Demo' : 'Comprador Demo', email: fakeSeller ? 'seller@sportx.com' : 'buyer@sportx.com', type: fakeSeller ? 'vendedor' : 'comprador' };
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(state.currentUser));
    showToast('Sessão local iniciada.');
  });
}

async function init() {
  loadSession();
  await loadProducts();
  setupFilters();
  setupAuthUi();
  document.addEventListener('click', handleGlobalClick);

  const page = document.body.dataset.page;
  if (page === 'home') renderHome();
  if (page === 'category') renderCategoryPage();
  if (page === 'product') renderProductPage();
  if (page === 'promotions') renderPromotionsPage();
  if (page === 'my-products') renderMyProductsPage();
  if (page === 'seller' || page === 'edit-product') {
    document.getElementById('sellerProductForm')?.addEventListener('submit', submitSellerProduct);
    if (page === 'edit-product') fillEditForm();
  }
}

document.addEventListener('DOMContentLoaded', init);
window.addToCart = addToCart;
window.toggleWish = toggleWish;
