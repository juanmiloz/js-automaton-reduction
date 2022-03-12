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
    cambiarVista("homePane");
    
    $('#mealyBtn').click(function() {
        cambiarVista("dataViewMealy");
    });

    $('#mooreBtn').click(function() {
        cambiarVista("dataViewMoore");
    });

    $('.exitBtn').click(function() {
        cambiarVista("homePane");
    });
    
    $('#submitBtnMealy').click(function() {
        states = $('#statesMealy').val().split(',');
        inputs = $('#inputsMealy').val().split(',');

        if(states[0] == ''|| inputs[0] == ''){
            $('#states').val('');
            $('#inputs').val('');
        }else{
            getInitialMachine(states, inputs);
            cambiarVista("tableViewMealy");
            loadHTML("#tableMealy", createMealyTable(states,inputs));
        }
    });

    $('#submitTableMealy').click(function() {
        for(let i = 0; i < states.length; i++){
            for(let j = 0; j < inputs.length; j++){
                let array = $('#'+states[i]+inputs[j]).val().split(',');
                machine['statesMachine'][states[i]][inputs[j]]['nextState'] = array[0];
                machine['statesMachine'][states[i]][inputs[j]]['response'] = array[1];
            }
        }
        console.log(machine);
        reduceMealyMachine();
    });

    $('#submitBtnMoore').click(function() {
        states = $('#statesMoore').val().split(',');
        inputs = $('#inputsMoore').val().split(',');

        if(states[0] == ''|| inputs[0] == ''){
            $('#states').val('');
            $('#inputs').val('');
        }else{
            getInitialMachine(states, inputs);
            cambiarVista("tableViewMoore");
            loadHTML("#tableMoore", createMooreTable(states,inputs));
        }
    });
});

function getInitialMachine(states, inputs){
    machine = {};
    machine.stymulus = inputs;
    machine.statesMachine = {};
    for(let i = 0; i < states.length; i++){
        machine['statesMachine'][states[i]] = {}; //A:{}
        for(let j = 0; j <inputs.length; j++){
            machine['statesMachine'][states[i]][inputs[j]] =   {
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

function createMooreTable(states, inputs){
    var html = ''
    html += '<table><thead><th></th>';
    
    for(let i = 0; i<inputs.length; i++){
        html += "<th>"+inputs[i]+"</th>";
        if(i==inputs.length-1){
            html += "<th>Response</th>"
        }
    }
    html += "</thead><tbody>";
    
    for(let i = 0; i<states.length; i++){
        html += "<tr><th>"+states[i]+"</th>";
        
        for(let j = 0; j<inputs.length; j++){
            html += '<td><input type="text" id='+states[i]+inputs[j]+'></td>';
            if(j==inputs.length-1){
                html += '<td><input type="text" id='+states[i]+'r'+'></td>';
            }
        }

        html += "</tr>"
    }
    html += "</tbody></table>"

    return html; 
}

function reduceMealyMachine(){
    var firstPartition = createFirstPartitionMealy();
    console.log(firstPartition);
}

function createFirstPartitionMealy() {
    var firstPartition = [];
    for (var state in machine['statesMachine']){
        var tempList = [];
        tempList.push(state);

        for (var compState in machine['statesMachine']) {
            if (compState != state && equalResponseMealyStates(machine['statesMachine'][state], machine['statesMachine'][compState])) {
                tempList.push(compState);
            }
        }

        tempList.sort()
        if(!containsArray(firstPartition, tempList)){
            firstPartition.push(tempList);
        }
    }
    return firstPartition;
}

//stateA, stateB are dicts
function equalResponseMealyStates(stateA, stateB) {
    var equalResponse = true;
    var stymulus = machine['stymulus'];
    for (var s in stymulus) {
        equalResponse = equalResponse && (stateA[s]['response'] == stateB[s]['response']);
    }

    return equalResponse;
}

function containsArray(firstPartition, newArray){
    var contains = false;
    for(var i = 0; i < firstPartition.length && !contains; i++){
        contains = contains || (firstPartition[i].toString() === newArray.toString());
    }

    return contains;
}