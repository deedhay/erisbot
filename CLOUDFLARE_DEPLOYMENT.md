# Cloudflare Pages Deployment Guide

This guide explains how to deploy the Eris Bot website to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account
2. Your repository connected to Cloudflare Pages

## Important: Pre-Deploy Step

Before deploying, you must generate the commands.json file locally:

\`\`\`bash
cd website
python3 scripts/parse_commands_from_source.py
\`\`\`

This creates `website/public/commands.json` which should be committed to your repository.

## Deployment Configuration

### Build Settings

In your Cloudflare Pages dashboard, configure:

- **Framework preset**: Next.js (Static HTML Export)
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Node version**: 18 or higher
- **Root directory**: `website`

### Environment Variables

Add these in Cloudflare Pages dashboard:

\`\`\`
NEXTAUTH_URL=https://your-domain.pages.dev
NEXTAUTH_SECRET=your-secret-key-here
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
NODE_VERSION=18
\`\`\`

## Build Process

The build process:

1. Installs Node.js dependencies
2. Builds the Next.js application as a static export
3. Deploys to Cloudflare's edge network

## Custom Domain

To use a custom domain:

1. Go to Cloudflare Pages dashboard
2. Select your project
3. Go to "Custom domains"
4. Add your domain and follow DNS configuration steps

## Updating Commands

When you update bot commands:

1. Run locally: `python3 scripts/parse_commands_from_source.py`
2. Commit the updated `public/commands.json`
3. Push to trigger automatic deployment

## Troubleshooting

### Build Fails

- Ensure Node.js 18+ is specified in environment variables
- Check that `public/commands.json` exists in repository
- Verify all environment variables are set correctly
- Ensure `@cloudflare/next-on-pages` is in devDependencies

### API Routes Not Working

The API routes use Edge runtime. If issues occur:
- Check Cloudflare Pages Functions logs
- Ensure environment variables are set
- Verify NextAuth configuration matches your domain

### Commands Not Showing

- Ensure `public/commands.json` is committed to repository
- Check that the file is accessible at `/commands.json`
- Clear browser cache

## Support

For Cloudflare Pages deployment issues:
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/)
