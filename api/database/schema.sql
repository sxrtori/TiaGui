CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) DEFAULT 'cliente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tipo_usuario_check CHECK (tipo_usuario IN ('cliente', 'admin', 'vendedor'))
);

CREATE TABLE endereco (
    id_endereco SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    cep VARCHAR(10) NOT NULL,
    rua VARCHAR(150) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    complemento VARCHAR(100)
);

CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE produto (
    id_produto SERIAL PRIMARY KEY,
    id_categoria INT NOT NULL REFERENCES categoria(id_categoria),
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
    preco_promocional DECIMAL(10,2),
    estoque INT NOT NULL DEFAULT 0 CHECK (estoque >= 0),
    imagem TEXT,
    genero VARCHAR(20),
    numeracao VARCHAR(50),
    marca VARCHAR(80),
    desconto DECIMAL(5,2) DEFAULT 0,
    cashback DECIMAL(5,2) DEFAULT 0,
    modalidade VARCHAR(80),
    lancamento BOOLEAN DEFAULT FALSE,
    promocao_ativa BOOLEAN DEFAULT FALSE,
    galeria_imagens TEXT,
    id_vendedor INT REFERENCES usuario(id_usuario),
    ativo BOOLEAN DEFAULT TRUE,
    media_avaliacao DECIMAL(3,2) DEFAULT 0,
    total_avaliacoes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT genero_check CHECK (genero IN ('Masculino', 'Feminino', 'Unissex', 'Esportes', 'Acessorios', 'Calcados') OR genero IS NULL)
);

CREATE TABLE carrinho (
    id_carrinho SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE item_carrinho (
    id_item_carrinho SERIAL PRIMARY KEY,
    id_carrinho INT NOT NULL REFERENCES carrinho(id_carrinho) ON DELETE CASCADE,
    id_produto INT NOT NULL REFERENCES produto(id_produto),
    quantidade INT NOT NULL DEFAULT 1 CHECK (quantidade > 0),
    CONSTRAINT unique_produto_carrinho UNIQUE (id_carrinho, id_produto)
);

CREATE TABLE pagamento (
    id_pagamento SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    tipo VARCHAR(30) NOT NULL,
    nome_titular VARCHAR(100),
    ultimos_digitos VARCHAR(4),
    bandeira VARCHAR(20),
    token_gateway TEXT,
    status VARCHAR(20) DEFAULT 'pendente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pagamento_status_check CHECK (status IN ('pendente', 'aprovado', 'recusado', 'estornado'))
);

CREATE TABLE pedido (
    id_pedido SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario),
    id_endereco INT NOT NULL REFERENCES endereco(id_endereco),
    id_pagamento INT REFERENCES pagamento(id_pagamento),
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'pendente',
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    forma_pagamento VARCHAR(30) NOT NULL,
    CONSTRAINT status_check CHECK (status IN ('pendente', 'pago', 'enviado', 'cancelado')),
    CONSTRAINT forma_pagamento_check CHECK (forma_pagamento IN ('cartao', 'pix', 'boleto'))
);

CREATE TABLE item_pedido (
    id_item_pedido SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    id_produto INT NOT NULL REFERENCES produto(id_produto),
    quantidade INT NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10,2) NOT NULL CHECK (preco_unitario >= 0)
);

CREATE TABLE favorito (
    id_favorito SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_produto INT NOT NULL REFERENCES produto(id_produto) ON DELETE CASCADE,
    CONSTRAINT unique_favorito UNIQUE (id_usuario, id_produto)
);

CREATE TABLE avaliacao (
    id_avaliacao SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_produto INT NOT NULL REFERENCES produto(id_produto) ON DELETE CASCADE,
    id_pedido INT REFERENCES pedido(id_pedido),
    nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    verificada BOOLEAN DEFAULT FALSE,
    denunciada BOOLEAN DEFAULT FALSE,
    ativa BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_avaliacao_usuario_produto UNIQUE (id_usuario, id_produto),
    CONSTRAINT comentario_minimo CHECK (char_length(comentario) >= 10 OR comentario IS NULL)
);

CREATE INDEX idx_avaliacao_produto ON avaliacao(id_produto);
CREATE INDEX idx_avaliacao_usuario ON avaliacao(id_usuario);

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

INSERT INTO categoria (nome) VALUES
('Masculino'),
('Feminino'),
('Calcados'),
('Acessorios'),
('Esportes')
ON CONFLICT (nome) DO NOTHING;