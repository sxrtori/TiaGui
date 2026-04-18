export function buildGiftCardEmailTemplate(params: {
  nomeDestinatario: string;
  valor: number;
  codigo: string;
  mensagem?: string;
}) {
  const { nomeDestinatario, valor, codigo, mensagem } = params;
  const valorFormatado = Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return `
    <div style="font-family: Arial, sans-serif; background:#0f1118; padding:24px; color:#fff;">
      <div style="max-width:560px;margin:0 auto;background:#171a23;border-radius:12px;padding:24px;border:1px solid #2a3142;">
        <h1 style="margin:0 0 12px;font-size:24px;">🎁 Seu gift card SportX chegou!</h1>
        <p style="margin:0 0 8px;">Olá, <strong>${nomeDestinatario}</strong>.</p>
        <p style="margin:0 0 8px;">Você recebeu um gift card no valor de <strong>${valorFormatado}</strong>.</p>
        <p style="margin:12px 0;">Código para uso: <strong style="font-size:18px;color:#6de09f;">${codigo}</strong></p>
        ${mensagem ? `<p style="margin:12px 0 0;padding:12px;border-left:3px solid #6de09f;background:#111722;"><em>"${mensagem}"</em></p>` : ''}
        <p style="margin-top:16px;color:#adb6cc;font-size:13px;">Use este código no checkout da SportX.</p>
      </div>
    </div>
  `;
}
