import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: '*',
}));
app.use(express.json());

// Configurar MailerSend
const mailerSend = new MailerSend({
  apiKey: process.env.API_KEY, // no .env
});

// Rota da API
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const sentFrom = new Sender('mailer@djdrones.com.br', 'DeJongh Contato');
    const recipients = [new Recipient('contato@djdrones.com.br', 'Cliente')]; // ou use o próprio email do usuário

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(new Sender(email, name)) // quem enviou o formulário
      .setSubject(`DeJongh Website - Novo Contato`)
      .setHtml(`<p><strong>Nome:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Mensagem:</strong> ${message}</p>`)
      .setText(`Nome: ${name}\nEmail: ${email}\nMensagem: ${message}`);

    const response = await mailerSend.email.send(emailParams);

    return res.status(200).json({ message: 'Email enviado com sucesso', response });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return res.status(500).json({ error: 'Erro ao enviar email' });
  }
});

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
