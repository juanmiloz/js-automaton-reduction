$(document).ready(function() {
    $('#submitBtn').click(function() {
        var states = $('#states').val().split(',');
        var inputs = $('#inputs').val().split(',');

        if(states[0] == ''|| inputs[0] == ''){
            $('#states').val('');
            $('#inputs').val('');
        }else{
            cambiarVista("tableView");
            loadHTML(createMealyTable2(states,inputs));
        }
    });
});

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

function loadHTML(html){
    $("#tableView").html(html);
}


function createMealyTable(states, inputs){
    var html = "<table><thead><th></th>";
    
    for(let i = 0; i<inputs.length; i++){
        html += "<th>"+inputs[i]+"</th>";
    }
    html += "</thead><tbody>";
    
    for(let i = 0; i<states.length; i++){
        html += "<tr><th>"+states[i]+"</th>";
        
        for(let j = 0; j<inputs.length; j++){
            html += '<td><input type="text"></td>';
        }

        html += "</tr>"
    }
    html += "</tbody></table>"

    console.log(html);
    return html; 
}