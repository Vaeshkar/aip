# AIP Setup Guide 🚀

Complete guide for setting up AIP and publishing to npm.

---

## 📋 **Prerequisites**

Before you begin, make sure you have:

- ✅ Node.js 16+ installed
- ✅ npm account (for publishing)
- ✅ GitHub account
- ✅ Figma API token

---

## 🔧 **Step 1: Initial Setup**

### **1.1 Clone the Repository**

```bash
git clone git@github.com:Vaeshkar/aip.git
cd aip
```

### **1.2 Install Dependencies**

```bash
npm install
```

### **1.3 Build Everything**

```bash
npm run build
```

---

## 🎨 **Step 2: Configure Figma Service**

### **2.1 Get Your Figma API Token**

1. Go to https://www.figma.com/settings
2. Scroll to **"Personal access tokens"**
3. Click **"Create new token"**
4. Name it (e.g., "AIP Service")
5. Copy the token (starts with `figd_`)

### **2.2 Set Environment Variables**

Create `services/figma/.env.local`:

```bash
FIGMA_API_KEY=figd_your_token_here
PORT=65001  # Optional: defaults to 65001 with dynamic allocation
HOST=0.0.0.0
```

**Important**: Never commit `.env.local` to git!

**Note**: The service uses **dynamic port allocation** starting from port 65001. If the port is in use, it will automatically find the next available port or kill old instances of the same service.

---

## 🧪 **Step 3: Test Locally**

### **3.1 Start the Figma Service**

```bash
cd services/figma
npm start
```

You should see:

```
🎨 Figma AIP Service started successfully!

📋 Available tools:
  - figma.getFile: Get a Figma file by key...
  ...

🔗 Endpoints:
  - Health: http://0.0.0.0:65001/health
  - RPC: http://0.0.0.0:65001/aip/v1/rpc
  - AICF: http://0.0.0.0:65001/aip/v1/aicf
```

**Note**: The actual port may differ if 65001 is in use. Check the console output for the allocated port.

### **3.2 Test with curl**

```bash
# Test health endpoint
curl http://localhost:65001/health

# Test capabilities
curl -X POST http://localhost:65001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.capabilities.list",
    "params": {}
  }'

# Test with a real Figma file
curl -X POST http://localhost:65001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "figma.getFile",
      "arguments": {
        "fileKey": "YOUR_FILE_KEY",
        "depth": 1
      }
    }
  }'
```

---

## 📦 **Step 4: Prepare for npm Publishing**

### **4.1 Update package.json**

Make sure `services/figma/package.json` has:

```json
{
  "name": "@vaeshkar/aip-figma",
  "version": "1.0.0",
  "bin": {
    "aip-figma": "./dist/index.js"
  },
  "files": ["dist", "README.md", "LICENSE"],
  "publishConfig": {
    "access": "public"
  }
}
```

### **4.2 Build for Production**

```bash
cd services/figma
npm run build
```

### **4.3 Test the CLI Locally**

```bash
# Link it globally
npm link

# Test the command
aip-figma

# Unlink when done testing
npm unlink -g @vaeshkar/aip-figma
```

---

## 🌍 **Step 5: Publish to npm**

### **5.1 Login to npm**

```bash
npm login
```

### **5.2 Publish the Figma Service**

```bash
cd services/figma
npm publish --access public
```

### **5.3 Verify Publication**

```bash
# Check on npm
open https://www.npmjs.com/package/@vaeshkar/aip-figma

# Test installation
npm install -g @vaeshkar/aip-figma
aip-figma --help
```

---

## 🐙 **Step 6: Push to GitHub**

### **6.1 Check Status**

```bash
git status
```

### **6.2 Add Files**

```bash
# Add everything except .env.local (already in .gitignore)
git add .
```

### **6.3 Commit**

```bash
git commit -m "Initial commit: AIP core + Figma service"
```

### **6.4 Push to GitHub**

```bash
git push -u origin main
```

---

## 🎯 **Step 7: Use Globally**

### **7.1 Install Globally**

```bash
npm install -g @vaeshkar/aip-figma
```

### **7.2 Set Environment Variable**

```bash
# Add to your ~/.bashrc or ~/.zshrc
export FIGMA_API_KEY=figd_your_token_here
```

### **7.3 Start the Service**

```bash
aip-figma
```

### **7.4 Use with Augment**

In Augment, tell Claude:

```
I have a Figma AIP service running at http://localhost:65001/aip/v1/rpc

Can you get the Figma file with key "Ml7RPTviH7YoellUOEQ9h1" and analyze it?

Use this curl command:
curl -X POST http://localhost:65001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "figma.getFile",
      "arguments": {
        "fileKey": "Ml7RPTviH7YoellUOEQ9h1",
        "depth": 1
      }
    }
  }'
```

---

## 🔄 **Step 8: Update and Republish**

### **8.1 Make Changes**

Edit files as needed.

### **8.2 Update Version**

```bash
cd services/figma
npm version patch  # or minor, or major
```

### **8.3 Rebuild and Republish**

```bash
npm run build
npm publish
```

### **8.4 Push to GitHub**

```bash
git add .
git commit -m "Version bump: v1.0.1"
git push
```

---

## 🚨 **Troubleshooting**

### **403 Error from Figma API**

**Problem**: `{"success":false,"error":"Request failed with status code 403"}`

**Solutions**:

1. Check your API token is correct
2. Make sure the file is accessible with your token
3. Regenerate your Figma API token
4. Check the file is not private/restricted

### **Module Not Found**

**Problem**: `Cannot find module '@vaeshkar/aip-core'`

**Solution**:

```bash
cd /path/to/aip
npm install
npm run build
```

### **Permission Denied**

**Problem**: `EACCES: permission denied`

**Solution**:

```bash
chmod +x services/figma/dist/index.js
```

### **Port Already in Use**

**Problem**: `Error: listen EADDRINUSE: address already in use :::65001`

**Solution**: The service now has **automatic port management**! It will:

1. ✅ Detect if the port is in use
2. ✅ Check if it's the same service (kills old instance automatically)
3. ✅ Find next available port if needed (65002, 65003, etc.)

You can also manually specify a port:

```bash
PORT=12345 aip-figma
```

Or manually kill processes:

```bash
# Find and kill the process
lsof -ti:65001 | xargs kill -9
```

---

## 📚 **Next Steps**

1. ✅ **Test thoroughly** - Make sure everything works
2. ✅ **Write documentation** - Update README files
3. ✅ **Add examples** - Create usage examples
4. ✅ **Build more services** - GitHub, Notion, Slack, etc.
5. ✅ **Get feedback** - Share with the community

---

## 🎉 **Success!**

You now have:

- ✅ AIP core protocol
- ✅ Figma service published to npm
- ✅ Globally installable CLI
- ✅ GitHub repository
- ✅ Ready for production use

**Next**: Build more services and expand the AIP ecosystem! 🚀

---

**Questions?** Open an issue on GitHub: https://github.com/Vaeshkar/aip/issues
