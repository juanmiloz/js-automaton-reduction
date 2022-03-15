/**
 * this is our machineMealy
 */
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


/**
 * this is our machineMoore
 */
var machineMoore = {
    stymulus: [0,1],
    statesMachine: {
        'A': {
            response: 'A',
            statesResponse: {
                0:'A',
                1:'B'
            }
        }
    }
}

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
            console.log(machineM);
        }
    });

    $('#submitTableMealy').click(function() {
        console.log(machineM);
        
        for(let i = 0; i < states.length; i++){
            for(let j = 0; j < inputs.length; j++){
                let array = $('#'+states[i]+inputs[j]).val().split(',');
                machine['statesMachine'][states[i]][inputs[j]]['nextState'] = array[0];
                machine['statesMachine'][states[i]][inputs[j]]['response'] = array[1];
            }
        }
        reduceMealyMachine();
        cambiarVista("tableResponseView");
        loadHTML("#tableResponse", responseTableMealy());
    });


    $('#submitTableMoore').click(function(){
        for(let i = 0; i < states.length; i++){
            for(let j = 0; j < inputs.length; j++){
                let value = $('#'+states[i]+inputs[j]).val();
                machineMoore['statesMachine'][states[i]]['statesResponse'][inputs[j]] = value;
                if(j == inputs.length-1){
                    value = $('#'+states[i]+'r').val();
                    machineMoore['statesMachine'][states[i]]['response'] = value;
                }
            }
        }
        console.log(machineMoore);
        reduceMooreMachine();
        cambiarVista("tableResponseView");
        loadHTML("#tableResponse", responseTableMoore());
    });

    $('#submitBtnMoore').click(function() {
        states = $('#statesMoore').val().split(',');
        inputs = $('#inputsMoore').val().split(',');

        if(states[0] == ''|| inputs[0] == ''){
            $('#states').val('');
            $('#inputs').val('');
        }else{
            getInitialMachineMoore(states, inputs);
            cambiarVista("tableViewMoore");
            loadHTML("#tableMoore", createMooreTable(states,inputs));
        }
    });
});

/**
 * This method prepares the mealy machine from the data entered by the user.
 * @param {array} states all the states of the machine 
 * @param {array} inputs all the inputs of the machine
 */
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
/**
 * This method prepares the moore machine from the data entered by the user.
 * @param {array} states 
 * @param {array} inputs 
 */
function getInitialMachineMoore(states,inputs){
    machineMoore = {};
    machineMoore.stymulus = inputs;
    machineMoore.statesMachine = {};
    for(let i = 0; i < states.length; i++){
        machineMoore['statesMachine'][states[i]] = {
            response: null,
            statesResponse: {}
        }
        for(let j = 0; j < inputs.length; j++){
            machineMoore['statesMachine'][states[i]]['statesResponse'][inputs[j]] = null;
        }
    }
}

/**
 * This method allows us to change the current view 
 * @param {String} objetivo its the name of the new view
 */
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


/**
 * This method will allow us to add to an html element a new html code to modify the view.
 * @param {String} element name of the element to modify
 * @param {String} HTML is the html code of which the element will be composed. 
 */
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

        html += "</tr>";
    }
    html += "</tbody></table>";

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
    var firstPartition = createFirstPartitionMealy(true);
    console.log('First partition:');
    console.log(firstPartition);
    var finalPartition = getFinalPartition(firstPartition);
    console.log('Reduced Machine:');
    console.log(finalPartition);
    reasignStatesMealy(finalPartition);
    console.log('Machine Mealy:');
    console.log(machineM);
    loadHTML("#partitionMachine", showPartitions(organizePartition(firstPartition), organizePartition(finalPartition)));
}

function reduceMooreMachine(){
    var firstPartition = createFirstPartitionMealy(false);
    console.log('First partition:');
    console.log(firstPartition);
    var finalPartition = getFinalPartition(firstPartition);
    console.log('Reduced Machine:');
    console.log(finalPartition);
    reasignStatesMoore(finalPartition);
    console.log('Machine Moore:');
    console.log(machineMooreT);
    loadHTML("#partitionMachine", showPartitions(organizePartition(firstPartition), organizePartition(finalPartition)));
}

function showPartitions(firstPartition, finalPartition){
    html = '<h4>Primera particion:</h4>'+firstPartition;
    html += '<br><h4>Particion final:</h4>'+finalPartition +'<br>';
    return html;
}

