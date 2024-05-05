"use strict";

import { displayErrors } from "./booking"; // Importerar funktion för att hantera fel
import { url } from "./main"; // Importerar url

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