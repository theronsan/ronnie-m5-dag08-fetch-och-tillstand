# Uppgifter Dag 8 - Fetch och tillstånd

## Steg 1

Skillnaden mot ett JavaScript-objekt är att i JSON måste man använda dubbla citationstecken, exempel:

"id": 1

Och man kan inte ha ett avslutande kommatecken på sista raden, eller skriva kommentarer.

I ett JavaScript-objekt använder man inte citationstecken omkring nyckeln, exempel:

id: 1,

Sista raden kan ha ett kommatecken, och det går att skriva kommentarer med //

## Steg 2

falskFetch returnerar ett objekt som liknar en Response. Status och innehåll bestäms i funktionen.

Anledningen till att testa med en falsk fetch är för att om man gör riktiga anrop går det långsamt, det kan vara instabilt, det går inte att testa error 500, och det kan också vara en kostnadsfråga då en del API:er har begränsningar på hur många anrop man kan göra.

## Steg 8

### Vid 'no throttling' (offline)

**Webbläsaren säger:**

Nedkopplat läge

Firefox kan inte ansluta till servern på localhost:5173
Vad kan du göra åt det?

Klicka på “Försök igen” för att byta till uppkopplat läge och ladda om sidan.

### Vid Slow 3G

Texten 'Laddar...' visas efter att jag har klickat på Hämta väder-knappen.

### Om data/meny.json inte finns

Det visas ett felmeddelande:

`Något gick fel: JSON.parse: unexpected character at line 1 column 1 of the JSON data`

### Om meny.json är tom []

Det visas ett meddelande:

Inga rätter hittades.
