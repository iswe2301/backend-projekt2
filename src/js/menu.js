"use strict"

import { url } from "./main"; // Importerar URL
import { menuContainer } from "./main"; // Importerar container för meny
import { displayErrors, loadingEl, loadingIcon } from "./booking";

const updateForm = document.getElementById("update-form"); // Hämtar uppdateringsformulär

// Asynkron funktion för att hämta menyn
export async function fetchMenu() {

    loadingIcon.style.display = "block"; // Visar laddningsikon

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
    menuContainer.style.display = "flex"; // Visar container
    menuContainer.innerHTML = ""; // Tömmer ev. tidigare innehåll i containern
    loadingIcon.style.display = "none"; // Döljer laddningsikon
    loadingEl.style.display = "none"; // Döljer span för "laddning" av sidan

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

                            // Lagrar variabel för klassen "admin-menu", kontrollerar om menucontainer innehåller klassen
                            const adminMenu = menuContainer.classList.contains("admin-menu")

                            // Kontrollerar om admin-menu finns på sidan (true)
                            if (adminMenu) {
                                const updateBtn = document.createElement("button"); // Skapar en uppdateringsknapp för varje rätt
                                updateBtn.innerHTML = "Ändra <i class='fa-solid fa-pen-to-square'></i>"; // Sätter innehållet på knappen
                                updateBtn.addEventListener("click", () => { // Skapar händelselyssnare vid klick
                                    showUpdateForm(dish); // Anropar funktion för att visa uppdateringsformuläret
                                });
                                div.appendChild(updateBtn); // Lägger till knappen i diven

                                const deleteBtn = document.createElement("button"); // Skapar en raderingsknapp
                                deleteBtn.innerHTML = "Ta bort <i class='fa-solid fa-trash-can'></i>"; // Sätter innehållet
                                deleteBtn.addEventListener("click", () => { // Skapar händelselyssnare vid klick
                                    deleteDish(dish._id); // Anropar funktion för att radera rätten, skickar med ID
                                });
                                div.appendChild(deleteBtn); // Lägger till knappen i diven
                            }

                            // Lägger till innehållet i sektionen
                            section.appendChild(div);
                        });
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

                    // Lagrar variabel för klassen "admin-menu", kontrollerar om menucontainer innehåller klassen
                    const adminMenu = menuContainer.classList.contains("admin-menu")

                    // Kontrollerar om admin-menu finns på sidan (true)
                    if (adminMenu) {
                        const updateBtn = document.createElement("button"); // Skapar en uppdateringsknapp för varje rätt
                        updateBtn.innerHTML = "Ändra <i class='fa-solid fa-pen-to-square'></i>"; // Sätter innehållet på knappen
                        updateBtn.addEventListener("click", () => { // Skapar händelselyssnare vid klick
                            showUpdateForm(dish); // Anropar funktion för att visa uppdateringsformuläret
                        });
                        div.appendChild(updateBtn); // Lägger till knappen i diven

                        const deleteBtn = document.createElement("button"); // Skapar en raderingsknapp
                        deleteBtn.innerHTML = "Ta bort <i class='fa-solid fa-trash-can'></i>"; // Sätter innehållet
                        deleteBtn.addEventListener("click", () => { // Skapar händelselyssnare vid klick
                            deleteDish(dish._id); // Anropar funktion för att radera rätten, skickar med ID
                        });
                        div.appendChild(deleteBtn); // Lägger till knappen i diven
                    }
                    // Lägger till diven i sektionen
                    section.appendChild(div);
                });
            }
            // Lägger till den sektionen i menyn
            menuContainer.appendChild(section);
        }
    });
}

