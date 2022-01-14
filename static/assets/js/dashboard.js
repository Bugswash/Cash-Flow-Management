function ValidateData(text, date,catt,mont) {
    if (text === ' ' || date === '' || catt == ' ' || mont == ' ') {
        alert("Please enter all the fields");
        return false;
    }
    else {
        return true;
    }
}
function edit() {
    var my_text = document.getElementById('ed').className
    if (my_text === 'btn btn-outline-warning ibtn-edit') {
        var t = document.getElementById("P").innerHTML
        var category = document.getElementById("C").innerHTML
        var date_t1 = document.getElementById("D").innerHTML
        console.log(date_t1)
        var money = document.getElementById("M").innerHTML
        var input = $(`<td><input type="text" class="edit text form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" id ='inp' value="${t}" /></td>`)
        var input1 = $(`<td><input type="text" class="edit text form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" id="inputText1" value="${category}" /></td>`)
        var input2 = $(`<td><input type="text" class="edit text form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" id="inputText2" value="${money}" /></td>`)
        $('#' + 'D').replaceWith(`<td><input type="date" class="form-control" id='Date' value="${date_t1}"></input></td>`)
        $('#' + "P").replaceWith(input);
        $('#' + "C").replaceWith(input1);
        $('#' + "M").replaceWith(input2);
        document.getElementById("ed").className = "btn btn-outline-warning ibtn-Save"
    }
    if (my_text === 'btn btn-outline-warning ibtn-Save') {
        var tex = $('#' + "inp").val();
        var cattext = $('#' + "inputText1").val();
        var montext = $('#' + "inputText2").val();
        var date_text = $('#' + "Date").val();
        console.log('-->> D', date_text);
        console.log(tex);
        if (ValidateData(tex,date_text,cattext,montext)) {
            // var temp = JSON.parse(localStorage.getItem('todos'));
            // for (let i = 0; i < temp.length; i++) {
            //     if (id === temp[i].id) {
            //         var todo = {
            //             id: id,
            //             name: text,
            //             completed: false,
            //             Expires: date_text
            //         };
            //         data[i] = todo;
            //         addToLocalStorage(data)
            //     }
            // }
            console.log('Nice');
            var inpt = $(`<td scope="row" id="P">${tex}</td>`)
            $('#' + "inp").replaceWith(inpt)
            var input1 = $(`<td id="C">${cattext}</td>`)
            var input2 = $(`<td id="M">${montext}</td>`)
            var input3 = $(`<td id="D">${date_text}</td>`)
            $('#' + "inputText1").replaceWith(input1);
            $('#' + "inputText2").replaceWith(input2);
            $('#' + "Date").replaceWith(input3);
            document.getElementById("ed").className = "btn btn-outline-warning ibtn-edit"
        }
    }
}

function change(){
    var sel = document.getElementsByTagName('option').classname 
    if(document.getElementsByClassName('form-check-input inc1').checked){
      if(sel === 'Income'){
        $('.' + "Income").replaceWith(" ");
      }
    }
    if(document.getElementsByClassName('form-check-input ex1').checked){
      if(sel === 'Expenses'){
        $('.'+'Expenses').replaceWith(" ")
      }
    }
  }