# Figma File Selector Guide 📁

The Figma AIP Service includes a **file selector** feature that lets you configure and manage your Figma files easily!

---

## 🎯 Why Use the File Selector?

Instead of remembering long Figma file keys like `abcXYZ123`, you can:

✅ **Use friendly names**: `design-system`, `landing-page`, `mobile-app`  
✅ **Organize with tags**: `design-system`, `mobile`, `web`  
✅ **Add descriptions**: Document what each file contains  
✅ **Share configuration**: Team members use the same file IDs  

---

## 📝 Setup

### Step 1: Edit `figma-files.json`

Open `services/figma/figma-files.json` and add your Figma files:

```json
{
  "files": [
    {
      "id": "design-system",
      "name": "Design System",
      "fileKey": "abc123xyz",
      "description": "Main design system with components and tokens",
      "tags": ["design-system", "components", "tokens"]
    },
    {
      "id": "landing-page",
      "name": "Landing Page",
      "fileKey": "def456uvw",
      "description": "Marketing landing page designs",
      "tags": ["marketing", "web"]
    },
    {
      "id": "mobile-app",
      "name": "Mobile App",
      "fileKey": "ghi789rst",
      "description": "Mobile app UI designs",
      "tags": ["mobile", "app"]
    }
  ],
  "teams": [
    {
      "id": "main-team",
      "name": "Main Team",
      "teamId": "123456",
      "description": "Primary design team"
    }
  ],
  "projects": [
    {
      "id": "web-project",
      "name": "Web Project",
      "projectId": "789012",
      "description": "Web application designs"
    }
  ]
}
```

### Step 2: Get Your File Keys

1. Open your Figma file in the browser
2. Look at the URL: `https://www.figma.com/file/abc123xyz/My-Design`
3. The file key is `abc123xyz`
4. Add it to `figma-files.json`

### Step 3: Start the Service

```bash
npm start
```

You'll see your configured files:

```
🎨 Figma AIP Service started successfully!

📁 Configured Files:
  - design-system: Design System (abc123xyz)
  - landing-page: Landing Page (def456uvw)
  - mobile-app: Mobile App (ghi789rst)
```

---

## 🚀 Usage

### New Tools Available

The file selector adds **3 new tools**:

1. **`figma.listConfiguredFiles`** - List all configured files
2. **`figma.getFileById`** - Get a file by its ID (e.g., `design-system`)
3. **`figma.getFilesByTag`** - Get all files with a specific tag

### Example 1: List Configured Files

```bash
curl -X POST http://localhost:3001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "figma.listConfiguredFiles",
      "arguments": {}
    }
  }'
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {
    "success": true,
    "data": {
      "files": [
        {
          "id": "design-system",
          "name": "Design System",
          "fileKey": "abc123xyz",
          "description": "Main design system with components and tokens",
          "tags": ["design-system", "components", "tokens"]
        },
        ...
      ],
      "count": 3
    }
  }
}
```

### Example 2: Get File by ID

Instead of:
```bash
# Old way - using file key
curl ... -d '{"tool":"figma.getFile","arguments":{"fileKey":"abc123xyz"}}'
```

You can now do:
```bash
# New way - using friendly ID
curl -X POST http://localhost:3001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "figma.getFileById",
      "arguments": {
        "id": "design-system",
        "depth": 1
      }
    }
  }'
```

**Much easier to remember!** 🎉

### Example 3: Get Files by Tag

Get all mobile-related files:

```bash
curl -X POST http://localhost:3001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "figma.getFilesByTag",
      "arguments": {
        "tag": "mobile"
      }
    }
  }'
```

---

## 🎓 Using with Augment

In **Augment**, you can now say:

```
I have a Figma AIP service at http://localhost:3001/aip/v1/rpc

Can you:
1. List all my configured Figma files
2. Get the "design-system" file
3. Extract all button components

Use the figma.listConfiguredFiles and figma.getFileById tools.
```

Claude will:
1. List your files
2. Get the design system file by ID (no need to remember the file key!)
3. Extract the components

---

## 📋 Configuration Schema

### File Object

```typescript
{
  id: string;           // Unique identifier (e.g., "design-system")
  name: string;         // Human-readable name
  fileKey: string;      // Figma file key from URL
  description?: string; // Optional description
  tags?: string[];      // Optional tags for categorization
}
```

