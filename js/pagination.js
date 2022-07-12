var url_string = window.location.href
var url = new URL(url_string);
var c = parseInt(url.searchParams.get("page")) || 1;
// console.log("page", c);
// document.querySelector("body > div.content > div.m-table-paging > div.m-paging-center > div.m-paging-number > div").innerHTML = c
var maxPage = c
$(document).ready(function () {
    $.ajax({
        type: "GET",        
        url: `http://localhost:4000/customer/count`,
        success: function (response) {
            if (response) {
                // console.log(response)
                const MAXPAGE = response.count
                maxPage = response.count

                const startPage = c-2 > 0 ? c - 2 : 1;
                const endPage = c+2 > MAXPAGE ? MAXPAGE: c+2 ;
                
            
                console.log("ok")
                for(let i=startPage;i<=endPage;i++){
                    $('body > div.content > div.m-table-paging > div.m-paging-center > div.m-paging-number').append(`<div class="page-number" onclick={loadPage(${i})}>${i}</div>`)
                }


                
            }

        }
    });
    
   
})
function loadPage(page){
    if(page){
        window.location.href = "/fontend/page/employee.html?page=" +page
    }
    else{
        window.location.href = "/fontend/page/employee.html"
    }
    
}
