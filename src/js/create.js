"use strict";

// Importerar modul
import { errorMsg } from "./main";
import { url } from "./main";
import { loadingIcon } from "./booking";

// Asynkron funktion för att skapa ny användare
export async function createUser() {

    const token = localStorage.getItem("JWT"); // Hämtar token från localStorage
    loadingIcon.style.display = "block"; // Visar laddningsikon

    const username = document.getElementById("new-username"); // Hämtar användarnamnet från formuläret
    const password = document.getElementById("new-password"); // Hämtar lösenordet från formuläret

    // Kontrollerar om lösenordet är minst 5 tecken
    if (password.length < 5) {
        errorMsg.style.display = "flex";
        errorMsg.innerHTML = "Lösenordet måste vara minst 5 tecken långt" // Visar felmeddelande om lösen är mindre, avbryter funktionen
        return;
    }

    try {
        // Skapar nytt objekt för användaren
        const userInfo = {
            username: username.value,
            password: password.value
        }

        // Skickar ett POST-anrop med fetch API till webbtjänsten med objektet som skapats för användaren
        const response = await fetch(`${url}register`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userInfo)
        });

        const data = await response.json(); // Inväntar svar och omvandlar till json

        loadingIcon.style.display = "none"; // Döljer laddningsikon

        // Kontrollerar om token saknas eller är ogiltig
        if (response.status === 401 || response.status === 403) {
            alert(`${result.message}. Du är inte inloggad eller din session har gått ut. Vänligen logga in igen.`); // Skriver ut felmeddelande till klienten
            window.location.href = "login.html"; // Omdirigerar till inloggningssidan
            return;
            // Kontrollerar om svaret blev lyckat eller ej
        } else if (!response.ok) {
            console.error("Fel vid skapande av konto: ", data.error); // Skriver ut felet till konsollen om ej lyckat
            errorMsg.style.display = "flex"; // Visar felmeddelande med felet från anropet
            errorMsg.innerHTML = data.error;
            return;
            // Vid lyckat svar
        } else {
            // Tömmer innehåll i inputfälten
            username.value = "";
            password.value = "";

            // Lagrar variabel för popup
            let popupMsg = document.querySelector(".popup");
            popupMsg.classList.add("show"); // Lägger till klassen show för popup när erfarenheten har skapats
            popupMsg.innerHTML = "Användarkonto har skapats"; // Skapar innehållet för popupen

            // Döljer popup efter 3 sekunder
            setTimeout(function () {
                popupMsg.classList.remove("show"); // Tar bort show-klassen
                popupMsg.innerHTML = ""; // Tömmer innehållet
            }, 3000); // 3 sekunder
        }

        // Fångar upp ev fel
    } catch (error) {
        console.error("Något gick fel vid skapande av konto: ", error);
    }
}
