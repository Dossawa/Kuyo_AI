import { GoogleAuth } from "google-auth-library";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      GCP_PROJECT_ID,
      GEMINI_MODEL = "gemini-2.5-flash",
      GOOGLE_APPLICATION_CREDENTIALS_JSON,
    } = process.env;

    if (!GCP_PROJECT_ID || !GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      return res.status(500).json({ error: "Missing server config" });
    }

    const auth = new GoogleAuth({
      credentials: JSON.parse(GOOGLE_APPLICATION_CREDENTIALS_JSON),
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    const url = `https://aiplatform.googleapis.com/v1/projects/${GCP_PROJECT_ID}/locations/global/publishers/google/models/${GEMINI_MODEL}:generateContent`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Gemini call failed" });
  }
}
