# Moip JS

[![Build Status](https://secure.travis-ci.org/moiplabs/moipjs.png)](https://travis-ci.org/moiplabs/moipjs)

## O que é o Moip JS?

É uma biblioteca javascript para auxiliar o seu checkout, identificando e validando um cartão de credito, possibilitando uma melhor experiência para seu usuário.

## É preciso instalar?
Não, basta fazer o download a biblioteca compactada na seguinte URL [https://raw.github.com/moiplabs/moipjs/master/build/moip.min.js].

## Validando um número de cartão de crédito

Para todas as validações é retornado um boolean se a condição é valida ou não. Veja abaixo algumas validações possíveis com o moip.js

### Validando apenas o número de cartão
``` javascript
moip.creditCard.isValid("4111111111111111");    //return true
moip.creditCard.isValid("4111 1111-1111.1111"); //return true
moip.creditCard.isValid("1919191919191919");    //return false
moip.creditCard.isValid("41111");               //return false
```
Possíveis retornos:
* true ou false

### Validando cartão com código de segurança
``` javascript
moip.creditCard.isSecurityCodeValid("5105105105105100", "123");    //return true
moip.creditCard.isSecurityCodeValid("5105105105105100", "12");     //return false
```
Possíveis retornos:
* true ou false

### Identificando a bandeira de um cartão
``` javascript 
moip.creditCard.cardType("5105105105105100");    //return [Object]MASTERCARD
moip.creditCard.cardType("4111111111111111");    //return [Object]VISA
moip.creditCard.cardType("341111111111111");     //return [Object]AMEX
moip.creditCard.cardType("30569309025904");      //return [Object]DINERS
moip.creditCard.cardType("3841001111222233334"); //return [Object]HIPERCARD
moip.creditCard.cardType("9191919191919191");    //return [Object]null

card = moip.creditCard.cardType("5105105105105100"); 
cardIs = card.brand; // MASTERCARD
```
Possíveis retornos:
Object: [brand]
 * MASTERCARD
 * VISA
 * AMEX
 * DINERS
 * HIPERCARD

### Verificado se a data de expiração do cartão
``` javascript
moip.creditCard.isExpiryDateValid("10", "2020");    //return true
moip.creditCard.isExpiryDateValid("10", "2000");    //return false

//Usando objeto Date
var now = new Date();
var isExpiryDateValid = moip.creditCard.isExpiryDateValid(now.getMonth()+1+"", now.getYear()+1900+""); // return true
```
Possíveis retornos:
* true ou false