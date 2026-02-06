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

    // --- ALTERS-LOGIK ---
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

### DIE GOLDENEN REGELN
1. DER "GEFÜHLS-ANKER": Beschreibe Emotionen über den Körper.
2. DIE INTERAKTIVE EINBINDUNG: Sprich ${name} direkt an.
3. DER WENDEPUNKT: Der Held löst das Problem selbst.
4. ALTERSGERECHTE ARCHITEKTUR: ${ageNumber < 3 ? "Kurze Sätze, Lautmalerei." : "Bildhafte Sprache, Vergleiche."}
5. ANTI-BELEHRUNGS-FILTER: Keine Moral am Ende.

### FORMAT
- Nur Titel (fett) und Geschichte. Ca. 4-5 Absätze.

### BESONDERE WÜNSCHE:
${extraWish || 'Keine'}
`;

    // --- API AUFRUF ---
    try {
        const response = await fetch('/.netlify/functions/story', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || JSON.stringify(data.error));
        }

        if (data.candidates && data.candidates[0].content) {
            outputDiv.innerText = data.candidates[0].content.parts[0].text;
        }

    } catch (error) {
        console.error("Fehler:", error);
        outputDiv.innerText = "Ein Fehler ist aufgetreten: " + error.message;
    }
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const content = document.getElementById('storyContent').innerText;
    const splitText = doc.splitTextToSize(content, 180);
    doc.text(splitText, 10, 20);
    doc.save("geschichte.pdf");
}
