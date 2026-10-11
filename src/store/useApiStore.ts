'use client';

import { create } from 'zustand';
import { RequestConfig, ResponseData, HistoryItem, EnvironmentVariable, KeyValuePair, HttpMethod } from '@/types/api';

interface ApiStore {
  activeRequest: RequestConfig;
  response: ResponseData | null;
  isLoading: boolean;
  history: HistoryItem[];
  environments: EnvironmentVariable[];
  activeTab: 'params' | 'headers' | 'auth' | 'body';
  responseTab: 'pretty' | 'raw' | 'headers';
  showCodeModal: boolean;
  showEnvModal: boolean;

  // Actions
  setActiveRequest: (req: Partial<RequestConfig>) => void;
  setMethod: (method: HttpMethod) => void;
  setUrl: (url: string) => void;
  setBody: (body: string) => void;
  setActiveTab: (tab: 'params' | 'headers' | 'auth' | 'body') => void;
  setResponseTab: (tab: 'pretty' | 'raw' | 'headers') => void;
  setShowCodeModal: (show: boolean) => void;
  setShowEnvModal: (show: boolean) => void;

  // Params & Headers
  addParam: () => void;
  updateParam: (id: string, updates: Partial<KeyValuePair>) => void;
  removeParam: (id: string) => void;

  addHeader: () => void;
  updateHeader: (id: string, updates: Partial<KeyValuePair>) => void;
  removeHeader: (id: string) => void;

  // Environments
  addEnvVar: () => void;
  updateEnvVar: (id: string, updates: Partial<EnvironmentVariable>) => void;
  removeEnvVar: (id: string) => void;

  // Execution
  sendRequest: () => Promise<void>;
  loadPreset: (presetName: string) => void;
  loadHistoryItem: (item: HistoryItem) => void;
  clearHistory: () => void;
}

const defaultRequest: RequestConfig = {
  id: 'req_default',
  name: 'Get Users List',
  method: 'GET',
  url: 'https://jsonplaceholder.typicode.com/users',
  params: [
    { id: '1', key: '_limit', value: '5', enabled: true },
  ],
  headers: [
    { id: '1', key: 'Accept', value: 'application/json', enabled: true },
  ],
  bodyType: 'json',
  body: '{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}',
  authType: 'none',
  bearerToken: '',
  basicAuth: { username: '', password: '' },
};

