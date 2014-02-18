(function(window) {
    var moip = window.moip || {};
    window.moip = moip;

    function normalizeCardNumber(cardNumber) {

        // converts it's value to a string
        cardNumber += '';

        return cardNumber.replace(/[\s+|\.|\-]/g, '');
    }

    function CreditCard() {
        if ( !( this instanceof CreditCard ) ) {
            return new CreditCard();
        }
    }

    CreditCard.prototype = {
        isValid: function(creditCardNumber) {
            var cardType = CreditCard.prototype.cardType(creditCardNumber);

            creditCardNumber = normalizeCardNumber(creditCardNumber);

            if (!cardType){
                return false;
            } else if (cardType.brand === "HIPERCARD") {
                return true; // There's no validation for hipercard.
            } else {
                // Luhn algorithm: http://en.wikipedia.org/wiki/Luhn_algorithm
                var checksum = 0;
                for (var i=(2-(creditCardNumber.length % 2)); i<=creditCardNumber.length; i+=2) {
                    checksum += parseInt(creditCardNumber.charAt(i-1), 10);
                }
                // Analyze odd digits in even length strings or even digits in odd length strings.
                for (i=(creditCardNumber.length % 2) + 1; i<creditCardNumber.length; i+=2) {
                    var digit = parseInt(creditCardNumber.charAt(i-1), 10) * 2;
                    if (digit < 10) { checksum += digit; } else { checksum += (digit-9); }
                }
                if ((checksum % 10) === 0) {
                    return true; 
                } else {
                    return false;
                }
            }
        },

        cardType: function(creditCardNumber, loose) {
            var brand, result,
                brands = {
                    VISA: /^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/,
                    MASTERCARD: /^5[1-5]\d{2}-?\d{4}-?\d{4}-?\d{4}$/,
                    AMEX: /^3[4,7]\d{13}$/,
                    DINERS: /^3[0,6,8]\d{12}$/,
                    HIPERCARD: /^(606282\d{10}(\d{3})?)|(3841\d{15})$/
                },

                // for non-strict detections
                looseBrands = {
                    VISA: /^4\d{3}-?\d{2}/,
                    MASTERCARD: /^5[1-5]\d{2}-?\d{2}/,
                    AMEX: /^3[4,7]\d{2}/,
                    DINERS: /^3(?:0[0-5]|[68][0-9])+/,
                    HIPERCARD: /^606282|3841\d{2}/
                };

            creditCardNumber = normalizeCardNumber(creditCardNumber);

            if (loose) {
                brands = looseBrands;
            }

            for (brand in brands) {
                if (brands.hasOwnProperty(brand) &&
                    creditCardNumber.match(brands[brand])) {
                    result = { brand : brand };
                }
            }

            return result;
        },

        isSecurityCodeValid: function(creditCardNumber, csc) {
            var type = moip.creditCard.cardType(creditCardNumber),
                digits;
            
            digits = (type.brand === "AMEX") ? 4 : 3;
            
            var regExp = new RegExp('[0-9]{' + digits + '}');
            
            return (csc.length === digits && regExp.test(csc));
        },

        isExpiryDateValid: function(month, year) {
            month = parseInt(month, 10);
            year = parseInt(year, 10);

            if(month < 1 || month > 12) {
                return false;
            }
            if((year+'').length !== 2 && (year+'').length !== 4) {
                return false;
            }
            if((year+'').length === 2) {
                if(year > 80) {
                    year = "19" + year;
                } else {
                    year = "20" + year;
                }
            }
            if(year < 1000 || year >= 3000) {
                return false;
            }
            return !CreditCard.prototype.isExpiredDate(month, year);
        },

        isExpiredDate: function(month, year) {
            var now = new Date();
            var thisMonth = ("0" + (now.getMonth() + 1)).slice(-2);
            var thisYear = now.getFullYear();

            month = ("0" + (month)).slice(-2);
            if(year.toString().length === 2) {
                if(year > 80) {
                    return true;
                } else {
                    year = "20" + year;
                }
            }
            var currentDate = thisYear + thisMonth;
            var customerDate = year + month;
            return parseInt(customerDate, 10) < parseInt(currentDate, 10);
        }
    };

    moip.creditCard = CreditCard();
    
})(window);
