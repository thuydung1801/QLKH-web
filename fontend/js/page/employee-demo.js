
$(document).ready(function(){
    loadData();
    // thực hiện gán các events cho các element
    // load dữ liệu phòng ban ( loại KH):
    loadCategory();

    $("#m-btn-add-e").click(function(){
        // hiển thị form chi tiết nhân viên
        $("#dlgPopup").show();
        // reset form
        $("input").val(null);

        //lấy mã khách hàng mới và hiển thị trên ô nhập mã KH
        $.ajax({
            type: "GET",
            url:"http://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
            success: function(response){
                $("#txtCustomerCode").val(response);
                // focus vào ô nhập liệu đầu tiên
                $("#txtCustomerCode").focus()
            }

        });

        
    })
    // đóng dialog
    $("#btnCloseDialog").click(function(){
        $("#dlgPopup").hide();
    })
    // hủy
    $("#btnClose").click(function(){
        $("#dlgPopup").hide();
    })

   


    // lưu
    $("#btnSave").click(function(){
        // lấy thu thập các thông tin đã liệu:
        const customerCode = $("#txtCustomerCode").val();
        const fullName = $("#txtFullName").val();
        const dateOfBirthday = $("#dtDateOfBirthday").val();
        const mobile = $("#mobile").val();
        const address = $("#txtAddress").val();
        const employeeCode = $("#txtEmployeeCode").val();
        const name = $("#cbName").val();
        const category = $("#cbCategory").val();

        // build thành object KH:
        let customer = {
            "CustomerCode": customerCode,
            "FullName":fullName,
            "DateOfBirth": dateOfBirthday,
            "PhoneNumber": mobile,
            "Address": address,
            "EmployeeCode": employeeCode,
            // "Name" :name,
            "Category" : category
            
        }

        //sử dụng ajax gọi lên Api cất dữ liệu:
        $.ajax({
            type: "POST",
            url:"http://cukcuk.manhnv.net/api/v1/Employees",
            data: JSON.stringify(customer),
            async: false,
            dataType: "json",
            
            contentType: "application/json",
            success: function(response){
                console.log(response);
            },
            error: function(res){
                console.log(res);
            }
        });
        // ẩn form chi tiết:
        $("#dlgPopup").hide();
        // load lại dữ liệu:
        loadData();
       
       
    })
    
})
 /**
     * Load dữ liệu cho combobox phòng ban
     * 
     */
function loadCategory(){
    // lấy dữ liệu về
    $.ajax({
        type:"GET",
        url:"http://cukcuk.manhnv.net/api/v1/Departments",
        success: function(response){
            // build combobox
            for( const department of response){
                let optionHTML = `<option value="${department.DepartmentId}">${department.DepartmentName}</option>`;
                $('#cbCategory').append(optionHTML);
            }
        }


});

    

}

function showLoading() {
    $('.m-loading').show();

}
function loadData() {
    // làm sạch bảng
    $("#tbdlEmloyeesList tbody").empty();
    //lấy dữ liệu:
    let employees = [];
    $('.m-loading').show();
    // gọi lên Api thực hiện lấy dữ liệu: -> sd jquery ajax:
    $.ajax({
        type: "GET", //POST- thêm mới, PUT-sửa, DELETE-xóa
        //url:"https://localhost:44310/employees",
        url:"http://cukcuk.manhnv.net/api/v1/Employees",
       // dataType: "json", //tham số truyền lên cho API
       // contentType:"application/json",
        async: true,
        success: function(response){
            employees = response;
            console.table("chặng 2");
            //xác đinh element sẽ hiển thị dữ liệu:
            // let table = document.getElementById('tbdlEmloyeesList');
            let table = $("#tbdlEmloyeesList");

            //build table:
            
            $.each(employees, function(indexInArray, employee){
                let employeeCode =employee.EmployeeCode;
                let fullName = employee.FullName;
                let dateOfBirthday = employee.DateOfBirth;
                let mobile = employee.Phone;
                let address = employee.Address;
                let code = employee.Code;
                let name = employee.Name;
                let category = employee.Category;

                // xử lý/ định dạng dữ liệu:
                // định dạng ngày sinh: - Phải có dạng hiển thị là ngày/tháng/năm
                dateOfBirthday = new Date(dateOfBirthday);
                let date = dateOfBirthday.getDate();
                date = date<10?`0${date}`:date;
                let month = dateOfBirthday.getMonth() + 1;
                month = month<10?`0${month}`:month;
                let year = dateOfBirthday.getFullYear();
                dateOfBirthday = `${date}/${month}/${year}`;
                let tr= `<tr>
                            <td class="text-align-left">${employeeCode}</td>
                            <td class="text-align-left">${fullName}</td>
                            <td class="text-align-center">${dateOfBirthday}</td>
                            <td class="text-align-center">${mobile}</td>
                            <td class="text-align-left">${address}</td>
                            <td class="text-align-left">${code}</td>
                            <td class="text-align-left">${name||""}</td>
                            <td class="text-align-left">${category||""}</td>
                        </tr>`;
                $("#tbdlEmloyeesList tbody").prepend(tr);
            });
            $('.m-loading').hide();

           // alert("Đã lấy được dữ liệu.!");

        },
        error: function (res) {
            alert("Có lỗi xẩy ra");
            
        }
     //   http://cukcuk.manhnv.net/swagger/index.html
    });

    
}