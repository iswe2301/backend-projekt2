"use strict";

// Importerar moduler
import { displayErrors } from "./booking"; // Importerar funktion för att hantera fel
import { url } from "./main"; // Importerar url
import { loadingEl } from "./booking";
import { loadingIcon } from "./booking";
import { contentEl } from "./booking";

// Asynkron funktion för att skicka ett meddelande i kontaktformuläret
export async function sendMessage() {

    // Hämtar värdena från formuläret
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;

    // Skapar ett objekt med kontaktinformationen
    const contactInfo = {
        name,
        email,
        phone,
        message
    };

    try {
        // Skickar ett POST-anrop med fetch API till webbtjänsten med objektet som skapats för kontaktinformationen
        const response = await fetch(`${url}messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactInfo)
        });

        // Inväntar svaret och konverterar till json
        const result = await response.json();

        // Kontrollerar om svaret är lyckat
        if (!response.ok) {
            console.error("Fel vid sändning av meddelande: ", result); // Skriver ut fel till konsollen
            displayErrors(result.errors);  // Anropar funktion för att visa felen
            return; // Avbryter funktionen
        } else {
            localStorage.setItem("type", "message"); // Sparar en nyckel i lS för typ av information för att kunna ge rätt bekräftelse
            localStorage.setItem("contactDetails", JSON.stringify({ message })); // Sparar meddelandet i localStorage
            window.location.href = "/confirm.html"; // Omdirigerar till bekräftelsesidan
        }
        // Fångar upp ev. fel
    } catch (error) {
        console.error("Något gick vid sändning av meddelande:", error);
    }
}

// Asynkron funktion för att hämta meddelanden (exporteras som modul)
export async function fetchMessages() {

    const token = localStorage.getItem("JWT"); // Hämtar token från localStorage

    loadingIcon.style.display = "block"; // Visar laddningsikon

    // Skickar ett GET-anrop med fetch API till webbtjänsten, skickar med token i header
    try {
        const response = await fetch(`${url}messages`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json(); // Inväntar svaret och konverterar till json

        // Kontrollerar om token saknas eller är ogiltig
        if (response.status === 401 || response.status === 403) {
            alert(`${result.message}. Du är inte inloggad eller din session har gått ut. Vänligen logga in igen.`); // Skriver ut felmeddelande till klienten
            window.location.href = "login.html"; // Omdirigerar till inloggningssidan
            return;

            // Vid lyckat svar
        } else {
            displayMessages(result); // Anropar funktion för att visa bokningar med svaret från anropet
        }

    } catch (error) {
        console.error("Något gick fel vid hämtning av bokningar: ", error); // Fångar upp ev. felmeddelanden
    }
}

// Funktion för att visa befintliga bokningar
function displayMessages(messages) {

    loadingIcon.style.display = "none"; // Döljer laddningsikon
    loadingEl.style.display = "none"; // Döljer span för "laddning" av sidan
    contentEl.style.display = "block"; // Visar innehållet på sidan

    // Hämtar container för bokningar och lagrar i variabel
    const messageContainer = document.getElementById("message-container");

    // Kontrollerar om containern existerar på sidan
    if (messageContainer) {
        messageContainer.innerHTML = ""; // Tömmer tidigare innehåll

        // Kontrollerar om det finns några meddelanden
        if (messages.length === 0) {
            messagesContainer.innerHTML = "<p>Inga inkomna meddelanden</p>";
            return;
        }

        // Sorterar meddelandena så att det senast mottagna visas först
        messages.sort((a, b) => new Date(b.recieved) - new Date(a.recieved));

        // Loopar igenom varje meddelande
        messages.forEach(message => {

            // Kontrollerar om telefonnummer finns med
            if (message.phone === undefined) {
                message.phone = ""; // Sätter en tom textsträng till innehållet
            }

            // Skapar en div för varje meddelande
            const div = document.createElement("div");

            // Sätter divens innehåll till bokningsinformationen, formatterar datum enligt svensk standard
            div.innerHTML = `
            <p><strong>Avsändare:</strong> ${message.name}</p>
            <p><strong>Mottaget:</strong> ${new Date(message.recieved).toLocaleString("sv-SE")}</p>
            <p><strong>E-post:</strong> ${message.email}</p>
            <p><strong>Telefon:</strong> ${message.phone}</p>
            <p><strong>Meddelande:</strong> ${message.message}</p>
            <a id="emailBtn" href="mailto:${message.email}">Besvara <i class="fa-solid fa-reply"></i></a>
        `;
            // Lägger till div i container för att skriva ut till DOM
            messageContainer.appendChild(div);
        });
    }
}