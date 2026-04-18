# API SportX (NestJS)

Backend do e-commerce esportivo com foco em autenticação, catálogo, pedidos, frete e fluxo profissional de gift cards.

## Requisitos

- Node 18+
- PostgreSQL

## Configuração

1. Copie o arquivo de variáveis:

```bash
cp .env.example .env
```

2. Preencha as variáveis de banco, frete, Stripe e Resend.

### Frete

- `FRENET_TOKEN`: token da sua conta Frenet.
- `FRENET_QUOTE_URL`: endpoint de cotação (padrão `https://api.frenet.com.br/shipping/quote`).
- `FRENET_TIMEOUT_MS`: timeout da consulta externa.
- `SHIPPING_ORIGIN_CEP`: CEP de origem usado no cálculo.

### Gift card e pagamentos

- `STRIPE_SECRET_KEY`: chave secreta da Stripe para criar sessão de checkout.
- `STRIPE_WEBHOOK_SECRET`: segredo do webhook para validar assinatura.
- `FRONTEND_URL`: base de URL para success/cancel da compra do gift card.

### E-mail

- `RESEND_API_KEY`: chave da Resend para envio de e-mail real.
- `RESEND_FROM_EMAIL`: remetente validado na Resend.

## Instalação

```bash
npm install
```

## Execução

```bash
npm run start:dev
```

## Endpoints principais

### Frete

- `GET /frete/cep/:cep` → consulta real de endereço via ViaCEP.
- `POST /frete/calcular` → cotação de frete (Frenet com fallback simulado), com regra de frete grátis.

### Gift cards

- `POST /gift-cards/checkout` → cria gift card pendente + sessão Stripe.
- `POST /payments/stripe/webhook` → confirma pagamento e dispara envio do gift card por e-mail.

## Testes e validação

```bash
npm run build
npm run test
```
