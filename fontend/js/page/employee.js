$(document).ready(function(){
    employeePage = new EmployeePage();
})

class EmployeePage{
    TitlePage = "Danh sách khách hàng";
    FormMode = null;
    EmployeeIdSelected = null;
    constructor(){
        this.loadData();
        this.initEvents();
    }
    
    /*
    *load dữ liệu
    */


    loadData(){
        // clear dữ liệu cũ:
        $('table#tbdlEmloyeesList tbody').empty();
        // gọi api thực hiện lấy dữ liệu về
        $.ajax({
            type: "GET",
            url: "http://cukcuk.manhnv.net/api/v1/employees",
            success: function(response){
                if(response){
                    var employees = response;
                    // duyệt từng nhân viên có trong mảng dữ liệu
                    for (const employee of employees){
                        // build từng tr và append vào tbody của table:
                        let trHTML = $( `<tr>
                                    <td class="text-align-left">${employee.EmployeeCode}</td>
                                    <td class="text-align-left">${employee.FullName}</td>
                                    <td class="text-align-center">${CommonJS.formatDateDDMMYYYY(employee.DateOfBirth)}</td>
                                    <td class="text-align-center">${employee.PhoneNumber}</td>
                                    <td class="text-align-left">${employee.Address}</td>
                                    <td class="text-align-left">${employee.Code}</td>
                                    <td class="text-align-left">${employee.Name}</td>
                                    <td class="text-align-left">${employee.Category}</td>
                                </tr>`);
                        // lưu trữ khóa chính của dòng dữ liệu hiện tại:
                        trHTML.data("employeeId", employee.EmployeeId);
                        trHTML.data("data",employee);
                        $("table#tbdlEmloyeesList tbody").append(trHTML);
                    }
                    
                }

            }
        });
       // $('.m-loading').hide();

        // build dữ liệu hiển thị lên table
    }
    /*
    *gán sự kiện cho các thành phần trong trang
    */

    initEvents(){
        // button add:
        $("#m-btn-add-e").click(this.btnAddOnclick.bind(this));
        //button save
        $("#btnSave").click(this.saveData.bind(this));
        // row on click
        //row double click
        $("#btnCloseDialog").click(this.btnCloseDialogOnclick);
        $("#btnClose").click(this.btnCloseDialogOnclick);
        $("table#tbdlEmloyeesList tbody").on("dblclick", "tr", this.rowOnDblClick.bind(this));
        $("table#tbdlEmloyeesList tbody").on("click", "tr", this.rowOnClick.bind(this));
        $("#btnDelete").click(this.delete.bind(this));

    }
    rowOnClick(sender){
        let currentRow = sender.currentTarget;
        let employeeId = $(this).data("employeeId");
        this.EmployeeIdSelected = employeeId;
        $(currentRow).siblings().removeClass('row-selected');
        currentRow.classList.add('row-selected');
        console.log(this.EmployeeIdSelected);
    }
    /*
    * hiển thị form thông tin KH khi đúp chuột vào dòng dữ liệu

    */
    rowOnDblClick(sender){
        this.FormMode = 2;
        
        let currentRow = sender.currentTarget;
        let employeeId = $(this).data("employeeId");
        this.EmployeeIdSelected = employeeId;
        // gọi api lấy dữ liệu chi tiết NV
        $.ajax({
            type: "GET",
            url: `http://cukcuk.manhnv.net/api/v1/Employees/${employeeId}`,
            success : function(response){
                // hiển thị form chi tiết
                $("#dlgPopup").show();

                // bindding dữ liệu vào form:
                // 1. lấy toàn bộ các input sẽ bindding dữ liệu -> có attribute [fielName]:
                let inputs = $("input[fieldName]");
                // 2. duyệt từng input ->lấy ra giá trị của attribute [fielName] -> để biết đc sẽ nạp thông tin (propperty) nào của đối tượng
                for (const input of inputs){
                    let fieldName = input.getAttribute("fieldName");
                    let value = response[fieldName];
                    if(value)
                        input.value = value;
                    else
                        input.value = null;
                }

                // $("#txtCustomerCode").val(response.EmployeeCode);
                // $("#txtFullName").val(response.FullName);
                // $("#dtDateOfBirthday").val(response.DateOfBirth);
                // $("#mobile").val(response.PhoneNumber);
                // $("#txtAddress").val(response.Address);
                // $("#txtEmployeeCode").val(response.Code);
               // $("cbName").val(response.Name);
               // $("cbCategory").val(response.Category);
                // hiển thị dữ liệu
               // $("#dlgPopup").show();
            }
        });

    }
    /*
    * hiển thị form thêm mới nhân viên khi ấn nút add
    */
    btnAddOnclick(){
        // gán lại giá trị cho FormMode của EmployeePage:
        this.FormMode = 1;
        // clean các giá trị nhập trc đó
        $('input').val(null);
        //load mã KH mới cho dialog 
        $.ajax({
            type: "GET",
            url: "http://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
            success : function(response){
                $("#txtCustomerCode").val(response);
                // focus vào ô nhập liệu đầu tiên
                $("#txtCustomerCode").focus()

            }
        });
        // hiển thị form thêm mới nhân viên
        $("#dlgPopup").show();
    }
    /*
    * 
    */
    btnCloseDialogOnclick(){
        $("#dlgPopup").hide();
    }
    /*
    *load dữ liệu
    */

    saveData(){
        var me = this;
        // kiểm tra giữ liệu có hợp lệ hay k

        // thực hiện build object chi tiết thông tin khách hàng


            // 1. lấy toàn bộ các input sẽ bindding dữ liệu -> có attribute [fielName]:
            let inputs = $("input[fieldName]");
            // 2. duyệt từng input ->lấy ra giá trị của attribute [fielName] -> để biết đc sẽ nạp thông tin (propperty) nào của đối tượng
            let employee = {}
            for (const input of inputs){
                let fieldName = input.getAttribute("fieldName");
                let value =input.value ;
                if(value)
                    employee[fieldName] = value;
                
            }
        //thực hiện cất dữ liệu => kiểm tra xem form ở trạng thái thêm mới hay update để gọi api tương ứng
        if(this.FormMode == 1){
            console.log(employee);
            $.ajax({
                type: "POST",
                url: "http://cukcuk.manhnv.net/api/v1/Employees",
                data: JSON.stringify(employee),
                dataType: "json",
                contentType : "application/json",
                success : function(response){
                  //  alert("thêm mới thành công");
                    // load lại dữ liệu
                    me.loadData();
                    // ẩn form chi tiết
                    $("#dlgPopup").hide();
                }
            });

        }
        else{
            $.ajax({
                type: "PUT",
                url: `http://cukcuk.manhnv.net/api/v1/Employees/${this.EmployeeIdSelected}`,
                data: JSON.stringify(employee),
                dataType: "json",
                contentType : "application/json",
                success : function(response){
                    me.loadData();
                    // ẩn form chi tiết 
                    $("#dlgPopup").hide();
    
                }
            });

        }

    }
    /*
    *load dữ liệu
    */
    delete(sender){
        let me = this;
        // lấy id cua bảng ghi vừa chọn
        let employeeId = this.EmployeeIdSelected;
        // gọi api thực hiện xóa
        $.ajax({
            type: "DELETE",
            url: `http://cukcuk.manhnv.net/api/v1/Employees/${this.EmployeeIdSelected}`,
            
            success : function(response){
                $('m-toast-delete').fadeIn();
                setTimeout(()=>{
                    $('.m-toast-delete').fadeOut();
                },3000)
                
                alert("xóa thành công")
                me.loadData();

            }
        });


    }
}