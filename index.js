const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();
const port = 3000;

// Middlewares
app.use(cors({
  origin: "*",
}));
app.use(bodyParser.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const data = await resend.emails.send({
      from: "DeJongh <onboarding@resend.dev>",
      to: ["marcus.relation@gmail.com"],
      subject: `DeJongh Website - Novo contato de ${name}`,
      html: `
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensagem:</strong><br/>${message}</p>
            `,
    });

    console.log("Email enviado:", data);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
