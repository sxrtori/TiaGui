const API_BASE_URL = window.SPORTX_API_URL || 'http://localhost:3000';

const STORAGE_KEYS = {
  cart: 'sportx-cart',
  wishlist: 'sportx-wishlist',
  cashback: 'sportx-cashback',
  user: 'sportx-current-user',
  token: 'sportx-token',
  localProducts: 'sportx-local-products',
  localReviews: 'sportx-local-reviews',
  productSales: 'sportx-product-sales',
  orders: 'sportx-local-orders',
  productsUpdated: 'sportx-products-updated'
};

const CATEGORY_MAP = { Masculino: 1, Feminino: 2, 'Calçados': 3, Acessórios: 4, Esportes: 5 };
const CATEGORY_BY_ID = { 1: 'Masculino', 2: 'Feminino', 3: 'Calçados', 4: 'Acessórios', 5: 'Esportes' };
const CATEGORY_ALIASES = { Calcados: 'Calçados', Acessorios: 'Acessórios' };

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    nome: 'Nike Tênis Velocity Pro',
    descricao: 'Tênis de corrida com amortecimento responsivo para treinos de alta intensidade.',
    preco: 499.9,
    imagem: 'https://m.media-amazon.com/images/I/81j4AXVz5tL._AC_SY575_.jpg',
    categoria: 'Calçados',
    genero: 'Masculino',
    tamanhos: '38,39,40,41,42,43',
    modalidade: 'Corrida',
    estoque: 15,
    marca: 'Nike',
    cashback: 5,
    avaliacaoMedia: 4.9,
    quantidadeAvaliacoes: 12,
    badgeLancamento: true,
    desconto: 10,
    vendas: 21,
    createdAt: '2026-03-29T10:00:00.000Z'
  },
  {
    id: 2,
    nome: 'Adidas Legging Motion Fit',
    descricao: 'Legging de compressão com tecido elástico e secagem rápida para academia.',
    preco: 189.9,
    imagem: 'https://static.ativaesportes.com.br/public/ativaesportes/imagens/produtos/calca-adidas-legging-3-stripes-feminina-gb4350-64ef58a2bd551.jpg',
    categoria: 'Feminino',
    genero: 'Feminino',
    tamanhos: 'P,M,G,GG',
    modalidade: 'Academia',
    estoque: 24,
    marca: 'Adidas',
    cashback: 4,
    avaliacaoMedia: 4.8,
    quantidadeAvaliacoes: 18,
    badgeLancamento: true,
    desconto: 0,
    vendas: 19,
    createdAt: '2026-03-25T10:00:00.000Z'
  },
  {
    id: 3,
    nome: 'Puma Camisa Dry Power',
    descricao: 'Camisa dry fit para treinos com ventilação e conforto térmico.',
    preco: 129.9,
    imagem: 'https://images.puma.com/image/upload/f_auto,q_auto,w_600,b_rgb:FAFAFA/global/526718/51/mod01/fnd/BRA/fmt/png',
    categoria: 'Masculino',
    genero: 'Masculino',
    tamanhos: 'P,M,G,GG',
    modalidade: 'Academia',
    estoque: 30,
    marca: 'Puma',
    cashback: 3,
    avaliacaoMedia: 4.7,
    quantidadeAvaliacoes: 8,
    badgeLancamento: false,
    desconto: 0,
    vendas: 11,
    createdAt: '2026-03-18T10:00:00.000Z'
  },
  {
    id: 4,
    nome: 'Nike Chuteira Strike Elite',
    descricao: 'Chuteira para campo com tração aprimorada e estabilidade em mudanças rápidas.',
    preco: 379.9,
    imagem: 'https://d1a9qnv764bsoo.cloudfront.net/stores/002/341/698/rte/chuteira-nike-mercurial-superfly-9-elite-fg-rising-gem-%20cinza-preta.png',
    categoria: 'Calçados',
    genero: 'Masculino',
    tamanhos: '37,38,39,40,41,42',
    modalidade: 'Futebol',
    estoque: 12,
    marca: 'Nike',
    cashback: 5,
    avaliacaoMedia: 4.8,
    quantidadeAvaliacoes: 14,
    badgeLancamento: true,
    desconto: 15,
    vendas: 24,
    createdAt: '2026-04-02T10:00:00.000Z'
  },
  {
    id: 5,
    nome: 'Under Armour Garrafa Thermal Sport',
    descricao: 'Garrafa térmica com vedação reforçada para manter a temperatura por mais tempo.',
    preco: 79.9,
    imagem: 'https://m.media-amazon.com/images/I/81d6Bu+04aL.jpg',
    categoria: 'Acessórios',
    genero: 'Unissex',
    tamanhos: 'Único',
    modalidade: 'Corrida',
    estoque: 40,
    marca: 'Under Armour',
    cashback: 2,
    avaliacaoMedia: 4.6,
    quantidadeAvaliacoes: 28,
    badgeLancamento: false,
    desconto: 5,
    vendas: 32,
    createdAt: '2026-03-10T10:00:00.000Z'
  }
];

let state = {
  cart: [],
  wishlist: [],
  cashbackBalance: 0,
  currentUser: null,
  authToken: '',
  allProducts: [],
  reviewsByProduct: {},
  productSales: {},
  accountView: 'overview',
  activeProductId: null,
  ratingSort: 'recentes'
};

