var moip = {
	creditCard: {
	 	isValid: function(creditCardNumber) {
			return true;
		},
		isSecurityCodeValid: function(creditCardNumber, csc) {
			return true;
		},
		cardType: function(creditCardNumber) {
			return {"brand": "VISA"};
		},
		isExpiryValid: function(month, year) {
			return true;
		}
	}
};