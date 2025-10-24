import { API_BASE } from "./base";

export type UploadResponse = {
  id: string;
  filename: string;
  size: number;
  path?: string; 
  url?: string;  
};

export async function uploadFile(file: File): Promise<UploadResponse> {
  const fd = new FormData();
  fd.append("file", file);

  const r = await fetch(`${API_BASE}/api/files`, {
    method: "POST",
    body: fd,
  });

  if (!r.ok) {
    throw new Error(`${r.status} ${r.statusText}: ${await r.text().catch(() => "")}`);
  }
  return (await r.json()) as UploadResponse;
}

export async function uploadFormData(fd: FormData): Promise<UploadResponse> {
  const r = await fetch(`${API_BASE}/api/files`, {
    method: "POST",
    body: fd,
  });
  if (!r.ok) {
    throw new Error(`${r.status} ${r.statusText}: ${await r.text().catch(() => "")}`);
  }
  return (await r.json()) as UploadResponse;
}


export function buildUploadedUrl(id: string, ext?: string) {
  return `${API_BASE}/uploads/${id}${ext ?? ""}`;
}