const API_BASE_URL = window.SPORTX_API_URL || 'http://localhost:3000';

const products = [
  {
    id: 1,
    title: 'Nike Tênis Velocity Pro',
    category: 'Calçados',
    group: 'Masculino',
    sport: 'Corrida',
    price: 499.9,
    rating: 4.9,
    cashback: 5,
    isNew: true,
    image: 'https://m.media-amazon.com/images/I/81j4AXVz5tL._AC_SY575_.jpg'
  },
  {
    id: 2,
    title: 'Adidas Legging Motion Fit',
    category: 'Feminino',
    group: 'Feminino',
    sport: 'Academia',
    price: 189.9,
    rating: 4.8,
    cashback: 4,
    isNew: true,
    image: 'https://static.ativaesportes.com.br/public/ativaesportes/imagens/produtos/calca-adidas-legging-3-stripes-feminina-gb4350-64ef58a2bd551.jpg'
  },
  {
    id: 3,
    title: 'Puma Camisa Dry Power',
    category: 'Masculino',
    group: 'Masculino',
    sport: 'Academia',
    price: 129.9,
    rating: 4.7,
    cashback: 3,
    isNew: false,
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,w_600,b_rgb:FAFAFA/global/526718/51/mod01/fnd/BRA/fmt/png'
  },
  {
    id: 4,
    title: 'Nike Chuteira Strike Elite',
    category: 'Calçados',
    group: 'Masculino',
    sport: 'Futebol',
    price: 379.9,
    rating: 4.8,
    cashback: 5,
    isNew: true,
    image: 'https://d1a9qnv764bsoo.cloudfront.net/stores/002/341/698/rte/chuteira-nike-mercurial-superfly-9-elite-fg-rising-gem-%20cinza-preta.png'
  },
  {
    id: 5,
    title: 'Under Armour Garrafa Thermal Sport',
    category: 'Acessórios',
    group: 'Esportes',
    sport: 'Corrida',
    price: 79.9,
    rating: 4.6,
    cashback: 2,
    isNew: false,
    image: 'https://m.media-amazon.com/images/I/81d6Bu+04aL.jpg'
  },
  {
    id: 6,
    title: 'Adidas Top Active Flow',
    category: 'Feminino',
    group: 'Feminino',
    sport: 'Academia',
    price: 109.9,
    rating: 4.7,
    cashback: 4,
    isNew: true,
    image: 'https://bayard.vtexassets.com/arquivos/ids/3714695-800-auto?v=639011749902370000&width=800&height=auto&aspect=true'
  },
  {
    id: 7,
    title: 'Nike Mochila Urban Sport',
    category: 'Acessórios',
    group: 'Esportes',
    sport: 'Treino',
    price: 219.9,
    rating: 4.8,
    cashback: 3,
    isNew: false,
    image: 'https://imgnike-a.akamaihd.net/1300x1300/012822IDA2.jpg'
  },
  {
    id: 8,
    title: 'Puma Jaqueta Runner Shield',
    category: 'Masculino',
    group: 'Masculino',
    sport: 'Corrida',
    price: 259.9,
    rating: 4.9,
    cashback: 5,
    isNew: true,
    image: 'https://static.ativaesportes.com.br/public/ativaesportes/imagens/produtos/jaqueta-puma-uv-favourite-running-masculina-521684-01-647f09f604350.jpg'
  },
  {
    id: 9,
    title: 'Nike Shorts Sprint Max',
    category: 'Masculino',
    group: 'Masculino',
    sport: 'Corrida',
    price: 149.9,
    rating: 4.6,
    cashback: 3,
    isNew: true,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLzsmk-ES_n1rgF-nbhisQAn7CDFMk2CqnOg&s'
  },
  {
    id: 10,
    title: 'Adidas Tênis Pulse Ride',
    category: 'Calçados',
    group: 'Feminino',
    sport: 'Corrida',
    price: 429.9,
    rating: 4.8,
    cashback: 5,
    isNew: true,
    image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/fc420c4011ab4e3fae1fafaa00110024_9366/Tenis_4DFWD_Pulse_2.0_Cinza_HP3204.jpg'
  },
  {
    id: 11,
    title: 'Puma Camiseta Training Core',
    category: 'Feminino',
    group: 'Feminino',
    sport: 'Academia',
    price: 99.9,
    rating: 4.5,
    cashback: 2,
    isNew: false,
    image: 'https://images.tcdn.com.br/img/img_prod/311840/camiseta_puma_teamsport_cup_training_core_64476_1_20210806233420.jpg'
  },
  {
    id: 12,
    title: 'Nike Meião Match Pro',
    category: 'Acessórios',
    group: 'Esportes',
    sport: 'Futebol',
    price: 59.9,
    rating: 4.4,
    cashback: 2,
    isNew: false,
    image: 'https://www.tkaesportes.com.br/estatico/tka/images/produto/7336.jpeg?v=1552938369'
  },
  {
    id: 13,
    title: 'Adidas Luva Grip Force',
    category: 'Acessórios',
    group: 'Esportes',
    sport: 'Futebol',
    price: 139.9,
    rating: 4.7,
    cashback: 3,
    isNew: true,
    image: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/377ad8bc-ea97-4236-9e7d-eb96608ba94a.__CR0,0,1772,1096_PT0_SX970_V1___.jpg'
  },
  {
    id: 14,
    title: 'Under Armour Regata Power Move',
    category: 'Masculino',
    group: 'Masculino',
    sport: 'Academia',
    price: 119.9,
    rating: 4.6,
    cashback: 3,
    isNew: false,
    image: 'https://underarmourbr.vtexassets.com/arquivos/ids/342184-800-800/1361521-001-01.jpg?v=638617466753230000&width=800&height=800'
  },
  {
    id: 15,
    title: 'Nike Bolsa Training Bag',
    category: 'Acessórios',
    group: 'Esportes',
    sport: 'Treino',
    price: 199.9,
    rating: 4.8,
    cashback: 4,
    isNew: true,
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQ1dJhbfj-Vx2t6blKzr-o9FTGM6Sow6d0lqPJ0aks17qmTF-JxplMt7q4G_pBcknMxCn5NanepSQABP1NPPIV6rp7aQ4VCmlJLboWnKK7eMjDay7X0F7iR'
  },
  {
    id: 16,
    title: 'Puma Calça Flex Motion',
    category: 'Feminino',
    group: 'Feminino',
    sport: 'Treino',
    price: 169.9,
    rating: 4.7,
    cashback: 4,
    isNew: false,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRoVXjqbxJzKKV7SrfaIJYNpZ5qHLIP3k90EqyxzgEtZ1BZilvdaV_ENRa4bZwZ1LlqqcVKUDMzjeck85iW4DEPUIvfS1HizuKKDrUcCG469c5yfnaC_8jKZpBOTYwENmLlRe9L6DA&usqp=CAc'
  }
];