const currency = (value) =>
  Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

function normalizeCategory(name = '') {
  return CATEGORY_ALIASES[name] || name;
}

function normalizeProduct(product) {
  const preco = Number(product.preco ?? product.price ?? 0);
  const desconto = Number(product.desconto ?? product.discount ?? 0);
  const categoria = normalizeCategory(product.categoria || product.category || CATEGORY_BY_ID[product.id_categoria] || 'Esportes');
  const genero = product.genero || product.gender || 'Unissex';
  const modalidade = product.modalidade || product.sport || 'Treino';
  const nome = product.nome || product.title || 'Produto SportX';
  const avaliacaoMedia = Number(product.avaliacaoMedia ?? product.rating ?? product.media_avaliacao ?? 0);
  const quantidadeAvaliacoes = Number(product.quantidadeAvaliacoes ?? product.total_avaliacoes ?? 0);
  const cashback = Number(product.cashback ?? 0);

  return {
    id: Number(product.id ?? product.id_produto ?? Date.now()),
    nome,
    descricao: product.descricao || product.description || 'Produto esportivo SportX.',
    preco,
    imagem: product.imagem || product.image || 'https://via.placeholder.com/600x600?text=SportX',
    categoria,
    genero,
    tamanhos: product.tamanhos || product.numeracao || product.sizes || 'Único',
    modalidade,
    estoque: Number(product.estoque ?? product.stock ?? 0),
    marca: product.marca || product.brand || 'SportX',
    cashback,
    avaliacaoMedia,
    quantidadeAvaliacoes,
    badgeLancamento: Boolean(product.badgeLancamento ?? product.isNew ?? false),
    desconto,
    vendas: Number(product.vendas ?? product.sales ?? 0),
    createdAt: product.createdAt || product.created_at || new Date().toISOString(),
    source: product.source || 'catalog'
  };
}

function discountedPrice(product) {
  const discount = Number(product.desconto || 0);
  if (!discount) return Number(product.preco);
  return Number((product.preco * (1 - discount / 100)).toFixed(2));
}

function loadSession() {
  state.cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || '[]');
  state.wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.wishlist) || '[]');
  state.cashbackBalance = Number(localStorage.getItem(STORAGE_KEYS.cashback) || '0');
  state.currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || sessionStorage.getItem(STORAGE_KEYS.user) || 'null');
  state.authToken = localStorage.getItem(STORAGE_KEYS.token) || sessionStorage.getItem(STORAGE_KEYS.token) || '';
  state.reviewsByProduct = JSON.parse(localStorage.getItem(STORAGE_KEYS.localReviews) || '{}');
  state.productSales = JSON.parse(localStorage.getItem(STORAGE_KEYS.productSales) || '{}');
}

function persistSession() {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state.cart));
  localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(state.wishlist));
  localStorage.setItem(STORAGE_KEYS.cashback, String(state.cashbackBalance));
  localStorage.setItem(STORAGE_KEYS.localReviews, JSON.stringify(state.reviewsByProduct));
  localStorage.setItem(STORAGE_KEYS.productSales, JSON.stringify(state.productSales));
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove('show'), 2500);
}

