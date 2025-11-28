import nodemailer from "nodemailer";

// Configurar transporter de email
// Em produção, use variáveis de ambiente para credenciais
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "seu-email@gmail.com",
    pass: process.env.SMTP_PASSWORD || "sua-senha-app",
  },
});

export interface EmailOrcamentoData {
  destinatario: string;
  nomeCliente: string;
  numeroOrcamento: string;
  valor: number;
  linkOrcamento: string;
  nomeEmpresa: string;
}

export interface EmailVendaData {
  destinatario: string;
  nomeCliente: string;
  numeroVenda: string;
  valor: number;
  comissao: number;
  nomeRepresentante: string;
}

/**
 * Enviar orçamento por email
 */
export async function enviarOrcamentoPorEmail(data: EmailOrcamentoData): Promise<boolean> {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .footer { background: #f0f0f0; padding: 10px; border-radius: 0 0 5px 5px; text-align: center; font-size: 12px; }
            .button { display: inline-block; background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .info { margin: 15px 0; }
            .label { font-weight: bold; color: #007bff; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Novo Orçamento - ${data.nomeEmpresa}</h1>
            </div>
            <div class="content">
              <p>Olá <strong>${data.nomeCliente}</strong>,</p>
              
              <p>Segue em anexo o orçamento solicitado:</p>
              
              <div class="info">
                <span class="label">Número do Orçamento:</span> ${data.numeroOrcamento}
              </div>
              
              <div class="info">
                <span class="label">Valor Total:</span> R$ ${data.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              
              <p>Para visualizar o orçamento completo, clique no botão abaixo:</p>
              
              <a href="${data.linkOrcamento}" class="button">Visualizar Orçamento</a>
              
              <p>Qualquer dúvida, entre em contato conosco.</p>
              
              <p>Atenciosamente,<br><strong>${data.nomeEmpresa}</strong></p>
            </div>
            <div class="footer">
              <p>Este é um email automático. Não responda este email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_USER || "seu-email@gmail.com",
      to: data.destinatario,
      subject: `Orçamento ${data.numeroOrcamento} - ${data.nomeEmpresa}`,
      html: htmlContent,
    });

    console.log(`[Email] Orçamento ${data.numeroOrcamento} enviado para ${data.destinatario}`);
    return true;
  } catch (error) {
    console.error("[Email] Erro ao enviar orçamento:", error);
    return false;
  }
}

/**
 * Enviar confirmação de venda por email
 */
export async function enviarConfirmacaoVendaPorEmail(data: EmailVendaData): Promise<boolean> {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #28a745; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .footer { background: #f0f0f0; padding: 10px; border-radius: 0 0 5px 5px; text-align: center; font-size: 12px; }
            .info { margin: 15px 0; }
            .label { font-weight: bold; color: #28a745; }
            .success { color: #28a745; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Venda Confirmada</h1>
            </div>
            <div class="content">
              <p>Olá <strong>${data.nomeCliente}</strong>,</p>
              
              <p class="success">Sua venda foi confirmada com sucesso!</p>
              
              <div class="info">
                <span class="label">Número da Venda:</span> ${data.numeroVenda}
              </div>
              
              <div class="info">
                <span class="label">Valor:</span> R$ ${data.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              
              <div class="info">
                <span class="label">Comissão do Representante:</span> R$ ${data.comissao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              
              <div class="info">
                <span class="label">Representante:</span> ${data.nomeRepresentante}
              </div>
              
              <p>Obrigado pela confiança!</p>
            </div>
            <div class="footer">
              <p>Este é um email automático. Não responda este email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_USER || "seu-email@gmail.com",
      to: data.destinatario,
      subject: `Confirmação de Venda ${data.numeroVenda}`,
      html: htmlContent,
    });

    console.log(`[Email] Confirmação de venda ${data.numeroVenda} enviada para ${data.destinatario}`);
    return true;
  } catch (error) {
    console.error("[Email] Erro ao enviar confirmação de venda:", error);
    return false;
  }
}

/**
 * Testar conexão com servidor SMTP
 */
export async function testarConexaoEmail(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log("[Email] Conexão SMTP verificada com sucesso");
    return true;
  } catch (error) {
    console.error("[Email] Erro ao verificar conexão SMTP:", error);
    return false;
  }
}
