DROP TABLE IF EXISTS item_pedido CASCADE;
DROP TABLE IF EXISTS pedido CASCADE;
DROP TABLE IF EXISTS entrega_opcao CASCADE;
DROP TABLE IF EXISTS pagamento CASCADE;
DROP TABLE IF EXISTS item_carrinho CASCADE;
DROP TABLE IF EXISTS carrinho CASCADE;
DROP TABLE IF EXISTS produto_variacao CASCADE;
DROP TABLE IF EXISTS produto_imagem CASCADE;
DROP TABLE IF EXISTS produto_tamanho CASCADE;
DROP TABLE IF EXISTS produto_cor CASCADE;
DROP TABLE IF EXISTS favorito CASCADE;
DROP TABLE IF EXISTS avaliacao CASCADE;
DROP TABLE IF EXISTS produto CASCADE;
DROP TABLE IF EXISTS categoria CASCADE;
DROP TABLE IF EXISTS endereco CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;

-- =========================================
-- TABELAS BASE
-- =========================================
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) DEFAULT 'cliente',
    cpf VARCHAR(14) UNIQUE,
    data_nascimento DATE,
    vendedor_bloqueado BOOLEAN DEFAULT FALSE,
    cpf_bloqueado_venda BOOLEAN DEFAULT FALSE,
    media_avaliacao_vendedor DECIMAL(3,2) DEFAULT 0,
    total_avaliacoes_vendedor INT DEFAULT 0,
    motivo_bloqueio TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tipo_usuario_check CHECK (tipo_usuario IN ('cliente', 'admin', 'vendedor'))
);

