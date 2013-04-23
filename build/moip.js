var moip = {
	creditCard: {
		isValid: function(creditCardNumber) {
			creditCardNumber = creditCardNumber.replace(/\s+/g, '');
			creditCardNumber = creditCardNumber.replace(/\./g, '');
			creditCardNumber = creditCardNumber.replace(/\-/g, '');
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

		},

		cardType: function(creditCardNumber) {
			creditCardNumber = creditCardNumber.replace(/\s+/g, '');
			creditCardNumber = creditCardNumber.replace('.', '');
			creditCardNumber = creditCardNumber.replace('-', '');
			var regexpVisa = /^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/;
			var regexpMaster = /^5[1-5]\d{2}-?\d{4}-?\d{4}-?\d{4}$/;
			var regexpAmex = /^3[4,7]\d{13}$/;
			var regexpDiners = /^3[0,6,8]\d{12}$/;
			var regexHiper = /^(606282\d{10}(\d{3})?|3841\d{15})$/;
			
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
		},
	},
	calculator: {
		pricing: function(json){
			return this.buildJson(json);
		},

		buildJson: function(json){
			var transaction_tax;
			var installmentValue = new Array();
			var antecipationPercentageArr = new Array();
			var totalTaxArr = new Array();
			var liquidValueArr = new Array();

			transaction_tax = this._calculateTransactionTax(json.amount, json.transaction_percentage, json.fixed);
			
			if (json.antecipation_percentage != undefined && json.floating != undefined && json.installment != undefined) {
				

				for(i = 0; i <= 11; i++){
					installmentValue[i] = this._calculateInstallmentValue(json.amount, i + 1);
					antecipationPercentageArr[i] = this._calculateAntecipationPercentage(transaction_tax, json, i);
					totalTaxArr[i] = this._calculateTotalTax(antecipationPercentageArr[i], transaction_tax);
					liquidValueArr[i] = this._calculateLiquidValue(json.amount, totalTaxArr[i]);
				}
				return { "amount" : json.amount/100, "transaction_tax" : transaction_tax, "antecipation_percentage" : antecipationPercentageArr, "total_tax" :  totalTaxArr, "liquid_value" : liquidValueArr, "installment" : installmentValue};
			} else {
				liquidValueArr = this._calculateLiquidValue(json.amount, transaction_tax);
				return { "amount" : json.amount/100, "transaction_tax" : transaction_tax, "liquid_value" : liquidValueArr };
			};
		},

		pricingWithInterest: function(json){
			var interestRate = new Array();
			var amount = new Array();
			var transaction_tax;
			var installmentValue = new Array();
			var antecipationPercentageArr = new Array();
			var totalTaxArr = new Array();
			var liquidValueArr = new Array();

			transaction_tax = this._calculateTransactionTax(json.amount, json.transaction_percentage, json.fixed);
			

			for (var i = 1; i <= 12; i++) {
				installmentValue[i - 1] = this._calculateInstallmentValue(json.amount, i);
				interestRate[i - 1] = this._calculateInterestRate(json.amount, json.interest_rate, i);
				amount[i - 1] = this._calculateAmount(interestRate[i - 1], i);
				antecipationPercentageArr[i - 1] = this._calculateAntecipationPercentage(transaction_tax, json, i - 1);
				totalTaxArr[i -1] = this._calculateTotalTax(antecipationPercentageArr[i -1], transaction_tax);
				liquidValueArr[i -1] = this._calculateLiquidValue(json.amount, totalTaxArr[i -1]);
			}
			return { "amount" : amount, "transaction_tax" : transaction_tax, "antecipation_percentage" : antecipationPercentageArr, "total_tax" :  totalTaxArr, "liquid_value" : liquidValueArr, "installment" : installmentValue};
		},

		_calculateTransactionTax: function(amount, transactionPercentage, fixed){
			return (amount * (transactionPercentage / 100) + fixed) / 100;
		},

		_calculateAntecipationPercentage: function(transaction_tax, json, index){
			return parseFloat((parseFloat((json.antecipation_percentage / 100) / 30 * ((30 + (index) * 15) - json.floating)) * parseFloat((json.amount / 100) - transaction_tax)).toFixed(2));
		},

		_calculateTotalTax: function(antecipation_percentage, transaction_tax){
			return parseFloat((antecipation_percentage + transaction_tax).toFixed(2));
		},

		_calculateLiquidValue: function(transactionValue, totalTax){
			return parseFloat(((transactionValue)/100 + parseFloat(totalTax)).toFixed(2));
		},

		_calculateInstallmentValue: function(amount, installment){
			return parseFloat(((amount / installment) / 100).toFixed(2));
		},

		_calculateInterestRate: function(amount, interestRate, installment){
			if (installment == 1){
				return parseFloat(amount/100);
			}
			return parseFloat(this._coefficient(interestRate, installment) * (amount/100));
		},

		_calculateAmount: function(interestRate, installment){
			return parseFloat((interestRate * installment).toFixed(2));
		},

		_coefficient: function(interestRate, installment){
			return parseFloat(((interestRate / 100)/(1-1/(Math.pow(((interestRate / 100)+1), installment)))).toFixed(10));
		}
	}
};