export const useApiStore = create<ApiStore>((set, get) => ({
  activeRequest: defaultRequest,
  response: null,
  isLoading: false,
  history: [],
  environments: [
    { id: '1', key: 'baseUrl', value: 'https://jsonplaceholder.typicode.com', enabled: true },
    { id: '2', key: 'mockApi', value: 'https://dummyjson.com', enabled: true },
  ],
  activeTab: 'params',
  responseTab: 'pretty',
  showCodeModal: false,
  showEnvModal: false,

  setActiveRequest: (updates) => {
    set((state) => ({
      activeRequest: { ...state.activeRequest, ...updates },
    }));
  },

  setMethod: (method) => {
    set((state) => ({
      activeRequest: { ...state.activeRequest, method },
    }));
  },

  setUrl: (url) => {
    set((state) => ({
      activeRequest: { ...state.activeRequest, url },
    }));
  },

  setBody: (body) => {
    set((state) => ({
      activeRequest: { ...state.activeRequest, body },
    }));
  },

  setActiveTab: (activeTab) => set({ activeTab }),
  setResponseTab: (responseTab) => set({ responseTab }),
  setShowCodeModal: (showCodeModal) => set({ showCodeModal }),
  setShowEnvModal: (showEnvModal) => set({ showEnvModal }),

  addParam: () => {
    set((state) => ({
      activeRequest: {
        ...state.activeRequest,
        params: [
          ...state.activeRequest.params,
          { id: Math.random().toString(), key: '', value: '', enabled: true },
        ],
      },
    }));
  },

  updateParam: (id, updates) => {
    set((state) => ({
      activeRequest: {
        ...state.activeRequest,
        params: state.activeRequest.params.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      },
    }));
  },

  removeParam: (id) => {
    set((state) => ({
      activeRequest: {
        ...state.activeRequest,
        params: state.activeRequest.params.filter((p) => p.id !== id),
      },
    }));
  },

  addHeader: () => {
    set((state) => ({
      activeRequest: {
        ...state.activeRequest,
        headers: [
          ...state.activeRequest.headers,
          { id: Math.random().toString(), key: '', value: '', enabled: true },
        ],
      },
    }));
  },

  updateHeader: (id, updates) => {
    set((state) => ({
      activeRequest: {
        ...state.activeRequest,
        headers: state.activeRequest.headers.map((h) => (h.id === id ? { ...h, ...updates } : h)),
      },
    }));
  },

  removeHeader: (id) => {
    set((state) => ({
      activeRequest: {
        ...state.activeRequest,
        headers: state.activeRequest.headers.filter((h) => h.id !== id),
      },
    }));
  },

  addEnvVar: () => {
    set((state) => ({
      environments: [
        ...state.environments,
        { id: Math.random().toString(), key: '', value: '', enabled: true },
      ],
    }));
  },

  updateEnvVar: (id, updates) => {
    set((state) => ({
      environments: state.environments.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  },

  removeEnvVar: (id) => {
    set((state) => ({
      environments: state.environments.filter((e) => e.id !== id),
    }));
  },

  sendRequest: async () => {
    const { activeRequest, environments } = get();
    set({ isLoading: true });

    // 1. Resolve Environment Variables {{key}}
    let resolvedUrl = activeRequest.url;
    environments.forEach((env) => {
      if (env.enabled && env.key) {
        resolvedUrl = resolvedUrl.replaceAll(`{{${env.key}}}`, env.value);
      }
    });

    // 2. Build Query Params
    const urlObj = new URL(resolvedUrl.startsWith('http') ? resolvedUrl : `https://${resolvedUrl}`);
    activeRequest.params.forEach((p) => {
      if (p.enabled && p.key) {
        urlObj.searchParams.set(p.key, p.value);
      }
    });

    // 3. Build Headers
    const headersMap: Record<string, string> = {};
    activeRequest.headers.forEach((h) => {
      if (h.enabled && h.key) {
        headersMap[h.key] = h.value;
      }
    });

    // Auth headers
    if (activeRequest.authType === 'bearer' && activeRequest.bearerToken) {
      headersMap['Authorization'] = `Bearer ${activeRequest.bearerToken}`;
    } else if (activeRequest.authType === 'basic') {
      const creds = btoa(`${activeRequest.basicAuth.username}:${activeRequest.basicAuth.password}`);
      headersMap['Authorization'] = `Basic ${creds}`;
    }

    if (activeRequest.method !== 'GET' && activeRequest.method !== 'HEAD' && activeRequest.bodyType === 'json') {
      headersMap['Content-Type'] = 'application/json';
    }

    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlObj.toString(),
          method: activeRequest.method,
          headers: headersMap,
          body: activeRequest.method !== 'GET' ? activeRequest.body : undefined,
        }),
      });

      const data: ResponseData = await res.json();
      set({ response: data, isLoading: false });

      // Save to history
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        request: { ...activeRequest, url: urlObj.toString() },
        response: data,
      };

      set((state) => ({
        history: [newHistoryItem, ...state.history].slice(0, 30),
      }));
    } catch (err: any) {
      set({
        response: {
          status: 500,
          statusText: 'Internal Client Error',
          timeMs: 0,
          sizeBytes: 0,
          headers: {},
          data: { error: err.message || 'Unknown network error' },
          timestamp: new Date().toISOString(),
        },
        isLoading: false,
      });
    }
  },

  loadPreset: (presetName) => {
    switch (presetName) {
      case 'users':
        set({
          activeRequest: {
            id: 'preset_users',
            name: 'Get Users List',
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/users',
            params: [{ id: '1', key: '_limit', value: '5', enabled: true }],
            headers: [{ id: '1', key: 'Accept', value: 'application/json', enabled: true }],
            bodyType: 'none',
            body: '',
            authType: 'none',
            bearerToken: '',
            basicAuth: { username: '', password: '' },
          },
        });
        break;
      case 'posts':
        set({
          activeRequest: {
            id: 'preset_posts',
            name: 'Create New Post',
            method: 'POST',
            url: 'https://jsonplaceholder.typicode.com/posts',
            params: [],
            headers: [{ id: '1', key: 'Content-Type', value: 'application/json', enabled: true }],
            bodyType: 'json',
            body: JSON.stringify({ title: 'Modern Frontend Architecture', body: 'Built with Next.js 15 & TypeScript', userId: 1 }, null, 2),
            authType: 'none',
            bearerToken: '',
            basicAuth: { username: '', password: '' },
          },
        });
        break;
      case 'products':
        set({
          activeRequest: {
            id: 'preset_products',
            name: 'Fetch Products Catalog',
            method: 'GET',
            url: 'https://dummyjson.com/products',
            params: [
              { id: '1', key: 'limit', value: '8', enabled: true },
              { id: '2', key: 'select', value: 'title,price,category,rating', enabled: true },
            ],
            headers: [],
            bodyType: 'none',
            body: '',
            authType: 'none',
            bearerToken: '',
            basicAuth: { username: '', password: '' },
          },
        });
        break;
    }
  },

  loadHistoryItem: (item) => {
    set({
      activeRequest: item.request,
      response: item.response || null,
    });
  },

  clearHistory: () => set({ history: [] }),
}));
