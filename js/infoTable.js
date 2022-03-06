$(document).ready(function() {
    $('#submitBtn').click(function() {
        var nStates = parseInt($('#nStates').val());
        var nInputs = parseInt($('#nInputs').val());
        
        if(Number.isNaN(nStates) || Number.isNaN(nInputs)){
            $('#nStates').val('');
            $('#nInputs').val('');
        }else{

        }
    });
});