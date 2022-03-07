var machine = {
    stymulus: [0, 1],
    statesMachine: {
        'A': {
            0: {
                response: 1,
                nextState: 'B'
            }
        }
    }
};



$(document).ready(function() {
    var states;
    var inputs;
    
    $('#submitBtn').click(function() {
        states = $('#states').val().split(',');
        inputs = $('#inputs').val().split(',');

        if(states[0] == ''|| inputs[0] == ''){
            $('#states').val('');
            $('#inputs').val('');
        }else{
            cambiarVista("tableView");
            loadHTML("#table", createMealyTable(states,inputs));
        }
    });

    $('#submitTable').click(function() {
        for(let i = 0; i < states.length; i++){
            for(let j = 0; j < inputs.length; j++){
                let array = $('#'+states[i]+inputs[j]).val().split(',');
                machine.statesMachine[states[i]][inputs[j]].nextState = array[0];
                machine.statesMachine[states[i]][inputs[j]].response = array[1];
            }
        }
        console.log(machine.statesMachine['A'][0].nextState);
    });
});

function getInitialMachine(states, inputs){
    machine.stymulus = inputs;
    machine.statesMachine = {};
    for(let i = 0; i < states.length; i++){
        machine.statesMachine[states[i]] = {}; //A:{}
        for(let j = 0; j <inputs.length; j++){
            machine[statesMachine][states[i]][inputs[j]] =   {
                response: null,
                nextState: null
            }
        }
    }
}

function cambiarVista(objetivo){
    $(".view").hide();
    $(".view").each(
        function() {
            if($(this).attr("id") == objetivo){
                $(this).show();
            }
        }
    );
}

function loadHTML(element, HTML){
    $(element).html(HTML);
}


function createMealyTable(states, inputs){
    var html = ''
    html += '<table><thead><th></th>';
    
    for(let i = 0; i<inputs.length; i++){
        html += "<th>"+inputs[i]+"</th>";
    }
    html += "</thead><tbody>";
    
    for(let i = 0; i<states.length; i++){
        html += "<tr><th>"+states[i]+"</th>";
        
        for(let j = 0; j<inputs.length; j++){
            html += '<td><input type="text" id='+states[i]+inputs[j]+'></td>';
        }

        html += "</tr>"
    }
    html += "</tbody></table>"

    return html; 
}