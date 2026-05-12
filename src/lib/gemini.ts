export async function generateContent(options: { model?: string, contents: any, config?: { responseMimeType?: string, responseSchema?: any } }) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: options.model,
      contents: options.contents,
      responseMimeType: options.config?.responseMimeType,
      responseSchema: options.config?.responseSchema,
    })
  });
  
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}: ${text}`);
    }
    throw new Error(`Invalid JSON response: ${text}`);
  }

  if (!res.ok) {
    throw new Error(json.error || 'Failed to fetch AI data');
  }
  return { text: json.text };
}

