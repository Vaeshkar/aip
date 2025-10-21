# Port Management in AIP Services

**Dynamic, Conflict-Free Port Allocation**

---

## 🎯 **The Problem**

Traditional services use low port numbers (3000-3010) which are **always occupied** by dev servers, causing constant `EADDRINUSE` errors:

```bash
❌ Error: listen EADDRINUSE: address already in use :::3001
❌ Error: listen EADDRINUSE: address already in use :::3002
```

**Result**: Frustration, manual port management, killed processes.

---

## 💡 **The Solution**

AIP services use **smart, dynamic port allocation** starting from **high port numbers** (65001+) which are almost never used.

### **Key Features**

1. ✅ **High Port Numbers** - Start from 65001, avoiding common conflicts
2. ✅ **Automatic Detection** - Checks if port is in use
3. ✅ **Process Identification** - Identifies which process is using the port
4. ✅ **Smart Conflict Resolution** - Kills old instances or finds next port
5. ✅ **Full Transparency** - Reports what happened

---

## 🔧 **How It Works**

### **Default Ports**

| Service | Default Port | Range |
|---------|-------------|-------|
| **Figma** | 65001 | 65001-65100 |
| **Playwright** | 65002 | 65002-65100 |
| **Future Services** | 65003+ | 65003-65535 |

### **Allocation Strategy**

```
1. Check if preferred port is available
   ├─ Available? → Use it ✅
   └─ In use? → Go to step 2

2. Identify process using the port
   ├─ Same service? → Kill it and take over ✅
   └─ Different service? → Go to step 3

3. Try next port (65002, 65003, etc.)
   └─ Repeat until available port found
```

### **Example Output**

```bash
🔌 Allocating port...
   Preferred port: 65001
[Port Manager] Port 65001 is in use by figma (PID 12345)
[Port Manager] Killing old process and taking over...
✅ Port 65001 allocated (killed previous instance PID 12345)

🎨 Figma AIP Service started successfully!

🔗 Endpoints:
  - Health: http://0.0.0.0:65001/health
  - RPC: http://0.0.0.0:65001/aip/v1/rpc
  - AICF: http://0.0.0.0:65001/aip/v1/aicf
```

---

## 🎮 **Usage**

### **Default Behavior**

Just start the service - it handles everything automatically:

```bash
# Figma service (uses port 65001)
aip-figma

# Playwright service (uses port 65002)
aip-playwright
```

### **Custom Port**

Override with environment variable:

```bash
# Use specific port
PORT=12345 aip-figma

# Or in .env.local
PORT=12345
```

### **Multiple Instances**

Run multiple instances on different ports:

```bash
# Terminal 1
PORT=65001 aip-figma

# Terminal 2
PORT=65010 aip-figma
```

---

## 🔍 **Technical Details**

### **Port Range**

- **Valid ports**: 1024-65535
- **System ports**: 0-1023 (avoided)
- **Common dev ports**: 3000-3010 (avoided)
- **AIP default range**: 65001-65535

### **Process Detection**

Uses `lsof` (macOS/Linux) to identify processes:

```bash
# Check what's using port 65001
lsof -i :65001

# Output:
COMMAND   PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    12345  user   23u  IPv6  0x...      0t0  TCP *:65001 (LISTEN)
```

### **Service Identification**

Matches process command against service name:

```typescript
// Example: Figma service
serviceName: "figma"
command: "node dist/index.js" // Contains "figma" → Same service ✅

// Example: Different service
serviceName: "figma"
command: "python server.py" // Doesn't contain "figma" → Different service ❌
```

### **Conflict Resolution**

```typescript
interface PortAllocationOptions {
  preferredPort: number;        // Port to try first
  serviceName: string;          // Service name for identification
  maxAttempts?: number;         // Max ports to try (default: 100)
  killSameService?: boolean;    // Kill old instances? (default: true)
}

interface PortAllocationResult {
  port: number;                 // Allocated port
  wasInUse: boolean;            // Was port occupied?
  killedProcess?: boolean;      // Did we kill a process?
  previousPid?: number;         // PID of killed process
  attempts: number;             // How many ports tried
}
```

---

## 🛠️ **Manual Port Management**

### **Check Port Usage**

```bash
# Check if port is in use
lsof -i :65001

# Check all AIP services
lsof -i :65001-65010
```

### **Kill Process**

```bash
# Kill by port
lsof -ti:65001 | xargs kill -9

# Kill by name
pkill -f "aip-figma"
```

### **Find Available Port**

```bash
# Check range
for port in {65001..65010}; do
  lsof -i :$port > /dev/null || echo "Port $port is available"
done
```

---

## 🚨 **Troubleshooting**

### **Port Still in Use After Killing**

**Problem**: Port shows as in use even after killing process.

**Solution**: Wait a few seconds for OS to release the port:

```bash
lsof -ti:65001 | xargs kill -9
sleep 2
aip-figma
```

### **Permission Denied**

**Problem**: Can't kill process (permission denied).

**Solution**: Use `sudo` or kill your own processes only:

```bash
# Check process owner
lsof -i :65001

# Kill with sudo if needed
sudo lsof -ti:65001 | xargs kill -9
```

### **No Available Ports**

**Problem**: All ports in range are occupied.

**Solution**: Increase range or use custom port:

```bash
# Use port outside default range
PORT=50000 aip-figma
```

### **Service Won't Start**

**Problem**: Service fails to allocate port.

**Solution**: Check logs and try manual port:

```bash
# Check what's happening
DEBUG=* aip-figma

# Force specific port
PORT=65100 aip-figma
```

---

## 📊 **Benefits**

### **Before (Old Way)**

```bash
❌ Port 3001 always occupied
❌ Manual port management required
❌ Constant EADDRINUSE errors
❌ Need to remember which port is which
❌ Kill processes manually
```

### **After (New Way)**

```bash
✅ Port 65001 almost never occupied
✅ Automatic port management
✅ No EADDRINUSE errors
✅ Service reports its port
✅ Old instances killed automatically
```

---

## 🔮 **Future Enhancements**

- [ ] Port registry file (track all running services)
- [ ] Service discovery (find running services automatically)
- [ ] Health checks (verify service is responding)
- [ ] Graceful shutdown (release port cleanly)
- [ ] Windows support (alternative to `lsof`)

---

## 📚 **Related Documentation**

- [SETUP.md](../SETUP.md) - Service setup guide
- [QUICKSTART.md](../QUICKSTART.md) - Quick start guide
- [README.md](../README.md) - Main documentation

---

**Built with ❤️ by Dennis van Leeuwen**