const kits = [
  {
    id: 'k1',
    title: 'Kit Corrida',
    price: 649.9,
    cashback: 5,
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1200&q=80',
    items: ['Tênis', 'Camisa dry', 'Garrafa'],
    productIds: [1, 3, 5]
  },
  {
    id: 'k2',
    title: 'Kit Academia',
    price: 389.9,
    cashback: 4,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    items: ['Top/Regata', 'Legging/Shorts', 'Mochila', 'Garrafa', 'Luva'],
    productIds: [2, 6, 7]
  },
  {
    id: 'k3',
    title: 'Kit Futebol',
    price: 559.9,
    cashback: 5,
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80',
    items: ['Chuteira', 'bermuda', 'Camisa', 'Meião', 'Caneleira'],
    productIds: [4, 3, 12]
  },
  {
    id: 'k4',
    title: 'Kit Treino Completo',
    price: 729.9,
    cashback: 5,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    items: ['Tênis', 'Regata', 'Bolsa'],
    productIds: [10, 14, 15]
  }
];

const CATEGORY_FOLDERS = {
  Masculino: '/masculino',
  Feminino: '/feminino',
  Calçados: '/sapatos',
  Acessórios: '/acessorios',
  Esportes: '/esportes'
};

const PRODUCT_DETAILS = {
  1: { description: 'Tênis de corrida com amortecimento responsivo para treinos de alta intensidade.', sizes: '38, 39, 40, 41, 42, 43', gender: 'Masculino', folders: ['/masculino', '/sapatos', '/esportes'] },
  2: { description: 'Legging de compressão com tecido elástico e secagem rápida para academia.', sizes: 'P, M, G, GG', gender: 'Feminino', folders: ['/feminino', '/esportes'] },
  3: { description: 'Camisa dry fit para treinos com ventilação e conforto térmico.', sizes: 'P, M, G, GG', gender: 'Masculino', folders: ['/masculino', '/esportes'] },
  4: { description: 'Chuteira para campo com tração aprimorada e estabilidade em mudanças rápidas.', sizes: '37, 38, 39, 40, 41, 42', gender: 'Masculino', folders: ['/masculino', '/sapatos', '/esportes'] },
  5: { description: 'Garrafa térmica com vedação reforçada para manter a temperatura por mais tempo.', sizes: 'Único', gender: 'Unissex', folders: ['/acessorios', '/esportes'] },
  6: { description: 'Top esportivo com sustentação média para corrida e academia.', sizes: 'P, M, G', gender: 'Feminino', folders: ['/feminino', '/esportes'] },
  7: { description: 'Mochila com divisórias internas e tecido resistente para rotina esportiva.', sizes: 'Único', gender: 'Unissex', folders: ['/acessorios', '/esportes'] },
  8: { description: 'Jaqueta leve com proteção contra vento e detalhes refletivos para corrida.', sizes: 'P, M, G, GG', gender: 'Masculino', folders: ['/masculino', '/esportes'] },
  9: { description: 'Shorts com mobilidade e respirabilidade para treinos e corridas.', sizes: 'P, M, G, GG', gender: 'Masculino', folders: ['/masculino', '/esportes'] },
  10: { description: 'Tênis feminino com retorno de energia e sola aderente para corrida urbana.', sizes: '34, 35, 36, 37, 38, 39', gender: 'Feminino', folders: ['/feminino', '/sapatos', '/esportes'] },
  11: { description: 'Camiseta training com toque macio e modelagem confortável.', sizes: 'P, M, G', gender: 'Feminino', folders: ['/feminino', '/esportes'] },
  12: { description: 'Meião esportivo de compressão com ajuste anatômico para futebol.', sizes: '39-43', gender: 'Unissex', folders: ['/acessorios', '/esportes'] },
  13: { description: 'Luva com grip reforçado para maior segurança em treinos e partidas.', sizes: 'P, M, G', gender: 'Unissex', folders: ['/acessorios', '/esportes'] },
  14: { description: 'Regata com tecido leve e tecnologia antiodor para academia.', sizes: 'P, M, G, GG', gender: 'Masculino', folders: ['/masculino', '/esportes'] },
  15: { description: 'Bolsa esportiva com amplo espaço interno e alças reforçadas.', sizes: 'Único', gender: 'Unissex', folders: ['/acessorios', '/esportes'] },
  16: { description: 'Calça com elasticidade e conforto para treino e uso diário.', sizes: 'P, M, G, GG', gender: 'Feminino', folders: ['/feminino', '/esportes'] }
};

const KIT_DETAILS = {
  k1: { description: 'Kit focado em corrida para melhorar desempenho e recuperação.', sizes: 'Variável por item', gender: 'Unissex' },
  k2: { description: 'Kit completo para academia com foco em praticidade e conforto.', sizes: 'Variável por item', gender: 'Unissex' },
  k3: { description: 'Kit para futebol com produtos essenciais para treino e jogo.', sizes: 'Variável por item', gender: 'Unissex' },
  k4: { description: 'Kit versátil para rotina de treino completo.', sizes: 'Variável por item', gender: 'Unissex' }
};

const productsWithDetails = products.map((product) => ({
  ...product,
  ...PRODUCT_DETAILS[product.id]
}));

let cart = [];
let wishlist = [];
let cashbackBalance = 0;
let activeFilter = '';
let activeFolder = '';
let authMode = 'register';
let allProducts = [];
let currentUser = JSON.parse(localStorage.getItem('sportx-current-user') || sessionStorage.getItem('sportx-current-user') || 'null');
let users = [];
let rememberSession = true;
let authToken = localStorage.getItem('sportx-token') || sessionStorage.getItem('sportx-token') || '';
let productSales = JSON.parse(localStorage.getItem('sportx-product-sales') || '{}');
let productReviews = JSON.parse(localStorage.getItem('sportx-product-reviews') || '{}');
let selectedVariants = {};

