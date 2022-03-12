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
    console.log("pasa");
    cambiarVista("homePane");
    //cambiarVista("tableViewMealy");
    
    $('#submitBtnMealy').click(function() {
        states = $('#states').val().split(',');
        inputs = $('#inputs').val().split(',');

        if(states[0] == ''|| inputs[0] == ''){
            $('#states').val('');
            $('#inputs').val('');
        }else{
            getInitialMachine(states, inputs);
            cambiarVista("tableViewMealy");
            loadHTML("#table", createMealyTable(states,inputs));
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

    $('#mealyBtn').click(function() {
        cambiarVista("dataViewMealy");
    })
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

function reduceMealyMachine(){
    var firstPartition = createFirstPartitionMealy();
    var finalPartition = getFinalPartition(firstPartition);
    console.log('Reduced Machine:');
    console.log(finalPartition);
    reasignStatesMealy(finalPartition);
    console.log(machineM);
}

function reasignStatesMealy(finalPartition) {
    for(var state in machineM['statesMachine']){
        var represent = getRepresentant(finalPartition, state);
        if(state === represent){
            for (let j = 0; j < machineM['stymulus'].length; j++) {
                var stymul = machineM['stymulus'][j];
                var currentNextState = machineM['statesMachine'][state][stymul]['nextState']
                var representNextState = getRepresentant(finalPartition, currentNextState);
                
                if(!(representNextState === currentNextState)){
                    machineM['statesMachine'][state][stymul]['nextState'] = representNextState;
                }
            }
        }else{
            delete machineM['statesMachine'][state];
        }
    }
}

function getRepresentant(partition, state) {
    var represent = null;
    for (let i = 0; i < partition.length; i++) {
        if(partition[i].includes(state)){
            represent = partition[i][0];
        }
    }
    
    return represent;
}

function getFinalPartition(nPartition) {
    var nextPartition = [];

    for(var i = 0; i < nPartition.length; i++){
        //Gets the block to compare and a representant value
        var currentBlock = nPartition[i];
        var represent = currentBlock[0];

        //Creates 2 arrays in case of the current Block changes
        var keepBlock = [];
        var removedBlock = [];

        //For every case the representan is going to be in keep block
        keepBlock.push(represent);

        //Gets the blocks where the nextStates are according to every input 
        var outputBlocks = getOutputBlocks(nPartition, represent);

        //Comparison of each element in the block with the representant and its output blocks
        for (let j = 1; j < currentBlock.length; j++) {
            var tempOutputBlocks = getOutputBlocks(nPartition, currentBlock[j]);

            //In case the compared pair does not have the same output blocks, then in goes to the removed block
            //which is a new block in the whole partition
            if(compareArrays(tempOutputBlocks, outputBlocks)){
                keepBlock.push(currentBlock[j]);
            }else{
                removedBlock.push(currentBlock[j]);
            }
        }

        //If the new blocks are not empty then those are added to the partition
        if(keepBlock.length != 0){
            nextPartition.push(keepBlock);
        }

        if(removedBlock.length != 0){
            nextPartition.push(removedBlock);
        }
    }

    //If the partitions are equal the process ends, othewise keeps finding final partition
    if(compareArrays(nPartition, nextPartition)){
        return nPartition;
    }else{
        return getFinalPartition(nextPartition);
    }
}

/*
    For every input a S state, has a nextState S' state.
    This function finds that S' state in the partition and returns the block where it is.
    It creates a list with all the blocks for every S' that is a nextState of S.
*/
function getOutputBlocks(partition, state) {
    var outputBlocks  = [];
    for(var input in machineM['statesMachine'][state]){
        var nextState = machineM['statesMachine'][state][input]['nextState'];
        for(var block in partition){
            if(partition[block].includes(nextState)){
                if(!containsArray(outputBlocks, partition[block])){
                    outputBlocks.push(partition[block]);
                }
            }
        }
    }
    
    return outputBlocks;
}

function createFirstPartitionMealy() {
    var firstPartition = [];
    for (var state in machineM['statesMachine']){
        var tempList = [];
        tempList.push(state);

        for (var compState in machineM['statesMachine']) {
            if (compState != state && equalResponseMealyStates(machineM['statesMachine'][state], machineM['statesMachine'][compState])) {
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

/*
    Search if an Array of arrays contains a new array
*/
function containsArray(generalArray, newArray){
    var contains = false;
    for(var i = 0; i < generalArray.length && !contains; i++){
        contains = contains || (generalArray[i].toString() === newArray.toString());
    }

    return contains;
}

function compareArrays(firstArray, secondArray) {
    var equalArrays = firstArray.length === secondArray.length;
    //If arrays are of the same size we compare them
    if(equalArrays){
        for (let i = 0; i < firstArray.length && equalArrays; i++) {
            if(!(firstArray[i].toString() === secondArray[i].toString())){
                equalArrays = false;
            }
        }
    }

    return equalArrays;
}

/*
    Test Machine
*/
var machineM = {
    stymulus: [0, 1],
    statesMachine: {
        'A': {
            0: {
                response: 0,
                nextState: 'B'
            },
            1: {
                response: 0,
                nextState: 'C'
            }
        },
        'B': {
            0: {
                response: 1,
                nextState: 'C'
            },
            1: {
                response: 1,
                nextState: 'D'
            }
        },
        'C': {
            0: {
                response: 0,
                nextState: 'D'
            },
            1: {
                response: 0,
                nextState: 'E'
            }
        },
        'D': {
            0: {
                response: 1,
                nextState: 'C'
            },
            1: {
                response: 1,
                nextState: 'B'
            }
        },
        'E': {
            0: {
                response: 1,
                nextState: 'F'
            },
            1: {
                response: 1,
                nextState: 'E'
            }
        },
        'F': {
            0: {
                response: 0,
                nextState: 'G'
            },
            1: {
                response: 0,
                nextState: 'C'
            }
        },
        'G': {
            0: {
                response: 1,
                nextState: 'F'
            },
            1: {
                response: 1,
                nextState: 'G'
            }
        },
        'H': {
            0: {
                response: 1,
                nextState: 'J'
            },
            1: {
                response: 0,
                nextState: 'B'
            }
        },
        'J': {
            0: {
                response: 1,
                nextState: 'H'
            },
            1: {
                response: 0,
                nextState: 'D'
            }
        }
    }
};