### Team Object

```typescript
{
  id: string;           // Unique identifier (e.g., "main-team")
  name: string;         // Human-readable name
  teamId: string;       // Figma team ID
  description?: string; // Optional description
}
```

### Project Object

```typescript
{
  id: string;           // Unique identifier (e.g., "web-project")
  name: string;         // Human-readable name
  projectId: string;    // Figma project ID
  description?: string; // Optional description
}
```

---

## 💡 Best Practices

### 1. Use Descriptive IDs

✅ Good: `design-system`, `landing-page`, `mobile-app`  
❌ Bad: `file1`, `file2`, `file3`

### 2. Add Tags for Organization

```json
{
  "id": "button-component",
  "name": "Button Component",
  "fileKey": "abc123",
  "tags": ["component", "design-system", "web", "mobile"]
}
```

Now you can get all components:
```bash
figma.getFilesByTag({ tag: "component" })
```

### 3. Document Your Files

```json
{
  "id": "design-system",
  "name": "Design System",
  "fileKey": "abc123",
  "description": "Main design system. Contains: buttons, inputs, cards, colors, typography. Updated weekly."
}
```

### 4. Share Configuration with Team

Commit `figma-files.json` to git (but NOT `.env.local`!):

```bash
git add figma-files.json
git commit -m "Add Figma file configuration"
git push
```

Now your team uses the same file IDs!

---

## 🔧 Advanced Usage

### Dynamic File Selection

Create a script that selects files based on context:

```typescript
import { FigmaConfigManager } from './src/figma-config';

const config = new FigmaConfigManager();

// Get all design system files
const designSystemFiles = config.getFilesByTag('design-system');

// Get all mobile files
const mobileFiles = config.getFilesByTag('mobile');

// Get a specific file
const landingPage = config.getFileById('landing-page');
```

### Validation

The config manager validates your configuration:

```typescript
const validation = config.validate();

if (!validation.valid) {
  console.error('Configuration errors:', validation.errors);
}
```

Common errors:
- Duplicate file IDs
- Duplicate file keys
- Placeholder keys not replaced

---

## 🚨 Troubleshooting

### "File with ID 'design-system' not found"

**Problem**: The file ID doesn't exist in `figma-files.json`

**Solution**: 
1. Check `figma-files.json`
2. Make sure the ID matches exactly (case-sensitive!)
3. Restart the service after editing the config

### "No files configured"

**Problem**: `figma-files.json` is empty or has placeholder keys

**Solution**:
1. Edit `figma-files.json`
2. Replace `YOUR_FILE_KEY_HERE` with actual file keys
3. Restart the service

### Changes Not Showing Up

**Problem**: Config is cached

**Solution**: Restart the service:
```bash
# Stop the service (Ctrl+C)
# Start it again
npm start
```

---

## 📚 Examples

### Example 1: Design-to-Code Workflow

```json
{
  "files": [
    {
      "id": "components",
      "name": "Component Library",
      "fileKey": "abc123",
      "tags": ["components", "design-system"]
    },
    {
      "id": "pages",
      "name": "Page Designs",
      "fileKey": "def456",
      "tags": ["pages", "web"]
    }
  ]
}
```

In Augment:
```
Get the "components" file and generate React components for all buttons.
```

### Example 2: Design Token Extraction

```json
{
  "files": [
    {
      "id": "tokens",
      "name": "Design Tokens",
      "fileKey": "ghi789",
      "tags": ["tokens", "design-system"],
      "description": "Colors, typography, spacing, shadows"
    }
  ]
}
```

In Augment:
```
Get the "tokens" file and extract all color variables as CSS custom properties.
```

---

## 🎯 Summary

**Before File Selector**:
```bash
# Hard to remember
figma.getFile({ fileKey: "abc123xyz" })
```

**After File Selector**:
```bash
# Easy to remember!
figma.getFileById({ id: "design-system" })
```

**Benefits**:
- ✅ Friendly names instead of cryptic keys
- ✅ Organization with tags
- ✅ Team collaboration (shared config)
- ✅ Documentation (descriptions)
- ✅ Easier to use with AI (Claude, ChatGPT, etc.)

---

**Happy designing! 🎨**

