-- Ajustes de compatibilidade para vendedor (CPF/data nascimento) e reputação por CPF.
ALTER TABLE usuario
  ADD COLUMN IF NOT EXISTS cpf VARCHAR(14) UNIQUE,
  ADD COLUMN IF NOT EXISTS data_nascimento DATE,
  ADD COLUMN IF NOT EXISTS vendedor_bloqueado BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cpf_bloqueado_venda BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS media_avaliacao_vendedor DECIMAL(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_avaliacoes_vendedor INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS motivo_bloqueio TEXT;

CREATE TABLE IF NOT EXISTS avaliacao_vendedor (
  id_avaliacao_vendedor SERIAL PRIMARY KEY,
  id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  id_vendedor INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_avaliacao_vendedor UNIQUE (id_usuario, id_vendedor)
);

CREATE INDEX IF NOT EXISTS idx_avaliacao_vendedor_vendedor
  ON avaliacao_vendedor(id_vendedor);

-- Garante modalidades mínimas de frete no banco.
INSERT INTO entrega_opcao (nome, descricao, prazo_min_dias, prazo_max_dias, valor_base, valor_por_kg, ativa, ordem) VALUES
('Sedex', 'Entrega rápida pelos Correios', 1, 3, 29.90, 4.50, TRUE, 1),
('PAC', 'Entrega econômica pelos Correios', 4, 8, 16.90, 2.50, TRUE, 2),
('Expressa', 'Entrega expressa privada', 1, 2, 34.90, 5.00, TRUE, 3),
('Econômica', 'Entrega com melhor custo-benefício', 5, 10, 12.90, 2.00, TRUE, 4),
('Retirada na loja', 'Retire em São Paulo sem custo', 0, 1, 0.00, 0.00, TRUE, 5)
ON CONFLICT (nome) DO NOTHING;
