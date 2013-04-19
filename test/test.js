load("../lib/moip.js");


var valid = moip.creditCard.isValid("4111111111111111");
print("Valid? "+valid);
valid = moip.creditCard.isValid("4111 1111 1111 1111");
print("Valid? "+valid);
valid = moip.creditCard.isValid("4111.1111.1111.1111");
print("Valid? "+valid);
valid = moip.creditCard.isValid("4111-1111-1111-1111");
print("Valid? "+valid);
var cscValid = moip.creditCard.isSecurityCodeValid("12345");
print("CSC Valid? "+cscValid);
var type = moip.creditCard.cardType("5105105105105100");
print("Type? "+type["brand"]);
type = moip.creditCard.cardType("4111111111111111");
print("Type? "+type["brand"]);
type = moip.creditCard.cardType("4111 1111 1111 1111");
print("Type? "+type["brand"]);
type = moip.creditCard.cardType("341111111111111");
print("Type? "+type["brand"]);
var now = new Date();
var isExpiryDateValid = moip.creditCard.isExpiryDateValid(now.getMonth()+1+"", now.getYear()+1900+"");
isExpiryDateValid = moip.creditCard.isExpiryDateValid("10", "2010");

