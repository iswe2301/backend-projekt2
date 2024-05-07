"use strict";

// Importerar moduler
import { loginUser } from "./login.js";
import { createUser } from "./create.js";
import { addNewDish, fetchMenu } from "./menu.js";
import { makeBooking, fetchBookings, contentEl, loadingEl, loadingIcon } from "./booking.js";
import { sendMessage, fetchMessages } from "./contact.js";
import { createReview, fetchReviews } from "./review.js";
import { fetchImage, uploadImage } from "./background.js";

// Hämtar element och lagrar i variabler
const loginBtn = document.getElementById("submit-login");
const loginForm = document.getElementById("loginForm");
const userBtn = document.getElementById("submit-user");
const userForm = document.getElementById("userForm");
const loggedInUser = document.getElementById("logged-in")
const userManager = document.getElementById("user-manager");
const logOutBtn = document.getElementById("log-out");
const bookingForm = document.getElementById("booking-form");
const bookingBtn = document.getElementById("bookBtn");
const contactBtn = document.getElementById("contactBtn");
const contactForm = document.getElementById("contact-form");
const reviewBtn = document.getElementById("reviewBtn");
const reviewForm = document.getElementById("review-form");
const uploadBtn = document.getElementById("uploadBtn");
const uploadForm = document.getElementById("upload-form");
const addDishBtn = document.getElementById("add-dish-btn");
const addDishForm = document.getElementById("add-dish-form");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const menuIcon = document.querySelector(".fa-bars");
const closeIcon = document.querySelector(".fa-xmark");
const containerEl = document.getElementById("overlay");
const confirmation = document.getElementById("confirmation");
const goToMenuBtn = document.getElementById("goToMenu");
const goToBookBtn = document.getElementById("goToBook");
export const menuContainer = document.getElementById("menu-list");
export const reviewsContainer = document.getElementById("reviews-container");
export let errorMsg = document.querySelector(".error-message");
export const url = "https://backend-projekt.onrender.com/api/" // Exporterar url

// Skapar initieringsfunktion som körs när webbsidan laddats
window.onload = init;
function init() {

    // Kontrollerar om knapparna finns på sidan
    if (goToMenuBtn || goToBookBtn) {
        // Lägger till händelselyssnare vid klick som omdirigerar användaren
        goToMenuBtn.addEventListener("click", () => {
            window.location.href = "menu.html"
        });
        goToBookBtn.addEventListener("click", () => {
            window.location.href = "booking.html"
        });
    }

    // Kontrollerar om knapp för att lägga till ny rätt finns på sidan
    if (addDishBtn) {
        // Lägger till händelselyssnare
        addDishBtn.addEventListener("click", function () {
            addDishForm.style.display = "flex"; // Visar formulär för att lägga till ny rätt
            // Scrollar till formulärets position med ett mjukt beteende
            addDishForm.scrollIntoView({ behavior: "smooth" });
            const submitNewDish = document.getElementById("submitNewDish"); // Hämtar knapp för att lägga till ny rätt
            submitNewDish.addEventListener("click", (event) => { // Lägger till händelselyssnare
                event.preventDefault(); // Förhindrar formulärets standardbeteende
                addNewDish(); // Anropar funktion för att lägga till ny rätt
            })
        });

        // Hämtar alla input-element från formuläret och lagrar i variabel
        const formInputs = addDishForm.querySelectorAll("input");

        // Lägger till händelselyssnare för varje input i formuläret
        formInputs.forEach(input => {
            input.addEventListener("input", () => {
                errorMsg.style.display = "none"; // Döljer felmeddelandet vid input
            });
        });
    }


    // Anropar funktion för att hämta bakgrundsbild
    fetchImage();

    // Skapar klickhändelselyssnare för menyknappen, anonym funktion
    menuToggle.addEventListener("click", () => {
        mobileMenu.classList.toggle("show"); // Växlar mellan klassen show för att visa/dölja mobilmenyn
        containerEl.classList.toggle("opacity"); // Växlar mellan visa/dölja opacity när menyn klickas

        // Kontrollerar om mobilmenyn visas eller inte
        if (mobileMenu.classList.contains("show")) {
            // Om menyn visas, gör hamburgerikonen osynlig och kryssikonen synlig
            menuIcon.style.opacity = "0";
            closeIcon.style.opacity = "1";
            closeIcon.style.transform = "translate(-50%, -50%) rotate(360deg)"; // Animerar kryssikonen med en rotation på 360 grader
        } else {
            // Om menyn inte visas, gör hamburgerikonen synlig och kryssikonen osynlig
            menuIcon.style.opacity = "1";
            closeIcon.style.opacity = "0";
            closeIcon.style.transform = "translate(-50%, -50%) rotate(-360deg)"; // Återställer kryssikonens rotation
        }
    });

    // Kontrollerar om sökvägen innehåller "/mybookings"
    if (window.location.pathname.includes("/mybookings")) {
        fetchBookings(); // Anropar isåfall funktion för att hämta bokningar
    }

    // Kontrollerar om sökvägen innehåller "/messages"
    if (window.location.pathname.includes("/messages")) {
        fetchMessages(); // Anropar isåfall funktion för att hämta bokningar
    }

    // Kontrollerar om container för meny existerar
    if (menuContainer) {
        fetchMenu(); // Anropar funktion för att hämta menyn
    }

    // Kontrollerar om contianer för recensioner existerar
    if (reviewsContainer) {
        fetchReviews(); // Anropar funktion för att hämta recensionerna
    }

    // Kontrollerar om sökvägen innehåller låsta sidor
    if (["/mymenu", "/mymenu.html", "/create", "/create.html", "/background", "/background.html"].includes(window.location.pathname)) {
        const token = localStorage.getItem("JWT"); // Hämtar token från localStorage
        // Kontrollerar om token saknas
        if (!token) {
            alert("Du är inte inloggad eller din session har gått ut. Vänligen logga in igen."); // Skriver ut felmeddelande till klienten
            contentEl.style.display = "none"; // Döljer innehållet
            loadingEl.style.display = "block"; // Visar laddning
            window.location.href = "login.html"; // Omdirigerar till inloggningssidan
        } else {
            loadingIcon.style.display = "none";
            loadingEl.style.display = "none"; // Döljer laddning
            contentEl.style.display = "flex"; // Visar innehållet på sidan
        };
    }

    // Kontrollerar om uppladdningsknapp finns på sidan
    if (uploadBtn) {
        // Lägger till händelselyssnare
        uploadBtn.addEventListener("click", (event) => {
            event.preventDefault(); // Förhindrar formulärets standardbeteende
            uploadImage(); // Anropar funktion för att ladda upp en bild
        });

        // Hämtar alla input-element från formuläret och lagrar i variabel
        const formInputs = uploadForm.querySelectorAll("input");

        // Lägger till händelselyssnare för varje input i formuläret
        formInputs.forEach(input => {
            input.addEventListener("input", () => {
                errorMsg.style.display = "none"; // Döljer felmeddelandet vid input
            });
        });
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
        userManager.style.display = "flex";
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
        // Skapar en händelselyssnare vid klick
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