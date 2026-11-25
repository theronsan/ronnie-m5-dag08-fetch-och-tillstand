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
