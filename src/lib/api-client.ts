/**
 * API client for the remote PPhat API (Hono + Cloudflare Workers).
 * Base URL: https://api.pphatdev.workers.dev
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || 'https://api.pphatdev.workers.dev';

interface ApiRequestOptions {
    method?: string;
    body?: unknown;
    token?: string;
    params?: Record<string, string | number | boolean | undefined>;
    cache?: RequestCache;
    revalidate?: number;
}

interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
    };
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`/v1/api${path}`, API_BASE_URL);
    if (params) {
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined) {
                url.searchParams.set(key, String(value));
            }
        }
    }
    return url.toString();
}

async function request<T = unknown>(path: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    const { method = 'GET', body, token, params, cache, revalidate } = options;

    const headers: Record<string, string> = {};
    if (body) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const fetchOptions: RequestInit & { next?: { revalidate?: number } } = {
        method,
        headers,
    };

    if (body) fetchOptions.body = JSON.stringify(body);
    if (cache) fetchOptions.cache = cache;
    if (revalidate !== undefined) fetchOptions.next = { revalidate };

    const url = buildUrl(path, params);
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: response.statusText }));
        const error = new Error((errorBody as { error?: string }).error || `API error: ${response.status}`);
        (error as ApiError).status = response.status;
        (error as ApiError).body = errorBody;
        throw error;
    }

    return response.json();
}

interface ApiError extends Error {
    status: number;
    body: unknown;
}

// ── Auth ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role?: string;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
    status: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface AuthTokenResponse {
    token: string;
    user?: AuthUser;
}

export async function apiLogin(payload: LoginPayload): Promise<ApiResponse<AuthTokenResponse>> {
    return request<AuthTokenResponse>('/auth/login', { method: 'POST', body: payload });
}

export async function apiRegister(payload: RegisterPayload): Promise<ApiResponse<AuthUser>> {
    return request<AuthUser>('/auth/register', { method: 'POST', body: payload });
}

export async function apiGetMe(token: string): Promise<ApiResponse<AuthUser>> {
    return request<AuthUser>('/auth/me', { token });
}

export async function apiVerifyToken(token: string): Promise<ApiResponse<AuthUser>> {
    return request<AuthUser>('/auth/verify', { token });
}

export async function apiRefreshToken(token: string): Promise<ApiResponse<AuthTokenResponse>> {
    return request<AuthTokenResponse>('/auth/refresh', { method: 'POST', token });
}

export async function apiLogout(token: string): Promise<ApiResponse<void>> {
    return request<void>('/auth/logout', { method: 'POST', token });
}

// ── Users ───────────────────────────────────────────────────────────────────

export interface ApiUser {
    id: number;
    name: string;
    email: string;
    role: string;
    status: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export async function apiListUsers(token: string, params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<ApiUser[]>> {
    return request<ApiUser[]>('/users', { token, params: params as Record<string, string | number | undefined> });
}

export async function apiGetUser(token: string, id: number | string): Promise<ApiResponse<ApiUser>> {
    return request<ApiUser>(`/users/${id}`, { token });
}

export async function apiCreateUser(token: string, payload: { name: string; email: string; password: string; role?: string }): Promise<ApiResponse<ApiUser>> {
    return request<ApiUser>('/users', { method: 'POST', token, body: payload });
}

export async function apiUpdateUser(token: string, id: number | string, payload: Partial<{ name: string; email: string; password: string; role: string }>): Promise<ApiResponse<ApiUser>> {
    return request<ApiUser>(`/users/${id}`, { method: 'PATCH', token, body: payload });
}

export async function apiDeleteUser(token: string, id: number | string): Promise<ApiResponse<void>> {
    return request<void>(`/users/${id}`, { method: 'DELETE', token });
}

// ── Categories ──────────────────────────────────────────────────────────────

export interface ApiCategory {
    id: number;
    name: string;
    slug: string;
    description: string;
    parent_id: number | null;
    image: string;
    is_active: boolean;
    status: boolean;
    created_at: string;
    updated_at: string;
}

export async function apiListCategories(params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<ApiCategory[]>> {
    return request<ApiCategory[]>('/categories', { params: params as Record<string, string | number | undefined> });
}

export async function apiGetCategory(id: number | string): Promise<ApiResponse<ApiCategory>> {
    return request<ApiCategory>(`/categories/${id}`);
}

export async function apiCreateCategory(token: string, payload: Partial<ApiCategory>): Promise<ApiResponse<ApiCategory>> {
    return request<ApiCategory>('/categories', { method: 'POST', token, body: payload });
}

export async function apiUpdateCategory(token: string, id: number | string, payload: Partial<ApiCategory>): Promise<ApiResponse<ApiCategory>> {
    return request<ApiCategory>(`/categories/${id}`, { method: 'PATCH', token, body: payload });
}

export async function apiDeleteCategory(token: string, id: number | string): Promise<ApiResponse<void>> {
    return request<void>(`/categories/${id}`, { method: 'DELETE', token });
}

// ── Articles (Blog Posts) ───────────────────────────────────────────────────

export interface ApiArticle {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author_id: number;
    category_id: number;
    published: boolean;
    published_date: string;
    featured_image: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    is_featured: boolean;
    view_count: number;
    tags: string;
    status: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export async function apiListArticles(params?: { page?: number; limit?: number; search?: string; sort?: string }): Promise<ApiResponse<ApiArticle[]>> {
    return request<ApiArticle[]>('/articles', { params: params as Record<string, string | number | undefined>, revalidate: 60 });
}

export async function apiGetArticle(slugOrId: string): Promise<ApiResponse<ApiArticle>> {
    return request<ApiArticle>(`/articles/${encodeURIComponent(slugOrId)}`, { revalidate: 60 });
}

export async function apiCreateArticle(token: string, payload: Partial<ApiArticle>): Promise<ApiResponse<ApiArticle>> {
    return request<ApiArticle>('/articles', { method: 'POST', token, body: payload });
}

export async function apiUpdateArticle(token: string, id: number | string, payload: Partial<ApiArticle>): Promise<ApiResponse<ApiArticle>> {
    return request<ApiArticle>(`/articles/${id}`, { method: 'PATCH', token, body: payload });
}

export async function apiDeleteArticle(token: string, id: number | string): Promise<ApiResponse<void>> {
    return request<void>(`/articles/${id}`, { method: 'DELETE', token });
}

// ── Projects ────────────────────────────────────────────────────────────────

export interface ApiProject {
    id: number;
    name: string;
    description: string;
    image: string;
    published: boolean;
    tags: string[];
    source: string[];
    authors: string[];
    languages: string[];
    status: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export async function apiListProjects(params?: { page?: number; limit?: number; search?: string; sort?: string }): Promise<ApiResponse<ApiProject[]>> {
    return request<ApiProject[]>('/projects', { params: params as Record<string, string | number | undefined>, revalidate: 60 });
}

export async function apiGetProject(id: number | string): Promise<ApiResponse<ApiProject>> {
    return request<ApiProject>(`/projects/${id}`, { revalidate: 60 });
}

export async function apiCreateProject(token: string, payload: Partial<ApiProject>): Promise<ApiResponse<ApiProject>> {
    return request<ApiProject>('/projects', { method: 'POST', token, body: payload });
}

export async function apiUpdateProject(token: string, id: number | string, payload: Partial<ApiProject>): Promise<ApiResponse<ApiProject>> {
    return request<ApiProject>(`/projects/${id}`, { method: 'PATCH', token, body: payload });
}

export async function apiDeleteProject(token: string, id: number | string): Promise<ApiResponse<void>> {
    return request<void>(`/projects/${id}`, { method: 'DELETE', token });
}

// ── Sessions ────────────────────────────────────────────────────────────────

export interface ApiSession {
    id: number;
    user_id: number;
    token: string;
    expires_date: string;
    created_at: string;
    updated_at: string;
}

export async function apiListSessions(token: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<ApiSession[]>> {
    return request<ApiSession[]>('/sessions', { token, params: params as Record<string, string | number | undefined> });
}
