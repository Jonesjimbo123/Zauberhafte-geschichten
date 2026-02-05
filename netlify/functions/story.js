export default async (req, context) => {
  // Hier holen wir den Key  von Netlify
  const API_KEY = Netlify.env.get("GOOGLE_API_KEY");

  // Daten von Website lesen
  const body = await req.json();
  const userPrompt = body.prompt;

  if (!userPrompt) {
    return new Response("Kein Prompt erhalten", { status: 400 });
  }

  try {
    // Anruf Google
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }]
      })
    });

    const data = await response.json();

    // Antwort von Google an Website
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" } // Wichtig!
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};