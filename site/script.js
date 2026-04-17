const API_BASE_URL = window.SPORTX_API_URL || 'http://localhost:3000';

const STORAGE_KEYS = {
  cart: 'sportx-cart',
  wishlist: 'sportx-wishlist',
  user: 'sportx-current-user',
  token: 'sportx-token',
  users: 'sportx-local-users',
  localProducts: 'sportx-local-products',
  localReviews: 'sportx-local-reviews',
  localSellerReviews: 'sportx-local-seller-reviews',
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

const DEFAULT_KITS = [
  {
    id: 'kit-corrida-1',
    nome: 'Kit Corrida Pro',
    descricao: 'Tênis + meia de compressão + camiseta dry fit.',
    imagem: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80',
    preco: 629.9,
    itens: ['Tênis Running', 'Meia Compressão', 'Camiseta Dry'],
  },
  {
    id: 'kit-academia-1',
    nome: 'Kit Treino Academia',
    descricao: 'Legging, top e luva para treino funcional.',
    imagem: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
    preco: 359.9,
    itens: ['Legging', 'Top esportivo', 'Luva Fitness'],
  },
  {
    id: 'kit-futebol-1',
    nome: 'Kit Futebol Performance',
    descricao: 'Camisa, short e meião para jogo.',
    imagem: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=900&q=80',
    preco: 299.9,
    itens: ['Camisa', 'Short', 'Meião'],
  },
];

const state = { cart: [], wishlist: [], currentUser: null, authToken: '', products: [], localReviews: {}, localSellerReviews: {}, authMode: 'login', pendingAction: null, shippingOption: null, shippingOptions: [], shippingOrigin: null, shippingZipCode: '' };

const FREE_SHIPPING_THRESHOLD = 400;

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
  const rawSizes = Array.isArray(p.tamanhos)
    ? p.tamanhos
    : String(p.tamanhos || p.numeracao || 'Único').split(',').map((size) => size.trim()).filter(Boolean);
  const parsedSizes = rawSizes.map((item) => {
    if (typeof item === 'object' && item !== null) {
      return {
        label: String(item.label || item.nome || item.size || 'Único'),
        disponivel: item.disponivel !== false && item.available !== false,
      };
    }
    const [label, rawAvailability] = String(item).split(':').map((part) => part.trim());
    return {
      label: label || String(item),
      disponivel: rawAvailability !== '0' && rawAvailability !== 'false',
    };
  });
  const firstImage = p.imagem || 'https://via.placeholder.com/600x600?text=SportX';
  const galeria = p.galeria_imagens ? String(p.galeria_imagens).split(',').map((i) => i.trim()).filter(Boolean) : [firstImage].filter(Boolean);
  const cores = Array.isArray(p.cores) ? p.cores : [{ nome: p.cor || 'Padrão', hex: p.corHex || '#c7c7c7', imagens: [firstImage, ...galeria].slice(0, 5) }];

  return {
    id: Number(p.id ?? p.id_produto ?? Date.now()),
    nome: p.nome || 'Produto',
    descricao: p.descricao || '',
    preco: Number(p.preco || 0),
    precoPromocional: Number(p.preco_promocional || 0),
    desconto: Number(p.desconto || 0),
    imagem: firstImage,
    galeria,
    cores,
    categoria: p.categoria || CATEGORY_BY_ID[p.id_categoria] || 'Esportes',
    genero: p.genero || 'Unissex',
    tamanhos: parsedSizes,
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

function sanitizeCep(value = '') {
  return String(value).replace(/\D/g, '').slice(0, 8);
}

function formatCep(value = '') {
  const digits = sanitizeCep(value);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function sanitizeCpf(value = '') {
  return String(value).replace(/\D/g, '').slice(0, 11);
}

function formatCpf(value = '') {
  const digits = sanitizeCpf(value);
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

function isValidCpf(value = '') {
  const cpf = sanitizeCpf(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  const calcDigit = (base, factor) => {
    const sum = base.split('').reduce((acc, digit) => acc + Number(digit) * factor--, 0);
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };
  return calcDigit(cpf.slice(0, 9), 10) === Number(cpf[9]) && calcDigit(cpf.slice(0, 10), 11) === Number(cpf[10]);
}

function getAgeFromBirthDate(value = '') {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return -1;
  const now = new Date();
  let age = now.getFullYear() - date.getFullYear();
  const month = now.getMonth() - date.getMonth();
  if (month < 0 || (month === 0 && now.getDate() < date.getDate())) age -= 1;
  return age;
}

function getCheckoutAddress() {
  return {
    cep: formatCep(document.getElementById('checkoutCep')?.value || ''),
    rua: (document.getElementById('checkoutStreet')?.value || '').trim(),
    numero: (document.getElementById('checkoutNumber')?.value || '').trim(),
    bairro: (document.getElementById('checkoutDistrict')?.value || '').trim(),
    cidade: (document.getElementById('checkoutCity')?.value || '').trim(),
    estado: (document.getElementById('checkoutState')?.value || '').trim().toUpperCase(),
    complemento: (document.getElementById('checkoutComplement')?.value || '').trim(),
  };
}

function computeCartPricing() {
  const entries = getCartEntries();
  const subtotal = entries.reduce((sum, { product, qty }) => sum + (discountedPrice(product) * qty), 0);
  const cashback = entries.reduce((sum, { product, qty }) => sum + ((discountedPrice(product) * qty) * Number(product.cashback || 0) / 100), 0);
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const selectedShippingValue = Number(state.shippingOption?.valor ?? 0);
  const shipping = freeShipping ? 0 : (Number.isFinite(selectedShippingValue) && selectedShippingValue >= 0 ? selectedShippingValue : 0);
  const total = subtotal + shipping;
  return { entries, subtotal, cashback, shipping, total, freeShipping };
}

function renderCheckoutSummaryItems(entries) {
  const summaryEl = document.getElementById('checkoutSummary');
  if (!summaryEl) return;
  if (!entries.length) {
    summaryEl.innerHTML = '<div class="empty-state"><h3>Seu carrinho está vazio.</h3></div>';
    return;
  }
  summaryEl.innerHTML = entries.map(({ product, qty, selectedColor, selectedSize }) => `
    <article class="drawer-item">
      <img src="${product.imagem}" alt="${product.nome}" />
      <div>
        <strong>${product.nome}</strong>
        <p>${currency(discountedPrice(product))}</p>
        <small>${selectedColor ? `Cor: ${selectedColor}` : ''} ${selectedSize ? `• Tam: ${selectedSize}` : ''}</small>
        <small>Qtd: ${qty}</small>
      </div>
    </article>
  `).join('');
}

async function calculateShipping(cep, subtotal) {
  const cleanCep = sanitizeCep(cep);
  if (cleanCep.length !== 8) throw new Error('CEP inválido');
  return apiRequest('/frete/calcular', {
    method: 'POST',
    body: JSON.stringify({ cep: formatCep(cleanCep), subtotal: Number(subtotal || 0) }),
  });
}

function renderShippingOptions(result, { selectable = false, selectedId = '' } = {}) {
  const options = result?.opcoes || [];
  if (!options.length) return '<small>Sem opções disponíveis para este CEP.</small>';
  return options.map((option, index) => {
    const selected = selectedId ? selectedId === option.id : index === 0;
    if (selectable) {
      return `
        <label class="shipping-option selectable ${option.destaque || ''} ${selected ? 'is-selected' : ''}">
          <input type="radio" name="checkoutShippingOption" value="${option.id}" ${selected ? 'checked' : ''}/>
          <div><strong>${option.nome}</strong><span>${currency(option.valor)} • ${option.prazoMin} a ${option.prazoMax} dias úteis • ${option.tipo || 'Padrão'}</span>${result?.origem ? `<small>Origem: ${result.origem.cidade}/${result.origem.estado}</small>` : ''}</div>
        </label>
      `;
    }
    return `<article class="shipping-option ${option.destaque || ''}"><strong>${option.nome}</strong><span>${currency(option.valor)} • ${option.prazoMin} a ${option.prazoMax} dias úteis • ${option.tipo || 'Padrão'}</span>${result?.origem ? `<small>Origem: ${result.origem.cidade}/${result.origem.estado}</small>` : ''}</article>`;
  }).join('');
}

async function fetchAddressByCep(cep) {
  const cleanCep = sanitizeCep(cep);
  if (cleanCep.length !== 8) throw new Error('CEP inválido');
  const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
  if (!response.ok) throw new Error('Falha ao buscar CEP');
  const data = await response.json();
  if (data.erro) throw new Error('CEP não encontrado');
  return data;
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
  const wished = state.wishlist.includes(Number(p.id));
  return `<article class="product-card" data-product-link="${p.id}">
    <div class="product-media">
      <img src="${p.imagem}" alt="${p.nome}" loading="lazy" />
      <button class="wishlist-heart ${wished ? 'active' : ''}" data-action="wish" data-id="${p.id}" aria-label="Favoritar produto">❤</button>
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
    if (s && !`${p.nome} ${p.marca} ${p.modalidade} ${p.categoria} ${p.genero}`.toLowerCase().includes(s)) return false;
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
  renderKits();
}

function renderKits() {
  const target = document.getElementById('kitsGrid');
  if (!target) return;
  const catalogKits = state.products
    .filter((product) => /kit/i.test(product.categoria) || /kit/i.test(product.nome))
    .slice(0, 4)
    .map((product) => ({
      id: product.id,
      nome: product.nome,
      descricao: product.descricao || 'Kit esportivo',
      imagem: product.imagem,
      preco: discountedPrice(product),
      itens: [product.modalidade || 'Treino', product.marca || 'SportX', product.genero || 'Unissex'],
    }));
  const kits = catalogKits.length ? catalogKits : DEFAULT_KITS;
  target.innerHTML = kits.map((kit) => `
    <article class="kit-card">
      <img src="${kit.imagem}" alt="${kit.nome}" loading="lazy" />
      <div class="kit-body">
        <h3>${kit.nome}</h3>
        <p>${kit.descricao}</p>
        <div class="kit-items">${kit.itens.map((item) => `<span class="pill">${item}</span>`).join('')}</div>
        <div class="product-meta">
          <div class="price-wrap"><strong>${currency(kit.preco)}</strong></div>
          <button class="btn-card btn-dark" data-kit-add="${kit.id}">Adicionar</button>
        </div>
      </div>
    </article>
  `).join('');
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
  let sellerStats = { media: 0, total: 0, reviews: [] };
  try { sellerStats = await apiRequest(`/avaliacoes/vendedor/${p.vendedorId}`); } catch (_e) {
    const localSeller = (state.localSellerReviews[p.vendedorId] || []);
    sellerStats = {
      total: localSeller.length,
      media: localSeller.length ? Number((localSeller.reduce((sum, review) => sum + Number(review.nota || 0), 0) / localSeller.length).toFixed(2)) : 0,
      reviews: localSeller
    };
  }
  const related = state.products.filter((x) => x.id !== p.id && (x.categoria === p.categoria || x.modalidade === p.modalidade)).slice(0, 4);
  const buyTogether = state.products.filter((x) => x.id !== p.id).slice(0, 3);

  const selectedColor = p.cores[0] || { nome: 'Padrão', hex: '#ccc', imagens: [p.imagem] };
  const selectedSize = p.tamanhos.find((size) => size.disponivel)?.label || p.tamanhos[0]?.label || 'Único';

  root.innerHTML = `
    <nav class="breadcrumb"> <a href="index.html">Página Inicial</a> / <a href="categoria.html?categoria=${encodeURIComponent(p.genero)}">${p.genero}</a> / <a href="categoria.html?categoria=${encodeURIComponent(p.categoria)}">${p.categoria}</a> / <span>${p.nome}</span> </nav>
    <section class="product-layout product-layout-pro">
      <div class="product-gallery">
        <img id="mainProductImage" class="product-main-image" src="${selectedColor.imagens?.[0] || p.imagem}" alt="${p.nome}" />
        <div class="product-thumbs" id="productThumbs">${(selectedColor.imagens?.length ? selectedColor.imagens : [p.imagem, ...p.galeria]).filter(Boolean).slice(0,5).map((img) => `<button class="thumb-btn" data-thumb="${img}"><img src="${img}" alt="thumb"></button>`).join('')}</div>
      </div>
      <div class="product-details product-details-pro">
        <h1>${p.nome}</h1>
        <p class="lead">${p.categoria} • ${p.marca} • ${p.modalidade}</p>
        <div class="product-rating-row">⭐ ${media || p.notaMedia} <span>(${total || p.totalAvaliacoes} avaliações)</span></div>
        <div class="product-price-box"><strong>${currency(discountedPrice(p))}</strong>${Number(p.desconto)>0 ? `<span class="old-price">${currency(p.preco)}</span><span class="discount-tag">-${p.desconto}%</span>` : ''}</div>
        <div class="seller-rating-row">Vendedor ⭐ ${Number(sellerStats.media || 0).toFixed(1)} <span>(${sellerStats.total || 0} avaliações)</span></div>

        <div class="variation-block">
          <p class="variation-title">Cor selecionada: <strong id="selectedColorName">${selectedColor.nome}</strong></p>
          <div class="color-swatches" id="colorSwatches">${p.cores.map((cor, idx) => `<button class="color-swatch ${idx === 0 ? 'active' : ''}" data-color="${idx}" title="${cor.nome}"><span style="background:${cor.hex || '#ccc'}"></span></button>`).join('')}</div>
        </div>

        <div class="variation-block">
          <p class="variation-title">Tamanho</p>
          <div class="size-grid" id="sizeGrid">${p.tamanhos.map((size, idx) => `<button class="size-btn ${idx === 0 && size.disponivel ? 'active' : ''}" ${size.disponivel ? '' : 'disabled'} data-size="${size.label}">${size.label}</button>`).join('')}</div>
        </div>

        <div class="product-actions-row"><button class="btn btn-primary" id="addToCartProductBtn" data-id="${p.id}">Adicionar ao carrinho</button><button class="wishlist-heart-lg ${state.wishlist.includes(Number(p.id)) ? 'active' : ''}" id="productWishBtn" data-action="wish" data-id="${p.id}" aria-label="Favoritar produto">❤</button></div>

        <div class="benefits-list">
          <div>🔒 Compra 100% segura</div>
          <div>↩ Devolução facilitada em até 7 dias</div>
          <div>🚚 Entrega rápida para todo o Brasil</div>
          <div>💳 Parcelamento em até 10x</div>
          <div>🎁 Benefícios exclusivos para clientes</div>
          <div>⭐ Frete grátis acima de ${currency(FREE_SHIPPING_THRESHOLD)}</div>
        </div>

        <div class="frete-box"><label>Calcular frete</label><div class="frete-form"><input id="freteCep" placeholder="Digite o CEP" maxlength="9"/><button id="calcFreteBtn" class="btn btn-light">Calcular</button></div><div id="freteResult"></div></div>
      </div>
    </section>
    <section class="section"><h3>Descrição detalhada</h3><p>${p.descricao}</p></section>
    <section class="section"><h3>Avaliações dos compradores</h3><div id="reviewList">${reviews.length ? reviews.map((r) => `<article class="review-item"><header><strong>${r.usuario}</strong><span>⭐ ${r.nota}</span></header><p>${r.comentario}</p><small>${new Date(r.data_criacao || r.data || Date.now()).toLocaleDateString('pt-BR')}</small><button class="btn-link" data-report-review="${r.id_avaliacao || ''}">Denunciar</button></article>`).join('') : '<p>Ainda sem avaliações.</p>'}</div>
      <form id="reviewForm" class="seller-form-pro"><div class="input-group"><label>Nota</label><select id="reviewRate" required><option value="">Selecione</option><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></div><div class="input-group"><label>Comentário</label><textarea id="reviewText" required></textarea></div><button class="btn btn-primary" type="submit">Enviar avaliação</button></form>
    </section>
    <section class="section"><h3>Avaliar vendedor</h3>
      <form id="sellerReviewForm" class="seller-form-pro"><div class="input-group"><label>Nota do vendedor</label><select id="sellerReviewRate" required><option value="">Selecione</option><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></div><div class="input-group"><label>Comentário</label><textarea id="sellerReviewText" required></textarea></div><button class="btn btn-primary" type="submit">Enviar avaliação do vendedor</button></form>
    </section>
    <section class="section"><div class="related-head"><small>Complete seu look</small><h3>Você também poderá gostar</h3></div><div class="products-carousel related-carousel">${related.map(renderProductCard).join('')}</div></section>
    <section class="section"><h3>Compre junto</h3><div class="products-carousel related-carousel">${buyTogether.map(renderProductCard).join('')}</div></section>
  `;

  let currentColorIndex = 0;
  let currentSize = selectedSize;

  const rerenderThumbs = () => {
    const color = p.cores[currentColorIndex] || selectedColor;
    const images = (color.imagens?.length ? color.imagens : [p.imagem, ...p.galeria]).filter(Boolean);
    document.getElementById('selectedColorName').textContent = color.nome;
    document.getElementById('mainProductImage').src = images[0] || p.imagem;
    document.getElementById('productThumbs').innerHTML = images.slice(0, 5).map((img) => `<button class="thumb-btn" data-thumb="${img}"><img src="${img}" alt="thumb"></button>`).join('');
    document.querySelectorAll('[data-thumb]').forEach((btn) => btn.addEventListener('click', () => { document.getElementById('mainProductImage').src = btn.dataset.thumb; }));
  };

  document.querySelectorAll('.color-swatch').forEach((btn) => btn.addEventListener('click', () => {
    currentColorIndex = Number(btn.dataset.color || 0);
    document.querySelectorAll('.color-swatch').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    rerenderThumbs();
  }));

  document.querySelectorAll('.size-btn').forEach((btn) => btn.addEventListener('click', () => {
    if (btn.disabled) return;
    currentSize = btn.dataset.size;
    document.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
  }));

  rerenderThumbs();

  document.getElementById('addToCartProductBtn')?.addEventListener('click', () => {
    const color = p.cores[currentColorIndex] || selectedColor;
    addToCart(p.id, { selectedSize: currentSize, selectedColor: color.nome, selectedColorHex: color.hex, skipAuth: false });
  });
  document.getElementById('productWishBtn')?.addEventListener('click', () => toggleWish(p.id));

  document.getElementById('freteCep')?.addEventListener('input', (event) => {
    event.target.value = formatCep(event.target.value);
  });

  document.getElementById('calcFreteBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const cep = (document.getElementById('freteCep').value || '').trim();
    if (!cep) return showToast('Informe um CEP para calcular o frete.');
    if (sanitizeCep(cep).length !== 8) return showToast('CEP inválido. Use o formato 00000-000.');
    const resultEl = document.getElementById('freteResult');
    resultEl.innerHTML = '<small>Calculando...</small>';
    try {
      const result = await calculateShipping(cep, discountedPrice(p));
      resultEl.innerHTML = renderShippingOptions(result, { selectable: false });
    } catch (_e) {
      resultEl.innerHTML = '<small>CEP inválido ou indisponível. Verifique e tente novamente.</small>';
    }
  });

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

  document.getElementById('sellerReviewForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state.currentUser) return showToast('Faça login para avaliar o vendedor.');
    const comentario = document.getElementById('sellerReviewText').value.trim();
    const nota = Number(document.getElementById('sellerReviewRate').value);
    if (!comentario) return showToast('Comentário não pode ser vazio.');
    if (!nota) return showToast('Selecione a nota do vendedor.');
    const payload = { id_usuario: Number(state.currentUser.id_usuario || state.currentUser.id), id_vendedor: Number(p.vendedorId), nota, comentario };
    try {
      await apiRequest('/avaliacoes/vendedor', { method: 'POST', body: JSON.stringify(payload) });
    } catch (_error) {
      const list = state.localSellerReviews[p.vendedorId] || [];
      if (list.some((review) => Number(review.id_usuario) === payload.id_usuario)) return showToast('Você já avaliou esse vendedor.');
      list.unshift({ ...payload, data: new Date().toISOString() });
      state.localSellerReviews[p.vendedorId] = list;
      localStorage.setItem(STORAGE_KEYS.localSellerReviews, JSON.stringify(state.localSellerReviews));
    }
    showToast('Avaliação do vendedor enviada.');
    renderProductPage();
  });
}

function renderPromotionsPage() {
  const list = filterProducts({ promoOnly: true });
  renderGrid('promotionsGrid', list);
}

function getSellerProducts() {
  if (!state.currentUser) return [];
  return state.products.filter((p) => Number(p.vendedorId || 0) === Number(state.currentUser.id_usuario) || p.source.startsWith('seller'));
}

function getSellerAccountStatus() {
  if (!state.currentUser || state.currentUser.type !== 'vendedor') return { blocked: false, average: 0, total: 0, reason: '' };
  const average = Number(state.currentUser.media_avaliacao_vendedor || 0);
  const total = Number(state.currentUser.total_avaliacoes_vendedor || 0);
  const blocked = Boolean(state.currentUser.vendedor_bloqueado) || (total > 0 && average < 4);
  return {
    blocked,
    average,
    total,
    reason: state.currentUser.motivo_bloqueio || (blocked ? 'Média do vendedor abaixo de 4.0' : ''),
  };
}

function renderMyProductsPage() {
  const target = document.getElementById('myProductsGrid');
  if (!target) return;
  const items = getSellerProducts();
  const sellerStatus = getSellerAccountStatus();
  const statusHtml = `<div class="seller-status-panel ${sellerStatus.blocked ? 'blocked' : ''}"><strong>Status do vendedor:</strong> ${sellerStatus.blocked ? 'Bloqueado para vender' : 'Ativo para vender'} • Média: ${sellerStatus.average.toFixed(1)} (${sellerStatus.total} avaliações) ${sellerStatus.reason ? `<small>${sellerStatus.reason}</small>` : ''}</div>`;
  target.innerHTML = `${statusHtml}${items.length ? items.map((p) => `<article class="product-card seller-product-card"><div class="product-media"><img src="${p.imagem}" alt="${p.nome}"></div><div class="product-body"><small>${p.marca} • ${p.categoria}</small><h3>${p.nome}</h3><div class="product-meta"><div class="price-wrap"><strong>${currency(discountedPrice(p))}</strong>${Number(p.desconto) > 0 ? `<span class="old-price">${currency(p.preco)}</span>` : ''}</div><span class="product-rating-row">Estoque: ${p.estoque}</span></div><p class="seller-status">Status: ${p.ativo ? 'Ativo' : 'Inativo'} • ${p.promocaoAtiva ? 'Promoção ativa' : 'Sem promoção'}</p><div class="product-actions"><a class="btn-card btn-light" href="editar-produto.html?id=${p.id}">Editar</a><button class="btn-card btn-light" data-action="toggle-active" data-id="${p.id}">${p.ativo ? 'Desativar' : 'Ativar'}</button><button class="btn-card btn-light" data-action="toggle-promo" data-id="${p.id}">${p.promocaoAtiva ? 'Remover promoção' : 'Colocar promoção'}</button><button class="btn-card btn-dark" data-action="delete-product" data-id="${p.id}">Excluir</button></div></div></article>`).join('') : '<p>Você ainda não publicou produtos.</p>'}`;
}

function fillEditForm() {
  const id = Number(getQuery('id'));
  const p = getProductById(id);
  if (!p) return;
  const map = { sellerProductName: p.nome, sellerProductDescription: p.descricao, sellerProductPrice: p.preco, sellerProductDiscount: p.desconto, sellerProductCategory: p.categoria, sellerProductGender: p.genero, sellerProductSport: p.modalidade, sellerProductBrand: p.marca, sellerProductCashback: p.cashback, sellerProductStock: p.estoque, sellerProductSizes: p.tamanhos.map((size) => size.disponivel ? size.label : `${size.label}:0`).join(','), sellerProductImage: p.imagem };
  Object.entries(map).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.value = val; });
  document.getElementById('sellerProductLaunch') && (document.getElementById('sellerProductLaunch').checked = p.badgeLancamento);
  document.getElementById('sellerProductPromotion') && (document.getElementById('sellerProductPromotion').checked = p.promocaoAtiva);
}

async function submitSellerProduct(event) {
  event.preventDefault();
  if (!state.currentUser || state.currentUser.type !== 'vendedor') return showToast('Faça login como vendedor.');
  const sellerStatus = getSellerAccountStatus();
  if (sellerStatus.blocked) return showToast(sellerStatus.reason || 'Conta de vendedor bloqueada para anunciar.');
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
    numeracao: payload.tamanhos.map((size) => size.disponivel ? size.label : `${size.label}:0`).join(','),
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

function updateHeaderUserUI() {
  const accountLabel = document.getElementById('accountLabel');
  const accountSubLabel = document.getElementById('accountSubLabel');
  const accountDropdownName = document.getElementById('accountDropdownName');
  const accountDropdownType = document.getElementById('accountDropdownType');
  const accountIcon = document.getElementById('accountIcon');
  const accountDropdownAvatar = document.getElementById('accountDropdownAvatar');
  const sellerMenuBtn = document.getElementById('sellerMenuBtn');
  const sellerProductsMenuBtn = document.getElementById('sellerProductsMenuBtn');
  const openAuthBtn = document.getElementById('openAuthBtn');

  if (!openAuthBtn) return;
  if (state.currentUser) {
    const name = state.currentUser.name || state.currentUser.nome || state.currentUser.email || 'Minha conta';
    const userType = state.currentUser.type || state.currentUser.tipo_usuario || 'comprador';
    const isSeller = userType === 'vendedor';
    const avatar = String(name).trim().charAt(0).toUpperCase() || 'U';
    accountLabel && (accountLabel.textContent = name);
    accountSubLabel && (accountSubLabel.textContent = isSeller ? (state.currentUser.vendedor_bloqueado ? 'Vendedor bloqueado' : 'Conta vendedor') : 'Conta ativa');
    accountDropdownName && (accountDropdownName.textContent = `Olá, ${name}`);
    accountDropdownType && (accountDropdownType.textContent = isSeller ? 'Painel do vendedor' : 'Conta de comprador');
    accountIcon && (accountIcon.textContent = avatar);
    accountDropdownAvatar && (accountDropdownAvatar.textContent = avatar);
    sellerMenuBtn && (sellerMenuBtn.style.display = isSeller ? 'block' : 'none');
    sellerProductsMenuBtn && (sellerProductsMenuBtn.style.display = isSeller ? 'block' : 'none');
    openAuthBtn.classList.add('is-authenticated');
  } else {
    accountLabel && (accountLabel.textContent = 'Entrar');
    accountSubLabel && (accountSubLabel.textContent = 'Minha conta');
    accountDropdownName && (accountDropdownName.textContent = 'Olá');
    accountDropdownType && (accountDropdownType.textContent = 'Faça login para continuar');
    accountIcon && (accountIcon.textContent = '👤');
    accountDropdownAvatar && (accountDropdownAvatar.textContent = '👤');
    sellerMenuBtn && (sellerMenuBtn.style.display = 'none');
    sellerProductsMenuBtn && (sellerProductsMenuBtn.style.display = 'none');
    openAuthBtn.classList.remove('is-authenticated');
  }
}

function updateCartBadge() {
  const totalItems = state.cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = String(totalItems);
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlistCount');
  if (badge) badge.textContent = String(state.wishlist.length);
}

function saveSessionState() {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state.cart));
  localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(state.wishlist));
}

function getCartEntries() {
  return state.cart.map((item) => {
    const product = getProductById(item.id);
    return product ? { product, qty: Number(item.qty || 1), selectedSize: item.selectedSize || '', selectedColor: item.selectedColor || '' } : null;
  }).filter(Boolean);
}

function updateCartTotals() {
  const { entries, subtotal, cashback, shipping, total, freeShipping } = computeCartPricing();
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');
  const cashbackEl = document.getElementById('cartCashback');
  const shippingEl = document.getElementById('cartShipping');
  const checkoutSubtotalEl = document.getElementById('checkoutSubtotal');
  const checkoutTotalEl = document.getElementById('checkoutTotal');
  const checkoutCashbackEl = document.getElementById('checkoutCashback');
  const checkoutShippingEl = document.getElementById('checkoutShipping');
  const checkoutShippingLabelEl = document.getElementById('checkoutShippingLabel');
  if (subtotalEl) subtotalEl.textContent = currency(subtotal);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Grátis' : currency(shipping);
  if (totalEl) totalEl.textContent = currency(total);
  if (cashbackEl) cashbackEl.textContent = currency(cashback);
  if (checkoutSubtotalEl) checkoutSubtotalEl.textContent = currency(subtotal);
  if (checkoutShippingEl) checkoutShippingEl.textContent = shipping === 0 ? 'Grátis' : currency(shipping);
  if (checkoutCashbackEl) checkoutCashbackEl.textContent = currency(cashback);
  if (checkoutTotalEl) checkoutTotalEl.textContent = currency(total);
  if (checkoutShippingLabelEl) checkoutShippingLabelEl.textContent = freeShipping ? 'Frete (grátis acima de R$ 400)' : 'Frete';
  renderCheckoutSummaryItems(entries);
}

function refreshShippingSelectionUi() {
  document.querySelectorAll('#checkoutShippingOptions .shipping-option.selectable').forEach((node) => {
    const input = node.querySelector('input[name="checkoutShippingOption"]');
    node.classList.toggle('is-selected', Boolean(input?.checked));
  });
}

function renderCart() {
  const target = document.getElementById('cartItems');
  if (!target) return;
  const entries = getCartEntries();
  if (!entries.length) {
    target.innerHTML = '<div class="empty-state"><h3>Seu carrinho está vazio.</h3><p>Adicione produtos para continuar.</p></div>';
  } else {
    target.innerHTML = entries.map(({ product, qty, selectedColor, selectedSize }) => `
      <article class="drawer-item">
        <img src="${product.imagem}" alt="${product.nome}" />
        <div>
          <strong>${product.nome}</strong>
          <p>${currency(discountedPrice(product))}</p>
          <small>${selectedColor ? `Cor: ${selectedColor}` : ''} ${selectedSize ? `• Tam: ${selectedSize}` : ''}</small>
          <div class="qty">
            <button data-action="decrease-cart" data-id="${product.id}">−</button>
            <span>${qty}</span>
            <button data-action="increase-cart" data-id="${product.id}">+</button>
          </div>
        </div>
        <button class="btn-link" data-action="remove-cart" data-id="${product.id}">Remover</button>
      </article>
    `).join('');
  }
  updateCartBadge();
  updateCartTotals();
}

function renderWishlist() {
  const target = document.getElementById('wishlistItems');
  if (!target) return;
  if (!state.wishlist.length) {
    target.innerHTML = '<div class="empty-state"><h3>Nenhum favorito salvo.</h3></div>';
  } else {
    const products = state.wishlist.map((id) => getProductById(id)).filter(Boolean);
    target.innerHTML = products.map((product) => `
      <article class="drawer-item">
        <img src="${product.imagem}" alt="${product.nome}" />
        <div>
          <strong>${product.nome}</strong>
          <p>${currency(discountedPrice(product))}</p>
          <button class="btn-card btn-dark wishlist-add-single" data-action="wishlist-cart" data-id="${product.id}">Adicionar ao carrinho</button>
        </div>
        <button class="btn-link" data-action="wish" data-id="${product.id}">Remover</button>
      </article>
    `).join('');
  }
  updateWishlistBadge();
}

function setAuthFeedback(message, type = '') {
  const feedback = document.getElementById('authFeedback');
  if (!feedback) return;
  feedback.textContent = message || '';
  feedback.className = `auth-feedback ${type}`.trim();
}

function setAuthMode(mode) {
  state.authMode = mode === 'register' ? 'register' : 'login';
  const isRegister = state.authMode === 'register';
  document.querySelectorAll('[data-auth-mode]').forEach((tab) => tab.classList.toggle('active', tab.dataset.authMode === state.authMode));
  document.getElementById('authTitle') && (document.getElementById('authTitle').textContent = isRegister ? 'Criar conta' : 'Entrar');
  document.getElementById('nameField')?.classList.toggle('hidden', !isRegister);
  document.getElementById('accountTypeField')?.classList.toggle('hidden', !isRegister);
  document.getElementById('sellerCpfField')?.classList.toggle('hidden', !isRegister || document.getElementById('authType')?.value !== 'vendedor');
  document.getElementById('sellerBirthField')?.classList.toggle('hidden', !isRegister || document.getElementById('authType')?.value !== 'vendedor');
  document.getElementById('authSubmitBtn') && (document.getElementById('authSubmitBtn').textContent = isRegister ? 'Criar conta' : 'Entrar');
  document.getElementById('toggleAuthModeBtn') && (document.getElementById('toggleAuthModeBtn').textContent = isRegister ? 'Já tenho login' : 'Criar conta');
  setAuthFeedback('');
}

function openAuthModal(mode = 'login', message = '') {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  setAuthMode(mode);
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (message) setAuthFeedback(message, 'warn');
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

async function ensureAuth(onSuccess, message = 'Faça login para continuar') {
  if (state.currentUser) {
    onSuccess?.();
    return true;
  }
  state.pendingAction = onSuccess || null;
  if (document.getElementById('authModal')) openAuthModal('login', message);
  else showToast(message);
  return false;
}

function persistUserSession(user, token = '') {
  state.currentUser = { ...user, type: user?.type || user?.tipo_usuario || user?.tipo || 'comprador' };
  state.authToken = token || state.authToken || '';
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  if (state.authToken) localStorage.setItem(STORAGE_KEYS.token, state.authToken);
  updateHeaderUserUI();
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const submitBtn = document.getElementById('authSubmitBtn');
  const email = document.getElementById('authEmail')?.value.trim();
  const password = document.getElementById('authPassword')?.value.trim();
  const name = document.getElementById('authName')?.value.trim();
  const type = document.getElementById('authType')?.value || 'comprador';
  const cpf = formatCpf(document.getElementById('authCpf')?.value || '');
  const birthDate = document.getElementById('authBirthDate')?.value || '';

  if (!email || !password || (state.authMode === 'register' && !name)) {
    setAuthFeedback('Preencha os campos obrigatórios.', 'error');
    return;
  }

  if (state.authMode === 'register' && type === 'vendedor') {
    if (!isValidCpf(cpf)) {
      setAuthFeedback('CPF inválido para vendedor.', 'error');
      return;
    }
    if (getAgeFromBirthDate(birthDate) < 18) {
      setAuthFeedback('É necessário ter 18 anos ou mais para vender.', 'error');
      return;
    }
  }

  const originalText = submitBtn?.textContent;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Carregando...';
  }
  setAuthFeedback('');

  try {
    if (state.authMode === 'login') {
      let userData = null;
      let token = '';
      try {
        const result = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha: password }) });
        token = result.token || '';
        userData = { ...result.user, email: result.user?.email || email, name: result.user?.name || result.user?.nome || email, type: result.user?.type || result.user?.tipo_usuario || result.user?.tipo || 'comprador' };
      } catch (_e) {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
        const local = users.find((u) => u.email === email && u.password === password);
        if (!local) throw new Error('Credenciais inválidas.');
        if (local.type === 'vendedor') {
          if (!isValidCpf(local.cpf || '')) throw new Error('Conta de vendedor inválida: CPF obrigatório.');
          if (getAgeFromBirthDate(local.birthDate) < 18) throw new Error('Conta de vendedor inválida: idade mínima 18 anos.');
          if (local.vendedorBloqueado) throw new Error(local.motivoBloqueio || 'Conta de vendedor bloqueada.');
        }
        userData = { id_usuario: local.id_usuario, email: local.email, name: local.name, type: local.type };
      }
      persistUserSession(userData, token);
      setAuthFeedback('Login realizado com sucesso.', 'success');
      showToast('Bem-vindo de volta!');
    } else {
      let created = false;
      try {
        await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ nome: name, email, senha: password, tipo_usuario: type === 'comprador' ? 'cliente' : type, cpf: type === 'vendedor' ? cpf : undefined, data_nascimento: type === 'vendedor' ? birthDate : undefined }) });
        created = true;
      } catch (_e) {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
        if (users.some((u) => u.email === email)) throw new Error('E-mail já cadastrado.');
        users.push({ id_usuario: Date.now(), name, email, password, type, cpf: type === 'vendedor' ? cpf : '', birthDate: type === 'vendedor' ? birthDate : '' });
        localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
      }
      setAuthFeedback(created ? 'Conta criada via API. Faça login.' : 'Conta criada localmente. Faça login.', 'success');
      setAuthMode('login');
      document.getElementById('authEmail') && (document.getElementById('authEmail').value = email);
      document.getElementById('authPassword') && (document.getElementById('authPassword').value = '');
      return;
    }

    closeAuthModal();
    const pending = state.pendingAction;
    state.pendingAction = null;
    pending?.();
  } catch (error) {
    setAuthFeedback(error.message || 'Não foi possível autenticar.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
}

function addToCart(id, options = {}) {
  if (!state.currentUser && !options.skipAuth) {
    return ensureAuth(() => addToCart(id, { ...options, skipAuth: true }), 'Faça login para continuar');
  }
  const item = state.cart.find((x) => Number(x.id) === Number(id) && String(x.selectedSize || '') === String(options.selectedSize || '') && String(x.selectedColor || '') === String(options.selectedColor || ''));
  if (item) item.qty += 1; else state.cart.push({ id: Number(id), qty: 1, selectedSize: options.selectedSize || '', selectedColor: options.selectedColor || '', selectedColorHex: options.selectedColorHex || '' });
  saveSessionState();
  renderCart();
  showToast('Produto adicionado ao carrinho.');
}

function toggleWish(id) {
  state.wishlist = state.wishlist.includes(Number(id)) ? state.wishlist.filter((x) => x !== Number(id)) : [...state.wishlist, Number(id)];
  saveSessionState();
  renderWishlist();
  updateWishlistVisualState();
  showToast('Favoritos atualizados.');
}

function updateWishlistVisualState() {
  document.querySelectorAll('[data-action="wish"][data-id]').forEach((button) => {
    const wished = state.wishlist.includes(Number(button.dataset.id));
    button.classList.toggle('active', wished);
  });
  if (document.body.dataset.page === 'home') renderHome();
  if (document.body.dataset.page === 'category') renderCategoryPage();
  if (document.body.dataset.page === 'promotions') renderPromotionsPage();
}

function toggleCart(open = true) {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  drawer.classList.toggle('open', open);
}

function toggleWishlist(open = true) {
  const drawer = document.getElementById('wishlistDrawer');
  if (!drawer) return;
  drawer.classList.toggle('open', open);
}

function toggleCheckout(open = true) {
  const modal = document.getElementById('checkoutModal');
  if (!modal) return;
  modal.classList.toggle('open', open);
  if (open) {
    if (state.currentUser) {
      document.getElementById('checkoutName') && (document.getElementById('checkoutName').value = state.currentUser.name || state.currentUser.nome || '');
      document.getElementById('checkoutEmail') && (document.getElementById('checkoutEmail').value = state.currentUser.email || '');
    }
    updateCartTotals();
  }
}

function toggleWishlistMiniModal(open = true) {
  const modal = document.getElementById('wishlistMiniModal');
  if (!modal) return;
  modal.classList.toggle('open', open);
}

function handleGlobalClick(e) {
  const quickAdd = e.target.closest('.add-to-cart');
  if (quickAdd?.dataset.id) addToCart(Number(quickAdd.dataset.id));
  const action = e.target.closest('[data-action]');
  if (action) {
    const id = Number(action.dataset.id);
    if (action.dataset.action === 'cart') addToCart(id);
    if (action.dataset.action === 'wish') toggleWish(id);
    if (action.dataset.action === 'increase-cart') { const item = state.cart.find((x) => Number(x.id) === id); if (item) item.qty += 1; saveSessionState(); renderCart(); }
    if (action.dataset.action === 'decrease-cart') { const item = state.cart.find((x) => Number(x.id) === id); if (item) item.qty -= 1; state.cart = state.cart.filter((x) => x.qty > 0); saveSessionState(); renderCart(); }
    if (action.dataset.action === 'remove-cart') { state.cart = state.cart.filter((x) => Number(x.id) !== id); saveSessionState(); renderCart(); }
    if (action.dataset.action === 'wishlist-cart') {
      addToCart(id, { skipAuth: true });
      toggleWishlistMiniModal(true);
    }
    if (action.dataset.action === 'toggle-active') {
      if (getSellerAccountStatus().blocked) return showToast('Conta de vendedor bloqueada para vender.');
      quickUpdateProduct(id, (p) => ({ ...p, ativo: !p.ativo }));
    }
    if (action.dataset.action === 'toggle-promo') {
      if (getSellerAccountStatus().blocked) return showToast('Conta de vendedor bloqueada para vender.');
      quickUpdateProduct(id, (p) => ({ ...p, promocaoAtiva: !p.promocaoAtiva, desconto: p.desconto || 10 }));
    }
    if (action.dataset.action === 'delete-product') {
      if (getSellerAccountStatus().blocked) return showToast('Conta de vendedor bloqueada para vender.');
      deleteProduct(id);
    }
  }
  const card = e.target.closest('[data-product-link]');
  if (card && !e.target.closest('button,a')) window.location.href = `produto.html?id=${card.dataset.productLink}`;
  const kit = e.target.closest('[data-kit-add]');
  if (kit) {
    const kitId = kit.dataset.kitAdd;
    const productKit = state.products.find((product) => String(product.id) === String(kitId));
    if (productKit) addToCart(productKit.id);
    else showToast('Kit adicionado à lista de interesse.');
  }
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
  state.cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || '[]').map((i) => ({ id: Number(i.id), qty: Number(i.qty || 1), selectedSize: i.selectedSize || '', selectedColor: i.selectedColor || '', selectedColorHex: i.selectedColorHex || '' }));
  state.wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.wishlist) || '[]').map(Number);
  const storedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || 'null');
  state.currentUser = storedUser ? { ...storedUser, type: storedUser.type || storedUser.tipo_usuario || storedUser.tipo || 'comprador' } : null;
  state.authToken = localStorage.getItem(STORAGE_KEYS.token) || '';
  state.localReviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.localReviews) || '{}');
  state.localSellerReviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.localSellerReviews) || '{}');
}

function setupAuthUi() {
  const accountDropdown = document.getElementById('accountDropdown');
  const accountArea = document.querySelector('.account-area');

  document.getElementById('openAuthBtn')?.addEventListener('click', () => {
    if (state.currentUser) accountDropdown?.classList.toggle('open');
    else openAuthModal('login');
  });
  document.getElementById('sellerMenuBtn')?.addEventListener('click', () => (window.location.href = 'vender.html'));
  document.getElementById('sellerProductsMenuBtn')?.addEventListener('click', () => (window.location.href = 'meus-produtos.html'));
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    state.currentUser = null;
    state.authToken = '';
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.token);
    accountDropdown?.classList.remove('open');
    updateHeaderUserUI();
    showToast('Você saiu da conta.');
  });
  document.getElementById('closeAuthBtn')?.addEventListener('click', closeAuthModal);
  document.getElementById('authModal')?.addEventListener('click', (event) => {
    if (event.target.id === 'authModal') closeAuthModal();
  });
  document.getElementById('authForm')?.addEventListener('submit', handleAuthSubmit);
  document.getElementById('toggleAuthModeBtn')?.addEventListener('click', () => setAuthMode(state.authMode === 'login' ? 'register' : 'login'));
  document.querySelectorAll('[data-auth-mode]').forEach((tab) => tab.addEventListener('click', () => setAuthMode(tab.dataset.authMode)));
  document.getElementById('authType')?.addEventListener('change', () => setAuthMode(state.authMode));
  document.getElementById('authCpf')?.addEventListener('input', (event) => {
    event.target.value = formatCpf(event.target.value);
  });

  document.getElementById('cartToggle')?.addEventListener('click', () => toggleCart(true));
  document.getElementById('wishlistToggle')?.addEventListener('click', () => toggleWishlist(true));
  document.getElementById('checkoutOpenBtn')?.addEventListener('click', () => ensureAuth(() => {
    toggleCheckout(true);
    updateCartTotals();
  }, 'Faça login para finalizar a compra'));
  document.getElementById('checkoutCep')?.addEventListener('input', (event) => {
    event.target.value = formatCep(event.target.value);
    const cleanCep = sanitizeCep(event.target.value || '');
    if (cleanCep.length === 8 && cleanCep !== state.shippingZipCode) {
      event.target.dispatchEvent(new Event('blur'));
    }
  });
  document.getElementById('checkoutCep')?.addEventListener('blur', async (event) => {
    const cep = event.target.value || '';
    const cleanCep = sanitizeCep(cep);
    if (cleanCep.length !== 8) return;
    try {
      const address = await fetchAddressByCep(cleanCep);
      document.getElementById('checkoutStreet') && (document.getElementById('checkoutStreet').value = address.logradouro || '');
      document.getElementById('checkoutDistrict') && (document.getElementById('checkoutDistrict').value = address.bairro || '');
      document.getElementById('checkoutCity') && (document.getElementById('checkoutCity').value = address.localidade || '');
      document.getElementById('checkoutState') && (document.getElementById('checkoutState').value = String(address.uf || '').toUpperCase());
      if (!document.getElementById('checkoutComplement')?.value) {
        document.getElementById('checkoutComplement') && (document.getElementById('checkoutComplement').value = address.complemento || '');
      }
      state.shippingZipCode = cleanCep;
    } catch (_error) {
      showToast('CEP não encontrado para auto preenchimento.');
    }
  });
  document.getElementById('checkoutCalcShippingBtn')?.addEventListener('click', async () => {
    const cep = document.getElementById('checkoutCep')?.value || '';
    if (sanitizeCep(cep).length !== 8) return showToast('CEP inválido. Informe 8 dígitos.');
    const entries = getCartEntries();
    const subtotal = entries.reduce((sum, { product, qty }) => sum + (discountedPrice(product) * qty), 0);
    if (!subtotal) return showToast('Adicione itens ao carrinho antes de calcular o frete.');
    const list = document.getElementById('checkoutShippingOptions');
    if (!list) return;
    list.innerHTML = '<small>Calculando frete...</small>';
    try {
      const result = await calculateShipping(cep, subtotal);
      state.shippingOptions = result.opcoes || [];
      state.shippingOption = state.shippingOptions[0] || null;
      state.shippingOrigin = result.origem || null;
      state.shippingZipCode = sanitizeCep(cep);
      list.innerHTML = renderShippingOptions(result, { selectable: true, selectedId: state.shippingOption?.id || '' });
      refreshShippingSelectionUi();
      updateCartTotals();
    } catch (_error) {
      list.innerHTML = '<small>Não foi possível calcular o frete. Confira o CEP.</small>';
    }
  });
  document.getElementById('checkoutShippingOptions')?.addEventListener('change', (event) => {
    const optionId = event.target.value;
    state.shippingOption = state.shippingOptions.find((option) => option.id === optionId) || null;
    refreshShippingSelectionUi();
    updateCartTotals();
  });
  const installmentsGroup = document.getElementById('installmentsGroup');
  const installmentsSelect = document.getElementById('installmentsSelect');
  const paymentMethod = document.getElementById('paymentMethod');
  const syncPaymentInstallments = () => {
    if (!paymentMethod || !installmentsGroup || !installmentsSelect) return;
    const cardSelected = paymentMethod.value === 'credito';
    installmentsGroup.style.display = cardSelected ? '' : 'none';
    installmentsSelect.disabled = !cardSelected;
    if (!cardSelected) installmentsSelect.value = '1x sem juros';
  };
  paymentMethod?.addEventListener('change', syncPaymentInstallments);
  syncPaymentInstallments();
  document.getElementById('finishOrderBtn')?.addEventListener('click', async () => {
    if (!state.currentUser) return ensureAuth(() => toggleCheckout(true), 'Faça login para finalizar a compra');
    if (!state.cart.length) return showToast('Seu carrinho está vazio.');
    const { entries, subtotal, cashback, shipping, total } = computeCartPricing();
    const address = getCheckoutAddress();
    const payload = {
      id_usuario: Number(state.currentUser?.id_usuario || state.currentUser?.id || 0),
      id_endereco: 1,
      status: 'pendente',
      forma_pagamento: document.getElementById('paymentMethod')?.value || 'credito',
      total: Number(total.toFixed(2)),
      resumo_checkout: {
        subtotal: Number(subtotal.toFixed(2)),
        frete: Number(shipping.toFixed(2)),
        cashback: Number(cashback.toFixed(2)),
        total: Number(total.toFixed(2)),
      },
      entrega: state.shippingOption ? {
        modalidadeId: state.shippingOption.id,
        modalidadeNome: state.shippingOption.nome,
        prazoMin: state.shippingOption.prazoMin,
        prazoMax: state.shippingOption.prazoMax,
        valor: Number(state.shippingOption.valor || 0),
        origem: state.shippingOrigin,
      } : null,
      endereco_entrega: address,
      itens: entries.map(({ product, qty, selectedSize, selectedColor }) => ({
        id_produto: product.id,
        nome: product.nome,
        quantidade: qty,
        preco_unitario: Number(discountedPrice(product).toFixed(2)),
        tamanho: selectedSize,
        cor: selectedColor,
      })),
    };
    try {
      await apiRequest('/pedidos', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (_error) {
      const localOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || '[]');
      localOrders.push({ ...payload, id_local: Date.now(), criado_em: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(localOrders));
    }
    showToast('Pedido confirmado com sucesso.');
    state.cart = [];
    state.shippingOption = null;
    state.shippingOptions = [];
    state.shippingZipCode = '';
    const shippingOptions = document.getElementById('checkoutShippingOptions');
    if (shippingOptions) shippingOptions.innerHTML = '';
    saveSessionState();
    renderCart();
    toggleCheckout(false);
  });
  document.getElementById('addAllWishlistBtn')?.addEventListener('click', () => {
    ensureAuth(() => {
      state.wishlist.forEach((id) => addToCart(id, { skipAuth: true }));
      toggleWishlistMiniModal(true);
      toggleWishlist(false);
    }, 'Faça login para continuar');
  });
  document.getElementById('wishlistMiniGoCheckout')?.addEventListener('click', () => {
    toggleWishlistMiniModal(false);
    toggleWishlist(false);
    ensureAuth(() => toggleCheckout(true), 'Faça login para finalizar a compra');
  });
  document.getElementById('wishlistMiniContinue')?.addEventListener('click', () => {
    toggleWishlistMiniModal(false);
  });
  document.getElementById('wishlistMiniModal')?.addEventListener('click', (event) => {
    if (event.target.id === 'wishlistMiniModal') toggleWishlistMiniModal(false);
  });

  document.addEventListener('click', (event) => {
    if (accountArea && accountDropdown && !accountArea.contains(event.target)) accountDropdown.classList.remove('open');
  });
  updateHeaderUserUI();
  setAuthMode('login');
}

async function init() {
  loadSession();
  await loadProducts();
  setupFilters();
  setupAuthUi();
  document.addEventListener('click', handleGlobalClick);
  renderCart();
  renderWishlist();

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
window.toggleCart = toggleCart;
window.toggleWishlist = toggleWishlist;
window.toggleCheckout = toggleCheckout;
function scrollSection(id, direction) {
  const el = document.getElementById(id);
  if (!el) return;

  el.scrollBy({
    left: direction * 320,
    behavior: 'smooth'
  });
}

window.scrollSection = scrollSection;
