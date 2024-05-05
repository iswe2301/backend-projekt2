"use strict";

import { errorMsg } from "./main"; // Importerar container för felmeddelanden
import { url } from "./main"; // Importerar url

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
            localStorage.setItem("bookingDetails", JSON.stringify({ name, phone, email, date, guests, specialRequests })); // Sparar bokning i localStorage
            window.location.href = "/confirm.html"; // Omdirigerar till bekräftelsesidan
        }
        // Fångar upp ev. fel
    } catch (error) {
        console.error("Något gick vid bokningen:", error);
    }
}

// Funktion för att visa ev. fel vid bokning
function displayErrors(errors) {
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
