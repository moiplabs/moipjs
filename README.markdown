# Moip JS

## O que é o Moip JS?

É uma biblioteca javascript para auxiliar o seu checkout, identificando e validando um cartão de credito, possibilitando uma melhor experiência para seu usuário.

## É preciso instalar?
Não, basta fazer o download a biblioteca compactada na seguinte URL.

## Validando um número de cartão de crédito

### Validando apenas o número de cartão
``` javascript
moip.creditCard.isValid("4111111111111111");
```
A validação acima irá retornar um boolean informando se o cartão é valido ou não.

### Validando cartão com código de segurança
``` javascript
moip.creditCard.isSecurityCodeValid("5105105105105100", "123");
```

