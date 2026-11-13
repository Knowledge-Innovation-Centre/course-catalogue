import { API_BASE_URL } from '../config/api';

export interface EdcTemplateRequest {
  courseId: string;
  givenName: string;
  familyName: string;
  deliveryAddress: string;
  instanceId?: string;
}

function filenameFromContentDisposition(header: string | null): string | null {
  if (!header) return null;
  const star = header.match(/filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i);
  if (star) {
    try {
      return decodeURIComponent(star[1].trim().replace(/^"|"$/g, ''));
    } catch {
      /* fall through */
    }
  }
  const plain = header.match(/filename\s*=\s*"?([^";]+)"?/i);
  return plain ? plain[1].trim() : null;
}

// Content-Disposition is not readable cross-origin unless the backend exposes it,
// so build a sensible name ourselves. Instance ids may be URIs/URNs: keep only the last segment.
function fallbackFilename(req: EdcTemplateRequest): string {
  const safe = (s: string) => s.replace(/[^A-Za-z0-9._-]+/g, '_');
  const instanceTail = req.instanceId ? req.instanceId.split(/[/:#]/).filter(Boolean).pop() : undefined;
  return `edc-template-${safe(req.courseId)}${instanceTail ? `-${safe(instanceTail)}` : ''}.json`;
}

// Turn a backend error response (FastAPI-style {"detail": ...}) into a readable message.
async function errorMessage(res: Response): Promise<string> {
  const prefix = `Request failed (${res.status})`;
  const text = await res.text().catch(() => '');
  if (!text) return prefix;
  try {
    const detail = JSON.parse(text)?.detail;
    if (typeof detail === 'string') return `${prefix}: ${detail}`;
    if (detail && typeof detail === 'object') {
      if (Array.isArray(detail)) {
        // validation errors: [{loc, msg, ...}]
        return `${prefix}: ${detail.map((d: any) => d?.msg ?? JSON.stringify(d)).join('; ')}`;
      }
      const parts = [detail.message, ...(Array.isArray(detail.errors) ? detail.errors : [])].filter(Boolean);
      if (parts.length) return `${prefix}: ${parts.join(' — ')}`;
    }
  } catch {
    /* not JSON */
  }
  return `${prefix}: ${text.slice(0, 300)}`;
}

/**
 * Request an EDC credential template from the backend and save it as a file.
 */
export async function downloadEdcTemplate(req: EdcTemplateRequest): Promise<void> {
  const params = new URLSearchParams({
    givenName: req.givenName,
    familyName: req.familyName,
    deliveryAddress: req.deliveryAddress,
  });
  if (req.instanceId) params.set('instance', req.instanceId);

  const url = `${API_BASE_URL}/api/v1/courses/${encodeURIComponent(req.courseId)}/edc-template?${params}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(await errorMessage(res));
  }

  const blob = await res.blob();
  const filename =
    filenameFromContentDisposition(res.headers.get('Content-Disposition')) ?? fallbackFilename(req);

  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
