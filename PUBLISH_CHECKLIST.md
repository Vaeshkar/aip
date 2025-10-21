# 📋 Publishing Checklist for Dennis

Quick checklist to get AIP published and online!

---

## ✅ **What's Ready**

- ✅ Git repository initialized
- ✅ Connected to `git@github.com:Vaeshkar/aip.git`
- ✅ Figma service built and tested
- ✅ Package renamed to `@vaeshkar/aip-figma`
- ✅ CLI command `aip-figma` configured
- ✅ Shebang added for executable
- ✅ AGPL-3.0 license applied
- ✅ .gitignore configured
- ✅ README files created

---

## 🚨 **Before You Publish**

### **1. Test the Figma API Token**

Your current token might not have access to the file. Let's verify:

```bash
# Test with Figma's API directly
curl -H "X-Figma-Token: YOUR_TOKEN" \
  https://api.figma.com/v1/me
```

If this returns your user info, the token is valid. If not, regenerate it:

1. Go to https://www.figma.com/settings
2. Delete old token
3. Create new token
4. Update `.env.local`

### **2. Make the File Public (or use a different file)**

The file `Ml7RPTviH7YoellUOEQ9h1` returned 403. Either:

- Make it public in Figma
- Use a different file you have access to
- Create a test file

---

## 📦 **Publishing Steps**

### **Step 1: Commit to GitHub**

```bash
cd /Users/leeuwen/Programming/aip-workspace

# Check what will be committed
git status

# Add all files (except .env.local - already ignored)
git add .

# Commit
git commit -m "Initial commit: AIP core + Figma service

- Universal AI protocol (AIP) implementation
- Figma service with 11 tools
- HTTP transport with JSON-RPC 2.0
- AGPL-3.0 licensed
- Globally installable via npm"

# Push to GitHub
git push -u origin main
```

### **Step 2: Publish to npm**

```bash
# Login to npm (if not already)
npm login

# Go to Figma service
cd services/figma

# Build for production
npm run build

# Publish
npm publish --access public
```

### **Step 3: Test Global Installation**

```bash
# Install globally
npm install -g @vaeshkar/aip-figma

# Set environment variable
export FIGMA_API_KEY=your_token_here

# Start the service
aip-figma
```

---

## 🎯 **Quick Commands**

### **Build Everything**

```bash
npm run build
```

### **Test Figma Service Locally**

```bash
cd services/figma
npm start
```

### **Test with curl**

```bash
curl -X POST http://localhost:65001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.capabilities.list",
    "params": {}
  }'
```

### **Publish to npm**

```bash
cd services/figma
npm publish --access public
```

### **Push to GitHub**

```bash
git add .
git commit -m "Your message"
git push
```

---

## 🔍 **What to Check**

### **Before Committing**:

- [ ] `.env.local` is NOT in git (check with `git status`)
- [ ] All TypeScript compiles (`npm run build`)
- [ ] Service starts successfully (`npm start`)
- [ ] No sensitive data in code

### **Before Publishing to npm**:

- [ ] Package name is correct: `@vaeshkar/aip-figma`
- [ ] Version is correct: `1.0.0`
- [ ] License is correct: `AGPL-3.0-or-later`
- [ ] `dist/` folder exists and has compiled code
- [ ] README is up to date

### **After Publishing**:

- [ ] Check npm page: https://www.npmjs.com/package/@vaeshkar/aip-figma
- [ ] Test global install: `npm install -g @vaeshkar/aip-figma`
- [ ] Test CLI command: `aip-figma`

---

## 🚨 **Important Notes**

### **API Token Security**

Your `.env.local` contains:

```
FIGMA_API_KEY="W3pEprpvmjENm6kTINhF8X"
FIGMA_CLIENT_SECRET="FW0TKBM2SVoFtE08UBGM2WFCjoDoWT"
```

**This file is in `.gitignore` and will NOT be committed.** ✅

But you should still:

1. **Regenerate these tokens** after testing (they're visible in this conversation)
2. **Never share them** publicly
3. **Use environment variables** in production

### **File Access Issue**

The 403 error means:

- The token doesn't have access to file `Ml7RPTviH7YoellUOEQ9h1`
- The file might be private
- The token might be invalid

**Solution**: Use a public Figma file or one you own for testing.

---

## 📝 **Recommended Commit Message**

```
Initial commit: AIP core + Figma service

Features:
- Universal AI protocol (AIP) implementation
- Figma service with 11 tools (files, nodes, images, comments, etc.)
- HTTP transport with JSON-RPC 2.0
- Globally installable via npm as `aip-figma`
- AGPL-3.0 licensed

Architecture:
- Vendor-neutral (works with any LLM)
- Simple HTTP + JSON-RPC (no MCP lock-in)
- Direct file key access (no config files needed)

Services:
- @vaeshkar/aip-figma (v1.0.0)

Documentation:
- Complete README with examples
- Setup guide
- Usage documentation
```

---

## 🎉 **After Publishing**

### **Announce It!**

Share on:

- GitHub Discussions
- Twitter/X
- LinkedIn
- Reddit (r/programming, r/webdev)
- Dev.to

### **Example Announcement**:

```
🚀 Introducing AIP (AI-Protocol)!

A universal, vendor-neutral protocol for AI services.

Unlike MCP (Claude-only), AIP works with ANY LLM:
✅ OpenAI
✅ Anthropic
✅ Google
✅ Local models

First service: Figma! 🎨

npm install -g @vaeshkar/aip-figma

GitHub: https://github.com/Vaeshkar/aip
npm: https://www.npmjs.com/package/@vaeshkar/aip-figma

#AI #OpenSource #Figma #LLM
```

---

## 🔄 **Next Steps**

After publishing:

1. **Test with Augment** - Make sure it works with Claude
2. **Build GitHub service** - Second service in the ecosystem
3. **Add WebSocket transport** - Real-time updates
4. **Create Python client** - For Python users
5. **Write tutorials** - Help others use AIP

---

## ❓ **Need Help?**

If you run into issues:

1. Check `SETUP.md` for detailed instructions
2. Check the troubleshooting section
3. Open an issue on GitHub
4. Ask me! 😊

---

**Dennis, you're about to launch something awesome!** 🚀

AIP is the future of AI-service integration. Let's get it online! 💪
