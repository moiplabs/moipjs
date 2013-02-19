load("../lib/moip.js");


var isExpiryDateValid = moip.creditCard.isExpiryDateValid("10", "2013");
print("ExpiryDateValid? "+isExpiryDateValid);
var isExpiryDateValid = moip.creditCard.isExpiryDateValid("02", "2013");
print("ExpiryDateValid? "+isExpiryDateValid);
var isExpiryDateValid = moip.creditCard.isExpiryDateValid("10", "2010");
print("ExpiryDateValid? "+isExpiryDateValid);