const currency = (value) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

function getProduct(id) {
  return productsWithDetails.find((product) => product.id === Number(id));
}

function getVisibleGender(gender) {
  if (gender === 'Unissex') return 'Unissex';
  return gender;
}

function updateActiveFolderLabel() {
  const folderLabel = document.getElementById('activeFolderLabel');
  if (!folderLabel) return;
  folderLabel.textContent = activeFolder || '/produtos';
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function saveState() {
  localStorage.setItem('sportx-cart', JSON.stringify(cart));
  localStorage.setItem('sportx-wishlist', JSON.stringify(wishlist));
  localStorage.setItem('sportx-cashback', String(cashbackBalance));
}

function loadState() {
  cart = JSON.parse(localStorage.getItem('sportx-cart') || '[]');
  wishlist = JSON.parse(localStorage.getItem('sportx-wishlist') || '[]');
  cashbackBalance = Number(localStorage.getItem('sportx-cashback') || '0');
}

function saveUsers() {
  if (rememberSession) {
    localStorage.setItem('sportx-current-user', JSON.stringify(currentUser));
    if (authToken) localStorage.setItem('sportx-token', authToken);
    sessionStorage.removeItem('sportx-current-user');
    sessionStorage.removeItem('sportx-token');
  } else {
    sessionStorage.setItem('sportx-current-user', JSON.stringify(currentUser));
    if (authToken) sessionStorage.setItem('sportx-token', authToken);
    localStorage.removeItem('sportx-current-user');
    localStorage.removeItem('sportx-token');
  }
}

function clearSessionStorage() {
  localStorage.removeItem('sportx-current-user');
  sessionStorage.removeItem('sportx-current-user');
  localStorage.removeItem('sportx-token');
  sessionStorage.removeItem('sportx-token');
}

async function apiRequest(path, options = {}) {
  const tokenHeader = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...tokenHeader, ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Erro na API');
  }

  return response.status === 204 ? null : response.json();
}

async function loadProductsFromApi(searchTerm = '') {
  try {
    const query = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : '';
    const dbProducts = await apiRequest(`/produtos${query}`);
    if (Array.isArray(dbProducts) && dbProducts.length) {
      allProducts = dbProducts.map((product) => ({
        id: product.id_produto,
        title: product.nome,
        category: mapCategoryFromId(product.id_categoria, product.genero),
        group: product.genero || 'Unissex',
        sport: product.genero || 'Treino',
        price: Number(product.preco || 0),
        rating: 4.7,
        cashback: 3,
        isNew: false,
        image: product.imagem || 'https://via.placeholder.com/400x400?text=Produto',
        description: product.descricao || 'Produto esportivo',
        sizes: product.numeracao || 'Único',
        gender: product.genero || 'Unissex',
        folders: getFoldersByCategory(mapCategoryFromId(product.id_categoria, product.genero)),
        sales: Number(productSales[product.id_produto] || 0)
      }));
      return;
    }
  } catch (error) {
    console.warn('API indisponível para produtos. Usando catálogo local.', error);
  }

  allProducts = productsWithDetails;
}

function closeAccountDropdown() {
  document.getElementById('accountDropdown')?.classList.remove('open');
}

function openAccountDropdown() {
  document.getElementById('accountDropdown')?.classList.add('open');
}

function toggleAccountDropdown(force) {
  const dropdown = document.getElementById('accountDropdown');
  if (!dropdown) return;

  const shouldOpen = force ?? !dropdown.classList.contains('open');
  dropdown.classList.toggle('open', shouldOpen);
}

function getInitials(nameOrEmail = '') {
  const value = nameOrEmail.trim();
  if (!value) return '👤';

  if (value.includes('@')) return '👤';

  const parts = value.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();

  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function updateAccountButton() {
  const accountLabel = document.getElementById('accountLabel');
  const accountSubLabel = document.getElementById('accountSubLabel');
  const accountIcon = document.getElementById('accountIcon');
  const accountDropdownAvatar = document.getElementById('accountDropdownAvatar');
  const accountDropdownName = document.getElementById('accountDropdownName');
  const accountDropdownType = document.getElementById('accountDropdownType');
  const logoutBtn = document.getElementById('logoutBtn');
  const sellerMenuBtn = document.getElementById('sellerMenuBtn');

  if (!accountLabel || !accountIcon) return;

  if (currentUser) {
    const avatarText = currentUser.type === 'vendedor'
      ? '🏪'
      : getInitials(currentUser.name || currentUser.email);

    accountLabel.textContent = currentUser.name || currentUser.email;
    if (accountSubLabel) {
      accountSubLabel.textContent =
        currentUser.type === 'vendedor' ? 'Painel do vendedor' : 'Minha conta';
    }

    accountIcon.textContent = avatarText;
    if (accountDropdownAvatar) accountDropdownAvatar.textContent = avatarText;
    if (accountDropdownName) accountDropdownName.textContent = currentUser.name || currentUser.email;
    if (accountDropdownType) {
      accountDropdownType.textContent =
        currentUser.type === 'vendedor'
          ? 'Conta de vendedor'
          : 'Conta de comprador';
    }

    if (logoutBtn) logoutBtn.style.display = 'block';
    if (sellerMenuBtn) sellerMenuBtn.style.display = currentUser.type === 'vendedor' ? 'block' : 'none';
  } else {
    accountLabel.textContent = 'Entrar / Cadastrar';
    if (accountSubLabel) accountSubLabel.textContent = 'Acesse sua conta';
    accountIcon.textContent = '👤';
    if (accountDropdownAvatar) accountDropdownAvatar.textContent = '👤';
    if (accountDropdownName) accountDropdownName.textContent = 'Olá';
    if (accountDropdownType) accountDropdownType.textContent = 'Entre para ver sua conta';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (sellerMenuBtn) sellerMenuBtn.style.display = 'none';
  }
}

function logoutUser() {
  currentUser = null;
  authToken = '';
  clearSessionStorage();
  updateAccountButton();
  closeAccountDropdown();
  showToast('Você saiu da sua conta.');
}

function addToCart(id, qty = 1, options = {}) {
  const { fromWishlist = false, showDecision = false } = options;
  const variant = getVariant(Number(id));
  const key = getCartKey(Number(id), variant.size);
  const item = cart.find((cartItem) => cartItem.key === key);

  if (item) {
    item.qty += qty;
  } else {
    cart.push({ id: Number(id), qty, size: variant.size, gender: variant.gender, key });
  }

  if (fromWishlist) {
    wishlist = wishlist.filter((itemId) => itemId !== Number(id));
    renderWishlist();
    renderProducts();
    renderLaunches();
  }

  saveState();
  renderCart();
  updateCounters();
  renderCheckout();
  showToast('Produto adicionado ao carrinho.');

  if (showDecision) {
    setTimeout(() => {
      const goToPayment = window.confirm(
        'Produto movido da wishlist para o carrinho.\n\nClique em OK para ir ao pagamento ou em Cancelar para continuar comprando.'
      );

      if (goToPayment) {
        if (!cart.length) {
          showToast('Adicione itens ao carrinho antes de finalizar.');
          return;
        }

        renderCheckout();
        toggleWishlist(false);
        toggleCart(false);
        toggleCheckout(true);
      } else {
        toggleWishlist(false);
        showToast('Você pode continuar comprando.');
      }
    }, 120);
  }
}

function addKitToCart(kitId) {
  const kit = kits.find((item) => item.id === kitId);
  if (!kit) return;

  kit.productIds.forEach((id) => addToCart(id, 1));
  showToast(`${kit.title} adicionado ao carrinho.`);
}

function toggleWish(id) {
  const productId = Number(id);

  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter((item) => item !== productId);
    showToast('Produto removido da wishlist.');
  } else {
    wishlist.push(productId);
    showToast('Produto salvo na wishlist.');
  }

  saveState();
  renderProducts();
  renderLaunches();
  renderWishlist();
  updateCounters();
}

