# API SportX (NestJS)

Backend do e-commerce esportivo com foco em autenticação, catálogo, pedidos e **frete real integrado**.

## Requisitos

- Node 18+
- PostgreSQL

## Configuração

1. Copie o arquivo de variáveis:

```bash
cp .env.example .env
```

2. Preencha as variáveis de banco e frete.

### Variáveis de frete (Frenet)

- `FRENET_TOKEN`: token da sua conta Frenet.
- `FRENET_QUOTE_URL`: endpoint de cotação (padrão `https://api.frenet.com.br/shipping/quote`).
- `FRENET_TIMEOUT_MS`: timeout da consulta externa.
- `SHIPPING_ORIGIN_CEP`: CEP de origem usado no cálculo.

## Instalação

```bash
npm install
```

## Execução

```bash
npm run start:dev
```

## Endpoints de frete

- `GET /frete/cep/:cep` → consulta real de endereço via ViaCEP (com validação e mensagens amigáveis).
- `POST /frete/calcular` → cotação real de frete via Frenet, com regras de frete grátis da loja.

Payload esperado em `POST /frete/calcular`:

```json
{
  "cep": "01310-100",
  "subtotal": 259.9,
  "itens": [
    {
      "sku": "123",
      "pesoKg": 0.7,
      "alturaCm": 12,
      "larguraCm": 22,
      "comprimentoCm": 32,
      "quantidade": 1,
      "valorUnitario": 259.9
    }
  ]
}
```

## Testes e validação

```bash
npm run build
npm run test
```
