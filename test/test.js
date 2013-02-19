load("../lib/moip.js");

var valid = moip.creditCard.isValid("4111111111111111");
print("Valid? "+valid);
var cscValid = moip.creditCard.isSecurityCodeValid("12345");
print("CSC Valid? "+cscValid);
var type = moip.creditCard.cardType("5105105105105100");
print("Type "+type["brand"]);
var isExpiryDateValid = moip.creditCard.isExpiryValid("10", "2013");
print("ExpiryDateValid? "+isExpiryDateValid);
