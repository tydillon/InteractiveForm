//declaring variables
const $colors = $('#colors-js-puns');
const $shirtColor = $('#color option');
const $frameworks = $('input[name="js-frameworks"]');
const $libs = $('input[name="js-libs"]');
const $express = $('input[name="express"]');
const $node = $('input[name="node"]');
const $buildTools = $('input[name="build-tools"]');
const $npm = $('input[name="npm"]');
const $payment = $('#payment');
let calcCost = 0;


//creating error messages
$('.container form fieldset label[for="name"]').append('<p id="nameErr" class="errorMsg">Name field is required and must be greater than 3 characters</p>')
$('.container form fieldset label[for="mail"]').append('<p id="mailErr" class="errorMsg">Email must be valid</p>');
$('.activities').prepend('<p id="actErr" class="errorMsg">You must register for at least 1 activity</p>');

//cost calculator message
$('.activities').append(`<p id="totalCostMessage">Your total is: <strong>$<span id="cost">${calcCost}</span></strong></p>`);

// set some preferences for on load
// $('#name').focus();
$('#other-title').hide();
$colors.hide();
$('#paypal').hide();
$('#bitcoin').hide();
$('#nameErr').hide();
$('#mailErr').hide();
$('#actErr').hide();

//adapted from https://medium.com/@dalalrohit102/full-screen-responsive-landing-page-with-html-css-jquery-e4e59c340236 
//makes sure that whenever you refresh the page, you go back to the top
window.onbeforeunload = () => {
    window.scrollTo(0, 0);
  }

//adds the animation and sets the focus to the name box whenever you click the down arrow
$(document).ready( () => {
    $('#down').on('click', () => {
        $('html, body').animate({
            scrollTop: $('.container').offset().top
        }, 1000);
        $('#name').focus();
    });
   });

//Disabling the 'select method' as an option for payment and setting 'credit card' as default
//adapted from https://stackoverflow.com/questions/11752097/disable-drop-down-option-using-jquery
$('#payment option[value="select_method"]').prop('disabled', true);
//adapted from https://stackoverflow.com/questions/4781420/set-the-default-value-in-dropdownlist-using-jquery 
$('#payment option[value="credit card"]').prop('selected', true)



//JOB ROLE

//If job title is selected as 'other', I'm making the other title input box visible
$('#title').on('change', () => {
    if ($('#title').val() === 'other'){$('#other-title').show()}
    else {$('#other-title').hide()}
})

//T-SHIRT INFO

//Changes the colors available for t-shirts based on design selection
$('#design').on('change', () => {
    if ($('#design').val() === 'js puns') {
        $colors.show()
        for (let i = 0; i < $shirtColor.length; i++) {
            if ($($shirtColor[i]).val() === 'cornflowerblue' || $($shirtColor[i]).val() === 'darkslategrey' || $($shirtColor[i]).val() === 'gold') {
                $($shirtColor[i]).show()
            } else {
                $($shirtColor[i]).hide()
            }
        }
    } else if ($('#design').val() === 'heart js') {
        $colors.show()
        for (let i = 0; i < $shirtColor.length; i++) {
            if ($($shirtColor[i]).val() === 'tomato' || $($shirtColor[i]).val() === 'steelblue' || $($shirtColor[i]).val() === 'dimgrey') {
                $($shirtColor[i]).show()
            } else {
                $($shirtColor[i]).hide()
            }
        }
    } else {$colors.hide()}
})

//REGISTER FOR ACTIVITIES

//Created a function that disables checkbox and visually indicate the workshop in the competing timeslot is unavailable
const checkConflict = (selected, conflict) => {
    // adapted from https://stackoverflow.com/questions/7960208/jquery-if-checkbox-is-checked 
    if (selected.is(':checked')) {
        conflict.attr("disabled", true)
        // conflict.parent().addClass("disabled")
        conflict.parent().addClass("disabled")
    } else {
        conflict.attr("disabled", false)
        conflict.parent().removeClass("disabled")
    }
}

//Compiles all of my preferences for conflicts
const compiledConflict = () => {
    checkConflict($frameworks, $express)
    checkConflict($libs, $node)
    checkConflict($express, $frameworks)
    checkConflict($node, $libs)
}

//Event listener for activities
$('.activities').on("click", compiledConflict)


//Make a running total of cost based on selections

$('.activities').on("click", (e) => {
    //get the cost from the label of the box that was checked
    let $indCost = $(e.target).parent().text();
    //either add or subtract everything after the 0 to the 'calcCost' variable
    if ($(e.target).is(':checked')) {
        calcCost += parseInt($indCost.substring($indCost.indexOf('$')+1,));
    } else {
        calcCost -= parseInt($indCost.substring($indCost.indexOf('$')+1,));
    }
    //replace the text in the cost message span with the calculated cost
    $('#totalCostMessage span').text(calcCost)
})


