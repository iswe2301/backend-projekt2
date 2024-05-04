"use strict";

// Hämtar element från DOM
const loadingEl = document.getElementById("loading");
const contentEl = document.getElementById("content");
const loadingIcon = document.querySelector(".loader");

// Asynkron funktion för att hämta data (exporteras som modul)
export async function fetchExperiences() {
    const url = "https://backend-moment4-1.onrender.com/api/experiences"; // Lagrar url för API
    const token = localStorage.getItem("JWT"); // Hämtar token från localStorage

    loadingIcon.style.display = "block"; // Visar laddningsikon

    // Skickar ett GET-anrop med fetch API till webbtjänsten, skickar med token i header
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json(); // Inväntar svaret och konverterar till json

        // Kontrollerar om token saknas eller är ogiltig
        if (response.status === 401 || response.status === 403) {
            alert(`${data.message}. Du är inte inloggad eller din session har gått ut. Vänligen logga in igen.`); // Skriver ut felmeddelande till klienten
            window.location.href = "/index.html"; // Omdirigerar till inloggningssidan
            return;

            // Vid lyckat svar
        } else {
            displayExperiences(data); // Anropar funktion för att visa erfarenheter med svaret från anropet
        }
        
    } catch (error) {
        console.error("Något gick fel vid hämtning av erfarenheter: " , error); // Fångar upp ev. felmeddelanden
    }
}



// Funktion för att visa befintliga jobberfarenheter
function displayExperiences(experiences) {

    loadingIcon.style.display = "none"; // Döljer laddningsikon
    loadingEl.style.display = "none"; // Döljer span för "laddning" av sidan
    contentEl.style.display = "block"; // Visar innehållet på sidan

    // Hämtar container för jobberfarenheter och lagrar i variabel
    const workContainer = document.getElementById("work-container");

    // Sorterar erfarenheterna baserat på startdatum med den senast påbörjade erfarenheten först
    experiences.sort((a, b) => {
        if (a.startDate < b.startDate) {
            return 1; // Om a är mindre (tidigare datum) än b, sortera a efter b
        } else if (a.startDate > b.startDate) {
            return -1; // Om a är större (senare datum) än b, sortera a före b
        } else {
            return 0; // Om a och b är samma, behåll den nuvarande ordningen
        }
    });

    // Kontrollerar om containern existerar på sidan
    if (workContainer) {
        workContainer.innerHTML = "<h2>Mina jobberfarenheter</h2>"; // Tömmer tidigare innehåll och visar endast rubriken
        // Loopar isåfall igenom varje erfarenhet
        experiences.forEach(experience => {

            // Använder substring för att endast inkludera de 10 första tecknen i datumet (börjar på index 0)
            const startDate = experience.startDate.substring(0, 10);

            let endDate = "Pågående"; // Sätter slutdatum till "Pågående" initalt (om den är null)

            // Kontrollerar om enddate finns och inte är null
            if (experience.endDate) {
                endDate = experience.endDate.substring(0, 10); // Inkluderar datumets första 10 tecken
            }

            // Skapar en article för varje jobberfarenhet
            const articleEl = document.createElement("article");

            // Skapar ett unikt ID för varje article baserat på erfarenhetens ID
            let articleID = `${experience._id}`;
            articleEl.id = articleID;

            // Sätter artikelns innehåll till erfarenhetens data (företagsnamn, titel, plats, datum och beskrivning)
            articleEl.innerHTML = `
            <div>
            <h3 class="company-name">${experience.companyName}</h3>
            <p><strong>Roll:</strong> ${experience.jobTitle}</p>
            <p><strong>Plats:</strong> ${experience.location}</p>
            <p><strong>Tidsperiod:</strong> ${startDate} - ${endDate}</p>
            <h4>Beskrivning</h4>
            <p>${experience.description}</p>
            </div>
        `;

            // Lägger till artikeln i container för att skriva ut till DOM
            workContainer.appendChild(articleEl);
        });
    }
}