// Asynkron funkltion för att radera en rätt från menyn
async function deleteDish(id) {
    // Skickar ett DELETE-anrop med fetch API till webbtjänsten
    try {
        const response = await fetch(`${url}dishes/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("JWT"), // Hämtar JWT från lS och skickar med
                "Content-Type": "application/json"
            }
        });

        // Inväntar svaret och konverterar till json
        const data = await response.json();

        // Kontrollerar om svaret är lyckat
        if (response.ok) {
            fetchMenu(); // Anropar funktion för att hämta menyn med rätter

            // Lagrar variabel för popup
            let popupMsg = document.querySelector(".popup");
            popupMsg.classList.add("show"); // Lägger till klassen show för popup
            popupMsg.innerHTML = "Rätten har tagits bort"; // Skapar innehållet för popupen

            // Döljer popup efter 3 sekunder
            setTimeout(function () {
                popupMsg.classList.remove("show"); // Tar bort show-klassen
                popupMsg.innerHTML = ""; // Tömmer innehållet
            }, 3000); // 3 sekunder
        } else {
            throw new Error(data.message); // Kastar ett felmeddelande om fel uppstår
        }
        // Fångar upp ev fel
    } catch (error) {
        console.error("Fel vid radering av rätt: ", error);
    }
}

// Funktion för att visa uppdateringsformuläret
function showUpdateForm(dish) {
    // Hämtar element från DOM
    const dishName = document.getElementById("up-name");
    const dishDesc = document.getElementById("up-desc");
    const dishPrice = document.getElementById("up-price");
    const submitUpdate = document.getElementById("submitUpdate");

    // Fyller i formuläret med rättens information
    dishName.value = dish.name;
    dishDesc.value = dish.description || ""; // Alternativt tom
    dishPrice.value = dish.price;

    // Visar formuläret
    updateForm.style.display = "flex";

    // Scrollar till formulärets position med ett mjukt beteende
    updateForm.scrollIntoView({ behavior: "smooth" });

    // Lägger till en händelselyssnare vid klick på uppdatera-knappen
    submitUpdate.addEventListener("click", (event) => {
        event.preventDefault(); // Förhindrar standarbeteende på formulär

        // Skapar ett objekt med den uppdaterade informationen för rätten
        const updatedDish = {
            name: dishName.value,
            description: dishDesc.value,
            price: dishPrice.value
        };

        // Anropar funktion för att uppdatera rätten, skickar med id + objektet
        updateDish(dish._id, updatedDish);
    });
}

// Asynkron funkltion för att radera en rätt från menyn
async function updateDish(id, dish) {

    // Skickar ett PUT-anrop med fetch API till webbtjänsten
    try {
        const response = await fetch(`${url}dishes/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("JWT"), // Hämtar JWT från lS och skickar med
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dish)
        });

        // Inväntar svaret och konverterar till json
        const data = await response.json();

        // Kontrollerar om svaret är lyckat
        if (!response.ok) {
            console.error("Fel vid uppdatering: ", data); // Skriver ut fel till konsollen
            displayErrors(data.errors);  // Anropar funktion för att visa felen
            return; // Avbryter funktionen
        } else {
            updateForm.reset(); // Återställer formuläret
            updateForm.style.display = "none"; // Döljer formuläret

            fetchMenu(); // Anropar funktion för att hämta menyn med rätter
            // Scrollar till menyns startposition med ett mjukt beteende
            menuContainer.scrollIntoView({ behavior: "smooth" });

            // Lagrar variabel för popup
            let popupMsg = document.querySelector(".popup");
            popupMsg.classList.add("show"); // Lägger till klassen show för popup
            popupMsg.innerHTML = "Rätten har uppdaterats"; // Skapar innehållet för popupen

            // Döljer popup efter 3 sekunder
            setTimeout(function () {
                popupMsg.classList.remove("show"); // Tar bort show-klassen
                popupMsg.innerHTML = ""; // Tömmer innehållet
            }, 3000); // 3 sekunder
        }
        // Fångar upp ev. fel
    } catch (error) {
        console.error("Fel vid uppdatering av rätt: ", error);
    }
}

// Asynkron funktion för att lägga till en ny rätt i menyn
export async function addNewDish() {

    // Hämtar värdena från formuläret
    const name = document.getElementById('dish-name').value;
    const description = document.getElementById('dish-description').value;
    const category = document.getElementById('dish-category').value;
    const drinkCategory = document.getElementById('dish-drink-category').value;
    const price = document.getElementById('dish-price').value;
    const addDishForm = document.getElementById("add-dish-form");

    // Skapar ett objekt med formulärets värden
    const dishData = {
        name,
        description,
        category,
        drinkCategory,
        price
    };

    try {
        // Skickar ett POST-anrop med fetch till webbtjänsten
        const response = await fetch(`${url}dishes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("JWT")}` // Hämtar token och skickar med
            },
            body: JSON.stringify(dishData)
        });

        // Inväntar svaret och konverterar till json
        const result = await response.json();

        // Kontrollerar om svaret är lyckat
        if (!response.ok) {
            console.error("Fel vid tilläggning: ", result); // Skriver ut fel till konsollen
            displayErrors(result.errors);  // Anropar funktion för att visa felen
            return; // Avbryter funktionen
        } else {

            addDishForm.reset(); // Återställer formuläret
            addDishForm.style.display = "none"; // Döljer formuläret

            fetchMenu(); // Anropar funktion för att hämta menyn med rätter
            // Scrollar till menyns startposition med ett mjukt beteende
            menuContainer.scrollIntoView({ behavior: "smooth" });

            // Lagrar variabel för popup
            let popupMsg = document.querySelector(".popup");
            popupMsg.classList.add("show"); // Lägger till klassen show för popup
            popupMsg.innerHTML = "Rätten har lagts till"; // Skapar innehållet för popupen

            // Döljer popup efter 3 sekunder
            setTimeout(function () {
                popupMsg.classList.remove("show"); // Tar bort show-klassen
                popupMsg.innerHTML = ""; // Tömmer innehållet
            }, 3000); // 3 sekunder
        }
        // Fångar upp ev. fel
    } catch (error) {
        console.error("Fel vid tilläggning av rätt: ", error);
    }
}