"use strict";

// Importerar modul
import { errorMsg } from "./main";

// Asynkron funktion för att logga in användare
export async function loginUser() {
    const url = "https://backend-moment4-1.onrender.com/api/login"; // Lagrar url för API
    const username = document.getElementById("username").value; // Hämtar användarnamnet från formuläret
    const password = document.getElementById("password").value; // Hämtar lösenordet från formuläret
    const loadingEl = document.querySelector(".loader"); // Hämtar ikon för laddningssymbol

    loadingEl.style.display = "block"; // Visar laddningsikon

    try {

        // Skapar nytt objekt för användaren
        const userInfo = {
            username: username,
            password: password
        }

        // Skickar ett POST-anrop med fetch API till webbtjänsten med objektet som skapats för användaren
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInfo)
        });
        
        const data = await response.json(); // Inväntar svar och omvandlar till json

        loadingEl.style.display = "none"; // Döljer laddningsikon när svaret kommit

        // Kontrollerar om svaret är lyckat eller inte
        if (!response.ok) {
            console.error("Inloggningsfel: ", data.error); // Skriver ut fel i konsollen
            errorMsg.style.display = "flex"; // Visar felmeddelande med felet från anropet
            errorMsg.innerHTML = data.error;
            return;

            // Vid lyckat svar
        } else {
            localStorage.setItem("JWT", data.response.token); // Sparar JWT-token i localStorage
            localStorage.setItem("username", username); // Sparar användarnamnet i localStorage
            window.location.href = "/get.html"; // Omdirigerar användaren till get-sidan
        }

        // Fångar upp ev fel
    } catch (error) {
        console.error("Något gick fel vid inloggning: ", error);
    }
}