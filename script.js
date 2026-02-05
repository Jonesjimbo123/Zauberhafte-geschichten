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
    let stylisticInstruction = "";
    
    if (ageNumber < 3) {
        stylisticInstruction = "Nutze einfache Sätze und sanfte Lautmalerei (z.B. 'Plumps', 'Wusch'), um die Aufmerksamkeit zu halten. Benenne Gefühle direkt nach einer kurzen Beschreibung.";
    } else {
        stylisticInstruction = "Schreibe komplexere, bildhafte Sätze. Nutze Lautmalerei nur als sehr seltenes, dezentes Stilmittel. Beschreibe Gefühle hauptsächlich durch Handlungen (Show, don't tell).";
    }

    // --- PROMPT ZUSAMMENBAUEN ---
    // Wichtig: Hier muss 'let' stehen, damit wir später Text hinzufügen können
    let prompt = `Du bist ein einfühlsamer Kinderbuchautor wie Ingo Siegner oder Astrid Lindgren. Schreibe eine Geschichte für ${name} (${age} J.). 
Held: ${hero}. Stimmung: ${mood}. Schauplatz: ${setting || 'Ein schöner Ort'}.
Stil-Vorgabe: ${stylisticInstruction}

 STRENGSTE REGELN FÜR DEN SCHREIBSTIL:
1. SHOW AND TELL: Beschreibe Gefühle erst durch Handlungen (Zittern, Lachen, Kopf hängen lassen) und benenne das Gefühl dann sanft in einem zweiten Satz, damit das Kind lernt, es zuzuordnen.
2. DIALOGE: Lass die Figuren lebendig sprechen, aber vermeide, dass sie wie Lehrer oder Therapeuten klingen.
3. KEINE META-DATEN: Gib NUR die Geschichte und den Titel aus. Keine Einleitung wie "Hier ist deine Geschichte" und keine Menütexte.
4. STRUKTUR: Ein kurzer, fesselnder Einstieg, ein Moment des Scheiterns und eine herzerwärmende, kreative Lösung.`;

    if (setting) prompt += ` Schauplatz: ${setting}.`;
    if (theme) prompt += ` Pädagogischer Kern (versteckt in der Handlung): ${theme}.`;
    if (extraWish) prompt += ` Wichtige Details: ${extraWish}.`;

    prompt += ` Schreibe die Geschichte in einer bildhaften, kindgerechten Sprache mit etwa 4-5 Absätzen. Gesamtlänge ca. 400 Wörter.`;

   // --- DER  API AUFRUF (über Netlify) ---
    try {
        // Wir rufen jetzt unsere eigene Funktion auf, nicht mehr Google direkt!
        const response = await fetch('/.netlify/functions/story', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt // Wir schicken nur den Text an den Mittelsmann
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error); // Falls der Mittelsmann einen Fehler meldet
        }
        
        // Ab hier bleibt alles gleich wie vorher...
        if (data.candidates && data.candidates[0].content) {
            outputDiv.innerText = data.candidates[0].content.parts[0].text;
        }

    } catch (error) {
        console.error("Fehler:", error);
        outputDiv.innerText = "Ein Fehler ist aufgetreten: " + error.message;
    }
    }
} // Hier endet generateStory

// PDF-Funktion (außerhalb der async function)
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const content = document.getElementById('storyContent').innerText;
    const splitText = doc.splitTextToSize(content, 180);
    doc.text(splitText, 10, 20);
    doc.save("geschichte.pdf");
}