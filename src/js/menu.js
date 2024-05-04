"use strict"

import { url } from "./main"; // Importerar URL

// Asynkron funktion för att hämta menyn
export async function fetchMenu() {
    try {
        // Skickar ett GET-anrop med fetch API till webbtjänsten
        const response = await fetch(`${url}dishes`);
        // Kontrollerar om hämtning lyckades
        if (!response.ok) {
            throw new Error("Misslyckades att hämta meny"); // Kastar ett felmeddelande vid misslyckad hämtning
        }
        // Inväntar svar och konverterar till json
        const dishes = await response.json();
        displayMenu(dishes); // Anropar funktion för att visa menyn
        // Fångar upp ev. fel
    } catch (error) {
        console.error("Något gick fel vid hämtning av menyn: ", error);
    }
}

// Funktion för att visa menyn med rätter
function displayMenu(dishes) {

    // Hämtar ett DOM-element där menyn ska visas
    const menu = document.getElementById("menu-list");

    // Definierar huvudkategorierna för rätterna som ett objekt
    const mainCategories = {
        starter: "Förrätter",
        main: "Huvudrätter",
        dessert: "Efterrätter",
        drink: "Dryck"
    };

    // Definierar underkategorierna för dryck som ett objekt
    const subCategories = {
        wine: "Vin",
        beer: "Öl",
        "non-alcoholic": "Alkoholfritt"
    };

    // Loopar genom huvudkategorierna för att skapa en sektion för varje kategori
    Object.keys(mainCategories).forEach(category => {
        // Filtrerar ut rätter som tillhör aktuell kategori
        const catDishes = dishes.filter(dish => dish.category === category);

        // Kontrollerar om det finns rätter i den aktuella kategorin
        if (catDishes.length > 0) {
            // Skapar en ny sektion för kategorin
            const section = document.createElement("section");
            // Skapar en rubrik för kategorin
            const h2 = document.createElement("h2");
            // Sätter kategoriens namn som text i rubriken
            h2.textContent = mainCategories[category];
            // Lägger till rubriken i sektionen
            section.appendChild(h2);

            // Kontrollerar om kategorin är av typen dryck för att hantera underkategorier
            if (category === "drink") {

                // Loopar genom underkategorierna för drycker
                Object.keys(subCategories).forEach(subCat => {
                    // Filtrerar ut drycker som tillhör en specifik underkategori
                    const subCatDishes = catDishes.filter(dish => dish.drinkcategory === subCat);

                    // Kontrollerar om det finns drycker i underkategorin
                    if (subCatDishes.length > 0) {
                        // Skapar en underrubrik för underkategorin
                        const subHeader = document.createElement("h3");
                        // Sätter underkategorins namn som text i underrubriken
                        subHeader.textContent = subCategories[subCat];
                        // Lägger till underrubriken i sektionen
                        section.appendChild(subHeader);

                        // Skapar en div för innehållet 
                        const div = document.createElement("div");

                        // Loopar genom dryckerna och skapar rubrik och paragraf för varje dryck
                        subCatDishes.forEach(dish => {
                            const title = document.createElement("h4"); // Skapar underrubrik för dryckerna
                            title.textContent = `${dish.name} - ${dish.price} kr`; // Sätter innehållet i rubriken till dryckens namn och pris
                           div.appendChild(title); // Lägger till rubrik i div
                            const description = document.createElement("p"); // Skapar paragraf
                            description.textContent = dish.description; // Sätter paragrafens innehåll till rättens beskrivning
                            div.appendChild(description); // Lägger till beskrivningen i diven

                        });
                        // Lägger till innehållet i sektionen
                        section.appendChild(div);
                    }
                });
            } else {
                // Skapar en div för rätter i andra kategorier än drycker
                const div = document.createElement("div");

                // Loopar genom rätterna och skapar rubrik och paragraf för varje rätt
                catDishes.forEach(dish => {
                    const title = document.createElement("h4"); // Skapar rubrik för rätterna
                    title.textContent = `${dish.name} - ${dish.price} kr`; // Sätter rubrikens innehåll till rättens namn och pris
                    div.appendChild(title); // Lägger till rubrik i div
                    const description = document.createElement("p"); // Skapar paragraf
                    description.textContent = dish.description; // Sätter paragrafens innehåll till rättens beskrivning
                    div.appendChild(description); // Lägger till beskrivningen i diven
                });
                // Lägger till listan i sektionen
                section.appendChild(div);
            }
            // Lägger till den sektionen i menyn
            menu.appendChild(section);
        }
    });
}