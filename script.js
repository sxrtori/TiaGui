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

let cart = [];
let wishlist = [];
let cashbackBalance = 0;
let activeFilter = '';
let authMode = 'register';
let currentUser = JSON.parse(localStorage.getItem('sportx-current-user') || 'null');
let users = JSON.parse(localStorage.getItem('sportx-users') || '[]');

const currency = (value) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

function getProduct(id) {
  return products.find((product) => product.id === Number(id));
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
  localStorage.setItem('sportx-users', JSON.stringify(users));
  localStorage.setItem('sportx-current-user', JSON.stringify(currentUser));
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
  } else {
    accountLabel.textContent = 'Entrar / Cadastrar';
    if (accountSubLabel) accountSubLabel.textContent = 'Acesse sua conta';
    accountIcon.textContent = '👤';
    if (accountDropdownAvatar) accountDropdownAvatar.textContent = '👤';
    if (accountDropdownName) accountDropdownName.textContent = 'Olá';
    if (accountDropdownType) accountDropdownType.textContent = 'Entre para ver sua conta';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}

function logoutUser() {
  currentUser = null;
  saveUsers();
  updateAccountButton();
  closeAccountDropdown();
  showToast('Você saiu da sua conta.');
}

function addToCart(id, qty = 1, options = {}) {
  const { fromWishlist = false, showDecision = false } = options;
  const item = cart.find((cartItem) => cartItem.id === Number(id));

  if (item) {
    item.qty += qty;
  } else {
    cart.push({ id: Number(id), qty });
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
        <img src="${product.image}" alt="${product.title}" />
        <button class="wish-btn ${wishlist.includes(product.id) ? 'active' : ''}" onclick="toggleWish(${product.id})">❤</button>
      </div>
      <div class="product-body">
        <div class="product-category">${product.category} • ${product.sport}</div>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-meta">
          <div class="price-wrap">
            <strong>${currency(product.price)}</strong>
            <span>Em até 3x sem juros</span>
          </div>
          <div class="rating">⭐ ${product.rating}</div>
        </div>
        <div class="product-actions">
          <button class="btn-card btn-dark" onclick="addToCart(${product.id})">Adicionar</button>
          <button class="btn-card btn-light" onclick="toggleWish(${product.id})">Favoritar</button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  if (!grid || !searchInput) return;

  const term = searchInput.value.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const fields = [product.title, product.category, product.group, product.sport].join(' ').toLowerCase();
    const categoryMatch =
      !activeFilter ||
      product.category === activeFilter ||
      product.group === activeFilter ||
      product.sport === activeFilter ||
      activeFilter === 'Esportes';

    const textMatch = !term || fields.includes(term);
    return categoryMatch && textMatch;
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

  const launches = products.filter((product) => product.isNew);
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
            <small style="color:#666;display:block;">${currency(product.price)}</small>
            <div class="qty">
              <button onclick="changeQty(${product.id}, -1)">−</button>
              <span>${item.qty}</span>
              <button onclick="changeQty(${product.id}, 1)">+</button>
            </div>
          </div>
          <button class="icon-btn" onclick="removeFromCart(${product.id})">✕</button>
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
          <span>${product.title} x${item.qty}</span>
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

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
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

function updateAuthUI() {
  const isRegister = authMode === 'register';

  document.getElementById('authTitle').textContent = isRegister ? 'Criar conta' : 'Entrar';
  document.getElementById('authSubmitBtn').textContent = isRegister ? 'Criar conta' : 'Entrar';
  document.getElementById('toggleAuthModeBtn').textContent = isRegister ? 'Já tenho login' : 'Criar conta';

  document.getElementById('nameField').style.display = isRegister ? 'block' : 'none';
  document.getElementById('accountTypeField').style.display = isRegister ? 'block' : 'none';
}

function handleAuthSubmit(event) {
  event.preventDefault();

  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const password = document.getElementById('authPassword').value.trim();

  if (!email || !password) {
    showToast('Preencha email e senha.');
    return;
  }

  if (authMode === 'register') {
    const name = document.getElementById('authName').value.trim();
    const type = document.getElementById('authType').value;

    if (!name) {
      showToast('Preencha seu nome.');
      return;
    }

    const emailAlreadyExists = users.some((user) => user.email === email);

    if (emailAlreadyExists) {
      showToast('Esse e-mail já está cadastrado.');
      return;
    }

    const newUser = {
      name,
      email,
      password,
      type
    };

    users.push(newUser);
    currentUser = newUser;
    saveUsers();
    updateAccountButton();

    showToast(`Conta de ${type} criada com sucesso.`);
  } else {
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!foundUser) {
      showToast('Email ou senha incorretos.');
      return;
    }

    currentUser = foundUser;
    saveUsers();
    updateAccountButton();

    showToast('Login realizado com sucesso.');
  }

  document.getElementById('authForm').reset();
  toggleAuthModal(false);
  openAccountDropdown();
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
      renderProducts();
      showToast(`Filtro aplicado: ${activeFilter}`);
    });
  });
}

function registerAccountPanelEvents() {
  const openAuthBtn = document.getElementById('openAuthBtn');
  const accountDropdown = document.getElementById('accountDropdown');
  const logoutBtn = document.getElementById('logoutBtn');

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

  document.getElementById('checkoutOpenBtn')?.addEventListener('click', () => {
    if (!cart.length) {
      showToast('Adicione itens ao carrinho antes de finalizar.');
      return;
    }

    renderCheckout();
    toggleCheckout(true);
  });

  document.getElementById('chatFab')?.addEventListener('click', () => toggleChat());
  document.getElementById('addAllWishlistBtn')?.addEventListener('click', addAllWishlistToCart);

  document.getElementById('clearFilterBtn')?.addEventListener('click', () => {
    activeFilter = '';
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    renderProducts();
    showToast('Filtro removido.');
  });

  document.querySelectorAll('[data-filter]').forEach((button) => {
    if (button.classList.contains('category-card')) return;

    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      renderProducts();
      showToast(`Filtro aplicado: ${activeFilter}`);
    });
  });

  document.getElementById('searchInput')?.addEventListener('input', renderProducts);

  document.getElementById('finishOrderBtn')?.addEventListener('click', () => {
    if (!cart.length) {
      showToast('Seu carrinho está vazio.');
      return;
    }

    const { cashback } = cartCalculations();
    cashbackBalance += cashback;
    cart = [];

    saveState();
    renderCart();
    renderCheckout();
    updateCounters();
    toggleCheckout(false);
    toggleCart(false);
    showToast('Pedido confirmado com sucesso! Cashback creditado.');
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

  registerCategoryCards();
  registerAccountPanelEvents();
}

function init() {
  loadState();
  renderProducts();
  renderLaunches();
  renderKits();
  renderCart();
  renderWishlist();
  renderCheckout();
  updateCounters();
  updateAuthUI();
  updateAccountButton();
  registerEvents();
}

document.addEventListener('DOMContentLoaded', init);