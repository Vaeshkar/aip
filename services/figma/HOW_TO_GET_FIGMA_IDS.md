# How to Get Figma IDs 🔍

Quick reference guide for finding Figma file keys, team IDs, and project IDs.

---

## 📁 **File Keys**

### **Where to Find It**
Look at the URL when you have a Figma file open:

```
https://www.figma.com/file/abc123XYZ456/My-Design-File
                          ^^^^^^^^^^^^
                          FILE KEY
```

### **Steps**:
1. Open your Figma file in the browser
2. Look at the URL in the address bar
3. Copy the part between `/file/` and the next `/`

### **Examples**:

| URL | File Key |
|-----|----------|
| `https://www.figma.com/file/dBskzKqYHcXobkKzF7XhMA/Design-System` | `dBskzKqYHcXobkKzF7XhMA` |
| `https://www.figma.com/design/k9vFQqZRzJxYmN3pL2wQ8R/Landing-Page` | `k9vFQqZRzJxYmN3pL2wQ8R` |
| `https://www.figma.com/file/pL2wQ8Rk9vFQqZRzJxYmN3/Mobile-App` | `pL2wQ8Rk9vFQqZRzJxYmN3` |

### **Note**: 
- File keys work with both `/file/` and `/design/` URLs
- File keys are **22 characters long** (letters and numbers)

---

## 👥 **Team IDs**

### **Where to Find It**
Look at the URL when viewing your team:

```
https://www.figma.com/files/team/123456789012345678/My-Team
                               ^^^^^^^^^^^^^^^^^^
                               TEAM ID
```

### **Steps**:
1. In Figma, click on your team name in the left sidebar
2. Look at the URL in the address bar
3. Copy the number after `/team/`

### **Example**:

| URL | Team ID |
|-----|---------|
| `https://www.figma.com/files/team/123456789012345678/Design-Team` | `123456789012345678` |

### **Note**:
- Team IDs are **18 digits long**
- You need to be a member of the team to access it

---

## 📂 **Project IDs**

### **Where to Find It**
Look at the URL when viewing a project:

```
https://www.figma.com/files/project/987654321/My-Project
                                    ^^^^^^^^^
                                    PROJECT ID
```

### **Steps**:
1. In Figma, click on a project within your team
2. Look at the URL in the address bar
3. Copy the number after `/project/`

### **Example**:

| URL | Project ID |
|-----|------------|
| `https://www.figma.com/files/project/987654321/Web-App` | `987654321` |

### **Note**:
- Project IDs are **9-10 digits long**
- Projects belong to teams

---

## 🎯 **Quick Visual Guide**

### **File URL Breakdown**:
```
https://www.figma.com/file/dBskzKqYHcXobkKzF7XhMA/Design-System?node-id=0-1
                     ^^^^  ^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^ ^^^^^^^^^^^
                     type       FILE KEY           file name    optional params
```

### **Team URL Breakdown**:
```
https://www.figma.com/files/team/123456789012345678/Design-Team
                      ^^^^^      ^^^^^^^^^^^^^^^^^^  ^^^^^^^^^^^
                      type          TEAM ID          team name
```

### **Project URL Breakdown**:
```
https://www.figma.com/files/project/987654321/Web-App-Project
                      ^^^^^^^      ^^^^^^^^^  ^^^^^^^^^^^^^^^^
                      type       PROJECT ID    project name
```

---

## 📝 **Filling Out `figma-files.json`**

### **Template**:
```json
{
  "files": [
    {
      "id": "your-friendly-id",           // ← You choose this (e.g., "design-system")
      "name": "Human Readable Name",      // ← You choose this
      "fileKey": "dBskzKqYHcXobkKzF7XhMA", // ← Copy from URL
      "description": "What this file contains",
      "tags": ["tag1", "tag2"]            // ← You choose these
    }
  ],
  "teams": [
    {
      "id": "your-team-id",               // ← You choose this (e.g., "main-team")
      "name": "Team Name",                // ← You choose this
      "teamId": "123456789012345678",     // ← Copy from URL
      "description": "Team description"
    }
  ],
  "projects": [
    {
      "id": "your-project-id",            // ← You choose this (e.g., "web-project")
      "name": "Project Name",             // ← You choose this
      "projectId": "987654321",           // ← Copy from URL
      "description": "Project description"
    }
  ]
}
```

