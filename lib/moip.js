var moip = {
	creditCard: {
	 	isValid: function(creditCardNumber) {
			creditCardNumber = creditCardNumber.replace(/\s+/g, '');
			creditCardNumber = creditCardNumber.replace('.', '');
			creditCardNumber = creditCardNumber.replace('-', '');
			// Luhn algorithm: http://en.wikipedia.org/wiki/Luhn_algorithm
			var evens = new Array();
			var odds = new Array();
			for(var i = 0; i < creditCardNumber.length; i++) {
				if(!isNaN(creditCardNumber.charAt(i))) {
					var val = parseInt(creditCardNumber.charAt(i)); 
					if(i % 2 == 0) {
						evens.push(val);
					} else {
						odds.push(val);
					}
				}
			}
			var checksum = 0;
			for(var i = 0; i < odds.length; i++) {
				checksum += odds[i];
			}
			for(var i = 0; i < evens.length; i++) {
				checksum += evens[i] * 2;
			}
			var valid = checksum % 10 == 0;
			return valid;
		},
		isSecurityCodeValid: function(creditCardNumber, csc) {
			return true;
		},
		cardType: function(creditCardNumber) {
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
		isExpiryValid: function(month, year) {
			return true;
		}
	}
};