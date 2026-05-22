export interface DiagnosisResult {
  disease_name: string;
  confidence: string;
  severity: string;
  description: string;
  symptoms: string[];
  treatment: {
    organic: string[];
    chemical: string[];
  };
  prevention: string[];
  confidenceValue?: number | null;
  source?: string | null;
  fallback?: boolean;
  topPredictions?: Array<{ disease: string; probability: number }>;
  note?: string | null;
}

export interface BackendUser {
  id: string;
  email: string;
  name: string;
  picture: string | null;
  role: string;
  provider: string;
  scanCount: number;
  createdAt: string | null;
}

export interface BackendHealthResponse {
  ok: boolean;
  hasGeminiKey: boolean;
  dbReady: boolean;
  authEnabled: boolean;
  ml: unknown;
}

export interface ChatResponse {
  ok: boolean;
  model?: string;
  fallback?: boolean;
  warning?: string;
  reply?: string;
  error?: string;
}

export interface AuthResponse {
  ok: boolean;
  token?: string;
  user?: BackendUser;
  error?: string;
}

const AUTH_TOKEN_KEY = "cropsense_auth_token";

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || "/api");

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

function normalizeConfidence(confidence: unknown) {
  if (typeof confidence === "string") {
    const trimmed = confidence.trim();
    if (/^(high|medium|low)$/i.test(trimmed)) {
      return trimmed[0].toUpperCase() + trimmed.slice(1).toLowerCase();
    }

    const parsed = Number.parseFloat(trimmed);
    if (!Number.isNaN(parsed)) {
      return normalizeConfidence(parsed);
    }

    return trimmed || "Unknown";
  }

  if (typeof confidence === "number" && Number.isFinite(confidence)) {
    if (confidence >= 0.8) return "High";
    if (confidence >= 0.5) return "Medium";
    return "Low";
  }

  return "Unknown";
}

function normalizeSeverity(severity: unknown, confidence: string) {
  if (typeof severity === "string" && severity.trim()) {
    const normalized = severity.trim();
    if (/^(high|medium|low)$/i.test(normalized)) {
      return normalized[0].toUpperCase() + normalized.slice(1).toLowerCase();
    }
    return normalized;
  }

  if (confidence === "High") return "High";
  if (confidence === "Medium") return "Medium";
  return "Low";
}

function toStringList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item)).filter(Boolean);
}

export function normalizeDiagnosisResult(payload: Record<string, unknown>): DiagnosisResult {
  const diseaseName = String(
    payload.disease_name ?? payload.disease ?? payload.plant_name ?? "Unknown disease"
  ).trim() || "Unknown disease";
  const confidence = normalizeConfidence(payload.confidence);
  const treatment = payload.treatment && typeof payload.treatment === "object"
    ? (payload.treatment as { organic?: unknown; chemical?: unknown })
    : {};

  return {
    disease_name: diseaseName,
    confidence,
    severity: normalizeSeverity(payload.severity, confidence),
    description: String(payload.description ?? `Analysis completed for ${diseaseName}.`),
    symptoms: toStringList(payload.symptoms),
    treatment: {
      organic: toStringList(treatment.organic),
      chemical: toStringList(treatment.chemical),
    },
    prevention: toStringList(payload.prevention),
    confidenceValue:
      typeof payload.confidenceValue === "number"
        ? payload.confidenceValue
        : typeof payload.confidence === "number"
          ? payload.confidence
          : Number.isNaN(Number.parseFloat(String(payload.confidence ?? "")))
            ? null
            : Number.parseFloat(String(payload.confidence)),
    source: typeof payload.source === "string" ? payload.source : null,
    fallback: Boolean(payload.fallback),
    topPredictions: Array.isArray(payload.topPredictions)
      ? (payload.topPredictions as Array<{ disease: string; probability: number }>)
      : [],
    note: typeof payload.note === "string" ? payload.note : null,
  };
}

async function apiRequest<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : await response.text();

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error?: unknown }).error || "Request failed")
        : typeof payload === "string" && payload.trim()
          ? payload
          : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return payload as T;
}

export async function analyzeCropImage(imageBase64: string) {
  const response = await apiRequest<Record<string, unknown>>("/analyze_image", {
    method: "POST",
    body: JSON.stringify({ imageBase64 }),
  });

  return normalizeDiagnosisResult(response);
}

export async function getBackendHealth() {
  return apiRequest<BackendHealthResponse>("/health");
}

export async function sendChatMessage(message: string, language?: string, context?: string) {
  return apiRequest<ChatResponse>("/chat", {
    method: "POST",
    body: JSON.stringify({ message, language, context }),
  });
}

export async function signUp(name: string, email: string, password: string) {
  const response = await apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  if (response.token) {
    setAuthToken(response.token);
  }

  return response;
}

export async function signIn(email: string, password: string) {
  const response = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (response.token) {
    setAuthToken(response.token);
  }

  return response;
}

export async function getCurrentUser() {
  return apiRequest<{ ok: boolean; user?: BackendUser }>("/auth/me");
}

export async function signOut() {
  const response = await apiRequest<{ ok: boolean; message?: string }>("/auth/logout", {
    method: "POST",
  });

  clearAuthToken();
  return response;
}