function updateCounters() {
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  const cartCountEl = document.getElementById('cartCount');
  const wishlistCountEl = document.getElementById('wishlistCount');
  const cashbackBalanceEl = document.getElementById('cashbackBalance');

  if (cartCountEl) cartCountEl.textContent = cartCount;
  if (wishlistCountEl) wishlistCountEl.textContent = wishlist.length;
  if (cashbackBalanceEl) cashbackBalanceEl.textContent = currency(cashbackBalance);
}

function renderProductCard(product) {
  return `
    <article class="product-card">
      <div class="product-media">
        ${product.isNew ? '<span class="badge">NOVO</span>' : ''}
        <span class="cashback">Ganhe ${product.cashback}% de volta</span>
        <img src="${product.image}" alt="${product.title}" onclick="openProductDetails(${product.id})" />
        <button class="wish-btn ${wishlist.includes(product.id) ? 'active' : ''}" onclick="toggleWish(${product.id})">❤</button>
      </div>
      <div class="product-body">
        <div class="product-category">${product.category} • ${getVisibleGender(product.gender)} • ${product.sport}</div>
        <h3 class="product-title" onclick="openProductDetails(${product.id})">${product.title}</h3>
        <div class="product-meta">
          <div class="price-wrap">
            <strong>${currency(product.price)}</strong>
            <span>Em até 3x sem juros</span>
          </div>
          <div class="rating">⭐ ${product.rating}</div>
        </div>
        <div class="product-actions">
          <button class="btn-card btn-dark" onclick="addToCart(${product.id})">Adicionar</button>
          <button class="btn-card btn-light" onclick="openProductDetails(${product.id})">Ver detalhes</button>
          <button class="btn-card btn-light" onclick="toggleWish(${product.id})">Favoritar</button>
        </div>
      </div>
    </article>
  `;
}


function mapCategoryFromId(categoryId, fallback = 'Esportes') {
  const map = { 1: 'Masculino', 2: 'Feminino', 3: 'Calçados', 4: 'Acessórios', 5: 'Esportes' };
  return map[Number(categoryId)] || fallback || 'Esportes';
}

function getFoldersByCategory(category) {
  return ['/produtos', CATEGORY_FOLDERS[category] || '/esportes', '/esportes'];
}

function saveReviews() {
  localStorage.setItem('sportx-product-reviews', JSON.stringify(productReviews));
}

function saveSales() {
  localStorage.setItem('sportx-product-sales', JSON.stringify(productSales));
}

function getVariant(id) {
  return selectedVariants[id] || { size: 'Único', gender: getProduct(id)?.gender || 'Unissex' };
}

function setVariant(id, variant) {
  selectedVariants[id] = { ...getVariant(id), ...variant };
}

function getCartKey(id, size) {
  return `${id}-${size || 'Único'}`;
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  if (!grid) return;

  const term = searchInput?.value?.trim().toLowerCase() || '';

  const sourceProducts = allProducts.length ? allProducts : productsWithDetails;

  const filteredProducts = sourceProducts.filter((product) => {
    const fields = [product.title, product.category, product.group, product.sport].join(' ').toLowerCase();
    const categoryMatch = !activeFilter || product.category === activeFilter || product.group === activeFilter || product.sport === activeFilter || activeFilter === 'Esportes';
    const folderMatch = !activeFolder || product.folders?.includes(activeFolder);

    const textMatch = !term || fields.includes(term);
    return categoryMatch && folderMatch && textMatch;
  });

  grid.innerHTML = filteredProducts.map(renderProductCard).join('');

  if (!filteredProducts.length) {
    grid.innerHTML = `
      <div class="panel" style="min-width: 320px;">
        <h3>Nenhum produto encontrado</h3>
        <p>Pesquise por nome, marca, categoria ou esporte. Exemplo: Nike, corrida, chuteira, feminino.</p>
      </div>
    `;
  }
}

function renderLaunches() {
  const launchCarousel = document.getElementById('launchCarousel');
  if (!launchCarousel) return;

  const launches = productsWithDetails.filter((product) => product.isNew);
  launchCarousel.innerHTML = launches.map(renderProductCard).join('');
}

