/**
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (c) 2025 Dennis van Leeuwen (Digital Liquids)
 *
 * Figma Configuration Manager
 * 
 * Manages Figma files, teams, and projects configuration
 */

import * as fs from 'fs';
import * as path from 'path';

export interface FigmaFile {
  id: string;
  name: string;
  fileKey: string;
  description?: string;
  tags?: string[];
}

export interface FigmaTeam {
  id: string;
  name: string;
  teamId: string;
  description?: string;
}

export interface FigmaProject {
  id: string;
  name: string;
  projectId: string;
  description?: string;
}

export interface FigmaConfig {
  files: FigmaFile[];
  teams: FigmaTeam[];
  projects: FigmaProject[];
}

export class FigmaConfigManager {
  private config: FigmaConfig;
  private configPath: string;

  constructor(configPath: string = './figma-files.json') {
    this.configPath = path.resolve(configPath);
    this.config = this.loadConfig();
  }

  private loadConfig(): FigmaConfig {
    try {
      if (!fs.existsSync(this.configPath)) {
        console.warn(`⚠️  Config file not found: ${this.configPath}`);
        console.warn('   Using empty configuration. Create figma-files.json to configure files.');
        return { files: [], teams: [], projects: [] };
      }

      const data = fs.readFileSync(this.configPath, 'utf-8');
      const config = JSON.parse(data) as FigmaConfig;
      
      console.log(`✅ Loaded ${config.files.length} files, ${config.teams.length} teams, ${config.projects.length} projects`);
      
      return config;
    } catch (error) {
      console.error(`❌ Error loading config: ${error}`);
      return { files: [], teams: [], projects: [] };
    }
  }

  // ============================================================================
  // File Methods
  // ============================================================================

  getAllFiles(): FigmaFile[] {
    return this.config.files;
  }

  getFileById(id: string): FigmaFile | undefined {
    return this.config.files.find(f => f.id === id);
  }

  getFileByKey(fileKey: string): FigmaFile | undefined {
    return this.config.files.find(f => f.fileKey === fileKey);
  }

  getFilesByTag(tag: string): FigmaFile[] {
    return this.config.files.filter(f => f.tags?.includes(tag));
  }

  // ============================================================================
  // Team Methods
  // ============================================================================

  getAllTeams(): FigmaTeam[] {
    return this.config.teams;
  }

  getTeamById(id: string): FigmaTeam | undefined {
    return this.config.teams.find(t => t.id === id);
  }

  // ============================================================================
  // Project Methods
  // ============================================================================

  getAllProjects(): FigmaProject[] {
    return this.config.projects;
  }

  getProjectById(id: string): FigmaProject | undefined {
    return this.config.projects.find(p => p.id === id);
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  listFiles(): void {
    console.log('\n📁 Configured Figma Files:\n');
    
    if (this.config.files.length === 0) {
      console.log('   No files configured. Edit figma-files.json to add files.');
      return;
    }

    this.config.files.forEach(file => {
      console.log(`   ${file.id}:`);
      console.log(`     Name: ${file.name}`);
      console.log(`     Key: ${file.fileKey}`);
      if (file.description) {
        console.log(`     Description: ${file.description}`);
      }
      if (file.tags && file.tags.length > 0) {
        console.log(`     Tags: ${file.tags.join(', ')}`);
      }
      console.log('');
    });
  }

  listTeams(): void {
    console.log('\n👥 Configured Figma Teams:\n');
    
    if (this.config.teams.length === 0) {
      console.log('   No teams configured. Edit figma-files.json to add teams.');
      return;
    }

    this.config.teams.forEach(team => {
      console.log(`   ${team.id}:`);
      console.log(`     Name: ${team.name}`);
      console.log(`     Team ID: ${team.teamId}`);
      if (team.description) {
        console.log(`     Description: ${team.description}`);
      }
      console.log('');
    });
  }

  listProjects(): void {
    console.log('\n📂 Configured Figma Projects:\n');
    
    if (this.config.projects.length === 0) {
      console.log('   No projects configured. Edit figma-files.json to add projects.');
      return;
    }

    this.config.projects.forEach(project => {
      console.log(`   ${project.id}:`);
      console.log(`     Name: ${project.name}`);
      console.log(`     Project ID: ${project.projectId}`);
      if (project.description) {
        console.log(`     Description: ${project.description}`);
      }
      console.log('');
    });
  }

  // ============================================================================
  // Validation
  // ============================================================================

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for duplicate IDs
    const fileIds = this.config.files.map(f => f.id);
    const duplicateFileIds = fileIds.filter((id, index) => fileIds.indexOf(id) !== index);
    if (duplicateFileIds.length > 0) {
      errors.push(`Duplicate file IDs: ${duplicateFileIds.join(', ')}`);
    }

    // Check for duplicate file keys
    const fileKeys = this.config.files.map(f => f.fileKey);
    const duplicateFileKeys = fileKeys.filter((key, index) => fileKeys.indexOf(key) !== index);
    if (duplicateFileKeys.length > 0) {
      errors.push(`Duplicate file keys: ${duplicateFileKeys.join(', ')}`);
    }

    // Check for empty file keys
    const emptyFileKeys = this.config.files.filter(f => !f.fileKey || f.fileKey === 'YOUR_FILE_KEY_HERE');
    if (emptyFileKeys.length > 0) {
      errors.push(`Files with placeholder keys: ${emptyFileKeys.map(f => f.id).join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

