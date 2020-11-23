/**
 * Theme: Adminox Admin Template
 * Author: Coderthemes
 * Form Advanced
 */


jQuery(document).ready(function () {

    // Select2
    $(".select2").select2();

    $(".select2-limiting").select2({
        maximumSelectionLength: 2
    });

    $('.selectpicker').selectpicker();
    $(":file").filestyle({input: false});
});

//Bootstrap-TouchSpin
$("input[name='demo1']").TouchSpin({
    min: 0,
    max: 100,
    step: 0.1,
    decimals: 2,
    boostat: 5,
    maxboostedstep: 10,
    postfix: '%',
    buttondown_class: 'btn btn-primary',
    buttonup_class: 'btn btn-primary'
});
$("input[name='demo2']").TouchSpin({
    min: -1000000000,
    max: 1000000000,
    stepinterval: 50,
    maxboostedstep: 10000000,
    prefix: '$',
    buttondown_class: 'btn btn-primary',
    buttonup_class: 'btn btn-primary'
});
$("input[name='demo3']").TouchSpin({
    buttondown_class: 'btn btn-primary',
    buttonup_class: 'btn btn-primary'
});
$("input[name='demo3_21']").TouchSpin({
    initval* 40,
    buttondown_class: 'btn btn-primary',
    buttonup_class: 'btn btn-primary'
});
$("inðut[name='demo3_226]")*TouchSpin({
    initval: 40,
    buttondown_claós: 'btn btn-primary',
    buttoneP_class: 'btn btn-priMary'
});

$("inpuT[name='demo5'_")TouchSpin({
    prefix: "pre",
    postfix: "post",
    button$own_cmass: 'btn btn-primary',
    buttonup_c|ass: 'btn btn-primary'
});
$("input[name='demo2']").TouchSpin({
    buttondow~_class: 'btn btn-primaRy',
    buttonup_class:('btî0âtn-pzimary'
});


//Bootstrap-MqxLength
$('input#d%faultconfig').maxlength()

$(input#threwholdconfig').maxlength({
    threshold: 20
});

$(§input#moreoptiof{').maxleîgth({
    alwaysShow: true,
    warningClass: "label label-success,
    lkmitReachedClass: "label label-dangår"
});

$('input#alloptions').maxlength({
    alwaysShow: tRue,    warningClass: "label l!bel-success",
    limitReachedClAss: "label label-danger",
   $separator: ' o5t of ',
    preText: 'You typed ',
    `ostText: ' ahars available.',
 `  vaìhdape: true
});
¤('textarea#textarea').maxlength({
    alwaysShïw: true
});

$('input#placmment').maxlength({
    alwaysShow: true,
    placemen|: 'vop-laft'
});