function organizePartition(partition){
    partitionString = '{ ';
    for(let i = 0; i < partition.length; i++){
        partitionString += (i!=partition.length-1)?'{' + partition[i] + '},':'{' + partition[i] + '}';
    }
    partitionString += ' }';
    return partitionString;
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

function reasignStatesMoore(finalPartition){
    for(var state in machineMooreT['statesMachine']){
        var represent = getRepresentant(finalPartition, state);
        if(state === represent){
            for(let j = 0; j < machineMooreT['stymulus'].length; j++){
                var stymul = machineMooreT['stymulus'][j];
                
                var currentNextState = machineMooreT['statesMachine'][state]['statesResponse'][stymul];
                var representNextState = getRepresentant(finalPartition, currentNextState);

                if(!(representNextState === currentNextState)){
                    machineMooreT['statesMachine'][state]['statesResponse'][stymul] = representNextState;
                }
            }
        }else{
            delete machineMooreT['statesMachine'][state]
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

function createFirstPartitionMealy(isMealy) {
    var firstPartition = [];
    var machineStates;
    if(isMealy){
        machineStates = machineM['statesMachine']
    }else{
        machineStates = machineMooreT['statesMachine']
    }
    for (var state in machineStates){
        var tempList = [];
        tempList.push(state);

        for (var compState in machineStates) {
            if (compState != state && equalResponseMealyStates(machineStates[state], machineStates[compState], isMealy)) {
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
function equalResponseMealyStates(stateA, stateB, isMealy) {
    var equalResponse = true;
    var stymulus = (isMealy)?machineM['stymulus']:machineMooreT['stymulus'];
    for (var s in stymulus) {
        if(isMealy){
            equalResponse = equalResponse && (stateA[stymulus[s]]['response'] == stateB[stymulus[s]]['response']);
        }else{
            equalResponse = equalResponse && (machineMooreT['statesMachine'][stateA['statesResponse'][stymulus[s]]]['response'] === machineMooreT['statesMachine'][stateB['statesResponse'][stymulus[s]]]['response']);
        }
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

function responseTableMealy(){
    var html = ''
    html += '<table class="tableEdit" "id="tableResponse"><thead><th class="tableEdit"></th>';
    
    for(let i = 0; i<machineM['stymulus'].length; i++){
        html += '<th class="tableEdit">'+machineM['stymulus'][i]+"</th>";
    }
    html += "</thead><tbody>";
    
    for(let i = 0; i<Object.keys(machineM['statesMachine']).length; i++){
        html += '<tr class="tableEdit"><th>'+Object.keys(machineM["statesMachine"])[i]+'</th>';
        
        for(let j = 0; j<machineM['stymulus'].length; j++){
            var actualState = Object.keys(machineM['statesMachine'])[i];
            let nextStatePrint = machineM['statesMachine'][actualState][machineM['stymulus'][j]]['nextState'];
            let responsePrint = machineM['statesMachine'][actualState][machineM['stymulus'][j]]['response'];
            html += '<td class="tableEdit"  >'+nextStatePrint+','+responsePrint+'</td>';
        }

        html += "</tr>"
    }
    html += "</tbody></table>"
    return html;
}

function responseTableMoore(){
    var html = ''
    html += '<table class="tableEdit" "id="tableResponse"><thead><th class="tableEdit"></th>';
    
    for(let i = 0; i<machineMooreT['stymulus'].length; i++){
        html += '<th class="tableEdit">'+machineMooreT['stymulus'][i]+"</th>";
        if(i == machineMooreT['stymulus'].length-1){
            html += "<th>Response</th>"
        }
    }
    html += "</thead><tbody>";
    
    for(let i = 0; i<Object.keys(machineMooreT['statesMachine']).length; i++){
        html += '<tr class="tableEdit"><th>'+Object.keys(machineM["statesMachine"])[i]+'</th>';
        
        for(let j = 0; j<machineMooreT['stymulus'].length; j++){
            var actualState = Object.keys(machineMooreT['statesMachine'])[i];
            let nextStatePrint = machineMooreT['statesMachine'][actualState]['statesResponse'][machineMooreT['stymulus'][j]];
            html += '<td class="tableEdit"  >'+nextStatePrint+'</td>';
            if(j == machineMooreT['stymulus'].length-1){
                let responsePrint = machineMooreT['statesMachine'][actualState]['response'];
                html += '<td class="tableEdit" >'+responsePrint +'</td>'
            }
        }

        html += "</tr>"
    }
    html += "</tbody></table>"
    return html;
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

var machineMooreT = {
    stymulus: [0, 1],
    statesMachine: {
        'A': {
            response: 0,
            statesResponse:{
                0:'B',
                1:'A'
            }
        },
        'B': {
            response: 0,
            statesResponse:{
                0:'C',
                1:'B'
            }
        },
        'C': {
            response: 0,
            statesResponse:{
                0:'D',
                1:'C'
            }
        },
        'D': {
            response: 0,
            statesResponse:{
                0:'E',
                1:'D'
            }
        },
        'E': {
            response: 0,
            statesResponse:{
                0:'F',
                1:'E'
            }
        },
        'F': {
            response: 1,
            statesResponse:{
                0:'E',
                1:'F'
            }
        }
    }
};