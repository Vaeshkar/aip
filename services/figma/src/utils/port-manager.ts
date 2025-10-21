/**
 * Port Manager
 * Smart port allocation with conflict resolution
 * 
 * Features:
 * - Starts from high port numbers (65001+) to avoid common conflicts
 * - Detects if port is in use
 * - Identifies which process is using the port
 * - Can kill same-service processes and take over
 * - Automatically finds next available port if needed
 */

import { exec } from "child_process";
import { promisify } from "util";
import * as net from "net";

const execAsync = promisify(exec);

export interface PortInfo {
  port: number;
  inUse: boolean;
  pid?: number;
  processName?: string;
  command?: string;
}

export interface PortAllocationOptions {
  preferredPort: number;
  serviceName: string;
  maxAttempts?: number;
  killSameService?: boolean;
}

export interface PortAllocationResult {
  port: number;
  wasInUse: boolean;
  killedProcess?: boolean;
  previousPid?: number;
  attempts: number;
}

/**
 * Check if a port is in use
 */
export async function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    server.once("listening", () => {
      server.close();
      resolve(false);
    });
    
    server.listen(port);
  });
}

/**
 * Get information about which process is using a port
 */
export async function getPortInfo(port: number): Promise<PortInfo> {
  const inUse = await isPortInUse(port);
  
  if (!inUse) {
    return { port, inUse: false };
  }
  
  try {
    // Use lsof to find process using the port
    const { stdout } = await execAsync(`lsof -i :${port} -t -sTCP:LISTEN`);
    const pid = parseInt(stdout.trim(), 10);
    
    if (isNaN(pid)) {
      return { port, inUse: true };
    }
    
    // Get process details
    try {
      const { stdout: psOutput } = await execAsync(`ps -p ${pid} -o comm=,args=`);
      const [processName, ...commandParts] = psOutput.trim().split(/\s+/);
      const command = commandParts.join(" ");
      
      return {
        port,
        inUse: true,
        pid,
        processName,
        command,
      };
    } catch {
      return { port, inUse: true, pid };
    }
  } catch {
    // lsof failed, port might be in use but we can't get details
    return { port, inUse: true };
  }
}

/**
 * Check if a process belongs to the same service
 */
export function isSameService(portInfo: PortInfo, serviceName: string): boolean {
  if (!portInfo.command && !portInfo.processName) {
    return false;
  }
  
  const searchString = (portInfo.command || portInfo.processName || "").toLowerCase();
  const serviceNameLower = serviceName.toLowerCase();
  
  // Check if the command contains the service name
  return searchString.includes(serviceNameLower);
}

/**
 * Kill a process by PID
 */
export async function killProcess(pid: number): Promise<boolean> {
  try {
    await execAsync(`kill -9 ${pid}`);
    // Wait a bit for the port to be released
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  } catch {
    return false;
  }
}

/**
 * Find next available port starting from a given port
 */
export async function findNextAvailablePort(
  startPort: number,
  maxAttempts: number = 100
): Promise<number> {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    if (port > 65535) {
      throw new Error("No available ports found (exceeded max port 65535)");
    }
    
    const inUse = await isPortInUse(port);
    if (!inUse) {
      return port;
    }
  }
  
  throw new Error(`No available ports found after ${maxAttempts} attempts`);
}

/**
 * Allocate a port with smart conflict resolution
 * 
 * Strategy:
 * 1. Check if preferred port is available → Use it
 * 2. If in use by same service → Kill it and take over (if killSameService=true)
 * 3. If in use by different service → Find next available port
 * 4. Report what happened
 */
export async function allocatePort(
  options: PortAllocationOptions
): Promise<PortAllocationResult> {
  const {
    preferredPort,
    serviceName,
    maxAttempts = 100,
    killSameService = true,
  } = options;
  
  let attempts = 0;
  let currentPort = preferredPort;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    const portInfo = await getPortInfo(currentPort);
    
    // Port is free - use it!
    if (!portInfo.inUse) {
      return {
        port: currentPort,
        wasInUse: false,
        attempts,
      };
    }
    
    // Port is in use - check if it's our service
    if (portInfo.pid && isSameService(portInfo, serviceName)) {
      if (killSameService) {
        console.log(
          `[Port Manager] Port ${currentPort} is in use by same service (PID ${portInfo.pid})`
        );
        console.log(`[Port Manager] Killing old process and taking over...`);
        
        const killed = await killProcess(portInfo.pid);
        
        if (killed) {
          // Verify port is now free
          const stillInUse = await isPortInUse(currentPort);
          if (!stillInUse) {
            return {
              port: currentPort,
              wasInUse: true,
              killedProcess: true,
              previousPid: portInfo.pid,
              attempts,
            };
          }
        }
      }
    }
    
    // Port is in use by different service or we couldn't kill it
    // Try next port
    console.log(
      `[Port Manager] Port ${currentPort} is in use${
        portInfo.processName ? ` by ${portInfo.processName}` : ""
      }${portInfo.pid ? ` (PID ${portInfo.pid})` : ""}`
    );
    console.log(`[Port Manager] Trying next port...`);
    
    currentPort++;
    
    if (currentPort > 65535) {
      throw new Error("No available ports found (exceeded max port 65535)");
    }
  }
  
  throw new Error(`Failed to allocate port after ${maxAttempts} attempts`);
}

/**
 * Get a recommended starting port for a service
 * Uses high port numbers to avoid common conflicts
 */
export function getRecommendedPort(serviceName: string): number {
  // Start from 65001 and use a hash of service name for offset
  const basePort = 65001;
  const hash = serviceName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const offset = hash % 100; // Max offset of 100
  
  return basePort + offset;
}

/**
 * Format port allocation result for logging
 */
export function formatPortAllocationResult(result: PortAllocationResult): string {
  const lines: string[] = [];
  
  if (result.wasInUse) {
    if (result.killedProcess) {
      lines.push(
        `✅ Port ${result.port} allocated (killed previous instance PID ${result.previousPid})`
      );
    } else {
      lines.push(`✅ Port ${result.port} allocated (moved from preferred port)`);
    }
  } else {
    lines.push(`✅ Port ${result.port} allocated (preferred port was available)`);
  }
  
  if (result.attempts > 1) {
    lines.push(`   (Found after ${result.attempts} attempts)`);
  }
  
  return lines.join("\n");
}

