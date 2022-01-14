function ValidateData(text, date, catt, mont) {
  if (text === ' ' || date === '' || catt == ' ' || mont == ' ') {
    alert("Please enter all the fields");
    return false;
  }
  else {
    return true;
  }
}
function edit(id) {
  console.log("edit", id);
  var my_text = document.getElementById('ed' + id).className
  if (my_text === 'btn btn-outline-warning ibtn-edit') {
    var t = document.getElementById("P" + id).innerHTML
    var category = document.getElementById("C" + id).innerHTML
    var date_t1 = document.getElementById("D" + id).innerHTML
    var my_text = document.getElementById('ed' + id).innerHTML = "Save"
    console.log(date_t1)
    var money = document.getElementById("M" + id).innerHTML
    var input = $(`<td><input type="text" class="edit text form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" id ='inp${id}' value="${t}" /></td>`)
    var input1 = $(`<td><input type="text" class="edit text form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" id="inputText1${id}" value="${category}" /></td>`)
    var input2 = $(`<td><input type="text" class="edit text form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" id="inputText2${id}" value="${money}" /></td>`)
    $('#' + 'D' + id).replaceWith(`<input type="date" class="form-control" id='Date${id}' value="${date_t1}"></input>`)
    $('#' + "P" + id).replaceWith(input);
    $('#' + "C" + id).replaceWith(input1);
    $('#' + "M" + id).replaceWith(input2);
    document.getElementById("ed" + id).className = "btn btn-outline-warning ibtn-Save"
  }
  if (my_text === 'btn btn-outline-warning ibtn-Save') {
    var tex = $('#' + "inp" + id).val();
    var cattext = $('#' + "inputText1" + id).val();
    var montext = $('#' + "inputText2" + id).val();
    var date_text = $('#' + "Date" + id).val();
    console.log("--->>> ", date_text);
    $.ajax({
      url: '/edit',
      type: 'POST',
      data: {
        text: tex,
        category: cattext,
        money: montext,
        date: date_text,
        id: id,
      },
      success: function (data) {
        console.log(data);
        location.reload();
      },
      error: function (data) {
        console.log(data);
      }
    });

    console.log('-->> D', date_text);
    console.log(tex);
    if (ValidateData(tex, date_text, cattext, montext)) {
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
      var inpt = $(`<td scope="row" id="P${id}">${tex}</td>`)
      $('#' + "inp" + id).replaceWith(inpt)
      var input1 = $(`<td id="C${id}">${cattext}</td>`)
      var input2 = $(`<td id="M${id}">${montext}</td>`)
      var input3 = $(`<td id="D${id}">${date_text}</td>`)
      $('#' + "inputText1" + id).replaceWith(input1);
      $('#' + "inputText2" + id).replaceWith(input2);
      $('#' + "Date" + id).replaceWith(input3);
      document.getElementById("ed" + id).className = "btn btn-outline-warning ibtn-edit"
      var my_text = document.getElementById('ed' + id).innerHTML = "Edit"
    }
  }
}

function change() {
  var sel = document.getElementsByTagName('option').classname
  if (document.getElementsByClassName('form-check-input inc1').checked) {
    if (sel === 'Income') {
      $('.' + "Income").replaceWith(" ");
    }
  }
  if (document.getElementsByClassName('form-check-input ex1').checked) {
    if (sel === 'Expenses') {
      $('.' + 'Expenses').replaceWith(" ")
    }
  }
}
function deletes(id) {
  $.ajax({
    url: '/item',
    type: 'DELETE',
    data: {
      id: id,
    },
    success: function (data) {
      console.log(data);
      location.reload();
    },
    error: function (data) {
      console.log(data);
    }
  });
}
