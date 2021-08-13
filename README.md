# Easy token

Proyecto para mejorar la usabilidad y características de tokens en sidechains

## Flujo funcional

Cuando se crean puentes de tokens entre una mainchain y una sidechain, normalmente el token en la segunda capa tiene unas funcionalidades muy limitadas y básicas, aparte de ser de naturaleza ERC20.

Para aumentar las funcionalidades básicas, se programarán una serie de smart contracts que permitan depositar este token ERC20 básico de la sidechain, y a cambio mintear una cantidad igual a la depositada de un token potenciado. Ver [Wrapped ETH](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code) para entender la funcionalidad. Al token "aumentado" de la sidechain lo llamaremos Easy Token.

En cualquier momento un poseedor de Easy Tokens puede realizar la operación contraria, quemando Easy Tokens para recibir a cambio una cantidad de tokens básicos equivalente.

## Características aumentadas

El Easy Token tendrá de base las siguientes características:

- Será ERC777
- Tendrá una función disponible solo para el owner, de añadir o quitar `defaultOperators`
- Implementará la interfaz de proxy de OpenZeppelin para permitir actualizaciones

## Configuración

Crear un `.secrets.json` con el siguiente formato:

```
{
  "mnemonic": "<12 or 24 words mnemonic seed>",
}

```