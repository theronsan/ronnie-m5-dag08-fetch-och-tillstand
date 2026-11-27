// Dag 8: koppla ihop allt.
// Du har en färdig sida från dag 5. Nu ska menyn och vädret hämtas med fetch, med tre tillstånd.
// Läs hela filen först. Gör sedan TODO-punkterna i ordning och testa i webbläsaren efter varje.
import { visaMeny, uppdateraRubrik, markeraDagensRatt, visaOrder } from './ui'
import { billigast } from './meny'
import { filtreraMeny } from './filter'
import { kopplaFilter, kopplaLaggTill } from './events'
import { laggTillIOrder, rensaOrder } from './order'
import { hamtaMeny, hamtaVader } from './api'
import { laddaMeny, laddaData } from './tillstand'
import { visaTillstand, visaVader } from './tillstand-ui'
import { hamta } from './dom'
import type { Ratt, Filter, OrderRad, KlarMeny, Vader, FetchFn } from './typer'

// Sätt till true om väder-API:et inte fungerar (till exempel på skolans nät).
const ANVAND_RESERVDATA = false

const STADER: Record<string, { namn: string; lat: number; lon: number }> = {
    stockholm: { namn: 'Stockholm', lat: 59.33, lon: 18.07 },
    goteborg: { namn: 'Göteborg', lat: 57.71, lon: 11.97 },
    malmo: { namn: 'Malmö', lat: 55.6, lon: 13.0 },
    kiruna: { namn: 'Kiruna', lat: 67.86, lon: 20.23 }
}

const lista = hamta('#meny-lista')
const rubrik = hamta('#meny-rubrik')
const filterGrupp = hamta('#filter')
const vaderForm = hamta('#vader-form')
const stadVal = hamta<HTMLSelectElement>('#stad')
const vaderResultat = hamta('#vader-resultat')

// Menyn finns inte från början längre. Den hämtas, och sparas här när den kommit.
let meny: Ratt[] = []
let aktivtFilter: Filter = 'alla'

// ---- Menyn ----
function ritaMeny(): void {
    const ratter = filtreraMeny(meny, aktivtFilter)
    visaMeny(lista, ratter)
    uppdateraRubrik(rubrik, ratter.length)
    const lunch = ratter.filter((ratt) => ratt.kategori === 'lunch')
    if (lunch.length > 0) {
        const dagens = billigast(lunch)
        if (dagens) {
            markeraDagensRatt(lista, dagens.id)
        }
    }
}

// TODO 1: Skriv laddaMenyn(). Den ska anropa laddaMeny(() => hamtaMeny(), vidTillstand).
//   I vidTillstand anropar du visaTillstand(lista, tillstand, { vidForsokIgen, visaKlar }).
//   - vidForsokIgen: laddaMenyn själv (så att knappen "Försök igen" fungerar).
//   - visaKlar: spara tillstand.ratter i variabeln meny, anropa ritaMeny() och uppdatera ordern med visaOrder.
function laddaMenyn(): void {
    laddaMeny(
        () => hamtaMeny(),
        (vidTillstand) => {
            visaTillstand(lista, vidTillstand, {
                vidForsokIgen: laddaMenyn,
                visaKlar: (_container: HTMLElement, tillstand: KlarMeny) => {
                    meny = tillstand.ratter
                    ritaMeny()
                    visaOrder(orderRef, order, meny)
                }
            })
        }
    )
}

kopplaFilter(filterGrupp, (filter) => {
    aktivtFilter = filter
    if (meny.length > 0) {
        ritaMeny()
    }
})

// ---- Beställningen (som förut) ----
let order: OrderRad[] = []
const orderRef = {
    lista: hamta('#order-lista'),
    summa: hamta('#order-summa'),
    tom: hamta('#order-tom')
}
kopplaLaggTill(lista, (id) => {
    order = laggTillIOrder(order, id)
    visaOrder(orderRef, order, meny)
})
hamta('#rensa-order').addEventListener('click', () => {
    order = rensaOrder()
    visaOrder(orderRef, order, meny)
})

// ---- Vädret ----
// Vid reservläge byter vi ut fetch mot en funktion som läser en lokal fil.
const vaderFetch: FetchFn = ANVAND_RESERVDATA
    ? () => fetch('data/vader-stockholm.json')
    : fetch

// TODO 2: Skriv laddaVader(). Hämta vald stad: STADER[stadVal.value].
//   Anropa laddaData(() => hamtaVader(stad.lat, stad.lon, vaderFetch), vidTillstand).
//   I vidTillstand: visaTillstand(vaderResultat, tillstand, { vidForsokIgen: laddaVader, visaKlar }).
//   visaKlar ska anropa visaVader(container, stad.namn, tillstand.data).
function laddaVader(): void {
    const stad = STADER[stadVal.value]
    laddaData(
        () => hamtaVader(stad.lat, stad.lon, vaderFetch),
        (tillstand) => {
            visaTillstand(vaderResultat, tillstand, {
                vidForsokIgen: laddaVader,
                visaKlar: (
                    container: HTMLElement,
                    tillstand: { typ: 'klar'; data: Vader }
                ) => {
                    visaVader(container, stad.namn, tillstand.data)
                }
            })
        }
    )
}

// TODO 3: Lyssna på submit på vaderForm. Anropa preventDefault och sedan laddaVader().

vaderForm.addEventListener('submit', (event) => {
    event.preventDefault()
    laddaVader()
})

// ---- Start ----
visaOrder(orderRef, order, meny)
laddaMenyn()
laddaVader()