//PAYMENT INFO

//hides and displays payment info based on which type is selected
$payment.on('change', () => {
    if ($payment.val() === 'paypal') {
        $('#credit-card').hide();
        $('#paypal').show();
        $('#bitcoin').hide();
    } else if ($payment.val() === 'bitcoin'){
        $('#credit-card').hide();
        $('#paypal').hide();
        $('#bitcoin').show();
    } else {
        $('#credit-card').show();
        $('#paypal').hide();
        $('#bitcoin').hide();
    }
})

//FORM VALIDATION - this is without the real-time validations created below.

//adapted from https://stackoverflow.com/questions/2507030/email-validation-using-jquery to check if e-mail is valid 
const isEmail = (email) => {
    let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
// using regex to declare that CC, zip, and CVV must all be numbers and must be their respective lengths
const isCCNum = (num) => {
    let regex = /^\d{13,16}$/;
    return regex.test(num);
}

const isZCNum = (num) => {
    let regex = /^\d{5}$/;
    return regex.test(num);
}

const isCVVNum = (num) => {
    let regex = /^\d{3}$/;
    return regex.test(num);
}

//On press of submit button, checks for form validation
$('button').on('click', (e) => {
    //if name is less than 3 characters, add styling and prevent use of button
    if ($('#name').val().length < 3) {
        $('#name').removeClass('valid').addClass('invalid').prop('placeholder', 'Name is required and must be greater than 3 characters');
        e.preventDefault();
    } else {
        $('#name').removeClass('invalid').addClass('valid');
    }
    //e-mail validation
    //if it's empty
    if ($('#mail').val().length === 0) {
        $('#mail').removeClass('valid').addClass('invalid').prop('placeholder', 'E-mail is required');
        e.preventDefault();
    // if it's not a valid type
    } else if (!isEmail($('#mail').val())) {
        $('#mail').removeClass('valid').addClass('invalid').val('').prop('placeholder', 'E-mail address must be a valid address');
        e.preventDefault();
    } else {
        $('#mail').removeClass('invalid').addClass('valid');
    }
    //makes sure atleast 1 activity is checked
    if (!$('.activities input').is(':checked')) {
        $('#actErr').show();
        e.preventDefault();
    } else {
        $('#actErr').hide();
    }
    //only if the payment is credit card
    if($payment.val() === 'credit card') {
        //checks length of credit card
        if (!isCCNum($('#cc-num').val())) {
            $('#cc-num').removeClass('valid').addClass('invalid').prop('placeholder', 'Credit card is required');
            e.preventDefault();
        } else {
            $('#cc-num').removeClass('invalid').addClass('valid');
        }
        //checks length of zip
        if (isZCNum($('#zip').val())) {
            $('#zip').removeClass('invalid').addClass('valid');
        } else {
            $('#zip').removeClass('valid').addClass('invalid').prop('placeholder', 'Zip is required');
            e.preventDefault();
        }
        //checks length of cvv
        if (isCVVNum($('#cvv').val())) {
            $('#cvv').removeClass('invalid').addClass('valid');
        } else {
            $('#cvv').removeClass('valid').addClass('invalid').prop('placeholder', 'CVV is required');
            e.preventDefault();
        }
    }
})

//REAL TIME ERROR MESSAGES
// similar to above, except these are set up as listeners on the individual inputs rather than on the whole document

$('#name').on('input', () => {
    if ($('#name').val().length < 3) {
        $('#name').removeClass('valid').addClass('invalid');
        $('#nameErr').show();
    } else {
        $('#name').removeClass('invalid').addClass('valid');
        $('#nameErr').hide();
    }
})

$('#mail').on('input', () => {
    if (!isEmail($('#mail').val())) {
        $('#mail').removeClass('valid').addClass('invalid');
        $('#mailErr').show();
    } else {
        $('#mail').removeClass('invalid').addClass('valid');
        $('#mailErr').hide();
    }
})

$('.activities input').on('click', () => {
    if (!$('.activities input').is(':checked')){
        $('#actErr').show();
    } else {
        $('#actErr').hide();
    }
})
//$('#cc-num').val().length < 13 || $('#cc-num').val().length > 16 && 
$('#cc-num').on('input', () => {
    if (!isCCNum($('#cc-num').val())) {
        $('#cc-num').removeClass('valid').addClass('invalid');
    } else {
        $('#cc-num').removeClass('invalid').addClass('valid');
    }
})

$('#zip').on('input', () => {
    if (isZCNum($('#zip').val())) {
        $('#zip').removeClass('invalid').addClass('valid');
    } else {
        $('#zip').removeClass('valid').addClass('invalid');
    }
})

$('#cvv').on('input', () => {
    if (isCVVNum($('#cvv').val())) {
        $('#cvv').removeClass('invalid').addClass('valid');
    } else {
        $('#cvv').removeClass('valid').addClass('invalid');
    }
})