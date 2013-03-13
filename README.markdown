# Moip JS

## O que é o Moip JS?

É uma biblioteca javascript para auxiliar o seu checkout, identificando e validando um cartão de credito, possibilitando uma melhor experiência para seu usuário.

## É preciso instalar?
Não, basta fazer o download a biblioteca compactada na seguinte URL [https://raw.github.com/moiplabs/moipjs/master/build/moip.min.js].

## Validando um número de cartão de crédito

Para todas as validações é retornado um boolean se a condição é valida ou não. Veja abaixo algumas validações possíveis com o moip.js

### Validando apenas o número de cartão
``` javascript
moip.creditCard.isValid("4111111111111111");
```

### Validando cartão com código de segurança
``` javascript
moip.creditCard.isSecurityCodeValid("5105105105105100", "123");
```

### Identificando a bandeira de um cartão
``` javascript 
moip.creditCard.cardType("5105105105105100");
```
Possíveis retornos:
 * MASTERCARD
 * VISA
 * AMEX
 * DINERS

### Verificado se a data de expiração do cartão
``` javascript
moip.creditCard.isExpiryDateValid("10", "2010");
```
