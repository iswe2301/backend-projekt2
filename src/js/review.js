"use strict";

import { displayErrors } from "./booking"; // Importerar funktion för att hantera fel
import { url } from "./main"; // Importerar url
import { reviewsContainer } from "./main"; // Importerar container för recensioner

// Asynkron funktion för att skicka ett meddelande i kontaktformuläret
export async function createReview() {

    // Hämtar värdena från formuläret
    const name = document.getElementById("name").value;
    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value;

    // Skapar ett objekt med recensionens information
    const reviewInfo = {
        name,
        rating,
        comment
    };

    try {
        // Skickar ett POST-anrop med fetch API till webbtjänsten med objektet som skapats för recensionens information
        const response = await fetch(`${url}reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reviewInfo)
        });

        // Inväntar svaret och konverterar till json
        const result = await response.json();

        // Kontrollerar om svaret är lyckat
        if (!response.ok) {
            console.error("Fel vid skapande av recension: ", result); // Skriver ut fel till konsollen
            displayErrors(result.errors);  // Anropar funktion för att visa felen
            return; // Avbryter funktionen
        } else {
            fetchReviews(); // Anropar funktion för att hämta recensionerna
        }
        // Fångar upp ev. fel
    } catch (error) {
        console.error("Något gick vid sparande av recension:", error);
    }
}

// Asynkron funktion för att hämta recensioner
export async function fetchReviews() {
    try {
        // Skickar ett GET-anrop med fetch API till webbtjänsten
        const response = await fetch(`${url}reviews`);
        // Kontrollerar om hämtning lyckades
        if (!response.ok) {
            throw new Error("Misslyckades att hämta recensioner"); // Kastar ett felmeddelande vid misslyckad hämtning
        }
        // Inväntar svar och konverterar till json
        const reviews = await response.json();

        displayReviews(reviews); // Anropar funktion för att visa recensioner, skickar med recensionerna
        // Fångar upp ev. fel
    } catch (error) {
        console.error("Något gick fel vid hämtning av recensioner: ", error);
    }
}

// Funktion för att visa alla recensioner
function displayReviews(reviews) {
    reviewsContainer.innerHTML = ""; // Rensar befintliga recensioner

    // Loopar igenom varje recension
    reviews.forEach(review => {
        const div = document.createElement("div"); // Skapar en div för varje recension
        // Skapar innehållet för diven med info från recensionerna, formatterar datum enligt svensk standard
        div.innerHTML = `
                <h3>${review.name}</h3>
                <p>${new Date(review.date).toLocaleDateString("sv-SE")}</p>
                <p><strong>Betyg: ${review.rating}</strong></p>
                <p><em>${review.comment}</em></p>
            `;
        reviewsContainer.appendChild(div); // Lägger till diven i containern för recensioner
    });
}