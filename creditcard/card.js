document.querySelector('#cardForm').addEventListener('submit', submitHandler);

function isCardNumberValid(number) {
    return number === '1234123412341234'
}

function submitHandler(event) {
    event.preventDefault();
    const errorMessage = document.querySelector('.errorMsg');
    const cardNumber = this.userNumber.value;
    console.log(cardNumber)
    const month = parseInt(this.month.value, 10);
    const year = parseInt(this.year.value, 10);
    errorMessage.textContent = '';
    const fullYear = 2000 + year;
    const expirationDate = new Date(fullYear, month -1, 1);
    const today = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);
    expirationDate.setDate(0);
    if (isNaN(cardNumber)) {
        errorMessage.textContent = 'Card number must be numbers.';
        return false;
    } else if (!isCardNumberValid(cardNumber)) {
       errorMessage.textContent = 'Card number is not valid.' 
    } else if (expirationDate < today) {
        errorMessage.textContent = 'Card is expired!';
        return false;
    } else {
        alert('Card submitted successfully!');
    }
}