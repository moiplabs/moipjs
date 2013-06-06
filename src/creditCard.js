	creditCard: {
		isValid: function(creditCardNumber) {
			creditCardNumber = creditCardNumber.replace(/\s+/g, '');
			creditCardNumber = creditCardNumber.replace(/\./g, '');
			creditCardNumber = creditCardNumber.replace(/\-/g, '');

			var cardType = this.cardType(creditCardNumber);
			if (cardType == null){
				return false;
			} else if (cardType["brand"] == "HIPERCARD") {
				return true; // There's no validation for hipercard.
			} else {
				// Luhn algorithm: http://en.wikipedia.org/wiki/Luhn_algorithm
				var checksum = 0;
				for (var i=(2-(creditCardNumber.length % 2)); i<=creditCardNumber.length; i+=2) {
					checksum += parseInt(creditCardNumber.charAt(i-1));
				}
			  // Analyze odd digits in even length strings or even digits in odd length strings.
			  for (var i=(creditCardNumber.length % 2) + 1; i<creditCardNumber.length; i+=2) {
			  	var digit = parseInt(creditCardNumber.charAt(i-1)) * 2;
			  	if (digit < 10) { checksum += digit; } else { checksum += (digit-9); }
			  }
			  if ((checksum % 10) == 0) return true; else return false;
			}
		},

		cardType: function(creditCardNumber) {
			creditCardNumber = creditCardNumber.replace(/\s+/g, '');
			creditCardNumber = creditCardNumber.replace('.', '');
			creditCardNumber = creditCardNumber.replace('-', '');
			var regexpVisa = /^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/;
			var regexpMaster = /^5[1-5]\d{2}-?\d{4}-?\d{4}-?\d{4}$/;
			var regexpAmex = /^3[4,7]\d{13}$/;
			var regexpDiners = /^3[0,6,8]\d{12}$/;
			var regexHiper = /^(606282\d{10}(\d{3})?)|(3841\d{15})$/;

			if(creditCardNumber.match(regexpVisa))
				return {"brand":"VISA"};

			if(creditCardNumber.match(regexpMaster))
				return {"brand":"MASTERCARD"};

			if(creditCardNumber.match(regexpAmex))
				return {"brand": "AMEX"};

			if(creditCardNumber.match(regexpDiners))
				return {"brand": "DINERS"};

			if(creditCardNumber.match(regexHiper))
				return {"brand": "HIPERCARD"}

			return null;
		},

		isSecurityCodeValid: function(creditCardNumber, csc) {
			var type = moip.creditCard.cardType(creditCardNumber);
			if(type["brand"] == "AMEX") {
				var digits = 4;
			} else {
				var digits = 3;
			}
			var regExp = new RegExp('[0-9]{' + digits + '}');
			return (csc.length == digits && regExp.test(csc));
		},

		isExpiryDateValid: function(month, year) {
			if(month < 1 || month > 12)
				return false;
			if(!year.length == 2 || !year.length == 4)
				return false;
			if(year.toString().length == 2) {
				if(year > 80) {
					year = "19" + year;
				} else {
					year = "20" + year;
				}
			}
			if(year < 1000 || year >= 3000)
				return false;
			return !this.isExpiredDate(month, year);
		},

		isExpiredDate: function(month, year) {
			var now = new Date();
			var thisMonth = ("0" + (now.getMonth() + 1)).slice(-2);
			var thisYear = now.getYear() + 1900;

			month = ("0" + (month)).slice(-2);
			if(year.toString().length == 2) {
				if(year > 80) {
					return true;
				} else {
					year = "20" + year;
				}
			}
			var currentDate = thisYear + thisMonth;
			var customerDate = year + month;
			return parseInt(customerDate) < parseInt(currentDate)
		},
	}