CREATE TABLE IF NOT EXISTS endereco (
    id_endereco SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    cep VARCHAR(10) NOT NULL,
    rua VARCHAR(150) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    complemento VARCHAR(100),
    apelido VARCHAR(50),
    principal BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categoria (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS produto (
    id_produto SERIAL PRIMARY KEY,
    id_categoria INT NOT NULL REFERENCES categoria(id_categoria),
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
    genero VARCHAR(20),
    ativo BOOLEAN DEFAULT TRUE,
    destaque BOOLEAN DEFAULT FALSE,
    marca VARCHAR(100),
    slug VARCHAR(180) UNIQUE,
    media_avaliacao DECIMAL(3,2) DEFAULT 0,
    total_avaliacoes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT genero_check CHECK (
        genero IN ('Masculino', 'Feminino', 'Unissex', 'Esportes', 'Acessorios', 'Calcados')
        OR genero IS NULL
    )
);

-- =========================================
-- CORES, TAMANHOS, IMAGENS E VARIAÇÕES
-- =========================================
CREATE TABLE IF NOT EXISTS produto_cor (
    id_produto_cor SERIAL PRIMARY KEY,
    id_produto INT NOT NULL REFERENCES produto(id_produto) ON DELETE CASCADE,
    nome_cor VARCHAR(50) NOT NULL,
    codigo_hex VARCHAR(7),
    ordem INT DEFAULT 0,
    ativa BOOLEAN DEFAULT TRUE,
    CONSTRAINT unique_produto_cor UNIQUE (id_produto, nome_cor)
);

CREATE TABLE IF NOT EXISTS produto_tamanho (
    id_produto_tamanho SERIAL PRIMARY KEY,
    id_produto INT NOT NULL REFERENCES produto(id_produto) ON DELETE CASCADE,
    tamanho VARCHAR(20) NOT NULL,
    ordem INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    CONSTRAINT unique_produto_tamanho UNIQUE (id_produto, tamanho)
);

CREATE TABLE IF NOT EXISTS produto_imagem (
    id_produto_imagem SERIAL PRIMARY KEY,
    id_produto INT NOT NULL REFERENCES produto(id_produto) ON DELETE CASCADE,
    id_produto_cor INT REFERENCES produto_cor(id_produto_cor) ON DELETE CASCADE,
    url_imagem TEXT NOT NULL,
    alt_text VARCHAR(255),
    principal BOOLEAN DEFAULT FALSE,
    ordem INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS produto_variacao (
    id_produto_variacao SERIAL PRIMARY KEY,
    id_produto INT NOT NULL REFERENCES produto(id_produto) ON DELETE CASCADE,
    id_produto_cor INT REFERENCES produto_cor(id_produto_cor) ON DELETE CASCADE,
    id_produto_tamanho INT REFERENCES produto_tamanho(id_produto_tamanho) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE,
    preco DECIMAL(10,2) CHECK (preco >= 0),
    estoque INT NOT NULL DEFAULT 0 CHECK (estoque >= 0),
    numeracao VARCHAR(50),
    peso_kg DECIMAL(10,3) DEFAULT 0.300 CHECK (peso_kg >= 0),
    altura_cm DECIMAL(10,2) DEFAULT 5 CHECK (altura_cm >= 0),
    largura_cm DECIMAL(10,2) DEFAULT 20 CHECK (largura_cm >= 0),
    comprimento_cm DECIMAL(10,2) DEFAULT 30 CHECK (comprimento_cm >= 0),
    ativa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_produto_variacao UNIQUE (id_produto, id_produto_cor, id_produto_tamanho)
);

-- =========================================
-- CARRINHO
-- =========================================
CREATE TABLE IF NOT EXISTS carrinho (
    id_carrinho SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS item_carrinho (
    id_item_carrinho SERIAL PRIMARY KEY,
    id_carrinho INT NOT NULL REFERENCES carrinho(id_carrinho) ON DELETE CASCADE,
    id_produto INT NOT NULL REFERENCES produto(id_produto) ON DELETE CASCADE,
    id_produto_variacao INT REFERENCES produto_variacao(id_produto_variacao) ON DELETE SET NULL,
    quantidade INT NOT NULL DEFAULT 1 CHECK (quantidade > 0),
    preco_unitario DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (preco_unitario >= 0),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_item_carrinho UNIQUE (id_carrinho, id_produto, id_produto_variacao)
);

-- =========================================
-- PAGAMENTO
-- =========================================
CREATE TABLE IF NOT EXISTS pagamento (
    id_pagamento SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    tipo VARCHAR(30) NOT NULL,
    nome_titular VARCHAR(100),
    ultimos_digitos VARCHAR(4),
    bandeira VARCHAR(20),
    token_gateway TEXT,
    status VARCHAR(20) DEFAULT 'pendente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pagamento_tipo_check CHECK (tipo IN ('cartao', 'pix', 'boleto')),
    CONSTRAINT pagamento_status_check CHECK (status IN ('pendente', 'aprovado', 'recusado', 'estornado'))
);

-- =========================================
-- FRETE / ENTREGA
-- =========================================
CREATE TABLE IF NOT EXISTS entrega_opcao (
    id_entrega_opcao SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(150),
    prazo_min_dias INT NOT NULL CHECK (prazo_min_dias >= 0),
    prazo_max_dias INT NOT NULL CHECK (prazo_max_dias >= prazo_min_dias),
    valor_base DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (valor_base >= 0),
    valor_por_kg DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (valor_por_kg >= 0),
    ativa BOOLEAN DEFAULT TRUE,
    ordem INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pedido (
    id_pedido SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario),
    id_endereco INT NOT NULL REFERENCES endereco(id_endereco),
    id_pagamento INT REFERENCES pagamento(id_pagamento),
    id_entrega_opcao INT REFERENCES entrega_opcao(id_entrega_opcao),
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'pendente',
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    valor_frete DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (valor_frete >= 0),
    desconto DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (desconto >= 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    frete_gratis BOOLEAN DEFAULT FALSE,
    origem_cep VARCHAR(10) DEFAULT '01000-000',
    prazo_entrega_min_dias INT,
    prazo_entrega_max_dias INT,
    forma_pagamento VARCHAR(30) NOT NULL,
    codigo_rastreio VARCHAR(100),
    observacoes_entrega TEXT,
    CONSTRAINT status_check CHECK (status IN ('pendente', 'pago', 'em_preparo', 'enviado', 'entregue', 'cancelado')),
    CONSTRAINT forma_pagamento_check CHECK (forma_pagamento IN ('cartao', 'pix', 'boleto'))
);

CREATE TABLE IF NOT EXISTS item_pedido (
    id_item_pedido SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    id_produto INT NOT NULL REFERENCES produto(id_produto),
    id_produto_variacao INT REFERENCES produto_variacao(id_produto_variacao) ON DELETE SET NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10,2) NOT NULL CHECK (preco_unitario >= 0),
    nome_produto VARCHAR(150) NOT NULL,
    nome_cor VARCHAR(50),
    tamanho VARCHAR(20)
);

-- =========================================
-- FAVORITOS
-- =========================================
CREATE TABLE IF NOT EXISTS favorito (
    id_favorito SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_produto INT NOT NULL REFERENCES produto(id_produto) ON DELETE CASCADE,
    CONSTRAINT unique_favorito UNIQUE (id_usuario, id_produto)
);

-- =========================================
-- AVALIAÇÕES
-- =========================================
CREATE TABLE IF NOT EXISTS avaliacao (
    id_avaliacao SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_produto INT NOT NULL REFERENCES produto(id_produto) ON DELETE CASCADE,
    nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    verificada BOOLEAN DEFAULT FALSE,
    ativa BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_avaliacao_usuario_produto UNIQUE (id_usuario, id_produto),
    CONSTRAINT comentario_minimo CHECK (char_length(comentario) >= 10 OR comentario IS NULL)
);

CREATE TABLE IF NOT EXISTS avaliacao_vendedor (
    id_avaliacao_vendedor SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_vendedor INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_avaliacao_vendedor UNIQUE (id_usuario, id_vendedor)
);

-- =========================================
-- ÍNDICES
-- =========================================
CREATE INDEX IF NOT EXISTS idx_endereco_usuario ON endereco(id_usuario);
CREATE INDEX IF NOT EXISTS idx_produto_categoria ON produto(id_categoria);
CREATE INDEX IF NOT EXISTS idx_produto_nome ON produto(nome);
CREATE INDEX IF NOT EXISTS idx_produto_marca ON produto(marca);
CREATE INDEX IF NOT EXISTS idx_produto_slug ON produto(slug);
CREATE INDEX IF NOT EXISTS idx_produto_ativo ON produto(ativo);

CREATE INDEX IF NOT EXISTS idx_produto_cor_produto ON produto_cor(id_produto);
CREATE INDEX IF NOT EXISTS idx_produto_tamanho_produto ON produto_tamanho(id_produto);
CREATE INDEX IF NOT EXISTS idx_produto_imagem_produto ON produto_imagem(id_produto);
CREATE INDEX IF NOT EXISTS idx_produto_variacao_produto ON produto_variacao(id_produto);
CREATE INDEX IF NOT EXISTS idx_produto_variacao_cor ON produto_variacao(id_produto_cor);
CREATE INDEX IF NOT EXISTS idx_produto_variacao_tamanho ON produto_variacao(id_produto_tamanho);
CREATE INDEX IF NOT EXISTS idx_produto_variacao_estoque ON produto_variacao(estoque);

CREATE INDEX IF NOT EXISTS idx_item_carrinho_carrinho ON item_carrinho(id_carrinho);
CREATE INDEX IF NOT EXISTS idx_item_carrinho_variacao ON item_carrinho(id_produto_variacao);

CREATE INDEX IF NOT EXISTS idx_pedido_usuario ON pedido(id_usuario);
CREATE INDEX IF NOT EXISTS idx_pedido_endereco ON pedido(id_endereco);
CREATE INDEX IF NOT EXISTS idx_pedido_pagamento ON pedido(id_pagamento);
CREATE INDEX IF NOT EXISTS idx_pedido_entrega_opcao ON pedido(id_entrega_opcao);
CREATE INDEX IF NOT EXISTS idx_pedido_status ON pedido(status);
CREATE INDEX IF NOT EXISTS idx_pedido_data ON pedido(data_pedido);

CREATE INDEX IF NOT EXISTS idx_item_pedido_pedido ON item_pedido(id_pedido);
CREATE INDEX IF NOT EXISTS idx_item_pedido_produto ON item_pedido(id_produto);
CREATE INDEX IF NOT EXISTS idx_item_pedido_variacao ON item_pedido(id_produto_variacao);

CREATE INDEX IF NOT EXISTS idx_favorito_usuario ON favorito(id_usuario);
CREATE INDEX IF NOT EXISTS idx_favorito_produto ON favorito(id_produto);

CREATE INDEX IF NOT EXISTS idx_avaliacao_produto ON avaliacao(id_produto);
CREATE INDEX IF NOT EXISTS idx_avaliacao_usuario ON avaliacao(id_usuario);
CREATE INDEX IF NOT EXISTS idx_avaliacao_vendedor_vendedor ON avaliacao_vendedor(id_vendedor);

-- =========================================
-- FUNÇÕES / TRIGGERS
-- =========================================
CREATE OR REPLACE FUNCTION atualizar_media_avaliacao_produto()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE produto
    SET
        media_avaliacao = COALESCE((
            SELECT ROUND(AVG(nota)::numeric, 2)
            FROM avaliacao
            WHERE id_produto = COALESCE(NEW.id_produto, OLD.id_produto)
              AND ativa = TRUE
        ), 0),
        total_avaliacoes = COALESCE((
            SELECT COUNT(*)
            FROM avaliacao
            WHERE id_produto = COALESCE(NEW.id_produto, OLD.id_produto)
              AND ativa = TRUE
        ), 0)
    WHERE id_produto = COALESCE(NEW.id_produto, OLD.id_produto);

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION atualizar_data_avaliacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_produto_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_variacao_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_carrinho_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_avaliacao_insert
AFTER INSERT ON avaliacao
FOR EACH ROW
EXECUTE FUNCTION atualizar_media_avaliacao_produto();

CREATE TRIGGER trg_avaliacao_update
AFTER UPDATE ON avaliacao
FOR EACH ROW
EXECUTE FUNCTION atualizar_media_avaliacao_produto();

CREATE TRIGGER trg_avaliacao_delete
AFTER DELETE ON avaliacao
FOR EACH ROW
EXECUTE FUNCTION atualizar_media_avaliacao_produto();

CREATE TRIGGER trg_update_data_avaliacao
BEFORE UPDATE ON avaliacao
FOR EACH ROW
EXECUTE FUNCTION atualizar_data_avaliacao();

CREATE TRIGGER trg_update_produto
BEFORE UPDATE ON produto
FOR EACH ROW
EXECUTE FUNCTION update_produto_timestamp();

CREATE TRIGGER trg_update_variacao
BEFORE UPDATE ON produto_variacao
FOR EACH ROW
EXECUTE FUNCTION update_variacao_timestamp();

CREATE TRIGGER trg_update_carrinho
BEFORE UPDATE ON carrinho
FOR EACH ROW
EXECUTE FUNCTION update_carrinho_timestamp();

-- =========================================
-- CATEGORIAS INICIAIS
-- =========================================
INSERT INTO categoria (nome) VALUES
('Masculino'),
('Feminino'),
('Calcados'),
('Acessorios'),
('Esportes')
ON CONFLICT (nome) DO NOTHING;

-- =========================================
-- MODALIDADES DE ENTREGA INICIAIS
-- =========================================
INSERT INTO entrega_opcao (nome, descricao, prazo_min_dias, prazo_max_dias, valor_base, valor_por_kg, ativa, ordem) VALUES
('Sedex', 'Entrega rápida pelos Correios', 1, 3, 29.90, 4.50, TRUE, 1),
('PAC', 'Entrega econômica pelos Correios', 4, 8, 16.90, 2.50, TRUE, 2),
('Expressa', 'Entrega expressa privada', 1, 2, 34.90, 5.00, TRUE, 3),
('Econômica', 'Entrega com melhor custo-benefício', 5, 10, 12.90, 2.00, TRUE, 4),
('Retirada na loja', 'Retire em São Paulo sem custo', 0, 1, 0.00, 0.00, TRUE, 5)
ON CONFLICT (nome) DO NOTHING;
