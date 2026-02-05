// HINWEIS: Der API_KEY wird hier nicht mehr gebraucht, 
// da wir jetzt über Netlify gehen.

async function generateStory() {
    // 1. Werte auslesen
    const name = document.getElementById('childName').value;
    const age = document.getElementById('childAge').value;
    const hero = document.getElementById('hero').value;
    const mood = document.getElementById('mood').value;
    const setting = document.getElementById('setting').value;
    const theme = document.getElementById('theme').value;
    const extraWish = document.getElementById('extraWish').value;
    
    const outputDiv = document.getElementById('storyContent');
    const outputSection = document.getElementById('storyOutput');

    if (!name || !hero || !age) {
        alert("Bitte fülle Name, Alter und Held aus!");
        return;
    }

    outputDiv.innerText = "Die Zauberfeder schreibt... ✨";
    outputSection.classList.remove('hidden');

    // --- ALTERS-LOGIK FÜR DEN ERZÄHLSTIL ---
    const ageNumber = parseInt(age);
// --- PROMPT ZUSAMMENBAUEN ---
const ageNumber = parseInt(age);

// Spezifische Autoren-Gewichtung nach Alter
let authorStyle = "";
if (ageNumber < 3) {
    authorStyle = "Nutze die rhythmischen Wiederholungen von Eric Carle und die Sanftheit von Jule Pfeiffer-Phof.";
} else {
    authorStyle = "Kombiniere die Herzlichkeit von Astrid Lindgren mit der Klarheit und dem Witz von Ingo Siegner.";
}

let prompt = `
### DEINE ROLLE
Du bist ein preisgekrönter Kinderbuchautor. Dein Schreibstil ist warmherzig, voller Staunen und rhythmisch. 
STIMME: ${authorStyle}

### ZIELGRUPPE & SETTING
- Kind: ${name} (${age} Jahre)
- Held: ${hero}
- Stimmung: ${mood}
- Schauplatz: ${setting || 'Ein Ort voller Wunder'}
- Pädagogischer Kern: ${theme || 'Keine spezifische Vorgabe'}

### DIE GOLDENEN REGELN (STRENG EINHALTEN)

1. DER "GEFÜHLS-ANKER" (Show, don't tell):
   - Beschreibe Emotionen NIEMALS abstrakt (Vermeide: "Er war traurig", "Dieses Gefühl der Entmutigung").
   - Beschreibe stattdessen den Körper: "Die Schultern hingen tief", "Ein Zittern in den Pfoten", "Ein Strahlen bis zu den Ohren".
   - Nach der körperlichen Beschreibung folgt EIN sanfter Satz zur Einordnung: "${name}, das nennt man Stolz, oder?"

2. DIE INTERAKTIVE EINBINDUNG:
   - Behandle ${name} als Begleiter. Sprich ${name} 2-3 Mal direkt an (z.B. "Kannst du das auch sehen, ${name}?" oder "${name} hielt den Atem an").

3. DER WENDEPUNKT (Kein Zufall!):
   - Der Held darf sein Problem NICHT durch Magie oder Zufall lösen.
   - Er muss einen Fehlversuch haben. 
   - Die Lösung muss aus einer Idee des Helden oder der Hilfe von ${name} entstehen.

4. ALTERSGERECHTE ARCHITEKTUR:
   ${ageNumber < 3 ? 
     "- Kurze Sätze (max. 8 Wörter). Viele Lautmalereien (Hui, Plumps). Wiederholungen von Wörtern." : 
     "- Bildhafte Sprache und Vergleiche aus der Kinderwelt (z.B. 'so gelb wie eine reife Banane'). Keine Schachtelsätze."
   }

5. ANTI-BELEHRUNGS-FILTER:
   - Schreibe NIEMALS eine Zusammenfassung oder eine Moral am Ende.
   - Die Geschichte endet mit einem herzerwärmenden Bild.

### FORMAT
- Nur Titel (fett) und Geschichte. Ca. 4-5 Absätze. Keine Metadaten.

### BESONDERE WÜNSCHE:
${extraWish || 'Keine'}
`;

    // --- DER NEUE API AUFRUF (über Netlify) ---
    try {
        const response = await fetch('/.netlify/functions/story', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt 
            })
        });

        const data = await response.json();

       if (data.error) {
            // Das hier sorgt dafür, dass wir den echten Fehlertext sehen
            const errorText = data.error.message || JSON.stringify(data.error);
            throw new Error(errorText);
        }

        if (data.candidates && data.candidates[0].content) {
            outputDiv.innerText = data.candidates[0].content.parts[0].text;
        }

    } catch (error) {
        console.error("Fehler:", error);
        outputDiv.innerText = "Ein Fehler ist aufgetreten: " + error.message;
    }
} // Hier endet generateStory

// PDF-Funktion
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const content = document.getElementById('storyContent').innerText;
    const splitText = doc.splitTextToSize(content, 180);
    doc.text(splitText, 10, 20);
    doc.save("geschichte.pdf");
}


