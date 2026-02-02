> **🚀 Don't want to self-host?** [Join the waitlist for our fully managed solution →](https://mcpengage.com/brevo)
> 
> Zero setup. Zero maintenance. Just connect and automate.

---

# 🚀 Brevo MCP Server — 2026 Complete Version

## 💡 What This Unlocks

**This MCP server gives AI direct access to your entire Brevo email and SMS marketing workspace.** Instead of clicking through interfaces, you just *tell* it what you need.

Brevo (formerly Sendinblue) is a complete email and SMS marketing platform used by 500,000+ businesses worldwide. This MCP server brings all its power into your AI workflow.

### 🎯 Email/SMS Marketing Power Moves

Stop context-switching between Claude and Brevo. The AI can directly control your campaigns:

1. **Emergency campaign deployment** — "Send an urgent email about the service outage to all active customers, skip the test list"
2. **Smart segmentation** — "Export all contacts who opened our last 3 campaigns but didn't convert, then create a re-engagement campaign"
3. **Multi-channel orchestration** — "Check email deliverability for campaign #12345, if bounce rate is over 5%, send an SMS follow-up to non-openers"
4. **Template-driven automation** — "List all active email templates, use template #8 to send welcome emails to the 50 contacts added this week"
5. **Real-time list hygiene** — "Find all contacts with invalid emails from yesterday's imports, add them to the cleanup list, and notify me with stats"

### 🔗 The Real Power: Combining Tools

AI can chain multiple Brevo operations together:

- Query campaign metrics → Segment by engagement → Create targeted follow-up → Schedule SMS backup
- Import contacts → Validate emails → Auto-assign to lists → Trigger welcome sequence
- Analyze template performance → Clone best performers → Customize for new segments → Deploy and track

## 📦 What's Inside

**8 powerful API tools** covering Brevo's email and SMS marketing platform:

1. **send_email** — Send transactional emails with templates, attachments, and tracking
2. **list_contacts** — Query and filter your contact database with pagination
3. **add_contact** — Create contacts with custom attributes and list assignments
4. **update_contact** — Modify contact data, list memberships, and preferences
5. **list_campaigns** — Browse email campaigns by type, status, and date
6. **create_campaign** — Build and schedule email campaigns programmatically
7. **send_sms** — Send transactional SMS with delivery tracking
8. **list_templates** — Access your email template library

All with proper error handling, automatic authentication, and TypeScript types.

**API Foundation:** [Brevo API v3](https://developers.brevo.com/reference/getting-started-1) (REST)

## 🚀 Quick Start

### Option 1: Claude Desktop (Local)

1. **Clone and build:**
   ```bash
   git clone https://github.com/BusyBee3333/Brevo-MCP-2026-Complete.git
   cd brevo-mcp-2026-complete
   npm install
   npm run build
   ```

2. **Get your Brevo API key:**
   - Log into [Brevo](https://app.brevo.com/)
   - Go to **Settings → SMTP & API → API Keys**
   - Create a new API key (v3) with email and SMS permissions
   - Copy the key (you'll only see it once)

3. **Configure Claude Desktop:**
   
   On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   
   On Windows: `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "brevo": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/brevo-mcp-2026-complete/dist/index.js"],
         "env": {
           "BREVO_API_KEY": "xkeysib-abc123..."
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop**

### Option 2: Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/brevo-mcp)

1. Click the button above
2. Set `BREVO_API_KEY` in Railway dashboard
3. Use the Railway URL as your MCP server endpoint

### Option 3: Docker

```bash
docker build -t brevo-mcp .
docker run -p 3000:3000 \
  -e BREVO_API_KEY=xkeysib-abc123... \
  brevo-mcp
```

## 🔐 Authentication

**Brevo uses API key authentication** (v3 API):

- **Header:** `api-key: YOUR_KEY`
- **Format:** `xkeysib-...` (starts with xkeysib-)
- **Permissions:** Email campaigns, Contacts, SMS (depending on your plan)
- **Rate limits:** 300 calls/minute on free plans, higher on paid

Get your API key at: https://app.brevo.com/settings/keys/api

The MCP server handles authentication automatically—just set `BREVO_API_KEY`.

## 🎯 Example Prompts for Email Marketers

Once connected to Claude, use natural language. Here are real email marketing workflows:

### Campaign Management
- *"List all email campaigns from the last 30 days that are still in draft status"*
- *"Create a new campaign called 'Spring Sale 2026' with template #45, targeting list #12"*
- *"Show me all campaigns with 'webinar' in the name scheduled for this month"*

### Contact Operations
- *"Add these 5 contacts to list #8: [paste CSV data]"*
- *"Find all contacts with Gmail addresses who signed up this week"*
- *"Update contact jane@example.com: set FIRSTNAME to Jane, add to VIP list"*

### Multi-Channel Workflows
- *"Send a welcome email to everyone added to list #15 today using template #9"*
- *"If bounce rate on campaign #789 is over 3%, send SMS backup to all recipients"*
- *"List all templates with 'newsletter' in the name, show me #3's stats"*

### Bulk Operations
- *"Export all contacts modified in the last 7 days as JSON"*
- *"Send 'Account Verified' email to all contacts with VERIFIED=true attribute"*
- *"Check how many contacts are in lists #10, #11, and #12 combined"*

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Brevo account (free or paid)

### Setup

```bash
git clone https://github.com/BusyBee3333/Brevo-MCP-2026-Complete.git
cd brevo-mcp-2026-complete
npm install
cp .env.example .env
# Edit .env with your Brevo API key
npm run build
npm start
```

### Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Project Structure

```
brevo-mcp-2026-complete/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── .env.example
```

## 🐛 Troubleshooting

### "Authentication failed"
- Verify your API key starts with `xkeysib-`
- Check key permissions at https://app.brevo.com/settings/keys/api
- Ensure your account is active (not suspended)

### "Rate limit exceeded"
- Free plans: 300 calls/minute
- Wait 60 seconds or upgrade to paid plan
- Use pagination (`limit` parameter) to reduce calls

### "Tools not appearing in Claude"
- Restart Claude Desktop after updating config
- Check that the path in `claude_desktop_config.json` is absolute (not relative)
- Verify the build completed: `ls dist/index.js`
- Check Claude Desktop logs: `tail -f ~/Library/Logs/Claude/mcp*.log`

### "Invalid list ID" or "Template not found"
- List IDs are numeric (e.g., 12, not "12")
- Get valid IDs: *"List all my contact lists"* or *"Show me all templates"*

## 📖 Resources

- **[Brevo API v3 Docs](https://developers.brevo.com/reference/getting-started-1)** — Official API reference
- **[Brevo Help Center](https://help.brevo.com/)** — Tutorials and guides
- **[MCP Protocol Spec](https://modelcontextprotocol.io/)** — How MCP servers work
- **[Claude Desktop Docs](https://claude.ai/desktop)** — Installing and configuring Claude
- **[MCPEngage Platform](https://mcpengine.pages.dev)** — Browse 30+ business MCP servers

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/sms-analytics`)
3. Commit your changes (`git commit -m 'Add SMS campaign stats tool'`)
4. Push to the branch (`git push origin feature/sms-analytics`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Credits

Built by [MCPEngage](https://mcpengage.com) — AI infrastructure for business software.

Want more MCP servers? Check out our [full catalog](https://mcpengage.com) covering 30+ business platforms including Constant Contact, Mailchimp, ActiveCampaign, and more.

---

**Questions?** Open an issue or join our [Discord community](https://discord.gg/mcpengage).