async function apiRequest(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.authToken) headers.Authorization = `Bearer ${state.authToken}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Erro na API');
  }
  if (res.status === 204) return null;
  return res.json();
}

async function loadProducts() {
  let apiProducts = [];
  try {
    const response = await apiRequest('/produtos');
    apiProducts = Array.isArray(response)
      ? response.map((item) =>
          normalizeProduct({
            ...item,
            categoria: CATEGORY_BY_ID[item.id_categoria] || item.genero,
            modalidade: item.modalidade || item.genero,
            desconto: item.desconto || 0,
            marca: item.marca || 'SportX',
            badgeLancamento: Boolean(item.lancamento)
          })
        )
      : [];
  } catch (_error) {
    apiProducts = [];
  }

  const localProducts = JSON.parse(localStorage.getItem(STORAGE_KEYS.localProducts) || '[]').map(normalizeProduct);

  const base = [...DEFAULT_PRODUCTS.map(normalizeProduct), ...apiProducts, ...localProducts];
  const dedup = new Map();
  base.forEach((product) => dedup.set(product.id, { ...product, vendas: Number(state.productSales[product.id] || product.vendas || 0) }));
  state.allProducts = [...dedup.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getProductById(id) {
  return state.allProducts.find((item) => Number(item.id) === Number(id));
}

function computeLiveRating(product) {
  const localReviews = state.reviewsByProduct[product.id] || [];
  if (!localReviews.length) return { avg: Number(product.avaliacaoMedia || 0), qty: Number(product.quantidadeAvaliacoes || 0) };
  const avg = localReviews.reduce((sum, r) => sum + Number(r.nota || 0), 0) / localReviews.length;
  return { avg: Number(avg.toFixed(1)), qty: localReviews.length };
}

function getFilteredProductsFromControls(prefix = '') {
  const getVal = (id) => document.getElementById(`${prefix}${id}`)?.value || '';
  const search = getVal('searchInput').trim().toLowerCase();
  const category = getVal('categoryFilter');
  const gender = getVal('genderFilter');
  const minRating = Number(getVal('ratingFilter') || 0);
  const maxPrice = Number(getVal('priceFilter') || 0);
  const sort = getVal('sortFilter') || 'recentes';

  const urlCategory = new URLSearchParams(window.location.search).get('categoria');
  const forcedCategory = document.body.dataset.page === 'category' ? normalizeCategory(urlCategory || '') : '';

  let result = state.allProducts.filter((product) => {
    const pool = `${product.nome} ${product.categoria} ${product.marca} ${product.modalidade}`.toLowerCase();
    const rating = computeLiveRating(product).avg;

    if (forcedCategory && product.categoria !== forcedCategory && product.genero !== forcedCategory && product.modalidade !== forcedCategory) return false;
    if (search && !pool.includes(search)) return false;
    if (category && product.categoria !== category && product.genero !== category && product.modalidade !== category) return false;
    if (gender && product.genero !== gender) return false;
    if (maxPrice && discountedPrice(product) > maxPrice) return false;
    if (minRating && rating < minRating) return false;
    return true;
  });

  result = result.sort((a, b) => {
    const ar = computeLiveRating(a).avg;
    const br = computeLiveRating(b).avg;
    if (sort === 'preco-menor') return discountedPrice(a) - discountedPrice(b);
    if (sort === 'preco-maior') return discountedPrice(b) - discountedPrice(a);
    if (sort === 'melhor-avaliacao') return br - ar;
    if (sort === 'mais-vendidos') return Number(b.vendas || 0) - Number(a.vendas || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return result;
}

function renderProductCard(product) {
  const inWishlist = state.wishlist.includes(product.id);
  const rating = computeLiveRating(product);
  const hasDiscount = Number(product.desconto || 0) > 0;
  const currentPrice = discountedPrice(product);
  const originalPrice = Number(product.preco || 0);

  return `
    <article class="product-card ${product.badgeLancamento ? 'is-new' : ''}">
      <div class="product-media">
        <img src="${product.imagem}" alt="${product.nome}" loading="lazy" />
        ${product.badgeLancamento ? '<span class="new-tag">Novo</span>' : ''}
        ${hasDiscount ? `<span class="discount-tag">-${product.desconto}%</span>` : ''}
      </div>
      <div class="product-body">
        <div class="product-headline">
          <small>${product.marca} • ${product.modalidade}</small>
          <h3>${product.nome}</h3>
        </div>
        <p>${product.descricao}</p>
        <div class="product-rating-row">⭐ ${rating.avg || '0.0'} <span>(${rating.qty} avaliações)</span></div>
        <div class="product-meta">
          <div class="price-wrap">
            <strong>${currency(currentPrice)}</strong>
            ${hasDiscount ? `<span class="old-price">${currency(originalPrice)}</span>` : '<span>Preço regular</span>'}
          </div>
          <span class="badge badge-cashback">${product.cashback}% cashback</span>
        </div>
        <div class="product-actions">
          <button class="btn-card btn-dark" data-action="cart" data-id="${product.id}">Adicionar</button>
          <button class="btn-card btn-light" data-action="details" data-id="${product.id}">Ver detalhes</button>
          <button class="btn-card btn-light ${inWishlist ? 'active' : ''}" data-action="wish" data-id="${product.id}">${inWishlist ? '♥ Favorito' : '♡ Favoritar'}</button>
        </div>
      </div>
    </article>
  `;
}

function renderEmpty(target, title = 'Nenhum produto encontrado') {
  target.innerHTML = `
    <div class="empty-state">
      <h3>${title}</h3>
      <p>Tente ajustar busca, filtros ou publique o primeiro produto da categoria.</p>
      <a class="btn btn-light" href="vender.html">Publicar produto</a>
    </div>
  `;
}

function renderSkeleton(target) {
  target.innerHTML = Array.from({ length: 4 })
    .map(
      () => `<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>`
    )
    .join('');
}

function renderGrid(id, products, emptyTitle) {
  const target = document.getElementById(id);
  if (!target) return;
  if (!products.length) return renderEmpty(target, emptyTitle);
  target.innerHTML = products.map(renderProductCard).join('');
}

function renderStorefront() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  renderSkeleton(grid);
  setTimeout(() => {
    const allFiltered = getFilteredProductsFromControls('');
    renderGrid('productsGrid', allFiltered, 'Nenhum produto na vitrine principal');

    const recents = [...state.allProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
    const bestRated = [...state.allProducts]
      .sort((a, b) => computeLiveRating(b).avg - computeLiveRating(a).avg)
      .slice(0, 6);
    const offers = state.allProducts.filter((p) => Number(p.desconto || 0) > 0).slice(0, 6);

    renderGrid('recentProductsGrid', recents, 'Sem recém-publicados');
    renderGrid('bestRatedGrid', bestRated, 'Sem avaliações ainda');
    renderGrid('offersGrid', offers, 'Sem ofertas no momento');
    renderGrid('launchCarousel', state.allProducts.filter((p) => p.badgeLancamento), 'Sem lançamentos');
    renderGrid(
      'bestSellersGrid',
      [...state.allProducts].sort((a, b) => Number(b.vendas || 0) - Number(a.vendas || 0)).slice(0, 6),
      'Sem dados de vendas'
    );
    renderGrid('monthlyPromotionsGrid', offers, 'Sem promoções no mês');
  }, 200);
}

function renderCategoryPage() {
  const titleEl = document.getElementById('categoryPageTitle');
  if (!titleEl) return;

  const category = normalizeCategory(new URLSearchParams(window.location.search).get('categoria') || 'Categoria');
  titleEl.textContent = category;

  const filtered = getFilteredProductsFromControls('category');
  renderGrid('productsGrid', filtered, `Nenhum produto em ${category}`);
}

function cartTotals() {
  const subtotal = state.cart.reduce((acc, item) => {
    const product = getProductById(item.id);
    if (!product) return acc;
    return acc + discountedPrice(product) * item.qty;
  }, 0);

  const cashback = state.cart.reduce((acc, item) => {
    const product = getProductById(item.id);
    if (!product) return acc;
    return acc + discountedPrice(product) * item.qty * (Number(product.cashback || 0) / 100);
  }, 0);

  return { subtotal, cashback, total: subtotal };
}

function updateCounters() {
  const cartCount = state.cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const wishCount = state.wishlist.length;
  const cartCountEl = document.getElementById('cartCount');
  const wishlistCountEl = document.getElementById('wishlistCount');
  if (cartCountEl) cartCountEl.textContent = cartCount;
  if (wishlistCountEl) wishlistCountEl.textContent = wishCount;

  const balance = document.getElementById('cashbackBalance');
  if (balance) balance.textContent = currency(state.cashbackBalance);
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  if (!cartItems) return;

  if (!state.cart.length) {
    cartItems.innerHTML = '<div class="panel"><h3>Seu carrinho está vazio</h3><p>Adicione produtos para continuar.</p></div>';
  } else {
    cartItems.innerHTML = state.cart
      .map((item) => {
        const product = getProductById(item.id);
        if (!product) return '';
        return `
          <div class="drawer-item">
            <img src="${product.imagem}" alt="${product.nome}" />
            <div>
              <strong>${product.nome}</strong>
              <small>${currency(discountedPrice(product))}</small>
              <div class="qty">
                <button data-action="qty-minus" data-id="${product.id}">−</button>
                <span>${item.qty}</span>
                <button data-action="qty-plus" data-id="${product.id}">+</button>
              </div>
            </div>
            <button class="icon-btn" data-action="remove-cart" data-id="${product.id}">✕</button>
          </div>
        `;
      })
      .join('');
  }

  const totals = cartTotals();
  const subtotal = document.getElementById('cartSubtotal');
  const cashback = document.getElementById('cartCashback');
  const total = document.getElementById('cartTotal');
  if (subtotal) subtotal.textContent = currency(totals.subtotal);
  if (cashback) cashback.textContent = currency(totals.cashback);
  if (total) total.textContent = currency(totals.total);
}

function renderWishlist() {
  const wrapper = document.getElementById('wishlistItems');
  if (!wrapper) return;

  if (!state.wishlist.length) {
    wrapper.innerHTML = '<div class="panel"><h3>Nenhum item salvo</h3><p>Use o coração nos produtos para montar sua wishlist.</p></div>';
    return;
  }

  wrapper.innerHTML = state.wishlist
    .map((id) => {
      const product = getProductById(id);
      if (!product) return '';
      return `
        <div class="drawer-item">
          <img src="${product.imagem}" alt="${product.nome}" />
          <div>
            <strong>${product.nome}</strong>
            <small>${currency(discountedPrice(product))}</small>
            <button class="btn btn-light" data-action="cart" data-id="${product.id}">Adicionar</button>
          </div>
          <button class="icon-btn" data-action="wish" data-id="${product.id}">✕</button>
        </div>
      `;
    })
    .join('');
}

function renderCheckout() {
  const summary = document.getElementById('checkoutSummary');
  if (!summary) return;

  if (!state.cart.length) {
    summary.innerHTML = '<p>Nenhum item no pedido.</p>';
  } else {
    summary.innerHTML = state.cart
      .map((item) => {
        const product = getProductById(item.id);
        if (!product) return '';
        return `<div class="summary-row"><span>${product.nome} x${item.qty}</span><strong>${currency(discountedPrice(product) * item.qty)}</strong></div>`;
      })
      .join('');
  }

  const totals = cartTotals();
  document.getElementById('checkoutSubtotal') && (document.getElementById('checkoutSubtotal').textContent = currency(totals.subtotal));
  document.getElementById('checkoutCashback') && (document.getElementById('checkoutCashback').textContent = currency(totals.cashback));
  document.getElementById('checkoutTotal') && (document.getElementById('checkoutTotal').textContent = currency(totals.total));
}

function addToCart(id) {
  const product = getProductById(id);
  if (!product) return;
  const item = state.cart.find((c) => Number(c.id) === Number(id));
  if (item) item.qty += 1;
  else state.cart.push({ id: Number(id), qty: 1 });

  persistSession();
  renderCart();
  renderCheckout();
  updateCounters();
  showToast('Produto adicionado ao carrinho.');
}

function changeQty(id, delta) {
  const item = state.cart.find((c) => Number(c.id) === Number(id));
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) state.cart = state.cart.filter((c) => Number(c.id) !== Number(id));

  persistSession();
  renderCart();
  renderCheckout();
  updateCounters();
}

function toggleWish(id) {
  const parsed = Number(id);
  if (state.wishlist.includes(parsed)) {
    state.wishlist = state.wishlist.filter((item) => item !== parsed);
    showToast('Removido dos favoritos.');
  } else {
    state.wishlist.push(parsed);
    showToast('Adicionado aos favoritos.');
  }
  persistSession();
  renderWishlist();
  renderStorefront();
  if (document.body.dataset.page === 'category') renderCategoryPage();
  updateCounters();
}

function addAllWishlistToCart() {
  if (!state.wishlist.length) return showToast('Sua wishlist está vazia.');
  [...state.wishlist].forEach((id) => addToCart(id));
}

function renderProductModal(product) {
  const content = document.getElementById('productModalContent');
  if (!content) return;

  const reviews = [...(state.reviewsByProduct[product.id] || [])];
  if (state.ratingSort === 'nota') reviews.sort((a, b) => Number(b.nota) - Number(a.nota));
  else reviews.sort((a, b) => new Date(b.data) - new Date(a.data));

  const rating = computeLiveRating(product);
  const hasDiscount = Number(product.desconto || 0) > 0;
  content.innerHTML = `
    <img src="${product.imagem}" alt="${product.nome}" />
    <div>
      <h3>${product.nome}</h3>
      <p>${product.descricao}</p>
      <div class="product-modal-meta">
        <span><strong>Preço:</strong> ${currency(discountedPrice(product))}</span>
        ${hasDiscount ? `<span><strong>De:</strong> <s>${currency(product.preco)}</s></span>` : ''}
        <span><strong>Marca:</strong> ${product.marca}</span>
        <span><strong>Avaliação:</strong> ⭐ ${rating.avg} (${rating.qty})</span>
      </div>
      <button class="btn btn-primary top-gap-sm" data-action="cart" data-id="${product.id}">Adicionar ao carrinho</button>

      <div class="reviews-head top-gap-sm">
        <h4>Avaliações</h4>
        <select id="reviewSortSelect">
          <option value="recentes" ${state.ratingSort === 'recentes' ? 'selected' : ''}>Mais recentes</option>
          <option value="nota" ${state.ratingSort === 'nota' ? 'selected' : ''}>Melhor nota</option>
        </select>
      </div>
      <div class="review-list">${
        reviews.length
          ? reviews
              .map(
                (review) => `
          <article class="review-item">
            <header><strong>${review.usuario}</strong><span>⭐ ${review.nota}</span></header>
            <p>${review.comentario}</p>
            <small>${new Date(review.data).toLocaleDateString('pt-BR')}</small>
          </article>`
              )
              .join('')
          : '<p>Ainda sem avaliações.</p>'
      }</div>

      <form id="reviewForm" class="top-gap-sm">
        <div class="input-group">
          <label>Nota</label>
          <select id="reviewRating" required><option value="">Selecione</option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option></select>
        </div>
        <div class="input-group">
          <label>Comentário</label>
          <textarea id="reviewComment" rows="3" required></textarea>
        </div>
        <button class="btn btn-light" type="submit">Enviar avaliação</button>
      </form>
    </div>
  `;

  document.getElementById('reviewSortSelect')?.addEventListener('change', (event) => {
    state.ratingSort = event.target.value;
    renderProductModal(product);
  });

  document.getElementById('reviewForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!state.currentUser) return showToast('Faça login para avaliar.');

    const nota = Number(document.getElementById('reviewRating').value || 0);
    const comentario = document.getElementById('reviewComment').value.trim();
    if (!comentario) return showToast('Comentário não pode ser vazio.');

    const list = state.reviewsByProduct[product.id] || [];
    const last = list[0];
    if (last && last.usuario === (state.currentUser.name || state.currentUser.email) && last.comentario === comentario && Number(last.nota) === nota) {
      return showToast('Evite enviar avaliações iguais em sequência.');
    }

    const reviewPayload = {
      usuario: state.currentUser.name || state.currentUser.email,
      nota,
      comentario,
      data: new Date().toISOString()
    };

    try {
      await apiRequest('/avaliacoes', {
        method: 'POST',
        body: JSON.stringify({
          id_usuario: state.currentUser.id_usuario,
          id_produto: product.id,
          nota,
          comentario
        })
      });
    } catch (_error) {
      // fallback localStorage
    }

    list.unshift(reviewPayload);
    state.reviewsByProduct[product.id] = list.slice(0, 50);
    persistSession();
    showToast('Avaliação enviada com sucesso.');
    renderProductModal(product);
    renderStorefront();
    if (document.body.dataset.page === 'category') renderCategoryPage();
  });
}

function openProductDetails(id) {
  const product = getProductById(id);
  if (!product) return;
  state.activeProductId = Number(id);
  renderProductModal(product);
  toggleProductModal(true);
}

function toggleDrawer(id, force) {
  const element = document.getElementById(id);
  if (!element) return;
  element.classList.toggle('open', force ?? !element.classList.contains('open'));
}

function toggleCart(force) {
  toggleDrawer('cartDrawer', force);
}

function toggleWishlist(force) {
  toggleDrawer('wishlistDrawer', force);
}

function toggleCheckout(force) {
  toggleDrawer('checkoutModal', force);
}

function toggleProductModal(force) {
  toggleDrawer('productModal', force);
}

function toggleAuthModal(force) {
  toggleDrawer('authModal', force);
}

function toggleChat(force) {
  toggleDrawer('chatBox', force);
}

function updateAccountButton() {
  const label = document.getElementById('accountLabel');
  const sub = document.getElementById('accountSubLabel');
  const icon = document.getElementById('accountIcon');
  const typeLabel = document.getElementById('accountDropdownType');
  const nameLabel = document.getElementById('accountDropdownName');
  const sellerMenuBtn = document.getElementById('sellerMenuBtn');

  if (!label) return;
  if (!state.currentUser) {
    label.textContent = 'Entrar / Cadastrar';
    if (sub) sub.textContent = 'Acesse sua conta';
    if (icon) icon.textContent = '👤';
    if (typeLabel) typeLabel.textContent = 'Minha conta';
    if (nameLabel) nameLabel.textContent = 'Olá';
    if (sellerMenuBtn) sellerMenuBtn.style.display = 'none';
    return;
  }

  const isSeller = state.currentUser.type === 'vendedor';
  label.textContent = state.currentUser.name || state.currentUser.email;
  if (sub) sub.textContent = isSeller ? 'Painel do vendedor' : 'Conta de comprador';
  if (icon) icon.textContent = isSeller ? '🏪' : '👤';
  if (nameLabel) nameLabel.textContent = state.currentUser.name || state.currentUser.email;
  if (typeLabel) typeLabel.textContent = isSeller ? 'Usuário vendedor' : 'Usuário comprador';
  if (sellerMenuBtn) sellerMenuBtn.style.display = isSeller ? 'block' : 'none';

  renderAccountPanel();
}

function renderAccountPanel() {
  const panel = document.getElementById('accountPanelContent');
  if (!panel || !state.currentUser) return;

  const isSeller = state.currentUser.type === 'vendedor';

  if (isSeller) {
    const sellerProducts = state.allProducts.filter((p) => p.source === 'seller-local' || p.source === 'seller-api');
    panel.innerHTML = `
      <div class="panel-section">
        <h4>Meus produtos publicados (${sellerProducts.length})</h4>
        ${
          sellerProducts.length
            ? sellerProducts
                .map(
                  (p) => `
            <div class="account-item">
              <div>
                <strong>${p.nome}</strong>
                <small>Estoque: ${p.estoque} • ${currency(discountedPrice(p))}</small>
              </div>
              <div class="account-actions">
                <button class="btn btn-light" data-action="edit-product" data-id="${p.id}">Editar</button>
                <button class="btn btn-light" data-action="delete-product" data-id="${p.id}">Excluir</button>
              </div>
            </div>`
                )
                .join('')
            : '<p>Você ainda não publicou produtos.</p>'
        }
      </div>
    `;
  } else {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || '[]');
    const userOrders = orders.filter((order) => order.user === (state.currentUser.email || ''));
    const userReviews = Object.values(state.reviewsByProduct)
      .flat()
      .filter((review) => review.usuario === (state.currentUser.name || state.currentUser.email));

    panel.innerHTML = `
      <div class="panel-section"><h4>Meus pedidos (${userOrders.length})</h4><p>${userOrders.length ? 'Pedidos registrados localmente.' : 'Sem pedidos ainda.'}</p></div>
      <div class="panel-section"><h4>Favoritos (${state.wishlist.length})</h4><p>Seus itens favoritos ficam salvos aqui.</p></div>
      <div class="panel-section"><h4>Avaliações enviadas (${userReviews.length})</h4><p>Você pode revisar produtos no modal de detalhes.</p></div>
    `;
  }
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const mode = document.getElementById('authForm').dataset.mode || 'register';
  const name = document.getElementById('authName').value.trim();
  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const password = document.getElementById('authPassword').value.trim();
  const type = document.getElementById('authType').value;

  if (!email || !password) return showToast('Preencha email e senha.');

  try {
    if (mode === 'register') {
      if (!name) return showToast('Informe seu nome.');
      const user = await apiRequest('/usuarios', {
        method: 'POST',
        body: JSON.stringify({ nome: name, email, senha: password, tipo_usuario: type === 'comprador' ? 'cliente' : type })
      });

      state.currentUser = {
        id_usuario: user.id_usuario,
        name: user.nome,
        email: user.email,
        type: user.tipo_usuario === 'cliente' ? 'comprador' : user.tipo_usuario
      };
      showToast('Conta criada com sucesso.');
    } else {
      const login = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha: password }) });
      state.authToken = login.access_token || '';
      state.currentUser = {
        id_usuario: login.user?.id_usuario,
        name: login.user?.nome,
        email: login.user?.email,
        type: login.user?.tipo_usuario === 'cliente' ? 'comprador' : login.user?.tipo_usuario
      };
      showToast('Login realizado com sucesso.');
    }
  } catch (_error) {
    state.currentUser = { id_usuario: Date.now(), name: name || email.split('@')[0], email, type };
    showToast('API indisponível. Sessão local ativada.');
  }

  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(state.currentUser));
  if (state.authToken) localStorage.setItem(STORAGE_KEYS.token, state.authToken);
  updateAccountButton();
  toggleAuthModal(false);
}

function setupAuthControls() {
  const form = document.getElementById('authForm');
  if (!form) return;
  form.dataset.mode = 'register';

  const update = () => {
    const isRegister = form.dataset.mode === 'register';
    document.getElementById('authTitle').textContent = isRegister ? 'Criar conta' : 'Entrar';
    document.getElementById('authSubmitBtn').textContent = isRegister ? 'Criar conta' : 'Entrar';
    document.getElementById('toggleAuthModeBtn').textContent = isRegister ? 'Já tenho login' : 'Criar conta';
    document.getElementById('nameField').style.display = isRegister ? 'block' : 'none';
    document.getElementById('accountTypeField').style.display = isRegister ? 'block' : 'none';
  };

  document.getElementById('toggleAuthModeBtn')?.addEventListener('click', () => {
    form.dataset.mode = form.dataset.mode === 'register' ? 'login' : 'register';
    update();
  });
  form.addEventListener('submit', handleAuthSubmit);
  update();
}

async function handleSellerForm(event) {
  event.preventDefault();
  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || sessionStorage.getItem(STORAGE_KEYS.user) || 'null');
  if (!user || user.type !== 'vendedor') {
    showToast('Faça login como vendedor para publicar.');
    return;
  }

  const get = (id) => document.getElementById(id);
  const parseFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  let imagem = get('sellerProductImage').value.trim();
  const file = get('sellerProductImageFile').files?.[0];
  if (file) imagem = await parseFile(file);

  const payload = normalizeProduct({
    id: Date.now(),
    nome: get('sellerProductName').value.trim(),
    descricao: get('sellerProductDescription').value.trim(),
    preco: Number(get('sellerProductPrice').value || 0),
    imagem,
    categoria: get('sellerProductCategory').value,
    genero: get('sellerProductGender').value,
    tamanhos: get('sellerProductSizes').value.trim(),
    modalidade: get('sellerProductSport').value.trim() || 'Treino',
    estoque: Number(get('sellerProductStock').value || 0),
    marca: get('sellerProductBrand').value.trim() || 'SportX',
    cashback: Number(get('sellerProductCashback').value || 0),
    badgeLancamento: get('sellerProductLaunch').checked,
    desconto: Number(get('sellerProductDiscount').value || 0),
    source: 'seller-local',
    createdAt: new Date().toISOString()
  });

  let persistedInApi = false;
  try {
    const apiResponse = await apiRequest('/produtos', {
      method: 'POST',
      body: JSON.stringify({
        id_categoria: CATEGORY_MAP[payload.categoria] || 5,
        nome: payload.nome,
        descricao: payload.descricao,
        preco: payload.preco,
        estoque: payload.estoque,
        imagem: payload.imagem,
        genero: payload.genero,
        numeracao: payload.tamanhos,
        ativo: true,
        marca: payload.marca,
        desconto: payload.desconto,
        lancamento: payload.badgeLancamento,
        modalidade: payload.modalidade,
        cashback: payload.cashback
      })
    });

    payload.id = Number(apiResponse?.id_produto || payload.id);
    payload.source = 'seller-api';
    persistedInApi = true;
  } catch (_error) {
    persistedInApi = false;
  }

  const localProducts = JSON.parse(localStorage.getItem(STORAGE_KEYS.localProducts) || '[]').map(normalizeProduct);
  const merged = [payload, ...localProducts.filter((p) => Number(p.id) !== Number(payload.id))];
  localStorage.setItem(STORAGE_KEYS.localProducts, JSON.stringify(merged));
  localStorage.setItem(STORAGE_KEYS.productsUpdated, String(Date.now()));

  document.getElementById('sellerProductForm').reset();

  const feedback = document.getElementById('sellerPublishFeedback');
  if (feedback) {
    feedback.innerHTML = `
      <div class="publish-success">
        <h3>Produto publicado com sucesso!</h3>
        <p>${persistedInApi ? 'Publicado via API e sincronizado na vitrine.' : 'API indisponível: produto salvo no localStorage como fallback.'}</p>
        <a class="btn btn-primary" href="category.html?categoria=${encodeURIComponent(payload.categoria)}">Ver produto publicado</a>
      </div>
    `;
  }

  showToast('Produto publicado e pronto para venda.');
}

function setupSellerForm() {
  const form = document.getElementById('sellerProductForm');
  if (!form) return;
  form.addEventListener('submit', handleSellerForm);
}

function handleGlobalClicks(event) {
  const actionNode = event.target.closest('[data-action]');
  if (!actionNode) return;

  const action = actionNode.dataset.action;
  const id = Number(actionNode.dataset.id);

  if (action === 'cart') addToCart(id);
  if (action === 'wish') toggleWish(id);
  if (action === 'details') openProductDetails(id);
  if (action === 'qty-minus') changeQty(id, -1);
  if (action === 'qty-plus') changeQty(id, 1);
  if (action === 'remove-cart') {
    state.cart = state.cart.filter((item) => Number(item.id) !== id);
    persistSession();
    renderCart();
    renderCheckout();
    updateCounters();
  }
  if (action === 'delete-product') {
    const localProducts = JSON.parse(localStorage.getItem(STORAGE_KEYS.localProducts) || '[]').filter((item) => Number(item.id) !== id);
    localStorage.setItem(STORAGE_KEYS.localProducts, JSON.stringify(localProducts));
    loadProducts().then(() => {
      renderStorefront();
      renderAccountPanel();
      showToast('Produto excluído.');
    });
  }
  if (action === 'edit-product') {
    showToast('Edição rápida: acesse a página vender para atualizar o cadastro.');
  }
}

function setupNavigationAndActions() {
  document.getElementById('openAuthBtn')?.addEventListener('click', () => {
    if (state.currentUser) toggleDrawer('accountDropdown');
    else toggleAuthModal(true);
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    state.currentUser = null;
    state.authToken = '';
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.token);
    sessionStorage.removeItem(STORAGE_KEYS.user);
    sessionStorage.removeItem(STORAGE_KEYS.token);
    updateAccountButton();
    showToast('Sessão encerrada.');
  });

  document.getElementById('sellerMenuBtn')?.addEventListener('click', () => {
    window.location.href = 'vender.html';
  });

  document.getElementById('cartToggle')?.addEventListener('click', () => toggleCart(true));
  document.getElementById('wishlistToggle')?.addEventListener('click', () => toggleWishlist(true));
  document.getElementById('addAllWishlistBtn')?.addEventListener('click', addAllWishlistToCart);
  document.getElementById('closeAuthBtn')?.addEventListener('click', () => toggleAuthModal(false));
  document.getElementById('chatFab')?.addEventListener('click', () => toggleChat());

  document.addEventListener('click', handleGlobalClicks);
}

function setupCategoryCards() {
  document.querySelectorAll('.category-card').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (card.dataset.redirectOnly === 'true') return;
      event.preventDefault();
      const href = card.getAttribute('href');
      if (href) window.location.href = href;
    });
  });
}

function setupFilters(prefix = '') {
  const ids = ['searchInput', 'categoryFilter', 'genderFilter', 'ratingFilter', 'priceFilter', 'sortFilter'];
  ids.forEach((id) => {
    document.getElementById(`${prefix}${id}`)?.addEventListener('input', () => {
      if (document.body.dataset.page === 'category') renderCategoryPage();
      else renderStorefront();
    });
    document.getElementById(`${prefix}${id}`)?.addEventListener('change', () => {
      if (document.body.dataset.page === 'category') renderCategoryPage();
      else renderStorefront();
    });
  });
}

function setupOrderFlow() {
  document.getElementById('checkoutOpenBtn')?.addEventListener('click', () => {
    if (!state.currentUser) return showToast('Faça login para continuar no checkout.');
    if (!state.cart.length) return showToast('Seu carrinho está vazio.');
    renderCheckout();
    toggleCheckout(true);
  });

  document.getElementById('finishOrderBtn')?.addEventListener('click', async () => {
    if (!state.currentUser) return showToast('Faça login para finalizar.');
    if (!state.cart.length) return showToast('Seu carrinho está vazio.');

    const totals = cartTotals();
    const orderRecord = {
      id: Date.now(),
      user: state.currentUser.email,
      total: totals.total,
      items: state.cart,
      date: new Date().toISOString()
    };

    try {
      await apiRequest('/pedidos', {
        method: 'POST',
        body: JSON.stringify({
          id_usuario: state.currentUser.id_usuario,
          id_endereco: 1,
          status: 'pendente',
          total: totals.total,
          forma_pagamento: 'pix'
        })
      });
    } catch (_error) {
      const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || '[]');
      orders.unshift(orderRecord);
      localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    }

    state.cashbackBalance += totals.cashback;
    state.cart.forEach((item) => {
      state.productSales[item.id] = Number(state.productSales[item.id] || 0) + item.qty;
    });

    state.cart = [];
    persistSession();
    renderCart();
    renderCheckout();
    updateCounters();
    renderStorefront();
    toggleCheckout(false);
    showToast('Pedido confirmado com sucesso.');
  });
}

function setupAccountTabs() {
  document.querySelectorAll('[data-account-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.accountView = btn.dataset.accountView;
      document.querySelectorAll('[data-account-view]').forEach((n) => n.classList.remove('active'));
      btn.classList.add('active');
      renderAccountPanel();
    });
  });
}


function scrollCarousel(direction) {
  const carousel = document.getElementById('launchCarousel');
  if (!carousel) return;
  carousel.scrollBy({ left: direction * 320, behavior: 'smooth' });
}

function initPageSpecific() {
  const page = document.body.dataset.page;
  if (page === 'home') renderStorefront();
  if (page === 'category') renderCategoryPage();
  if (page === 'seller') setupSellerForm();
}

async function init() {
  loadSession();
  await loadProducts();

  setupNavigationAndActions();
  setupCategoryCards();
  setupFilters('');
  setupFilters('category');
  setupOrderFlow();
  setupAuthControls();
  setupAccountTabs();
  initPageSpecific();

  renderCart();
  renderWishlist();
  renderCheckout();
  updateCounters();
  updateAccountButton();

  window.addEventListener('storage', async (event) => {
    if (event.key === STORAGE_KEYS.productsUpdated) {
      await loadProducts();
      if (document.body.dataset.page === 'home') renderStorefront();
      if (document.body.dataset.page === 'category') renderCategoryPage();
      renderAccountPanel();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);

window.toggleCart = toggleCart;
window.toggleWishlist = toggleWishlist;
window.toggleCheckout = toggleCheckout;
window.toggleChat = toggleChat;
window.toggleAuthModal = toggleAuthModal;
window.toggleProductModal = toggleProductModal;
window.openProductDetails = openProductDetails;
window.toggleWish = toggleWish;
window.addToCart = addToCart;
window.addAllWishlistToCart = addAllWishlistToCart;
window.scrollCarousel = scrollCarousel;
