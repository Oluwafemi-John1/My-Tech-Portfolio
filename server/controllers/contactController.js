const nodemailer = require('nodemailer');
const Message    = require('../models/Message');

// Lazily initialised so the server starts even when EMAIL_* env vars are absent
let transporter = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

exports.sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'name, email, subject and message are required' });
  }

  try {
    const doc = await Message.create({ name, email, subject, message });

    // Fire-and-forget email notification — never blocks the response
    getTransporter()
      .sendMail({
        from:    `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to:      process.env.EMAIL_USER,
        subject: `Portfolio Contact: ${subject}`,
        text:    `Name:    ${name}\nEmail:   ${email}\nSubject: ${subject}\n\n${message}`,
        html:    `<p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Subject:</strong> ${subject}</p>
                  <hr/>
                  <p>${message.replace(/\n/g, '<br>')}</p>`,
      })
      .catch((err) => console.error('Email notification error:', err.message));

    res.status(201).json({ message: 'Message sent', id: doc._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMessages = async (_req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
