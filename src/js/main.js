"use strict";

// Importerar moduler
import { loginUser } from "./login.js";
import { createUser } from "./create.js";
import { fetchExperiences } from "./get.js";

// Hämtar element och lagrar i variabler
const loginBtn = document.getElementById("submit-login");
const loginForm = document.getElementById("loginForm");
const userBtn = document.getElementById("submit-user");
const userForm = document.getElementById("userForm");
const loggedInUser = document.getElementById("logged-in")
const logOutBtn = document.getElementById("log-out");
export let errorMsg = document.getElementById("error-message");

// Skapar initieringsfunktion som körs när webbsidan laddats
window.onload = init;
function init() {

    // Kontrollerar om sökvägen innehåller "/get"
    if (window.location.pathname.includes("/get")) {
        fetchExperiences(); // Anropar isåfall funktion för att hämta jobberfarenheter
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
};