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
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch AI data');
  }
  const data = await res.json();
  return { text: data.text };
}