function renderKits() {
  const kitsGrid = document.getElementById('kitsGrid');
  if (!kitsGrid) return;

  kitsGrid.innerHTML = kits
    .map(
      (kit) => `
    <article class="kit-card">
      <img src="${kit.image}" alt="${kit.title}" />
      <div class="kit-body">
        <div class="eyebrow">Ganhe ${kit.cashback}% de cashback</div>
        <h3 style="font-size:1.4rem;font-weight:900;">${kit.title}</h3>
        <div class="kit-items">${kit.items.map((item) => `<span class="pill">${item}</span>`).join('')}</div>
        <p style="color:#555;margin-bottom:14px;">Monte uma compra mais rápida com itens pensados para a modalidade.</p>
        <div class="product-meta">
          <div class="price-wrap"><strong>${currency(kit.price)}</strong><span>Kit personalizável</span></div>
        </div>
        <div class="product-actions">
          <button class="btn-card btn-dark" onclick="addKitToCart('${kit.id}')">Adicionar kit</button>
          <button class="btn-card btn-light" onclick="openKitDetails('${kit.id}')">Ver detalhes</button>
          <button class="btn-card btn-light" onclick="showToast('Personalização simulada para ${kit.title}.')">Personalizar</button>
        </div>
      </div>
    </article>
  `
    )
    .join('');
}

function cartCalculations() {
  const subtotal = cart.reduce((total, item) => {
    const product = getProduct(item.id);
    return total + (product ? product.price * item.qty : 0);
  }, 0);

  const cashback = cart.reduce((total, item) => {
    const product = getProduct(item.id);
    return total + (product ? product.price * item.qty * (product.cashback / 100) : 0);
  }, 0);

  return { subtotal, cashback, total: subtotal };
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  if (!cartItems) return;

  if (!cart.length) {
    cartItems.innerHTML = '<div class="panel"><h3>Seu carrinho está vazio</h3><p>Adicione produtos para continuar.</p></div>';
  } else {
    cartItems.innerHTML = cart
      .map((item) => {
        const product = getProduct(item.id);
        if (!product) return '';

        return `
        <div class="drawer-item">
          <img src="${product.image}" alt="${product.title}" />
          <div>
            <strong style="display:block;margin-bottom:4px;">${product.title}</strong>
            <small style="color:#666;display:block;">${currency(product.price)}</small><small style="color:#666;display:block;">Tam: ${item.size || 'Único'} • ${item.gender || getVisibleGender(product.gender)}</small>
            <div class="qty">
              <button onclick="changeQty(${product.id}, -1)">−</button>
              <span>${item.qty}</span>
              <button onclick="changeQty(${product.id}, 1)">+</button>
            </div>
          </div>
          <button class="icon-btn" onclick="removeFromCart('${item.key || getCartKey(product.id, item.size)}')">✕</button>
        </div>
      `;
      })
      .join('');
  }

  const { subtotal, cashback, total } = cartCalculations();
  document.getElementById('cartSubtotal').textContent = currency(subtotal);
  document.getElementById('cartCashback').textContent = currency(cashback);
  document.getElementById('cartTotal').textContent = currency(total);
}

function renderWishlist() {
  const wrapper = document.getElementById('wishlistItems');
  if (!wrapper) return;

  if (!wishlist.length) {
    wrapper.innerHTML = '<div class="panel"><h3>Nenhum item salvo</h3><p>Use o coração nos produtos para montar sua wishlist.</p></div>';
    return;
  }

  wrapper.innerHTML = wishlist
    .map((id) => {
      const product = getProduct(id);
      if (!product) return '';

      return `
      <div class="drawer-item">
        <img src="${product.image}" alt="${product.title}" />
        <div>
          <strong style="display:block;margin-bottom:4px;">${product.title}</strong>
          <small style="color:#666;display:block;">${currency(product.price)}</small>
          <button class="btn btn-light" style="margin-top:10px;padding:10px 14px;" onclick="addToCart(${product.id}, 1, { fromWishlist: true, showDecision: true })">Adicionar</button>
        </div>
        <button class="icon-btn" onclick="toggleWish(${product.id})">✕</button>
      </div>
    `;
    })
    .join('');
}

function renderCheckout() {
  const summary = document.getElementById('checkoutSummary');
  if (!summary) return;

  if (!cart.length) {
    summary.innerHTML = '<p>Nenhum item no pedido.</p>';
  } else {
    summary.innerHTML = cart
      .map((item) => {
        const product = getProduct(item.id);
        if (!product) return '';

        return `
        <div class="summary-row">
          <span>${product.title} (${item.size || 'Único'}) x${item.qty}</span>
          <strong>${currency(product.price * item.qty)}</strong>
        </div>
      `;
      })
      .join('');
  }

  const { subtotal, cashback, total } = cartCalculations();
  document.getElementById('checkoutSubtotal').textContent = currency(subtotal);
  document.getElementById('checkoutCashback').textContent = currency(cashback);
  document.getElementById('checkoutTotal').textContent = currency(total);
}

function changeQty(id, delta) {
  const item = cart.find((cartItem) => cartItem.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== id);
  }

  saveState();
  renderCart();
  renderCheckout();
  updateCounters();
}

function removeFromCart(key) {
  cart = cart.filter((item) => (item.key || getCartKey(item.id, item.size)) !== key);
  saveState();
  renderCart();
  renderCheckout();
  updateCounters();
  showToast('Item removido do carrinho.');
}

function addAllWishlistToCart() {
  if (!wishlist.length) {
    showToast('Sua wishlist está vazia.');
    return;
  }

  const wishlistCopy = [...wishlist];
  wishlistCopy.forEach((id) => addToCart(id, 1, { fromWishlist: true }));
  renderWishlist();
  showToast('Todos os itens da wishlist foram para o carrinho.');
}

function toggleCart(force) {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  drawer.classList.toggle('open', force ?? !drawer.classList.contains('open'));
}

function toggleWishlist(force) {
  const drawer = document.getElementById('wishlistDrawer');
  if (!drawer) return;
  drawer.classList.toggle('open', force ?? !drawer.classList.contains('open'));
}

function toggleCheckout(force) {
  const modal = document.getElementById('checkoutModal');
  if (!modal) return;
  modal.classList.toggle('open', force ?? !modal.classList.contains('open'));
}

function toggleChat(force) {
  const box = document.getElementById('chatBox');
  if (!box) return;
  box.classList.toggle('open', force ?? !box.classList.contains('open'));
}

