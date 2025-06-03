const menu = document.getElementById('paymentMethod');

const creditCard = document.getElementById('creditCardNumberContainer');

const payPal = document.getElementById('paypalUsernameContainer');

function checkMenu(event) {
    const value = event.target.value;
    console.log('hi');
    if (value == 'creditCard') {
        console.log('credit');
        creditCard.classList.remove('hide');
        payPal.classList.add('hide');
    } else if (value == 'paypal') {
        console.log('paypal');
        payPal.classList.remove('hide');
        creditCard.classList.add('hide');
    } else {
        creditCard.classList.add('hide');
        payPal.classList.add('hide');
    }
}

menu.addEventListener('change', checkMenu);