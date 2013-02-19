var moip = {
	creditCard: {
	 	isValid: function(creditCardNumber) {
			creditCardNumber = creditCardNumber.replace(/\s+/g, '');
			creditCardNumber = creditCardNumber.replace(/\./g, '');
			creditCardNumber = creditCardNumber.replace(/\-/g, '');
			// Luhn algorithm: http://en.wikipedia.org/wiki/Luhn_algorithm
			var checksum = 0;
			var valid = false;
			for(var i = 0; i < creditCardNumber.length; i++) {
				if(!isNaN(creditCardNumber.charAt(i))) {
					var val = parseInt(creditCardNumber.charAt(i)); 
					if(i % 2 == 0) {
						checksum += val * 2;
					} else {
						checksum += val;
					}
				} else {
					return false;
				} 
			}
			return checksum % 10 == 0;
		},
		
		cardType: function(creditCardNumber) {
			creditCardNumber = creditCardNumber.replace(/\s+/g, '');
			creditCardNumber = creditCardNumber.replace('.', '');
			creditCardNumber = creditCardNumber.replace('-', '');
			var regexpVisa = /^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/;
      var regexpMaster = /^5[1-5]\d{2}-?\d{4}-?\d{4}-?\d{4}$/;
      var regexpAmex = /^3[4,7]\d{13}$/;
      var regexpDiners = /^3[0,6,8]\d{12}$/;
			if(creditCardNumber.match(regexpVisa)) {
				return {"brand":"VISA"};
			}
			if(creditCardNumber.match(regexpMaster)) {
				return {"brand":"MASTER CARD"};
			}
			if(creditCardNumber.match(regexpAmex)) {
				return {"brand": "AMEX"};
			}
			if(creditCardNumber.match(regexpDiners)) {
				return {"brand": "DINERS"};
			}
			return null;
		},
		
		isSecurityCodeValid: function(creditCardNumber, csc) {
			var type = moip.creditCard.cardType(creditCardNumber);
			if(type["brand"] == "4") {
				var digits = 4;
			} else {
				var digits = 3;
			}
			var regExp = new RegExp('[0-9]{' + digits + '}');
			return (csc.length == digits && regExp.test(csc));
		},
		
		isExpiryDateValid: function(month, year) {
			var now = new Date();
			var thisMonth = now.getMonth() + 1;
			var thisYear = now.getYear() + 1900;
			var valid = false;
			if(parseInt(year) >= thisYear) {
				if(parseInt(month) >= thisMonth) {
					valid = true;
				}
			}
			return valid;
		}
	}
};