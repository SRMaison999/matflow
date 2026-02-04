// =====================================================
// MatFlow - Email Service
// =====================================================

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { config } from '@/config/index.js';
import { createLogger } from './logger.js';

const logger = createLogger('email');

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!config.email.enabled) {
    logger.warn('Email service not configured');
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  return transporter;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const transport = getTransporter();

  if (!transport) {
    logger.warn('Email not sent - service not configured', { to: options.to });
    return false;
  }

  try {
    await transport.sendMail({
      from: config.email.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    });

    logger.info('Email sent successfully', { to: options.to, subject: options.subject });
    return true;
  } catch (error) {
    logger.error('Failed to send email', { error, to: options.to });
    return false;
  }
}

// Email templates
export const emailTemplates = {
  passwordReset: (resetUrl: string, userName: string) => ({
    subject: 'Réinitialisation de votre mot de passe MatFlow',
    html: `
      <h2>Bonjour ${userName},</h2>
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
      <p><a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Réinitialiser mon mot de passe</a></p>
      <p>Ce lien expire dans 1 heure.</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      <p>L'équipe MatFlow</p>
    `,
    text: `Bonjour ${userName},\n\nVous avez demandé la réinitialisation de votre mot de passe.\n\nCliquez sur ce lien pour créer un nouveau mot de passe : ${resetUrl}\n\nCe lien expire dans 1 heure.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.\n\nL'équipe MatFlow`,
  }),

  welcomeEmail: (userName: string, loginUrl: string) => ({
    subject: 'Bienvenue sur MatFlow',
    html: `
      <h2>Bienvenue ${userName} !</h2>
      <p>Votre compte MatFlow a été créé avec succès.</p>
      <p>Connectez-vous pour commencer à utiliser l'application :</p>
      <p><a href="${loginUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Se connecter</a></p>
      <p>L'équipe MatFlow</p>
    `,
    text: `Bienvenue ${userName} !\n\nVotre compte MatFlow a été créé avec succès.\n\nConnectez-vous : ${loginUrl}\n\nL'équipe MatFlow`,
  }),

  reservationConfirmation: (projectName: string, startDate: string, endDate: string) => ({
    subject: `Confirmation de réservation - ${projectName}`,
    html: `
      <h2>Réservation confirmée</h2>
      <p>Votre réservation pour le projet <strong>${projectName}</strong> a été confirmée.</p>
      <p><strong>Période :</strong> ${startDate} - ${endDate}</p>
      <p>L'équipe MatFlow</p>
    `,
    text: `Réservation confirmée\n\nVotre réservation pour le projet ${projectName} a été confirmée.\n\nPériode : ${startDate} - ${endDate}\n\nL'équipe MatFlow`,
  }),
};

export const email = {
  send: sendEmail,
  templates: emailTemplates,
};
