"use strict";

// Importerar modul
import { errorMsg } from "./main";

// Asynkron funktion för att skapa ny användare
export async function createUser() {
    const url = "https://backend-moment4-1.onrender.com/api/register"; // Lagrar url för API
    const username = document.getElementById("new-username").value; // Hämtar användarnamnet från formuläret
    const password = document.getElementById("new-password").value; // Hämtar lösenordet från formuläret
    const loadingEl = document.querySelector(".loader"); // Hämtar ikon för laddningssymbol

    // Kontrollerar om lösenordet är minst 5 tecken
    if (password.length < 5) {
        errorMsg.style.display = "flex";
        errorMsg.innerHTML = "Lösenordet måste vara minst 5 tecken långt" // Visar felmeddelande om lösen är mindre, avbryter funktionen
        return;
    }

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

        loadingEl.style.display = "none"; // Döljer laddningsikon

        // Kontrollerar om svaret var lyckat eller inte
        if (!response.ok) {
            console.error("Fel vid skapande av användare: ", data.error); // Skriver ut felet till konsollen om ej lyckat
            errorMsg.style.display = "flex"; // Visar felmeddelande med felet från anropet
            errorMsg.innerHTML = data.error;
            return;

            // Vid lyckat svar
        } else {

            // Lagrar variabel för popup
            let popupMsg = document.querySelector(".popup");
            popupMsg.classList.add("show"); // Lägger till klassen show för popup när erfarenheten har skapats
            popupMsg.innerHTML = `Användarkonto för ${username} har skapats!`; // Skapar innehållet för popupen

            // Döljer popup efter 3 sekunder
            setTimeout(function () {
                popupMsg.classList.remove("show"); // Tar bort show-klassen
                popupMsg.innerHTML = ""; // Tömmer innehållet

                // Omdirigerar användaren till startsidan efter att popupen har dolts
                setTimeout(function () {
                    window.location.href = "index.html";
                }, 800); // Omdirigerar användaren till startsidan efter att popupen har dolts, 0.8 sekunders fördröjning
            }, 3000); // 3 sekunder
        }

        // Fångar upp ev fel
    } catch (error) {
        console.error("Något gick fel vid inloggning: ", error);
    }
}
