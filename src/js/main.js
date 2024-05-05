"use strict";

// Importerar moduler
import { loginUser } from "./login.js";
import { createUser } from "./create.js";
import { fetchMenu } from "./menu.js";
import { makeBooking } from "./booking.js";
import { sendMessage } from "./contact.js";
import { createReview } from "./review.js";
import { fetchReviews } from "./review.js";

// Hämtar element och lagrar i variabler
const loginBtn = document.getElementById("submit-login");
const loginForm = document.getElementById("loginForm");
const userBtn = document.getElementById("submit-user");
const userForm = document.getElementById("userForm");
const loggedInUser = document.getElementById("logged-in")
const logOutBtn = document.getElementById("log-out");
const bookingForm = document.getElementById("booking-form");
const bookingBtn = document.getElementById("bookBtn");
const contactBtn = document.getElementById("contactBtn");
const contactForm = document.getElementById("contact-form");
const reviewBtn = document.getElementById("reviewBtn");
const reviewForm = document.getElementById("review-form");
export const menuContainer = document.getElementById("menu-list");
export const reviewsContainer = document.getElementById("reviews-container");
const confirmation = document.getElementById("confirmation");
export let errorMsg = document.getElementById("error-message");
export const url = "https://backend-projekt.onrender.com/api/" // Exporterar url

