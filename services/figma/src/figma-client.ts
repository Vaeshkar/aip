/**
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (c) 2025 Dennis van Leeuwen (Digital Liquids)
 *
 * Figma API Client
 *
 * Wrapper around the Figma REST API
 */

import axios, { AxiosInstance } from "axios";

export interface FigmaClientConfig {
  apiKey: string;
  baseURL?: string;
}

export class FigmaClient {
  private client: AxiosInstance;

  constructor(config: FigmaClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL || "https://api.figma.com/v1",
      headers: {
        "X-Figma-Token": config.apiKey,
      },
    });
  }

  // ============================================================================
  // File Methods
  // ============================================================================

  async getFile(
    fileKey: string,
    options?: {
      version?: string;
      ids?: string[];
      depth?: number;
      geometry?: string;
      plugin_data?: string;
      branch_data?: boolean;
    }
  ): Promise<any> {
    const response = await this.client.get(`/files/${fileKey}`, {
      params: options,
    });
    return response.data;
  }

  async getFileNodes(
    fileKey: string,
    ids: string[],
    options?: {
      version?: string;
      depth?: number;
      geometry?: string;
      plugin_data?: string;
    }
  ): Promise<any> {
    const response = await this.client.get(`/files/${fileKey}/nodes`, {
      params: {
        ids: ids.join(","),
        ...options,
      },
    });
    return response.data;
  }

  async getImages(
    fileKey: string,
    options: {
      ids: string[];
      scale?: number;
      format?: "jpg" | "png" | "svg" | "pdf";
      svg_include_id?: boolean;
      svg_simplify_stroke?: boolean;
      use_absolute_bounds?: boolean;
      version?: string;
    }
  ): Promise<any> {
    const response = await this.client.get(`/images/${fileKey}`, {
      params: {
        ids: options.ids.join(","),
        scale: options.scale,
        format: options.format,
        svg_include_id: options.svg_include_id,
        svg_simplify_stroke: options.svg_simplify_stroke,
        use_absolute_bounds: options.use_absolute_bounds,
        version: options.version,
      },
    });
    return response.data;
  }

  async getImageFills(fileKey: string): Promise<any> {
    const response = await this.client.get(`/files/${fileKey}/images`);
    return response.data;
  }

  async getFileVersions(fileKey: string): Promise<any> {
    const response = await this.client.get(`/files/${fileKey}/versions`);
    return response.data;
  }

  // ============================================================================
  // Comment Methods
  // ============================================================================

  async getComments(
    fileKey: string,
    options?: {
      as_md?: boolean;
    }
  ): Promise<any> {
    const response = await this.client.get(`/files/${fileKey}/comments`, {
      params: options,
    });
    return response.data;
  }

  async postComment(
    fileKey: string,
    message: string,
    options?: {
      client_meta?: any;
      comment_id?: string;
    }
  ): Promise<any> {
    const response = await this.client.post(`/files/${fileKey}/comments`, {
      message,
      ...options,
    });
    return response.data;
  }

  async deleteComment(fileKey: string, commentId: string): Promise<any> {
    const response = await this.client.delete(
      `/files/${fileKey}/comments/${commentId}`
    );
    return response.data;
  }

  // ============================================================================
  // User Methods
  // ============================================================================

  async getMe(): Promise<any> {
    const response = await this.client.get("/me");
    return response.data;
  }

  // ============================================================================
  // Team & Project Methods
  // ============================================================================

  async getTeamProjects(teamId: string): Promise<any> {
    const response = await this.client.get(`/teams/${teamId}/projects`);
    return response.data;
  }

  async getProjectFiles(
    projectId: string,
    options?: {
      branch_data?: boolean;
    }
  ): Promise<any> {
    const response = await this.client.get(`/projects/${projectId}/files`, {
      params: options,
    });
    return response.data;
  }

  // ============================================================================
  // Component Methods
  // ============================================================================

  async getTeamComponents(
    teamId: string,
    options?: {
      page_size?: number;
      after?: string;
      before?: string;
    }
  ): Promise<any> {
    const response = await this.client.get(`/teams/${teamId}/components`, {
      params: options,
    });
    return response.data;
  }

  async getFileComponents(fileKey: string): Promise<any> {
    const response = await this.client.get(`/files/${fileKey}/components`);
    return response.data;
  }

  async getComponent(componentKey: string): Promise<any> {
    const response = await this.client.get(`/components/${componentKey}`);
    return response.data;
  }

  async getTeamComponentSets(
    teamId: string,
    options?: {
      page_size?: number;
      after?: string;
      before?: string;
    }
  ): Promise<any> {
    const response = await this.client.get(`/teams/${teamId}/component_sets`, {
      params: options,
    });
    return response.data;
  }

  async getFileComponentSets(fileKey: string): Promise<any> {
    const response = await this.client.get(`/files/${fileKey}/component_sets`);
    return response.data;
  }

  async getComponentSet(componentSetKey: string): Promise<any> {
    const response = await this.client.get(
      `/component_sets/${componentSetKey}`
    );
    return response.data;
  }

  // ============================================================================
  // Style Methods
  // ============================================================================

  async getTeamStyles(
    teamId: string,
    options?: {
      page_size?: number;
      after?: string;
      before?: string;
    }
  ): Promise<any> {
    const response = await this.client.get(`/teams/${teamId}/styles`, {
      params: options,
    });
    return response.data;
  }

  async getFileStyles(fileKey: string): Promise<any> {
    const response = await this.client.get(`/files/${fileKey}/styles`);
    return response.data;
  }

  async getStyle(styleKey: string): Promise<any> {
    const response = await this.client.get(`/styles/${styleKey}`);
    return response.data;
  }

  // ============================================================================
  // Webhook Methods (V2 API)
  // ============================================================================

  async createWebhook(data: {
    event_type: string;
    team_id: string;
    endpoint: string;
    passcode: string;
    description?: string;
  }): Promise<any> {
    const response = await this.client.post("/webhooks", data, {
      baseURL: "https://api.figma.com/v2",
    });
    return response.data;
  }

  async getWebhook(webhookId: string): Promise<any> {
    const response = await this.client.get(`/webhooks/${webhookId}`, {
      baseURL: "https://api.figma.com/v2",
    });
    return response.data;
  }

  async updateWebhook(
    webhookId: string,
    data: {
      event_type?: string;
      endpoint?: string;
      passcode?: string;
      status?: string;
      description?: string;
    }
  ): Promise<any> {
    const response = await this.client.put(`/webhooks/${webhookId}`, data, {
      baseURL: "https://api.figma.com/v2",
    });
    return response.data;
  }

  async deleteWebhook(webhookId: string): Promise<any> {
    const response = await this.client.delete(`/webhooks/${webhookId}`, {
      baseURL: "https://api.figma.com/v2",
    });
    return response.data;
  }

  async getTeamWebhooks(teamId: string): Promise<any> {
    const response = await this.client.get(`/teams/${teamId}/webhooks`, {
      baseURL: "https://api.figma.com/v2",
    });
    return response.data;
  }
}