function toggleAuthModal(force) {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  modal.classList.toggle('open', force ?? !modal.classList.contains('open'));
}

function toggleProductModal(force) {
  const modal = document.getElementById('productModal');
  if (!modal) return;
  modal.classList.toggle('open', force ?? !modal.classList.contains('open'));
}

function renderProductModalContent(item) {
  const content = document.getElementById('productModalContent');
  if (!content || !item) return;

  const sizes = String(item.sizes || 'Único').split(',').map((s) => s.trim()).filter(Boolean);
  const genders = item.gender === 'Unissex' ? ['Unissex'] : ['Masculino', 'Feminino'];
  const reviews = productReviews[item.id] || [];
  const avg = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : item.rating;

  content.innerHTML = `
    <img src="${item.image}" alt="${item.title}" />
    <div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="product-modal-meta">
        <span><strong>Preço:</strong> ${currency(item.price)}</span>
        <span><strong>Avaliação:</strong> ⭐ ${avg}</span>
      </div>
      <div class="input-group top-gap-sm">
        <label>Tamanho/numeração</label>
        <select id="productSizeSelect">${sizes.map((size) => `<option value="${size}">${size}</option>`).join('')}</select>
      </div>
      <div class="input-group top-gap-sm">
        <label>Gênero</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${genders.map((g) => `<button type="button" class="btn btn-light gender-option" data-gender="${g}">${g}</button>`).join('')}
        </div>
      </div>
      <button class="btn btn-primary top-gap-sm" id="productAddToCartBtn">Adicionar ao carrinho</button>
      <div class="top-gap-sm">
        <h4>Avaliações (${reviews.length})</h4>
        <div id="productReviewsList">${reviews.length ? reviews.map((review) => `<p>⭐ ${review.rating} - ${review.comment}</p>`).join('') : '<p>Ainda sem avaliações.</p>'}</div>
      </div>
      <form id="reviewForm" class="top-gap-sm" style="display:grid;gap:8px;">
        <select id="reviewRating" required><option value="">Nota</option><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select>
        <textarea id="reviewComment" rows="2" placeholder="Escreva sua avaliação" required></textarea>
        <button class="btn btn-light" type="submit">Enviar avaliação</button>
      </form>
    </div>
  `;

  setVariant(item.id, { size: sizes[0] || 'Único', gender: genders[0] || 'Unissex' });

  document.querySelectorAll('.gender-option').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.gender-option').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      setVariant(item.id, { gender: button.dataset.gender });
    });
  });

  const firstGender = document.querySelector('.gender-option');
  if (firstGender) firstGender.classList.add('active');

  document.getElementById('productSizeSelect')?.addEventListener('change', (event) => {
    setVariant(item.id, { size: event.target.value });
  });

  document.getElementById('productAddToCartBtn')?.addEventListener('click', () => {
    addToCart(item.id);
    toggleProductModal(false);
  });

  document.getElementById('reviewForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!currentUser) {
      showToast('Faça login para avaliar.');
      return;
    }

    const rating = Number(document.getElementById('reviewRating')?.value);
    const comment = document.getElementById('reviewComment')?.value.trim();
    if (!rating || !comment) return;

    const list = productReviews[item.id] || [];
    list.unshift({ rating, comment, user: currentUser.name || currentUser.email, createdAt: new Date().toISOString() });
    productReviews[item.id] = list.slice(0, 20);
    saveReviews();
    showToast('Avaliação enviada com sucesso.');
    renderProductModalContent(item);
  });
}

function openProductDetails(id) {
  const product = getProduct(id);
  if (!product) return;
  renderProductModalContent(product);
  toggleProductModal(true);
}

function openKitDetails(kitId) {
  const kit = kits.find((item) => item.id === kitId);
  if (!kit) return;

  const details = KIT_DETAILS[kit.id];
  const content = document.getElementById('productModalContent');
  if (!content || !details) return;

  content.innerHTML = `
    <img src="${kit.image}" alt="${kit.title}" />
    <div>
      <h3>${kit.title}</h3>
      <p>${details.description}</p>
      <div class="product-modal-meta">
        <span><strong>Preço:</strong> ${currency(kit.price)}</span>
        <span><strong>Numeração:</strong> ${details.sizes}</span>
        <span><strong>Gênero:</strong> ${getVisibleGender(details.gender)}</span>
      </div>
      <button class="btn btn-primary top-gap-sm" onclick="addKitToCart('${kit.id}'); toggleProductModal(false);">Adicionar kit</button>
    </div>
  `;

  toggleProductModal(true);
}

function updatePaymentInstallments() {
  const paymentMethod = document.getElementById('paymentMethod');
  const installmentsGroup = document.getElementById('installmentsGroup');
  const installmentsSelect = document.getElementById('installmentsSelect');
  if (!paymentMethod || !installmentsGroup || !installmentsSelect) return;

  const isCredit = paymentMethod.value === 'credito';
  installmentsGroup.style.display = isCredit ? 'block' : 'none';
  installmentsSelect.disabled = !isCredit;
}

function updateAuthUI() {
  const isRegister = authMode === 'register';

  document.getElementById('authTitle').textContent = isRegister ? 'Criar conta' : 'Entrar';
  document.getElementById('authSubmitBtn').textContent = isRegister ? 'Criar conta' : 'Entrar';
  document.getElementById('toggleAuthModeBtn').textContent = isRegister ? 'Já tenho login' : 'Criar conta';

  document.getElementById('nameField').style.display = isRegister ? 'block' : 'none';
  document.getElementById('accountTypeField').style.display = isRegister ? 'block' : 'none';
}

