"use strict";

import { errorMsg } from "./main"; // Importerar container för felmeddelanden
import { url } from "./main"; // Importerar url

// Hämtar element från DOM, skapar exporterbara moduler
export const loadingEl = document.getElementById("loading");
export const contentEl = document.getElementById("content");
export const loadingIcon = document.querySelector(".loader");

// Asynkron funktion för att genomföra en bokning
export async function makeBooking() {

    // Hämtar värdena från formuläret
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("date").value;
    const guests = document.getElementById("guests").value;
    const specialRequests = document.getElementById("specialRequests").value;

    // Skapar ett objekt med bokningsinformation
    const bookingInfo = {
        name,
        phone,
        email,
        date,
        guests,
        specialRequests
    };

    try {
        // Skickar ett POST-anrop med fetch API till webbtjänsten med objektet som skapats för bokningen
        const response = await fetch(`${url}bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingInfo)
        });

        // Inväntar svaret och konverterar till json
        const result = await response.json();

        // Kontrollerar om svaret är lyckat
        if (!response.ok) {
            console.error("Fel vid bokning: ", result); // Skriver ut fel till konsollen
            displayErrors(result.errors);  // Anropar funktion för att visa felen
            return; // Avbryter funktionen
        } else {
            localStorage.setItem("type", "booking"); // Sparar en nyckel i lS för typ av information för att kunna ge rätt bekräftelse
            localStorage.setItem("bookingDetails", JSON.stringify({ name, phone, email, date, guests, specialRequests })); // Sparar bokning i localStorage
            window.location.href = "/confirm.html"; // Omdirigerar till bekräftelsesidan
        }
        // Fångar upp ev. fel
    } catch (error) {
        console.error("Något gick vid bokningen:", error);
    }
}

// Funktion för att visa ev. fel vid bokning (exporteras som modul)
export function displayErrors(errors) {
    errorMsg.innerHTML = "";  // Rensar tidigare felmeddelanden
    errorMsg.style.display = "flex"; // Visar container för felmeddelanden
    // Loopar igenom varje nyckel i objektet med errors
    Object.keys(errors).forEach(key => {
        const error = errors[key]; // Hämtar felet för den aktuella nyckeln
        const errorMessage = document.createElement("p"); // Skapar paragraf
        errorMessage.textContent = error.message; // Sätter innehållet i paragrafen till error-meddelandet
        errorMsg.appendChild(errorMessage); // Lägger till paragrafen i containern för felmeddelanden
    });
}

// Asynkron funktion för att hämta bokningar (exporteras som modul)
export async function fetchBookings() {

    const token = localStorage.getItem("JWT"); // Hämtar token från localStorage

    loadingIcon.style.display = "block"; // Visar laddningsikon

    // Skickar ett GET-anrop med fetch API till webbtjänsten, skickar med token i header
    try {
        const response = await fetch(`${url}bookings`, {
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
            displayBookings(result); // Anropar funktion för att visa bokningar med svaret från anropet
        }

    } catch (error) {
        console.error("Något gick fel vid hämtning av bokningar: ", error); // Fångar upp ev. felmeddelanden
    }
}

// Funktion för att visa befintliga bokningar
function displayBookings(bookings) {

    loadingIcon.style.display = "none"; // Döljer laddningsikon
    loadingEl.style.display = "none"; // Döljer span för "laddning" av sidan
    contentEl.style.display = "block"; // Visar innehållet på sidan

    // Hämtar container för bokningar och lagrar i variabel
    const bookingContainer = document.getElementById("booking-container");

    // Kontrollerar om containern existerar på sidan
    if (bookingContainer) {
        bookingContainer.innerHTML = ""; // Tömmer tidigare innehåll

        const today = new Date(); // Skapar ett nytt date objekt
        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Hämtar aktuellt år, månad och datum per månad

        // Filtrerar bokningarna för att endast inkludera framtida datum, bokningsdatum ska vara större eller = dagens datum (startdatum)
        const futureBookings = bookings.filter(booking => new Date(booking.date) >= startDate);

        // Sorterar de filtrerade bokningarna så att den tidigaste bokningen visas först
        futureBookings.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Loopar igenom varje bokning
        futureBookings.forEach(booking => {

            // Kontrollerar om inga speciella önskemål har angetts
            if (booking.specialRequests === undefined) {
                booking.specialRequests = "Inga"; // Sätter innehållet till "inga" istället
            }

            // Skapar en div för varje bokning
            const div = document.createElement("div");

            // Sätter divens innehåll till bokningsinformationen, formatterar datum enligt svensk standard
            div.innerHTML = `
            <h3>${booking.name}</h3>
            <p><strong>Tid för bokning:</strong> ${new Date(booking.date).toLocaleString("sv-SE")}</p>
            <p><strong>Antal gäster:</strong> ${booking.guests}</p>
            <p><strong>Telefon:</strong> ${booking.phone}</p>
            <p><strong>E-post:</strong> ${booking.email}</p>
            <p><strong>Speciella önskemål:</strong> ${booking.specialRequests}</p>
        `;

            // Lägger till div i container för att skriva ut till DOM
            bookingContainer.appendChild(div);
        });
    }
}