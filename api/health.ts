export default function handler(req: any, res: any) {
  res.json({ 
    status: "ok", 
    key: process.env.GEMINI_API_KEY ? "Set" : "Not Set"
  });
}
