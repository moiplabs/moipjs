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
            var brands = {
                    VISA:       { matches: function(cardNum){ return /^4\d{15}$/.test(cardNum); } },
                    MASTERCARD: { matches: function(cardNum){ return /^5[1-5]\d{14}$/.test(cardNum); } },
                    AMEX:       { matches: function(cardNum){ return /^3[4,7]\d{13}$/.test(cardNum); } },
                    DINERS:     { matches: function(cardNum){ return /^3[0,6,8]\d{12}$/.test(cardNum); } },
                    HIPERCARD:  { matches: function(cardNum){ return /^(606282\d{10}(\d{3})?)|(3841\d{15})$/.test(cardNum); } },
                    ELO:        { matches: function(cardNum){
                                    var eloBins = [
                                        "50670","50671","50672","50673","50674","50675","50676","50900","50901","50902",
                                        "50903","50904","50905","50906","50907","401178","401179","431274","438935","451416",
                                        "457393","457631","457632","504175","506699","506770","506771","506772","506773","506774",
                                        "506775","506776","506777","506778","509080","509081","509082","509083","627780","636297"
                                    ];
                                    if (cardNum === null || cardNum.length != 16){
                                        return false;
                                    }
                                    return ( eloBins.indexOf(cardNum.substring(0,6)) > -1 ||
                                             eloBins.indexOf(cardNum.substring(0,5)) > -1
                                           );
                                } }
                },
                // for non-strict detections
                looseBrands = {
                    VISA:       { matches: function(cardNum){ return /^4\d{3}\d*$/.test(cardNum); } },
                    MASTERCARD: { matches: function(cardNum){ return /^5[1-5]\d{4}\d*$/.test(cardNum); } },
                    AMEX:       { matches: function(cardNum){ return /^3[4,7]\d{2}\d*$/.test(cardNum); } },
                    DINERS:     { matches: function(cardNum){ return /^3(?:0[0-5]|[68][0-9])+\d*$/.test(cardNum); } },
                    HIPERCARD:  { matches: function(cardNum){ return /^(606282|3841\d{2})\d*$/.test(cardNum); } },
                    ELO:        { matches: function(cardNum){
                                    var eloBins = [
                                        "50670","50671","50672","50673","50674","50675","50676","50900","50901","50902",
                                        "50903","50904","50905","50906","50907","401178","401179","431274","438935","451416",
                                        "457393","457631","457632","504175","506699","506770","506771","506772","506773","506774",
                                        "506775","506776","506777","506778","509080","509081","509082","509083","627780","636297"
                                    ];
                                    if (cardNum === null || cardNum.length < 6){
                                        return false;
                                    }
                                    return ( eloBins.indexOf(cardNum.substring(0,6)) > -1 ||
                                             eloBins.indexOf(cardNum.substring(0,5)) > -1
                                           );
                                } }
                };

            creditCardNumber = normalizeCardNumber(creditCardNumber);

            if (loose) {
                brands = looseBrands;
            }


            // order is mandatory:
            // a) VISA is identified by the broad prefix '4', shadowing more specific ELO prefixes
            // b) HIPERCARD has precendence over DINERS for prefix 3841 (loose check)
            if (brands.ELO.matches(creditCardNumber))          { return {brand:'ELO'}; }
            if (brands.VISA.matches(creditCardNumber))         { return {brand:'VISA'}; }
            if (brands.MASTERCARD.matches(creditCardNumber))   { return {brand:'MASTERCARD'}; }
            if (brands.AMEX.matches(creditCardNumber))         { return {brand:'AMEX'}; }
            if (brands.HIPERCARD.matches(creditCardNumber))    { return {brand:'HIPERCARD'}; }
            if (brands.DINERS.matches(creditCardNumber))       { return {brand:'DINERS'}; }
            
            return null;
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

