# DT207G - Backend-baserad webbutveckling, Moment 4.2 Autentisering och säkerhet

## Moment 4.2 WorkXPerience - projektbeskrivning
I detta projekt har en webbapplikation skapats som använder den webbtjänst som skapats i Moment 4.1: "https://github.com/iswe2301/backend-moment4.1.git". Webbapplikationen erbjuder användare att skapa användarkonton samt logga in på sitt konto. Väl inloggad på sitt konto kan användaren komma åt data om jobberfarenheter. Applikationen använder JSON Web Tokens (JWT) för att hantera autentisering, vilket säkerställer att endast behöriga användare kan se information om jobberfarenheter.

## Funktioner
De funktioner som skapats är:
- **Användarregistrering:** Användare kan skapa ett nytt konto genom att ange användarnamn och lösenord. Lösenord måste vara minst 5 tecken långt, annars visas felmeddelande. Användarnamnet måste vara unikt, annars visas felmeddelande. POST-anrop görs till webbtjänsten för att skapa en ny användare och lagra i databasen.
- **Användarinloggning:** Användare kan logga in med sina inloggningsuppgifter. Vid felaktiga inloggningsuppgifter visas felmeddelande. Vid lyckad inloggning sparas en JWT i localStorage för användaren. Denna används för att säkerställa behörighet för förfrågningar som kräver autentisering. JWT:n är giltig som maximalt 1 timme. POST-anrop görs till webbtjänsten för att logga in en befintlig användare och kontrollera mot sparad data.
* **Visa jobberfarenheter:** Inloggade användare kan visa en lista över sina jobberfarenheter. Vid inloggning görs automatiskt ett GET-anrop tillsammans med JWT:n för att hämta jobberfarenheter.
* **Säkerhet:** Autentisering krävs för att se jobberfarenheter. Vid försök att besöka sidan `/get` utan att vara inloggad eller ha en giltig JWT visas ett felmeddelande för klienten, och hen omdirigeras till startsidan för att logga in.
* **Utloggningsfunktion:** När användaren är inloggad på sin sida kan hen välja att logga ut. Vid utloggning så rensas localStorage och användaren omdirigeras till startsidan för inlogg.

## Tekniker
Applikationen är byggd med HTML, CSS (SCSS), och JavaScript. Applikationen använder av Fetch API för att kommunicera med en backend-server där data för användare samt erfarenheter lagras. De ikoner som används är hämtade från FontAwesome.

### Utvecklingsmiljö
* **Node.js och Express:** för utveckling på serversidan och API-hantering (moment 4.1)
* **Parcel:** för att automatisera utvecklingsprocessen och bygga projektet.
* **MongoDB Atlas:** används som databas för lagring av användare och jobberfarenheter.
* **Render:** för publicering av webbtjänsten (moment 4.1).
* **Netlify:** för publicering av webbapplikationen.

## Om
* **Av:** Isa Westling
* **Kurs:** Backend-baserad programmering (DT207G)
* **Program:** Webbutvecklingsprogrammet
* **År:** 2024
* **Skola:** Mittuniversitetet