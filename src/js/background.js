"use strict";

// Importerar moduler
import { url } from "./main";
import { errorMsg } from "./main";

// Asynkron funktion för att ladda upp en bild
export async function uploadImage() {

    // Hämtar värdena från formuläret
    const form = document.getElementById("upload-form");
    const formData = new FormData(form); // Skapar ett nytt formdata-objekt med formuläret
    const token = localStorage.getItem("JWT"); // Hämtar token från localStorage

    // Skickar ett PUT-anrop med fetch API till webbtjänsten med formdata-objektet
    try {
        const response = await fetch(`${url}image`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });

        // Inväntar svar och konverterar till json
        const data = await response.json();

        // Kontrollerar om svaret blev lyckat eller ej
        if (!response.ok) {
            console.error("Fel vid uppdatering av bild: ", data.message); // Skriver ut felet till konsollen om ej lyckat
            errorMsg.style.display = "flex"; // Visar felmeddelande med felet från anropet
            errorMsg.innerHTML = data.message;
            return;
            // Vid lyckat svar
        } else {
            fetchImage(); // Anropar funktion för att hämta bilden
            // Lagrar variabel för popup
            let popupMsg = document.querySelector(".popup");
            popupMsg.classList.add("show"); // Lägger till klassen show för popup
            popupMsg.innerHTML = "Bilden har uppdaterats"; // Skapar innehållet för popupen

            // Döljer popup efter 3 sekunder
            setTimeout(function () {
                popupMsg.classList.remove("show"); // Tar bort show-klassen
                popupMsg.innerHTML = ""; // Tömmer innehållet
                setTimeout(function () {
                    location.reload(); // Laddar om sidan 0.8 sek efter att popup har dolts
                }, 800);
            }, 3000); // 3 sekunder
        }
    } catch (error) {
        console.error("Fel när bilden skulle laddas upp:", error);
    }
}

// Asynkron funktion för att hämta bild
export async function fetchImage() {
    try {
        // Skickar ett GET-anrop med fetch API till webbtjänsten
        const response = await fetch(`${url}image`);
        // Kontrollerar om hämtning lyckades
        if (!response.ok) {
            throw new Error("Misslyckades att hämta bild"); // Kastar ett felmeddelande vid misslyckad hämtning
        }
        // Inväntar svar och konverterar till json
        const image = await response.json();
        displayImage(image[0]); // Anropar funktion för att visa bilden med index 0 (första bilden)
        // Fångar upp ev. fel
    } catch (error) {
        console.error("Något gick fel vid hämtning av bild: ", error);
    }
}

// Funktion för att befintlig bakgrundsbild
function displayImage(image) {

    // Hämtar bildens källa från DOM
    const bgImage = document.getElementById("background-img");

    // Uppdaterar bildens sökväg samt alt-text med den nya bilden
    bgImage.src = image.imagePath;
    bgImage.alt = image.altText;
}