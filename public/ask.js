// document.getElementById("content").addEventListener("input", function(){
//     document.getElementById("count").innerText = 200 - document.getElementById("content").value.length;
// });
$("#content").on('input', function(){
    $("#count").text(200 - $("#content").val().length);
});