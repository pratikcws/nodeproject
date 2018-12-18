$(function () {
    $('body').on('submit', '#addpaymentmethod', function (e) {
        e.preventDefault();
        var dataS = new FormData(this);
        dataS.append('payment_id', payment_id);
        $.ajax({
            url: HTTP_PATH + "account/payment_method",
            type: 'post',
            data: dataS ,
            processData: false,  // tell jQuery not to process the data
       contentType: false,  // tell jQuery not to set contentType
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success").then(function () {
                       
                    });
                  
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });
	
	
	$('body').on('submit', '#billing_Address', function (e) {
        e.preventDefault();
        var dataS = new FormData(this);
        dataS.append('billing_id', billing_id);
        $.ajax({
            url: HTTP_PATH + "account/billing_Address",
            type: 'post',
            data: dataS ,
            processData: false,  // tell jQuery not to process the data
       contentType: false,  // tell jQuery not to set contentType
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success").then(function () {
                    // window.location.href = HTTP_PATH+"account/payment-methods;
                   
                    location.reload();
                    });
                  
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    }); 
	
	 $('body').on('submit', '#bank_Account_detials', function (e) {	
        e.preventDefault();
        var dataS = new FormData(this);
        dataS.append('account_id', account_id);
        $.ajax({
            url: HTTP_PATH + "account/bank_account_detials",
            type: 'post',
            data: dataS ,
            processData: false,  // tell jQuery not to process the data
       contentType: false,  // tell jQuery not to set contentType
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success").then(function () {
                        location.reload();
                    });
                  
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });
	
	
	
	
	
	
(function() {
		var ccnum  = document.getElementById('card_number'),
      type   = document.getElementById('ccnum-type'),
      expiry = document.getElementById('exp_date'),
      cvc    = document.getElementById('cvc'),
      submit = document.getElementById('submit'),
      result = document.getElementById('result');

  payform.cardNumberInput(ccnum);
  payform.expiryInput(expiry);
  payform.cvcInput(cvc);

  ccnum.addEventListener('input',   updateType);

  submit.addEventListener('click', function() {
    var valid     = [],
        expiryObj = payform.parseCardExpiry(expiry.value);

    valid.push(fieldStatus(ccnum,  payform.validateCardNumber(ccnum.value)));
    valid.push(fieldStatus(expiry, payform.validateCardExpiry(expiryObj)));
    valid.push(fieldStatus(cvc,    payform.validateCardCVC(cvc.value, type.innerHTML)));

    result.className = 'emoji ' + (valid.every(Boolean) ? 'valid' : 'invalid');
  });

  function updateType(e) {
    var cardType = payform.parseCardType(e.target.value);
    type.innerHTML = cardType || 'invalid';
  }


  function fieldStatus(input, valid) {
    if (valid) {
      removeClass(input.parentNode, 'error');
    } else {
      addClass(input.parentNode, 'error');
    }
    return valid;
  }

  function addClass(ele, _class) {
    if (ele.className.indexOf(_class) === -1) {
      ele.className += ' ' + _class;
    }
  }

  function removeClass(ele, _class) {
    if (ele.className.indexOf(_class) !== -1) {
      ele.className = ele.className.replace(_class, '');
    }
  }
})();


});