import type { Ratt, Vader, FetchFn } from './typer'

// Vi måste beskriva formen på svaret i hamtaVader
// annars Error: 'data' is of type 'unknown'.
type VaderSvar = {
    current?: {
        temperature_2m: number
        wind_speed_10m: number
        weather_code: number
    }
}

// Dag 8: riktiga nätanrop med fetch.
// Alla funktioner tar emot fetchFn (som standard den riktiga fetch). I testerna skickar vi in en
// falsk fetch, så att testerna inte behöver internet.

// 1. Hämta JSON från en url.
//    - Anropa fetchFn(url).
//    - Går själva anropet fel (inget nät): kasta new Error("Kunde inte nå servern. Kontrollera din anslutning.")
//    - Svarar servern med fel (svar.ok är false): kasta new Error(`Servern svarade ${svar.status}`)
//    - Annars: returnera await svar.json().
//    Tips: fetch kastar INTE fel för 404 eller 500. Du måste själv kolla svar.ok.
export async function hamtaJson(
    url: string,
    fetchFn: FetchFn = fetch
): Promise<unknown> {
    // TODO

    // Deklarerar variabeln
    let svar: Awaited<ReturnType<FetchFn>>

    try {
        svar = await fetchFn(url)
    } catch {
        throw new Error('Kunde inte nå servern. Kontrollera din anslutning.')
    }
    if (!svar.ok) {
        throw new Error(`Servern svarade ${svar.status}`)
    }
    return await svar.json()
}

// 2. Hämta menyn från "data/meny.json" med hamtaJson.
//    Är svaret inte en array: kasta new Error("Menyn hade ett oväntat format").
export async function hamtaMeny(fetchFn: FetchFn = fetch): Promise<Ratt[]> {
    // TODO

    // Hämtar menyn
    const svar = await hamtaJson('data/meny.json', fetchFn)
    // Kollar om svaret är en array
    if (!Array.isArray(svar)) {
        throw new Error('Menyn hade ett oväntat format')
    }
    return svar as Ratt[]
}

// 3. Hämta aktuellt väder från Open-Meteo.
//    Url: https://api.open-meteo.com/v1/forecast?latitude=LAT&longitude=LON&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto
//    Svaret har data.current med temperature_2m, wind_speed_10m och weather_code.
//    Returnera { temperatur, vindhastighet, kod }.
//    Saknas data.current: kasta new Error("Oväntat svar från väder-API:et").
export async function hamtaVader(
    lat: number,
    lon: number,
    fetchFn: FetchFn = fetch
): Promise<Vader> {
    // TODO

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`

    const data = (await hamtaJson(url, fetchFn)) as VaderSvar

    if (!data.current) {
        throw new Error('Oväntat svar från väder-API:et')
    }
    return {
        temperatur: data.current.temperature_2m,
        vindhastighet: data.current.wind_speed_10m,
        kod: data.current.weather_code
    }
}

// 4. Översätt en väderkod (WMO) till svensk text:
//    0 "klart", 1-3 "mest klart eller molnigt", 45 och 48 "dimma", 51-57 "duggregn",
//    61-67 "regn", 71-77 "snö", 80-82 "regnskurar", 85-86 "snöbyar", 95-99 "åska".
//    Allt annat: "okänt väder".
export function tolkaVaderkod(kod: number): string {
    // TODO

    if (kod === 0) {
        return 'klart'
    } else if (kod >= 1 && kod <= 3) {
        return 'mest klart eller molnigt'
    } else if (kod === 45 || kod === 48) {
        return 'dimma'
    } else if (kod >= 51 && kod <= 57) {
        return 'duggregn'
    } else if (kod >= 61 && kod <= 67) {
        return 'regn'
    } else if (kod >= 71 && kod <= 77) {
        return 'snö'
    } else if (kod >= 80 && kod <= 82) {
        return 'regnskurar'
    } else if (kod >= 85 && kod <= 86) {
        return 'snöbyar'
    } else if (kod >= 95 && kod <= 99) {
        return 'åska'
    } else {
        return 'okänt väder'
    }

    // Notering till mig själv
    // Det fungerar även att skriva så här:

    // if (kod === 0) return 'klart'
    // if (kod >= 1 && kod <= 3) return 'mest klart eller molnigt'
    // ...
    // return 'okänt väder'

    // När en return körs avslutas funktionen direkt. Därför behövs inget else. Om villkoret var sant har funktionen redan returnerat.
    // Det kallas early return. Den sista raden blir ett naturligt "allt annat".
}