(function(window) {
    var moip = window.moip || {};
    window.moip = moip;

    moip.calculator = {
        pricing: function(json){
            return this.buildJson(json);
        },

        buildJson: function(json){
            var transaction_tax;
            var installmentValue = [];
            var antecipationPercentageArr = [];
            var totalTaxArr = [];
            var liquidValueArr = [];

            transaction_tax = this._calculateTransactionTax(json.amount, json.transaction_percentage, json.fixed);
            
            if (json.antecipation_percentage !== undefined && json.floating !== undefined && json.installment !== undefined) {
                for(var i = 0; i <= 11; i++){
                    installmentValue[i] = this._calculateInstallmentValue(json.amount, i + 1);
                    antecipationPercentageArr[i] = this._calculateAntecipationPercentage(transaction_tax, json, i, json.amount);
                    totalTaxArr[i] = this._calculateTotalTax(antecipationPercentageArr[i], transaction_tax);
                    liquidValueArr[i] = this._calculateLiquidValue(json.amount, totalTaxArr[i]);
                }
                return { 
                    "amount" : json.amount, 
                    "transaction_tax" : transaction_tax, 
                    "antecipation_percentage" : antecipationPercentageArr, 
                    "total_tax" :  totalTaxArr, 
                    "liquid_value" : liquidValueArr, 
                    "installment_value" : installmentValue
                };
            } else {
                liquidValueArr = this._calculateLiquidValue(json.amount, transaction_tax);
                return { 
                    "amount" : json.amount, 
                    "transaction_tax" : transaction_tax, 
                    "liquid_value" : liquidValueArr 
                };
            }
        },

        pricingWithInterest: function(json){
            var interestRate = [];
            var amount = [];
            var transaction_tax = [];
            var antecipationPercentageArr = [];
            var antecipationPercentageFromAmount = [];
            var totalTaxArr = [];
            var liquidValueArr = [];

            for (var i = 1; i <= 12; i++) {
                interestRate[i - 1] = this._calculateInterestRate(json.amount, json.interest_rate, i);
                amount[i - 1] = this._calculateAmount(interestRate[i - 1], i);
                transaction_tax[i-1] = this._calculateTransactionTax(amount[i-1], json.transaction_percentage, json.fixed);
                antecipationPercentageArr[i - 1] = this._calculateAntecipationPercentage(transaction_tax[i-1], json, i - 1, amount[i-1]);
                antecipationPercentageFromAmount[i - 1] =  this._calculateAntecipationPercentageFromAmount(amount[i - 1], antecipationPercentageArr[i - 1]);
                totalTaxArr[i -1] = this._calculateTotalTax(antecipationPercentageArr[i -1], transaction_tax[i-1]);
                liquidValueArr[i -1] = this._calculateLiquidValue(amount[i-1], totalTaxArr[i -1]);
            }
            return { "amount" : amount, "transaction_tax" : transaction_tax, "antecipation_percentage" : antecipationPercentageFromAmount, "total_tax" :  totalTaxArr, "liquid_value" : liquidValueArr, "installment_value" : interestRate};
        },

        _calculateAntecipationPercentageFromAmount: function(amount, percent) {
            return parseFloat((percent * 100) / (amount / 100)).toFixed(2);
        },

        _calculateTransactionTax: function(amount, transactionPercentage, fixed){
            return parseFloat(((amount * (transactionPercentage / 100) + fixed) / 100).toFixed(2));
        },

        _calculateAntecipationPercentage: function(transaction_tax, json, index, amount){
            return parseFloat((parseFloat((json.antecipation_percentage / 100) / 30 * ((30 + (index) * 15) - json.floating)) * parseFloat((amount / 100) - transaction_tax)).toFixed(2));
        },

        _calculateTotalTax: function(antecipation_percentage, transaction_tax){
            return parseFloat((antecipation_percentage + transaction_tax).toFixed(2));
        },

        _calculateLiquidValue: function(transactionValue, totalTax){
            return parseFloat(((transactionValue)/100 - parseFloat(totalTax)).toFixed(2));
        },

        _calculateInstallmentValue: function(amount, installment){
            return parseFloat(((amount / installment) / 100).toFixed(2));
        },

        _calculateInterestRate: function(amount, interestRate, installment){
            if (installment === 1){
                return parseFloat(amount/100);
            }
            return parseFloat((this._coefficient(interestRate, installment) * (amount/100)).toFixed(2));
        },

        _calculateAmount: function(interestRate, installment){
            return parseFloat(((interestRate * installment).toFixed(2)) * 100);
        },

        _coefficient: function(interestRate, installment){
            return parseFloat(((interestRate / 100)/(1-(1/(Math.pow(((interestRate / 100)+1), installment))))).toFixed(10));
        }
    };
})(window);
    