// Skapar initieringsfunktion som körs när webbsidan laddats
window.onload = init;
function init() {

    // Kontrollerar om container för meny existerar
    if (menuContainer) {
        fetchMenu(); // Anropar funktion för att hämta menyn
    }

    // Kontrollerar om contianer för recensioner existerar
    if (reviewsContainer) {
        fetchReviews(); // Anropar funktion för att hämta recensionerna
    }

    // Kontrollerar om bokningsknapp finns på sidan
    if (bookingBtn) {
        // Lägger till händelselyssnare
        bookingBtn.addEventListener("click", (event) => {
            event.preventDefault(); // Förhindrar formulärets standardbeteende
            makeBooking(); // Anropar funktion för att genomföra bokning
        });

        // Hämtar alla input-element från formuläret och lagrar i variabel
        const formInputs = bookingForm.querySelectorAll("input");

        // Lägger till händelselyssnare för varje input i formuläret
        formInputs.forEach(input => {
            input.addEventListener("input", () => {
                errorMsg.style.display = "none"; // Döljer felmeddelandet vid input
            });
        });
    }

    // Kontrollerar om kontaktknapp finns på sidan
    if (contactBtn) {
        // Lägger till händelselyssnare
        contactBtn.addEventListener("click", (event) => {
            event.preventDefault(); // Förhindrar formulärets standardbeteende
            sendMessage(); // Anropar funktion för att skicka meddelande
        });

        // Hämtar alla input-element från formuläret och lagrar i variabel
        const formInputs = contactForm.querySelectorAll("input");

        // Lägger till händelselyssnare för varje input i formuläret
        formInputs.forEach(input => {
            input.addEventListener("input", () => {
                errorMsg.style.display = "none"; // Döljer felmeddelandet vid input
            });
        });
    }

    // Kontrollerar om recensionsknapp finns på sidan
    if (reviewBtn) {
        // Lägger till händelselyssnare
        reviewBtn.addEventListener("click", (event) => {
            event.preventDefault(); // Förhindrar formulärets standardbeteende
            createReview(); // Anropar funktion för att skicka meddelande
        });

        // Hämtar alla input-element från formuläret och lagrar i variabel
        const formInputs = reviewForm.querySelectorAll("input");

        // Lägger till händelselyssnare för varje input i formuläret
        formInputs.forEach(input => {
            input.addEventListener("input", () => {
                errorMsg.style.display = "none"; // Döljer felmeddelandet vid input
            });
        });
    }

    const username = localStorage.getItem("username"); // Hämtar lösenordet från localStorage
    // Kontrollerar om användarnamnet finns och om element för att skriva ut info finns på sidan
    if (username && loggedInUser) {
        loggedInUser.innerHTML = `<i class="fa-solid fa-user"></i> Inloggad som: ${username}`; // Sätter innehåll till span
    }

    // Kontrollerar om logga-ut knappen finns på sidan
    if (logOutBtn) {
        // Skapar händelselyssnare vid klick
        logOutBtn.addEventListener("click", () => {
            localStorage.clear() // Tömmer localStorage
            window.location.href = "/index.html"; // Omdirigerar till startsidan
        });
    }

    // Kontrollerar om formulär för att logga in finns på sidan
    if (loginForm) {
        // Skapar isåfall en händelselyssnare vid klick
        loginBtn.addEventListener("click", (event) => {
            event.preventDefault(); // Förhindrar formulärets standardbeteende (så att sidan inte laddas om)
            loginUser();  // Anropar loginUser funktionen
        });

        // Hämtar alla input-element från formuläret och lagrar i variabel
        const formInputs = loginForm.querySelectorAll("input");

        // Lägger till händelselyssnare för varje input i formuläret
        formInputs.forEach(input => {
            input.addEventListener("input", () => {
                errorMsg.style.display = "none"; // Döljer felmeddelandet vid input
            });
        });
    }

    // Kontrollerar om formulär för att skapa ny användare finns på sidan
    if (userForm) {
        // Skapar isåfall en händelselyssnare vid klick
        userBtn.addEventListener("click", (event) => {
            event.preventDefault(); // Förhindrar formulärets standardbeteende (så att sidan inte laddas om)
            createUser();  // Anropar createUser funktionen
        });

        // Hämtar alla input-element från formuläret och lagrar i variabel
        const formInputs = userForm.querySelectorAll("input");

        // Lägger till händelselyssnare för varje input i formuläret
        formInputs.forEach(input => {
            input.addEventListener("input", () => {
                errorMsg.style.display = "none"; // Döljer felmeddelandet vid input
            });
        });
    }

    const type = localStorage.getItem("type"); // Hämtar typ av information som sparats i localStorage senast

    // Kontrollerar container för bekräftelse finns
    if (confirmation) {
        // Kontrollerar om typen av information är bokning
        if (type === "booking") {
            // Hämtar bokningsdetaljer från localStorage
            const bookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));
            // Skriver ut bekräftelsemeddelande på bokning
            confirmation.innerHTML = `
            <h2>Tack för din bokning!</h2>
            <p>En bokningsbekräftelse har skickats till dig per e-post.</p>
            <p><strong>Din bokning:</strong></p>
            <p>Namn: ${bookingDetails.name}</p>
            Telefonnummer: ${bookingDetails.phone}</p>
            E-post: ${bookingDetails.email}</p>
            Tid för bokning: ${bookingDetails.date}</p>
            Antal personer: ${bookingDetails.guests}</p>
            Speciella önskemål: ${bookingDetails.specialRequests}</p>`;

            // Rensar localStorage efter att bokningen har visats
            localStorage.removeItem("bookingDetails");
            localStorage.removeItem("type");

            // Kontrollerar om typen av information är meddelande
        } else if (type === "message") {
            // Hämtar meddelandedetaljer från localStorage
            const contactDetails = JSON.parse(localStorage.getItem("contactDetails"));
            confirmation.innerHTML = `
            <h2>Tack för ditt meddelande!</h2>
            <p>Vi har tagit emot ditt meddelande och kommer att återkomma till dig så snart som möjligt. En bekräftelse har skickats till dig per e-post.</p>
            <p><strong>Ditt meddelande:</strong></p>
            <p><em>${contactDetails.message}</em></p>`;

            // Rensar localStorage efter att meddelandet har visats
            localStorage.removeItem("contactDetails");
            localStorage.removeItem("type");
        }
    }
}