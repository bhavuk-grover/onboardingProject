// toggle effect

$(document).ready(function(){
  
    $(".input1, .fa-sticky-note").click(function(){
      $(".container, .input, .Save, .container2").toggleClass("active");
      $("input1[type='text']").focus();
    });
    
  });


//   Object creating 
function getitem(note){
    var item = `
         <li class = "item1" id = "item">
                <div class = "title1">${note.title}</div>
                <div class = "sub_title1">${note.sub_title}</div>
                <div class = "text_note1">${note.text_note}</div>
                <div class = "note_id">${note.id}</div>
        </li>
        `
        return item;
};


// Dynamic modal creation
function getmodal(){
  var modal = `
  <div class="bg-modal">
        <div class="modal-contents">
    
            <div class="close">+</div>
    
            <form action="">
                <input type="text" class="title1" id = "t" placeholder="title">
                <input type="text" class="sub_title1" id = "st" placeholder="subtitle">
                <textarea id="nt" placeholder="Note"></textarea>
                <a href="#" class="button" id = "edit" >Save Changes</a>
                <a href="#" class="button" id = "delete">Delete</a>
            </form>
            <div  class = "note_id "id= "_id"></div>
    
        </div>
    </div>`
    return modal;
};
// Get Method

  $(document).ready(function() {
    var Scallback = function(notes) {
        notes.forEach(function (note) {
            var item = getitem(note);
            $('.container2').append(item);
        });
    }
    $.ajax({
      url: "http://127.0.0.1:8000/",
      type: "GET",
      success: function(result) {
        Scallback(result);
      },
      error: function(error) {
        console.log(error);
      }

    });
  });

//   Post Method

$(document).ready(function() {
    /* ... */
    /* send a POST request to create a todo */
    $('#form').submit(function(e) {
        e.preventDefault(); // prevent the page from reload

      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/",
        data: JSON.stringify({ title: $('#title').val(), sub_title: $('#sub_title').val(), text_note: $('#note_text').val()}),
        success: function (result) {
            
            var item = getitem(result)
            $('.container2').append(item)
        }
      }).done(function(response) {
          console.log(response) //print the data in the console 
        })
      $(this).trigger('reset') // reset the form
    })
  })


//  modal and PUT Method
$('ul').on('click', 'li', function(event) {
  var item =getmodal();
  $('.container2').append(item)
    //dispal loaded items in modal
  event.stopPropagation();
  // jquery not working-look error
  $('#t').val($(this).children()[0].innerText);
  $('#st').val($(this).children()[1].innerText);
  $('#nt').val($(this).children()[2].innerText);
  $('#_id').val($(this).children()[3].innerText);

  // document.getElementById("t").value = $(this).children()[0].innerText;
  // document.getElementById("st").value = $(this).children()[1].innerText;    
  // document.getElementById("nt").value = $(this).children()[2].innerText;
  // document.getElementById("_id").innerText = $(this).children()[3].innerText;
  
// on click load modal by changing dispaly to flex
  document.querySelector('.bg-modal').style.display = "flex";
  
}).on('click', '#edit', function(event) {
  // do something when the user clicks on the edit button
  event.stopPropagation();
  $.ajax({
    url: "http://127.0.0.1:8000/" + $(this).parent().parent().children().eq(2).val(),
    contentType: "application/json; charset=utf-8",
    type: "put",
    dataType: "json",
    data: JSON.stringify({ 
      title: $(this).parent()[0][0].value, 
      sub_title: $(this).parent()[0][1].value, 
      text_note: $(this).parent()[0][2].value}),
    success: function(note) {

    },error: function(error){
      console.log(error)
    } 

  })
  location.reload()
});

// cross button
$('ul').on('click', 'li', function() {

}).on('click', '.close', function(event) {
  // do something when the user clicks on the edit button
  document.querySelector('.bg-modal').style.display = "none";
});

// delete method
$("ul").on('click', "li",function(){
}).on('click', "#delete" , function(){
  
  if(window.confirm("This will delete the note permanently. Click Ok to confirm"))
  {
    $.ajax({
      url: "http://127.0.0.1:8000/" + $(this).parent().parent().children().eq(2).val(),
      contentType: "application/json; charset=utf-8",
      type: "delete",
      dataType: "json",
      success: function(note) 
      {
        console.log("working")
      },error: function(error)
      {
        console.log(error)
      } 
    })
    location.reload()
  };
  
});




// var form = document.getElementById('form');
// form.addEventListener('submit', function(event){
//     event.preventDefault();
//     let title = document.getElementById('title').value
//     let sub_title = document.getElementById('sub_title').value
//     let note_text = document.getElementById('note_text').value
//     $.ajax({
//         type: "POST",
//         contentType: "application/json; charset=utf-8",
//         url: "http://127.0.0.1:8000/",
//         data: JSON.stringify({ title: title, sub_title: sub_title, text_note: note_text }),
//         success: function (result) {
//             var item = getitem(result)
//             $('.container2').append(item)
//         }
        
//     });
    
// });

