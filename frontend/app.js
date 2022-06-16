const page_size = 6;
var tag_map=new Map();
// Add class to create toggle effecty
$(document).ready(function(){
  $(".input1, .fa-sticky-note").click(function(){
    $(".container, .input, .Save, .container2").addClass("active");
    });
    $("input1[type='text']").focus();
  });
// Remove class to create toggle effect
  $(document).ready(function(){
    $(".container2, .fa-sticky-note").click(function(){
      $(".container, .input, .Save, .container2").removeClass("active");
      });
      $("input1[type='text']").focus();
    });

var url = ""
function geturl(t, page_size, page_num=1){
  if(t == ""){
    url = "http://127.0.0.1:8000/?page_size="+page_size+"&page_num="+page_num
  }
  else{
    url = "http://127.0.0.1:8000/?tag=" + t + "&page_size="+page_size+"&page_num="+page_num
  }
  return url
}

//   Object creating to show notes
function getitem(note){
  var item = `
       <li class = "item1" id = "item">
              <div class = "title1">${note.title}</div>
              <div class = "sub_title1">${note.sub_title}</div>
              <div class = "text_note1">${note.text_note}</div>
              <div class = "note_tag_item">${note.tag}</div>
              <div class = "note_id">${note.id}</div>
              <div class = "note_taglist">${note.taglist}</div>
              <i class="fa-solid fa-pen-to-square editb"></i>
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
              <input type="text" class="tag" id = "ta" placeholder="tag">
              <a href="#" class="button" id = "edit" >Save Changes</a>
              <a href="#" class="button" id = "delete">Delete</a>
          </form>
          <div  class = "note_id "id= "_id"></div>
      </div>
  </div>`
  return modal;
};

// Get Method

// item append function 
var Scallback = function(notes) {
  notes[0].forEach(function (note) {
      var item = getitem(note);
      var tags=note.taglist.toString().split(",");
      tags.forEach(function(tag)
      {
      if(!tag_map.has(tag))
            {
              tag_map.set(tag,1);
            }
            else tag_map.set(tag,tag_map.get(tag)+1);
      });
      $('.container2').append(item);
  });
  $(".pagenum").text(notes[1])
  if(notes[1]>page_size){
    $(".pagenum").text(notes[1])
    $(".wrapper2 , .icon").removeClass("rem")

  }
  else{
    $(".pagenum").text("")
    $(".wrapper2 , .icon").addClass("rem")
  }

}

var getapi = function(page_size){
  $.ajax({
    url: geturl("", page_size,1),
    type: "GET",
    success: function(result) {
      $(".container2").empty()
      Scallback(result);
    },
    error: function(error) {
      console.log(error);
    }
  });
}



// get api call
$(document).ready(function() {
  var t = ""
  
  $(".icon1").click(function(){
    getapi(page_size)
    $(".search").val("")
    t=""
  })
  getapi(page_size)
  
  
  $('.search').keydown(function(e){
    $(".search").autocomplete(
      {
      source: Array.from(tag_map.keys()),
      },
      {
          autoFocus:true,
          delay:0,
          min:1
      }
    );
    if(e.keyCode == 13){
      t = $(".search").val()
      
      $.ajax({
        url: geturl(t,page_size),
        type: "GET",
        success: function(result) {
          $(".container2").empty()
          Scallback(result)
        },
        error: function(error) {
          console.log(error);
        }
      });
    }
  })
  
  $("#next").click(function(){
    var page_num = $(this).parent().children()[1].innerText
    end = page_num*page_size
    max = $(".pagenum").text()
    if(max<end){
      alert("this is the last page")
      return false

    } 
    page_num = parseInt(page_num)+1
    $(this).parent().children()[1].innerText = page_num
    $(".starting").text((page_num-1)*page_size + 1)
    
    $.ajax({
      url: geturl(t,page_size,page_num),
      type: "GET",
      success: function(result) {
        $(".container2").empty()
        Scallback(result)
      },
      error: function(error) {
        console.log(error);
      }

    });
    end = page_num*page_size
    max = $(".pagenum").text()
    $(".end").text((end<max ? end : max))
    

  })
  $("#previous").click(function(){
    var page_num = $(this).parent().children()[1].innerText
    if(page_num==1){
      alert("this is the first page")
      return false

    } 
    page_num = parseInt(page_num)-1

    $(".starting").text(((page_num-1)*page_size)+1)
    $(".end").text(page_num*page_size)
    $(this).parent().children()[1].innerText = page_num
    $.ajax({
    
      url: geturl(t,page_size,page_num),
      type: "GET",
      success: function(result) {
        $(".container2").empty()
        Scallback(result)
      },
      error: function(error) {
        console.log(error);
      }
    });
  })
});
//   Post Method
$(document).ready(function() {
  $('#form').submit(function(e) {
      e.preventDefault(); // prevent the page from reload
      var tags= $('#note_tags').val().split(",");
      tags.forEach(function(tag)
      {
      if(tag_map.has(tag))
      {
        tag_map.set(tag,tag_map.get(tag)+1);
      }
      else tag_map.set(tag,1);
      });
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "http://127.0.0.1:8000/",
      data: JSON.stringify({ title: $('#title').val(), sub_title: $('#sub_title').val(), text_note: $('#note_text').val(), tag:$('#note_tags').val()}),
      success: function (result) {
          
      }
    }).done(function(response) {
        console.log(response) //print the data in the console
      })
    $(this).trigger('reset') // reset the form
    location.reload()

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
$('#ta').val($(this).children()[3].innerText);
$('#_id').val($(this).children()[4].innerText);
// on click load modal by changing dispaly to flex
document.querySelector('.bg-modal').style.display = "flex";
}).on('click', '#edit', function(event) {

  // edit button
event.stopPropagation();
var tags= $(this).parent()[0][3].value.split(",");
      tags.forEach(function(tag)
      {
if(tag_map.has(tag))
        {
          tag_map.set(tag ,tag_map.get(tag.value)+1);
        }
        else tag_map.set(tag,1);
      });
$.ajax({
  url: "http://127.0.0.1:8000/" + $(this).parent().parent().children().eq(2).val(),
  contentType: "application/json; charset=utf-8",
  type: "put",
  dataType: "json",
  data: JSON.stringify({
    title: $(this).parent()[0][0].value,
    sub_title: $(this).parent()[0][1].value,
    text_note: $(this).parent()[0][2].value,
    tag: $(this).parent()[0][3].value,}),
  success: function(note) {
    console.log(note)
  },error: function(error){
    console.log(error)
  }
})
location.reload()
});

// cross button
$('ul').on('click', 'li', function() {
}).on('click', '.close', function(event) {

  // remove modal
document.querySelector('.bg-modal').style.display = "none";
});

// delete method
$("ul").on('click', "li",function(){
}).on('click', "#delete" , function(){
if(window.confirm("This will delete the note permanently. Click Ok to confirm"))
{
  var tags= $(this).parent()[0][3].value.split(",");
      tags.forEach(function(tag)
      {
  if(tag_map.get(tag)>1)
  {
    tag_map.set(tag ,tag_map.get(tag)-1);
  }
  else tag_map.delete(tag);
  });
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

      $(document).ready(function(){
        $(".starting").text(1)
        $(".end").text(page_size)
      })