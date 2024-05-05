"use strict";

import { displayErrors } from "./booking"; // Importerar funktion för att hantera fel
import { url } from "./main"; // Importerar url
import { reviewsContainer } from "./main"; // Importerar container för recensioner

// Asynkron funktion för att skicka ett meddelande i kontaktformuläret
export async function createReview() {

    // Hämtar värdena från formuläret
    let name = document.getElementById("name");
    let rating = document.getElementById("rating");
    let comment = document.getElementById("comment");

    // Skapar ett objekt med recensionens information
    const reviewInfo = {
        name: name.value,
        rating: rating.value,
        comment: comment.value
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

            // Tömmer inputfälten
            name.value = "";
            rating.value = "";
            comment.value = "";

            const popupMsg = document.querySelector(".popup"); // Hämtar element för popup
            popupMsg.classList.add("show"); // Lägger till klassen show för popup när erfarenheten har skapats
            popupMsg.innerHTML = "Recension skapad"; // Skapar innehållet för popupen

            // Döljer popup efter 3 sekunder
            setTimeout(function () {
                popupMsg.classList.remove("show"); // Tar bort show-klassen
                popupMsg.innerHTML = ""; // Tömmer innehållet
            }, 3000); // 3 sekunder
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

    // Beräknar genomsnittsbetyget genom att anropa funktion med recensionerna som argument
    const averageRating = calculateRating(reviews);

    reviewsContainer.innerHTML = `<h2>Våra omdömen - ${averageRating}</h2>`; // Rensar befintliga recensioner och sätter rubriken till medelbetyget

    // Sorterar recensionerna så att den senaste alltid visas först (högst upp baserat på datum)
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

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

// Funktion för att beräkna genomsnittsbetyget
function calculateRating(reviews) {

    let rate = 0;  // Rating, startar på 0
    let amount = 0;  // Antalet betyg, startar på 0

    // Loopar igenom alla recensioner och summerar betygen
    for (let i = 0; i < reviews.length; i++) {
        rate += reviews[i].rating; // Lägger till betyg i rating
        amount++;  // Ökar räknaren för varje betyg
    }

    // Beräknar genomsnittet genom att dela totala summan med antalet betyg
    const averageRating = rate / amount;
    return averageRating.toFixed(1);  // Formaterar betyget till en decimal och returnerar medelbetyg
}