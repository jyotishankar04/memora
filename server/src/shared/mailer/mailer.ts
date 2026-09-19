import nodemailer from "nodemailer";
import { env } from "../../config/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: env.SMTP_USERNAME ? { user: env.SMTP_USERNAME, pass: env.SMTP_PASSWORD } : undefined,
});

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
}

/**
 * The only place nodemailer is imported outside this file. Deliberately
 * throws on failure rather than swallowing it — this runs inside the email
 * worker, which owns retry/status bookkeeping via BullMQ's own attempts
 * mechanism. Fire-and-forget error handling belongs at the enqueue site
 * (email.service.ts), not here.
 */
export async function sendMail(input: SendMailInput): Promise<void> {
  await transporter.sendMail({
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_ADDRESS}>`,
    to: input.to,
    subject: input.subject,
    html: input.html,
  });
}
