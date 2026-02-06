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

  // --- NEUE ALTERSMATRIX ---
const ageNumber = parseInt(age);

let languageRules = "";

if (ageNumber <= 3) {
    languageRules = `
SPRACHE:
- Sehr kurze Sätze (maximal 8 Wörter).
- Sehr einfache, bekannte Wörter.
- Viele Geräusche wie "brumm", "hui", "klack".
- Wiederholungen sind erlaubt.
- Keine Metaphern.
- Keine abstrakten Begriffe.
- Keine inneren Monologe.

GEFÜHLE:
- Nur über sichtbare Handlungen zeigen.
- Nicht erklären.

STRUKTUR:
- Sehr einfache Handlung.
- Keine dramatische Zuspitzung.
`;

} else if (ageNumber <= 5) {
    languageRules = `
SPRACHE:
- Kurze bis mittlere Sätze.
- Einfache Vergleiche erlaubt.
- Keine komplizierten oder abstrakten Wörter.

GEFÜHLE:
- Einfache Gedanken erlaubt.
- Keine tiefen Reflexionen.

STRUKTUR:
- Kleine Herausforderung.
- Die Hauptfigur löst sie selbst.
`;

} else {
    languageRules = `
SPRACHE:
- Klare, lebendige Sprache.
- Bildhafte Vergleiche erlaubt.
- Keine übertrieben poetische Sprache.

GEFÜHLE:
- Innere Gedanken erlaubt.
- Klarer emotionaler Moment.

STRUKTUR:
- Klarer Spannungsbogen.
`;
}

let prompt = `
Schreibe eine Kindergeschichte.

HAUPTFIGUR:
${hero}

ORT:
${setting || "Ein besonderer Ort"}

STIMMUNG:
${mood || "freundlich"}

${languageRules}

WICHTIG:
- Keine direkte Ansprache des Kindes.
- Keine Moral am Ende.
- Keine künstlich poetische Sprache.
- Kein Pathos.
- Vermeide Wörter wie: Rausch, Schicksal, Bestimmung, zögerlich, Lampenfieber.

FORMAT:
- Titel (fett)
- 4–5 Absätze
- Natürlich klingender Erzählton.

ZUSÄTZLICHER WUNSCH:
${extraWish || "Keiner"}
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

