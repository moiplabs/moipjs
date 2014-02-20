QUnit.module("MoIP Credit Card Validations", {
    setup: function(assert) {
        this.strictList = function(list, validation) {
            var actual, expected,
                counter = 0;

            for (var msg in list) {
                if (!list.hasOwnProperty(msg)) {
                    continue;
                }

                actual = list[msg][0];
                expected = list[msg][1];

                assert.strictEqual(validation(actual), expected, msg);
                counter++;
            }

            return counter;
        };
    }
});

QUnit.test("Visa", function() {
    var valids = {
            "number": [4111111111111111, true],
            "without spaces": ["4111111111111111", true],
            "with espaços": ["4111 1111 1111 1111", true],
            "with dots": ["4111.1111.1111.1111", true],
            "with hifens": ["4111-1111-1111-1111", true],
            "invalid 1": ["4222222222222", false],
            "invalid 2": ["4000000000000000", false]
        };

    this.strictList(valids, moip.creditCard.isValid);
});

QUnit.test("Mastercard", function() {
    var valids = {
            "valid number": ["5555666677778884", true],
            "valid number #2": ["5105105105105100", true],
            "invalid": ["5105105105105120", false]
        };

    this.strictList(valids, moip.creditCard.isValid);
});

QUnit.test("Diners", function() {
    var valids = {
            "valid": ["30569309025904", true]
        };

    this.strictList(valids, moip.creditCard.isValid);
});
    
QUnit.test("Amex", function() {
    var valids = {
            "valid w/ 16 digits": ["378282246310005", true]
        };

    this.strictList(valids, moip.creditCard.isValid);
});

QUnit.test("Hipercard", function(assert) {
    var valids = {
            "valid 19 digits": ["3841001111222233334", true],
            "valid": ["6062825607632328", true],
            "valid w/ spaces": ["6062 8256 0763 2328", true]
        };

    this.strictList(valids, moip.creditCard.isValid);    
});

QUnit.test("moip.creditCard.isSecurityCodeValid", function(assert) {
    var cscValid = moip.creditCard.isSecurityCodeValid("5105105105105100", "123");
    assert.strictEqual(cscValid, true);

    cscValid = moip.creditCard.isSecurityCodeValid("5105105105105100", "1234");
    assert.strictEqual(cscValid, false);

    cscValid = moip.creditCard.isSecurityCodeValid("378282246310005", "1234");
    assert.strictEqual(cscValid, true, "CVV Cartão AMEX deve conter 4 digitos");
});

QUnit.test("moip.creditCard.cardType", function(assert) {
    assert.deepEqual(moip.creditCard.cardType("5105105105105100"), {"brand": "MASTERCARD"});

    assert.deepEqual(moip.creditCard.cardType("4111111111111111"), {"brand": "VISA"});

    assert.deepEqual(moip.creditCard.cardType("4111 1111 1111 1111"), {"brand": "VISA"});

    assert.deepEqual(moip.creditCard.cardType("341111111111111"), {"brand": "AMEX"});

    assert.deepEqual(moip.creditCard.cardType("3841001111222233334"), {"brand": "HIPERCARD"});

    assert.deepEqual(moip.creditCard.cardType("6062825607632328"), {"brand": "HIPERCARD"});

    assert.equal(moip.creditCard.cardType("2441111111111111"), null);
});

QUnit.test("moip.creditCard.cardType loose check", function(assert) {
    var loose = true;
    assert.deepEqual(moip.creditCard.cardType("411111", loose), {"brand": "VISA"}, "loosely VISA => 411111");
    assert.notDeepEqual(moip.creditCard.cardType("411111"), {"brand": "VISA"});

    assert.deepEqual(moip.creditCard.cardType("510510", loose), {"brand": "MASTERCARD"}, "loosely MASTERCARD => 510510");
    assert.notDeepEqual(moip.creditCard.cardType("510510"), {"brand": "MASTERCARD"});

    assert.deepEqual(moip.creditCard.cardType("4111 11", loose), {"brand": "VISA"}, "loosely VISA => 4111 11");
    assert.notDeepEqual(moip.creditCard.cardType("4111 11"), {"brand": "VISA"});

    assert.deepEqual(moip.creditCard.cardType("341111", loose), {"brand": "AMEX"}, "loosely AMEX => 341111");
    assert.notDeepEqual(moip.creditCard.cardType("341111"), {"brand": "AMEX"});

    assert.deepEqual(moip.creditCard.cardType("305693", loose), {"brand": "DINERS"}, "loosely DINERS => 305693");
    assert.notDeepEqual(moip.creditCard.cardType("305693"), {"brand": "DINERS"});

    assert.deepEqual(moip.creditCard.cardType("381100", loose), {"brand": "DINERS"}, "loosely DINERS => 381100");
    assert.notDeepEqual(moip.creditCard.cardType("381100"), {"brand": "DINERS"});

    assert.deepEqual(moip.creditCard.cardType("384100", loose), {"brand": "HIPERCARD"}, "loosely HIPERCARD => 384100");
    assert.notDeepEqual(moip.creditCard.cardType("384100"), {"brand": "HIPERCARD"});

    assert.deepEqual(moip.creditCard.cardType("606282", loose), {"brand": "HIPERCARD"}, "loosely HIPERCARD => 606282");
    assert.notDeepEqual(moip.creditCard.cardType("606282"), {"brand": "HIPERCARD"});
});

QUnit.test("moip.creditCard.isExpiryDateValid", function(assert) {
    var valid = moip.creditCard.isExpiryDateValid(5, 2013);
    assert.strictEqual(valid, false, "Invalid arguments/date");

    valid = moip.creditCard.isExpiryDateValid("ab", "cd");
    assert.strictEqual(valid, false, "Non numeric date");

    valid = moip.creditCard.isExpiryDateValid(00, 2013);
    assert.strictEqual(valid, false, "Invalid month (00)");

    valid = moip.creditCard.isExpiryDateValid(13, 2013);
    assert.strictEqual(valid, false, "Invalid month (13)");

    valid = moip.creditCard.isExpiryDateValid(5, 3000);
    assert.strictEqual(valid, false, "Invalid Year (3000)");

    valid = moip.creditCard.isExpiryDateValid(5, 100);
    assert.strictEqual(valid, false, "Invalid Year (100)");

    valid = moip.creditCard.isExpiryDateValid(5, 98);
    assert.strictEqual(valid, false, "Invalid Year (98)");

    valid = moip.creditCard.isExpiryDateValid(01, 42);
    assert.strictEqual(valid, true, "Valid");

    var now = new Date();
    var isExpiryDateValid = moip.creditCard.isExpiryDateValid(
            now.getMonth()+1+"", now.getYear()+1900+"");

    assert.strictEqual(isExpiryDateValid, true);

    isExpiryDateValid = moip.creditCard.isExpiryDateValid("10", "2010");
    assert.strictEqual(isExpiryDateValid, false, "Expired valid date");
});

QUnit.test("moip.creditCard.isExpiredDate", function(assert) {
    var valid = moip.creditCard.isExpiredDate(5, 2013);
    assert.strictEqual(valid, true, "Expired date");

    valid = moip.creditCard.isExpiredDate(5, 98);
    assert.strictEqual(valid, true, "Expired year");

    valid = moip.creditCard.isExpiredDate(01, 42);
    assert.strictEqual(valid, false, "Not expired date");
});
