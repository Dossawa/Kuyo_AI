import axios from "axios";
import { GoogleAuth } from "google-auth-library";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const PROJECT_ID = process.env.GCP_PROJECT_ID;
    const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const LOCATION = "global";

    if (!PROJECT_ID) {
      return res.status(500).json({ error: "GCP_PROJECT_ID manquant" });
    }

    const auth = new GoogleAuth({
      credentials: JSON.parse(
        process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
      ),
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const client = await auth.getClient();
    const { token } = await client.getAccessToken();

    const url =
      `https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}` +
      `/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;

    const response = await axios.post(url, req.body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Gemini Vercel error:", error?.response?.data || error);
    res.status(500).json({ error: "Erreur Gemini Vercel" });
  }
}
