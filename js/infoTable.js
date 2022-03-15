/**
 * this is our machineMealy
 */
var machine = {
    initialState: 'A',
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
    initialState: 'A',
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
        machine = JSON.parse(JSON.stringify(machineM));
        
        reduceMealyMachine(machine);
        getConexusMealy();
        console.log('Reduce and Connexus machine: ');
        console.log(machine);

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
        machineMoore = JSON.parse(JSON.stringify(machineMooreT));

        reduceMooreMachine();
        getConexusMoore();
        console.log('Reduce and Connexus machine: ');
        console.log(machineMoore);

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
            getInitialmachineMoore(states, inputs);
            cambiarVista("tableViewMoore");
            loadHTML("#tableMoore", createMooreTable(states,inputs));
        }
    });
});

/**
 * This method prepares the mealy machine from the data entered by the user.
 * @param {array} states all the states of the machine Mealy
 * @param {array} inputs all the inputs of the machine Mealy
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
 * @param {array} states all the states of the machine Moore 
 * @param {array} inputs all the inputs of the machine Moore
 */
function getInitialmachineMoore(states,inputs){
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

/**
 * This method allows to create the html code of the table for the mealy machine from the states and inputs.
 * @param {array} states all the states of the machine Mealy
 * @param {array} inputs all the inputs of the machine Mealy
 */
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

/**
 * This method allows to create the html code of the table for the moore machine from the states and inputs.
 * @param {array} states all the states of the machine Moore
 * @param {array} inputs all the inputs of the machine Moore
 */
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
/**
 * This method is in charge of handling all the machine Mealy reduction.
 * @param {Object} machine Object containing the mealy machine from dictionaries and arrays
 */
function reduceMealyMachine(machine){
    var firstPartition = createFirstPartitionMealy(machine, true);
    console.log('First Partition:');
    console.log(firstPartition);
    var finalPartition = getFinalPartition(firstPartition);
    console.log('Final Partition:');
    console.log(finalPartition);
    reasignStatesMealy(machine, finalPartition);
    console.log('Machine Mealy:');
    console.log(machine);
    loadHTML("#partitionMachine", showPartitions(organizePartition(firstPartition), organizePartition(finalPartition)));
}   

/**
 * This method is in charge of handling all the machine Moore reduction.
 * @param {dic} machine Object containing the Moore machine from dictionaries and arrays
 */
function reduceMooreMachine(){
    var firstPartition = createFirstPartitionMealy(machine, false);
    console.log('First partition:');
    console.log(firstPartition);
    var finalPartition = getFinalPartition(firstPartition, false);
    console.log('Final Partition:');
    console.log(finalPartition);
    reasignStatesMoore(finalPartition);
    console.log('Machine Moore:');
    console.log(machineMoore);
    loadHTML("#partitionMachine", showPartitions(organizePartition(firstPartition), organizePartition(finalPartition)));
}

/**
 * This method is in charge of creating the html with the first and the last partition.
 * @param {*} firstPartition the first partition of de machine
 * @param {*} finalPartition the last partition of de machine
 * @returns {String} html code with the necessary code to display the initial and final partition
 */
function showPartitions(firstPartition, finalPartition){
    html = '<h4>Primera particion:</h4>'+firstPartition;
    html += '<br><h4>Particion final:</h4>'+finalPartition +'<br>';
    return html;
}

/**
 * This method is in charge of organizing a partition in a string
 * @param {array} partition any partition
 * @returns {String} Partition organized in a string
 */
function organizePartition(partition){
    partitionString = '{ ';
    for(let i = 0; i < partition.length; i++){
        partitionString += (i!=partition.length-1)?'{' + partition[i] + '},':'{' + partition[i] + '}';
    }
    partitionString += ' }';
    return partitionString;
}

/**
 * This method is in charge of reassigning the names to the final partition of Mealy.
 * @param {Object} machine Object containing the Mealy machine from dictionaries and arrays
 * @param {Array} finalPartition final partition of machine Mealy
 */
function reasignStatesMealy(machine, finalPartition) {
    var states = Object.keys(machine['statesMachine']);
    for(var s in states){
        var state = states[s];
        var represent = getRepresentant(finalPartition, state);
        if(state === represent){
            for (let j = 0; j < machine['stymulus'].length; j++) {
                var stymul = machine['stymulus'][j];
                var currentNextState = machine['statesMachine'][state][stymul]['nextState']
                var representNextState = getRepresentant(finalPartition, currentNextState);
                
                if(!(representNextState === currentNextState)){
                    machine['statesMachine'][state][stymul]['nextState'] = representNextState;
                }
            }
        }else{
            delete machine['statesMachine'][state];
        }
    }
}

/**
 * This method is in charge of reassigning the names to the final partition of Moore.
 * @param {Array} finalPartition final partition of machine Moore
 */
function reasignStatesMoore(finalPartition){
    for(var state in machineMoore['statesMachine']){
        var represent = getRepresentant(finalPartition, state);
        if(state === represent){
            for(let j = 0; j < machineMoore['stymulus'].length; j++){
                var stymul = machineMoore['stymulus'][j];
                
                var currentNextState = machineMoore['statesMachine'][state]['statesResponse'][stymul];
                var representNextState = getRepresentant(finalPartition, currentNextState);

                if(!(representNextState === currentNextState)){
                    machineMoore['statesMachine'][state]['statesResponse'][stymul] = representNextState;
                }
            }
        }else{
            delete machineMoore['statesMachine'][state]
        }
    }
}

/**
 * this method obtains the representative of a partition 
 * @param {array} partition final partition of machine
 * @param {Object} state one state from partition
 * @returns {Object} retunr one representant for de block
 */
function getRepresentant(partition, state) {
    var represent = null;
    for (let i = 0; i < partition.length; i++) {
        if(partition[i].includes(state)){
            represent = partition[i][0];
        }
    }
    
    return represent;
}

function getFinalPartition(nPartition, isMealy) {
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
        var outputBlocks = getOutputBlocks(nPartition, represent, isMealy);

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

/**
 * For every input a S state, has a nextState S' state.
 * This function finds that S' state in the partition and returns the block where it is.
 * It creates a list with all the blocks for every S' that is a nextState of S.
 * @param {array} partition final partition of machine
 * @param {Object} state one state from partition
 * @param {boolean} isMealy gives us the type of machine, if is true machine is Mealy else machine is Moore
 * @returns {array} obtain one block
 */
function getOutputBlocks(partition, state, isMealy) {
    var outputBlocks  = [];
    var inputs = (isMealy) ? machine['statesMachine'][state]: machineMoore['statesMachine'][state]['statesResponse'];
    for(var input in inputs){
        var nextState = (isMealy) ? machine['statesMachine'][state][input]['nextState'] : machineMoore['statesMachine'][state]['statesResponse'][input];
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

function createFirstPartitionMealy(machine, isMealy) {
    var firstPartition = [];
    var machineStates;
    if(isMealy){
        machineStates = machine['statesMachine']
    }else{
        machineStates = machineMoore['statesMachine']
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
    var stymulus = (isMealy)?machine['stymulus']:machineMoore['stymulus'];
    for (var s in stymulus) {
        if(isMealy){
            equalResponse = equalResponse && (stateA[stymulus[s]]['response'] == stateB[stymulus[s]]['response']);
        }else{
            equalResponse = equalResponse && (machineMoore['statesMachine'][stateA['statesResponse'][stymulus[s]]]['response'] === machineMoore['statesMachine'][stateB['statesResponse'][stymulus[s]]]['response']);
        }
    }

    return equalResponse;
}

function getConexusMealy() {
    var connectedStates = [];
    var initialState = machine['initialState'];
    var states = Object.keys(machine['statesMachine']);
    var stymulus = machine['stymulus'];

    connectedStates.push(initialState);
    var c = 0;

    while(c < connectedStates.length){
        var connected = connectedStates[c];
        for(var s in stymulus){
            var stymul = stymulus[s];
            var currentState = connected;
            var i = 0;
            do{
                var nextState = machine['statesMachine'][currentState][stymul]['nextState'];
                if(!connectedStates.includes(nextState)){
                    connectedStates.push(nextState);
                }
                currentState = nextState;
                i++;
            } while(i < states.length);
        }
        c++;
    }

    if(!compareArrays(connectedStates, states)){
        for (let j = 0; j < states.length; j++) {
            if(!(connectedStates.includes(states[j]))){
                delete machine['statesMachine'][states[j]];
            }
        }
    }
}

function getConexusMoore() {
    var connectedStates = [];
    var initialState = machineMoore['initialState'];
    var states = Object.keys(machineMoore['statesMachine']);
    var stymulus = machineMoore['stymulus'];

    connectedStates.push(initialState);
    var c = 0;

    while(c < connectedStates.length){
        var connected = connectedStates[c];
        for(var s in stymulus){
            var stymul = stymulus[s];
            var currentState = connected;
            var i = 0;
            do{
                var nextState = machineMoore['statesMachine'][currentState]['statesResponse'][stymul];
                if(!connectedStates.includes(nextState)){
                    connectedStates.push(nextState);
                }
                currentState = nextState;
                i++;
            } while(i < states.length);
        }
        c++;
    }

    if(!compareArrays(connectedStates, states)){
        for (let j = 0; j < states.length; j++) {
            if(!(connectedStates.includes(states[j]))){
                delete machineMoore['statesMachine'][states[j]];
            }
        }
    }
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

/**
 * This method performs a comparison between arrays to see if they are identical or not.
 * @param {array} firstArray first array to compare
 * @param {array} secondArray second array to compare
 * @returns {boolean} if both arrays are equal returns true else return false
 */
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

/**
 * This method returns an html with the format of a mealy machine with the content 
 * of the final partition already reallocated. 
 * @returns {String} html code with all the content of the final tables Mealy
 */
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

/**
 * This method returns an html with the format of a Moore machine with the content 
 * of the final partition already reallocated. 
 * @returns {String} html code with all the content of the final tables Moore
 */
function responseTableMoore(){
    var html = ''
    html += '<table class="tableEdit" "id="tableResponse"><thead><th class="tableEdit"></th>';
    
    for(let i = 0; i<machineMoore['stymulus'].length; i++){
        html += '<th class="tableEdit">'+machineMoore['stymulus'][i]+"</th>";
        if(i == machineMoore['stymulus'].length-1){
            html += "<th>Response</th>"
        }
    }
    html += "</thead><tbody>";
    
    for(let i = 0; i<Object.keys(machineMoore['statesMachine']).length; i++){
        html += '<tr class="tableEdit"><th>'+Object.keys(machineM["statesMachine"])[i]+'</th>';
        
        for(let j = 0; j<machineMoore['stymulus'].length; j++){
            var actualState = Object.keys(machineMoore['statesMachine'])[i];
            let nextStatePrint = machineMoore['statesMachine'][actualState]['statesResponse'][machineMoore['stymulus'][j]];
            html += '<td class="tableEdit"  >'+nextStatePrint+'</td>';
            if(j == machineMoore['stymulus'].length-1){
                let responsePrint = machineMoore['statesMachine'][actualState]['response'];
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
    initialState: 'A',
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