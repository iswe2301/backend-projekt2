# DT207G - Backend-baserad webbutveckling, Moment 5.2 Projekt
Detta projekt omfattar frontend-delen av en webbapplikation som interagerar med backend-webbtjänsten "https://github.com/iswe2301/backend-projekt.git". Applikationen tillåter användare att se meny, boka bord, skicka meddelanden, lämna och se recensioner. En administrativ del finns också, vilken kräver autentisering och erbjuder funktionaliteter som att hantera meny, bokningar, och recensioner.

## Funktioner
### Allmänna Funktioner
- **Se meny:** Användare kan bläddra genom en lista med rätter sorterade efter kategori.
- **Boka bord:** Användare kan fylla i ett formulär för att göra en bordsbokning. Vid lyckad bokning skickas en e-postbekräftelse till användaren.
- **Skicka meddelande:** Möjlighet att skicka ett meddelande via ett kontaktformulär. Vid lyckad sändning av meddelandet skickas en e-postbekräftelse.
- **Lämna recensioner:** Användare kan skriva recensioner om deras upplevelser.
- **Se recensioner:** Alla besökare kan se recensioner som andra lämnat.

### Administrativa Funktioner (Kräver autentiserad inloggning med JWT)
- **Hantera bokningar:** Översikt över alla bokningar från aktuellt datum och framåt.
- **Hantera meny:** Lägg till, uppdatera och ta bort rätter från menyn.
- **Registrera ny admin:** Admin kan registrera en ny användare som ska bli admin genom att skapa användarnmn och lösenord.
- **Hantera inkomna meddelanden:** Se inkomna meddelanden och svara på meddelanden.
- **Byta bakgrundsbild:** Ändra applikationens bakgrundsbild genom att ladda upp en ny bild. Uppdateras automatiskt i både öppna och låsta miljön.

## Säkerhet
Applikationen använder JSON Web Tokens (JWT) för att hantera autentisering och säkerställa att endast behöriga användare kan åtkomst de administrativa funktionerna. JWT sparas i localStorage 1 timme.

## Tekniker
Applikationen är byggd med:
- **HTML/CSS:** För struktur och design.
- **JavaScript:** För logik och interaktion på klientsidan inklusive Fetch API för kommunikation med backend.

### Utvecklingsmiljö
* **Node.js och Express:** Används på backend för att hantera API-anrop (se backend-projektet moment 5.1).
* **Parcel:** för att automatisera utvecklingsprocessen och bygga projektet.
* **MongoDB Atlas:** används som databas för lagring av användare och jobberfarenheter.
* **Render:** för publicering av webbtjänsten (moment 5.1).
* **Netlify:** för publicering av webbapplikationen.

## Om
* **Av:** Isa Westling
* **Kurs:** Backend-baserad programmering (DT207G)
* **Program:** Webbutvecklingsprogrammet
* **År:** 2024
* **Skola:** Mittuniversitetet