async function handleAuthSubmit(event) {
  event.preventDefault();

  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const password = document.getElementById('authPassword').value.trim();
  const remember = document.getElementById('rememberSession')?.checked ?? true;
  rememberSession = remember;

  if (!email || !password) {
    showToast('Preencha email e senha.');
    return;
  }

  try {
    if (authMode === 'register') {
      const name = document.getElementById('authName').value.trim();
      const type = document.getElementById('authType').value;

      if (!name) {
        showToast('Preencha seu nome.');
        return;
      }

      const newUser = await apiRequest('/usuarios', {
        method: 'POST',
        body: JSON.stringify({
          nome: name,
          email,
          senha: password,
          tipo_usuario: type === 'comprador' ? 'cliente' : type,
        }),
      });

      currentUser = {
        id_usuario: newUser.id_usuario,
        name: newUser.nome,
        email: newUser.email,
        type: newUser.tipo_usuario,
      };

      saveUsers();
      updateAccountButton();
      showToast(`Conta de ${currentUser.type} criada com sucesso.`);
    } else {
      const user = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha: password }),
      });

      authToken = user.access_token || '';
      currentUser = {
        id_usuario: user.user?.id_usuario,
        name: user.user?.nome,
        email: user.user?.email,
        type: user.user?.tipo_usuario,
      };

      saveUsers();
      updateAccountButton();
      showToast('Login realizado com sucesso.');
    }

    document.getElementById('authForm').reset();
    toggleAuthModal(false);
    openAccountDropdown();
  } catch (error) {
    showToast(error.message || 'Não foi possível autenticar.');
  }
}

function scrollCarousel(direction) {
  document.getElementById('launchCarousel')?.scrollBy({
    left: direction * 300,
    behavior: 'smooth'
  });
}

function scrollProducts(direction) {
  const container = document.getElementById('productsGrid');
  if (!container) return;

  container.scrollBy({
    left: direction * 340,
    behavior: 'smooth'
  });
}

function registerCategoryCards() {
  document.querySelectorAll('.category-card[data-filter]').forEach((card) => {
    card.addEventListener('click', () => {
      activeFilter = card.dataset.filter;
      activeFolder = card.dataset.folder || CATEGORY_FOLDERS[activeFilter] || '';
      updateActiveFolderLabel();
      renderProducts();
      showToast(`Pasta ${activeFolder || '/produtos'} aberta.`);
    });
  });
}

function registerAccountPanelEvents() {
  const openAuthBtn = document.getElementById('openAuthBtn');
  const accountDropdown = document.getElementById('accountDropdown');
  const logoutBtn = document.getElementById('logoutBtn');
  const sellerMenuBtn = document.getElementById('sellerMenuBtn');

  openAuthBtn?.addEventListener('click', (event) => {
    event.stopPropagation();

    if (currentUser) {
      toggleAccountDropdown();
    } else {
      updateAuthUI();
      toggleAuthModal(true);
    }
  });

  logoutBtn?.addEventListener('click', (event) => {
    event.stopPropagation();
    logoutUser();
  });

  accountDropdown?.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  document.addEventListener('click', () => {
    closeAccountDropdown();
  });
}

function registerEvents() {
  document.getElementById('cartToggle')?.addEventListener('click', () => toggleCart(true));
  document.getElementById('wishlistToggle')?.addEventListener('click', () => toggleWishlist(true));

  document.getElementById('checkoutOpenBtn')?.addEventListener('click', async () => {
    if (!currentUser) {
      showToast('Faça login para finalizar a compra.');
      updateAuthUI();
      toggleAuthModal(true);
      return;
    }

    if (!cart.length) {
      showToast('Adicione itens ao carrinho antes de finalizar.');
      return;
    }

    prefillCheckoutUserData();
    await loadSavedPaymentPreference();
    renderCheckout();
    toggleCheckout(true);
  });

  document.getElementById('chatFab')?.addEventListener('click', () => toggleChat());
  document.getElementById('addAllWishlistBtn')?.addEventListener('click', addAllWishlistToCart);

  document.getElementById('clearFilterBtn')?.addEventListener('click', () => {
    activeFilter = '';
    activeFolder = '';
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    updateActiveFolderLabel();
    renderProducts();
    showToast('Filtro removido.');
  });

  document.querySelectorAll('[data-filter]').forEach((button) => {
    if (button.classList.contains('category-card')) return;

    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      activeFolder = CATEGORY_FOLDERS[activeFilter] || '';
      updateActiveFolderLabel();
      renderProducts();
      showToast(`Filtro aplicado: ${activeFilter}`);
    });
  });

  document.getElementById('searchInput')?.addEventListener('input', async (event) => {
    const term = event.target.value.trim();
    await loadProductsFromApi(term);
    renderProducts();
  });

  document.getElementById('finishOrderBtn')?.addEventListener('click', async () => {
    if (!currentUser) {
      showToast('Você precisa estar logado para comprar.');
      return;
    }

    if (!cart.length) {
      showToast('Seu carrinho está vazio.');
      return;
    }

    try {
      const paymentMethod = document.getElementById('paymentMethod')?.value || 'pix';
      const savePayment = document.getElementById('savePaymentInfo')?.checked;

      let idPagamento;
      if (savePayment) {
        const createdPayment = await apiRequest('/pagamentos', {
          method: 'POST',
          body: JSON.stringify({
            id_usuario: currentUser.id_usuario,
            tipo: paymentMethod,
            nome_titular: document.getElementById('checkoutName')?.value || currentUser.name,
            ultimos_digitos: '0000',
            bandeira: paymentMethod === 'credito' ? 'VISA' : null,
          }),
        });
        idPagamento = createdPayment.id_pagamento;
      }

      const { total, cashback } = cartCalculations();
      await apiRequest('/pedidos', {
        method: 'POST',
        body: JSON.stringify({
          id_usuario: currentUser.id_usuario,
          id_endereco: 1,
          id_pagamento: idPagamento,
          status: 'pendente',
          total,
          forma_pagamento: paymentMethod === 'credito' ? 'cartao' : paymentMethod,
        }),
      });

      cashbackBalance += cashback;
      cart.forEach((item) => {
        productSales[item.id] = Number(productSales[item.id] || 0) + item.qty;
      });
      saveSales();
      cart = [];
      saveState();
      renderCart();
      renderCheckout();
      updateCounters();
      toggleCheckout(false);
      toggleCart(false);
      showToast('Pedido confirmado com sucesso! Cashback creditado.');
    } catch (error) {
      showToast(error.message || 'Erro ao finalizar pedido.');
    }
  });

  document.getElementById('giftBtn')?.addEventListener('click', () => {
    const email = document.getElementById('giftEmail')?.value.trim();
    const name = document.getElementById('giftName')?.value.trim();

    if (!name || !email) {
      showToast('Preencha nome e e-mail para enviar o gift card.');
      return;
    }

    showToast(`Gift card enviado com sucesso para ${name}.`);
  });

  document.querySelector('.add-to-cart')?.addEventListener('click', (event) => {
    const id = event.currentTarget.dataset.id;
    addToCart(id);
  });

  document.getElementById('productsPrevBtn')?.addEventListener('click', () => {
    scrollProducts(-1);
  });

  document.getElementById('productsNextBtn')?.addEventListener('click', () => {
    scrollProducts(1);
  });

  document.getElementById('closeAuthBtn')?.addEventListener('click', () => {
    toggleAuthModal(false);
  });

  document.getElementById('toggleAuthModeBtn')?.addEventListener('click', () => {
    authMode = authMode === 'register' ? 'login' : 'register';
    updateAuthUI();
  });

  document.getElementById('authForm')?.addEventListener('submit', handleAuthSubmit);
  document.getElementById('paymentMethod')?.addEventListener('change', updatePaymentInstallments);
  document.getElementById('productModal')?.addEventListener('click', (event) => {
    if (event.target.id === 'productModal') toggleProductModal(false);
  });


  document.getElementById('sellerMenuBtn')?.addEventListener('click', () => {
    if (!currentUser || currentUser.type !== 'vendedor') {
      showToast('Apenas vendedores podem acessar essa área.');
      return;
    }

    window.open('vender.html', '_blank');
  });

  document.getElementById('sellerProductForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const sellerUser = JSON.parse(localStorage.getItem('sportx-current-user') || sessionStorage.getItem('sportx-current-user') || 'null');
    if (!sellerUser || sellerUser.type !== 'vendedor') {
      showToast('Faça login como vendedor para cadastrar produtos.');
      return;
    }

    try {
      const fileInput = document.getElementById('sellerProductImageFile');
      const selectedFile = fileInput?.files?.[0];
      let image = document.getElementById('sellerProductImage')?.value?.trim();
      if (selectedFile) {
        image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
      }

      const category = document.getElementById('sellerProductCategory')?.value || 'Esportes';
      const categoryMap = { Masculino: 1, Feminino: 2, 'Calçados': 3, 'Acessórios': 4, Esportes: 5 };

      await apiRequest('/produtos', {
        method: 'POST',
        body: JSON.stringify({
          id_categoria: categoryMap[category] || 5,
          nome: document.getElementById('sellerProductName')?.value,
          descricao: document.getElementById('sellerProductDescription')?.value,
          preco: Number(document.getElementById('sellerProductPrice')?.value || 0),
          estoque: Number(document.getElementById('sellerProductStock')?.value || 0),
          imagem: image,
          genero: document.getElementById('sellerProductGender')?.value || 'Unissex',
          numeracao: document.getElementById('sellerProductSizes')?.value || 'Único',
          ativo: true,
        }),
      });

      localStorage.setItem('sportx-products-updated', String(Date.now()));
      showToast('Produto cadastrado com sucesso e publicado na vitrine.');
      document.getElementById('sellerProductForm')?.reset();
    } catch (error) {
      showToast(error.message || 'Erro ao cadastrar produto.');
    }
  });

  registerCategoryCards();
  registerAccountPanelEvents();
}