### **What You Choose**:
- ✅ `id` - Friendly identifier (lowercase, dashes, no spaces)
- ✅ `name` - Human-readable name
- ✅ `description` - What the file/team/project contains
- ✅ `tags` - Categories for organization

### **What You Copy from Figma**:
- 📋 `fileKey` - From the file URL
- 📋 `teamId` - From the team URL
- 📋 `projectId` - From the project URL

---

## 🔐 **Getting Your Figma API Key**

You also need a Figma API key in `.env.local`:

### **Steps**:
1. Go to https://www.figma.com/settings
2. Scroll down to **"Personal access tokens"**
3. Click **"Create new token"**
4. Give it a name (e.g., "AIP Service")
5. Copy the token (it looks like: `figd_abc123...`)
6. Add it to `.env.local`:
   ```bash
   FIGMA_API_KEY=figd_abc123xyz456...
   ```

### **Security**:
- ⚠️ **Never commit `.env.local` to git!** (it's in `.gitignore`)
- ⚠️ **Keep your API key secret!**
- ✅ Share `figma-files.json` (safe - no secrets)
- ❌ Don't share `.env.local` (contains API key)

---

## ✅ **Checklist**

Before starting the service, make sure you have:

- [ ] Copied file keys from Figma URLs
- [ ] Added file keys to `figma-files.json`
- [ ] Created Figma API token
- [ ] Added API token to `.env.local`
- [ ] Chosen friendly IDs for your files
- [ ] Added tags and descriptions (optional but helpful)

---

## 🚀 **Test It**

After filling out `figma-files.json`:

```bash
# Start the service
npm start

# You should see:
# 📁 Configured Files:
#   - design-system: Design System (dBskzKqYHcXobkKzF7XhMA)
#   - landing-page: Landing Page (k9vFQqZRzJxYmN3pL2wQ8R)
```

If you see your files listed, you did it correctly! 🎉

---

## 🆘 **Troubleshooting**

### **"No files configured"**
- Check that `figma-files.json` exists
- Make sure file keys are not `YOUR_FILE_KEY_HERE`
- Restart the service after editing

### **"File not found" error**
- Double-check the file key is correct
- Make sure you have access to the file in Figma
- Verify your API token has the right permissions

### **"Invalid API key"**
- Check `.env.local` has `FIGMA_API_KEY=...`
- Make sure the API key starts with `figd_`
- Generate a new token if needed

---

## 📚 **Example: Real World Setup**

Let's say you're working on a SaaS product:

```json
{
  "files": [
    {
      "id": "design-system",
      "name": "Design System",
      "fileKey": "dBskzKqYHcXobkKzF7XhMA",
      "description": "Core components: buttons, inputs, cards, modals",
      "tags": ["design-system", "components"]
    },
    {
      "id": "marketing-site",
      "name": "Marketing Website",
      "fileKey": "k9vFQqZRzJxYmN3pL2wQ8R",
      "description": "Landing page, pricing, about us",
      "tags": ["marketing", "web"]
    },
    {
      "id": "dashboard",
      "name": "User Dashboard",
      "fileKey": "pL2wQ8Rk9vFQqZRzJxYmN3",
      "description": "Main app dashboard and user flows",
      "tags": ["app", "web", "dashboard"]
    },
    {
      "id": "mobile-ios",
      "name": "iOS App",
      "fileKey": "mN3pL2wQ8Rk9vFQqZRzJxY",
      "description": "Native iOS app designs",
      "tags": ["mobile", "ios"]
    }
  ],
  "teams": [
    {
      "id": "design-team",
      "name": "Design Team",
      "teamId": "123456789012345678",
      "description": "Main product design team"
    }
  ],
  "projects": [
    {
      "id": "v2-redesign",
      "name": "V2 Redesign",
      "projectId": "987654321",
      "description": "Version 2.0 redesign project"
    }
  ]
}
```

Now you can use friendly names:
```bash
# Instead of remembering "dBskzKqYHcXobkKzF7XhMA"
figma.getFileById({ id: "design-system" })

# Get all mobile files
figma.getFilesByTag({ tag: "mobile" })
```

---

**That's it!** 🎉 You now know how to find all the IDs you need!

