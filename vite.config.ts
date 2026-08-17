import 'dotenv/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { Plugin } from 'vite';
import {defineConfig} from 'vite';
import { parseSendSmsRequest, sendConfirmationSms } from './api/_sms';

// Mirrors api/send-sms.ts (the Vercel serverless function) so the SMS
// confirmation flow also works with plain `npm run dev` locally, without
// needing the Vercel CLI.
function smsDevApiPlugin(): Plugin {
  return {
    name: 'sms-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/send-sms', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
          return;
        }

        let raw = '';
        req.on('data', (chunk) => {
          raw += chunk;
        });
        req.on('end', () => {
          void (async () => {
            try {
              const body = raw ? JSON.parse(raw) : {};
              const parsed = parseSendSmsRequest(body);
              if (parsed.error || !parsed.phone || !parsed.message) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: parsed.error || 'phone প্রয়োজন' }));
                return;
              }
              const result = await sendConfirmationSms(parsed.phone, parsed.message);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = result.success ? 200 : 502;
              res.end(JSON.stringify(result));
            } catch (error) {
              res.statusCode = 500;
              res.end(
                JSON.stringify({
                  success: false,
                  error: error instanceof Error ? error.message : 'Server error',
                })
              );
            }
          })();
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), smsDevApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
