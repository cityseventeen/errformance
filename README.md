# Performance Error
[![Test][test-pass-img]][test-pass-url]
[![Commit Number][commit-number-img]][commit-number-url]

[test-pass-img]: https://github.com/CitySeventeen/Errformance/workflows/Node.js%20CI/badge.svg
[test-pass-url]: https://github.com/CitySeventeen/Errformance/actions/workflows/node.js.yml

[commit-number-img]: https://img.shields.io/github/commit-activity/m/CitySeventeen/Errformance
[commit-number-url]: https://github.com/CitySeventeen/Errformance/commits/main

Permette in modo agevole la disabilitazione degli assert inseriti a scopo di unit test, ad esempio in ambiente di produzione per migliorare le performance.
Pensato anche per chi scrive package e moduli, si può configurare la restituzione di errori o assert senza modificare nulla nel codice;
in questo modo, si possono inserire assert puri per le funzioni interne, o private, e tipi `errformance` nelle interfacce verso l'utilizzatore,
così che possa decidere lui se mantenerli come assert disattivabili in produzione, o come errori puri non disattibili.

## Esempio di utilizzo
```js
//Modulo A
const e = require('errformance')('prod') //gli assert sono attivati se l'ambiente è diverso da prod, oppure si può inserire una callback più complesa per le regole di disattivazione

class interfaccia{
    metodo(arg){
        e.error(typeof arg === 'string', 'messaggio errore') // o anche, come da metodi assert es di chai, errformance.isString(arg, 'messaggio errore')
        return funzioneInterna(arg)
} 
}
function funzioneInterna(arg){
    e.assert(arg === 'valore1' || arg === 'valore2', 'messaggio errore')
    let new_value = maipolaArg(arg)
    return new value
}
module.exports = interfaccia;

//Modulo B
process.env.NODE_ENV = 'prod'
const moduloA = require('moduloA') // -> gli assert vengono disattivati

function funzioneCheUsaModuloA(args){
    /* corpo */}
}

module.exports = funzioneCheUsaModuloA;
```
Ed eventualmente, se a sua volta il modulo B verrà usato in altri progetti (Modulo C), l'utilizzatore potrà decidere se avere restituiti gli errori se sbaglia ad usare l'interfaccia, o dopo esito positivo unit test, trasformarli in assert disabilitabili
```js
//ModuloC

process.env.NODE_ENV = 'dev' // -> gli assert di modulo A sono attivi
const moduloB = require('moduloB')
function unitTest(){/*...*/}
// utilizzo del modulo B in produzione
process.env.NODE_ENV = 'prod' // -> assert disattivati, ma rimangono ancora attivi gli e.error
process.env.ERRFORMANCE = 'assert' // -> gli e.error sono considerati come assert, e quindi essendo NODE_ENV = prod sono disattivati
```
