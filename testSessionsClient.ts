export interface DeviceSession {
  deviceKey: string;
  tree: any;
}

export class TestSessionsClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
    };
  }

  async getAllSessions(): Promise<DeviceSession[]> {
    const res = await fetch(`${this.baseUrl}/test-sessions`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch sessions');
    return res.json();
  }

  async postSessionTree(deviceKey: string, tree: any): Promise<DeviceSession> {
    const res = await fetch(`${this.baseUrl}/test-sessions/${deviceKey}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(tree),
    });
    if (!res.ok) throw new Error('Failed to post session tree');
    return res.json();
  }

  async getSessionTree(deviceKey: string): Promise<any | null> {
    const res = await fetch(`${this.baseUrl}/test-sessions/${deviceKey}`, {
      headers: this.getHeaders(),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch session tree');
    return res.json();
  }
} 