function prefillCheckoutUserData() {
  if (!currentUser) return;
  const nameField = document.getElementById('checkoutName');
  const emailField = document.getElementById('checkoutEmail');
  if (nameField) nameField.value = currentUser.name || '';
  if (emailField) emailField.value = currentUser.email || '';
}

async function loadSavedPaymentPreference() {
  if (!currentUser?.id_usuario) return;

  try {
    const savedPayments = await apiRequest(`/pagamentos/usuario/${currentUser.id_usuario}`);
    if (!Array.isArray(savedPayments) || !savedPayments.length) return;

    const useSaved = window.confirm('Encontramos um pagamento salvo. Deseja reutilizar?');
    if (!useSaved) return;

    const lastPayment = savedPayments[0];
    const paymentMethod = document.getElementById('paymentMethod');
    if (paymentMethod) paymentMethod.value = lastPayment.tipo || paymentMethod.value;
    updatePaymentInstallments();
    showToast('Dados de pagamento salvos carregados.');
  } catch (error) {
    console.warn('Sem pagamentos salvos.', error);
  }
}

function renderBestSellers() {
  const grid = document.getElementById('bestSellersGrid');
  if (!grid) return;
  const source = (allProducts.length ? allProducts : productsWithDetails).map((product) => ({ ...product, sales: Number(productSales[product.id] || 0) }));
  const top = source.sort((a, b) => b.sales - a.sales).slice(0, 6);
  grid.innerHTML = top.map(renderProductCard).join('');
}

function renderMonthlyPromotions() {
  const grid = document.getElementById('monthlyPromotionsGrid');
  if (!grid) return;
  const date = new Date();
  const seed = date.getFullYear() * 100 + (date.getMonth() + 1);
  const source = [...(allProducts.length ? allProducts : productsWithDetails)];
  const promos = source.filter((_, index) => ((index + seed) % 3) === 0).slice(0, 6).map((p) => ({ ...p, price: Number((p.price * 0.88).toFixed(2)), isNew: true }));
  const label = document.getElementById('monthlyPromotionLabel');
  if (label) label.textContent = `Promoções de ${date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })} com até 12% OFF.`;
  grid.innerHTML = promos.map(renderProductCard).join('');
}

function applyCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('categoria');
  if (!category) return;
  activeFilter = category;
  activeFolder = CATEGORY_FOLDERS[category] || '';
  const title = document.getElementById('categoryPageTitle');
  if (title) title.textContent = `${category}`;
}

async function init() {
  loadState();
  applyCategoryFromUrl();
  await loadProductsFromApi();
  renderProducts();
  renderLaunches();
  renderBestSellers();
  renderMonthlyPromotions();
  renderKits();
  renderCart();
  renderWishlist();
  renderCheckout();
  updateCounters();
  updateActiveFolderLabel();
  updatePaymentInstallments();
  updateAuthUI();
  updateAccountButton();
  registerEvents();

  window.addEventListener('storage', async (event) => {
    if (event.key === 'sportx-products-updated') {
      await loadProductsFromApi();
      renderProducts();
      renderBestSellers();
      renderMonthlyPromotions();
    }
  });
}


document.addEventListener('DOMContentLoaded', init);