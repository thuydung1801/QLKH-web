$(document).ready(function () {
    customerPage = new CustomerPage();
    loadEmployeeComboboxData();
    loadCategoryComboboxData();
})

class CustomerPage {
    TitlePage = "Danh sách khách hàng";
    FormMode = null;
    FormEmployee = null;
    CustomerIdSelected = null;
    
    constructor() {
        var url_string = window.location.href
        var url = new URL(url_string);
        this.page = url.searchParams.get("page");
        // this.loadDataRefresh();
        this.loadData();
        this.initEvents();
    }

    /*
     *load dữ liệu
     */


    loadData() {
        // clear dữ liệu cũ:
        $('table#tbdlEmloyeesList tbody').empty();
        // gọi api thực hiện lấy dữ liệu về
        $.ajax({
            type: "GET",
            
            url: this.page ? `http://localhost:4000/customer?page=${this.page}`: "http://localhost:4000/customer",
            // url:"http://localhost:4000/customer",
            success: function (response) {
                if (response) {
                    var customers = response;
                    // duyệt từng nhân viên có trong mảng dữ liệu
                    for (const customer of customers) {
                        // build từng tr và append vào tbody của table:
                        let trHTML = $(`<tr>
                                    <td class="text-align-left">${customer?.code}</td>
                                    <td class="text-align-left">${customer?.name}</td>
                                    <td class="text-align-center">${CommonJS.formatDateDDMMYYYY(customer?.dateOfBirth)}</td>
                                    <td class="text-align-center">${customer?.mobile}</td>
                                    <td class="text-align-left">${customer?.address}</td>
                                
                                    <td class="text-align-left">${customer?.Employee?.name}</td>
                                    <td class="text-align-left">${customer?.Category?.name}</td>
                                </tr>`);
                                //    <td class="text-align-left">${customer?.Employee?.code}</td>
                        // lưu trữ khóa chính của dòng dữ liệu hiện tại:
                     //   trHTML.data("customerId", customer.code);
                        trHTML.data("id", customer.id);
                        trHTML.data("data", customer);
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

    initEvents() {
        // button add:
        $("#m-btn-add-e").click(this.btnAddOnclick.bind(this));
        // button search
        $("#inputSearch").on('keyup',this.search.bind(this));
       
        //button save
        $("#btnSave").click(this.saveData.bind(this));
        // button refresh
        $("#btnRefresh").click(this.btnLoadingPage.bind(this));
        // row on click
        //row double click
        $("#btnCloseDialog").click(this.btnCloseDialogOnclick);
        $("#btnClose").click(this.btnCloseDialogOnclick);
        $("table#tbdlEmloyeesList tbody").on("dblclick", "tr", this.rowOnDblClick.bind(this));
        $("table#tbdlEmloyeesList tbody").on("click", "tr", this.rowOnClick.bind(this));
        $("#btnDelete").on("click", this.delete.bind(this));
         //bộ lọc nhân viên
        // $("#slNV").on('click',this.showCustomerbyEmployee.bind(this));
        //bộ lọc loại
        // $("#slLoai").on('click',this.showCustomerbyCategory.bind(this));
        //bộ lọc
        $("#btn-submit").click(this.showCustomerbyEmployee.bind(this));

    }
    loadDataRefresh() {
        // clear dữ liệu cũ:
        $('table#tbdlEmloyeesList tbody').empty();
        // gọi api thực hiện lấy dữ liệu về
        $.ajax({
            type: "GET",
            
            // url: this.page ? `http://localhost:4000/customer?page=${this.page}`: "http://localhost:4000/customer",
            url:"http://localhost:4000/customer",
            success: function (response) {
                if (response) {
                    var customers = response;
                    // duyệt từng nhân viên có trong mảng dữ liệu
                    for (const customer of customers) {
                        // build từng tr và append vào tbody của table:
                        let trHTMLrf = $(`<tr>
                                    <td class="text-align-left">${customer?.code}</td>
                                    <td class="text-align-left">${customer?.name}</td>
                                    <td class="text-align-center">${CommonJS.formatDateDDMMYYYY(customer?.dateOfBirth)}</td>
                                    <td class="text-align-center">${customer?.mobile}</td>
                                    <td class="text-align-left">${customer?.address}</td>
                                
                                    <td class="text-align-left">${customer?.Employee?.name}</td>
                                    <td class="text-align-left">${customer?.Category?.name}</td>
                                </tr>`);
                                //    <td class="text-align-left">${customer?.Employee?.code}</td>
                        // lưu trữ khóa chính của dòng dữ liệu hiện tại:
                     //   trHTML.data("customerId", customer.code);
                        trHTMLrf.data("id", customer.id);
                        trHTMLrf.data("data", customer);
                        $("table#tbdlEmloyeesList tbody").append(trHTMLrf);
                    }
                }
            }
        });
        // $('.m-loading').hide();

        // build dữ liệu hiển thị lên table
    }
    btnLoadingPage() {
        this.loadDataRefresh();
        // this.loadData();
    }
    search(){
    
        let key = $("#inputSearch").val().toLowerCase();
        
        $('table#tbdlEmloyeesList tbody tr').filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(key) > -1);
               
        });
   
    }
    showCustomerbyEmployee(){
        var me=this;
        let seclected_Eml = $("#slNV option:selected").text();
        let seclected_Ctg = $("#slLoai option:selected").text();
        let seclect_Eml = $("#slNV option:selected").val();
        let seclect_Ctg = $("#slLoai option:selected").val();
        if(seclect_Eml==0 && seclect_Ctg == 0)
            //me.loadData();
            me.loadDataRefresh();
        if( seclect_Eml==0){
            // me.loadData();
            $('table#tbdlEmloyeesList tbody tr').filter(function(){
                $(this).toggle($(this).text().indexOf(seclected_Ctg) > -1);
               
            });
        }
        else if(seclect_Ctg == 0 ){
            // me.loadData();
            $('table#tbdlEmloyeesList tbody tr').filter(function(){
                $(this).toggle($(this).text().indexOf(seclected_Eml) > -1);
               
            });
        }
        else{
            $('table#tbdlEmloyeesList tbody tr').filter(function(){
                $(this).toggle(($(this).text().indexOf(seclected_Eml) > -1)&&($(this).text().indexOf(seclected_Ctg) > -1));
               
            });
        }
        
    }
   
    rowOnClick(sender) {
        let currentRow = sender.currentTarget;
        let customerId = $(currentRow).data("id");
        this.CustomerIdSelected = customerId;
        $(currentRow).siblings().removeClass('row-selected');
        currentRow.classList.add('row-selected');
        console.log(this.CustomerIdSelected);
    }
    /*
    * hiển thị form thông tin KH khi đúp chuột vào dòng dữ liệu

    */
    rowOnDblClick(sender) {
        this.FormMode = 2;

        let currentRow = sender.currentTarget;
        let customerId = $(currentRow).data("id");
        this.CustomerIdSelected = customerId;
       // console.log(this.CustomerIdSelected);
        // gọi api lấy dữ liệu chi tiết NV
        $.ajax({
            type: "GET",
          //  url: `http://localhost:4000/customer/${employeeId}`,
            url: `http://localhost:4000/customer/${this.CustomerIdSelected}`,
            success: function (customer) {
                // hiển thị form chi tiết
             //   $("#dlgPopup").show();

                // bindding dữ liệu vào form:
                // 1. lấy toàn bộ các input sẽ bindding dữ liệu -> có attribute [fielName]:
                let inputs = $("input[fieldName]");
                // 2. duyệt từng input ->lấy ra giá trị của attribute [fielName] -> để biết đc sẽ nạp thông tin (propperty) nào của đối tượng
                for (const input of inputs) {
                    let fieldName = input.getAttribute("fieldName");
                    let value = customer[fieldName];
                    if (value)
                        input.value = value;
                    else
                        input.value = null;
                }
            //    console.log(customer)

            //     $("#txtCustomerCode").val(response.code);
            //     $("#txtFullName").val(response.name);
            $("#dtDateOfBirthday").val(customer.dateOfBirth);
            //     $("#mobile").val(response.mobile);
            //     $("#txtAddress").val(response.address);
            //  //   $("#txtEmployeeCode").val(response.Code);
                $("#cbNV").val(customer.employeeId);
                $("#cbLoai").val(customer.categoryId);
            //   //  hiển thị dữ liệu
                 $("#dlgPopup").show();
            }
        });

    }
    /*
     * hiển thị form thêm mới nhân viên khi ấn nút add
     */
    btnAddOnclick() {
        // gán lại giá trị cho FormMode của EmployeePage:
        this.FormMode = 1;
        // clean các giá trị nhập trc đó
        $('input').val(null);
        //load mã KH mới cho dialog 
        // $.ajax({
        //     type: "GET",
        //     url: `http://localhost:4000/customer/newId`,
        //     success: function (response) {
        //         $("#txtCustomerCode").val(response);
        //         // focus vào ô nhập liệu đầu tiên
        //       //  $("#txtCustomerCode").focus()

        //     }
        // });
        // hiển thị form thêm mới nhân viên
        $("#dlgPopup").show();
        
    }
    /*
     * 
     */
    btnCloseDialogOnclick() {
        $("#dlgPopup").hide();
    }
    /*
     *load dữ liệu
     */
    
    saveData() {
        var me = this;
        // kiểm tra giữ liệu có hợp lệ hay k

        // thực hiện build object chi tiết thông tin khách hàng


        // 1. lấy toàn bộ các input sẽ bindding dữ liệu -> có attribute [fielName]:
        let inputs = $("input[fieldName]");
        // 2. duyệt từng input ->lấy ra giá trị của attribute [fielName] -> để biết đc sẽ nạp thông tin (propperty) nào của đối tượng
        let customer = {};
        for (const input of inputs) {
            let fieldName = input.getAttribute("fieldName");
            let value = input.value;
            if (value)
                customer[fieldName] = value;

        }


        customer = {
            ...customer,
            employeeId: $("#cbNV").val(),
            categoryId: $("#cbLoai").val()

        }

       // console.log("Custommer", customer)

        //thực hiện cất dữ liệu => kiểm tra xem form ở trạng thái thêm mới hay update để gọi api tương ứng
        if (this.FormMode == 1) {
            console.log(customer);
            $.ajax({
                type: "POST",
                url: "http://localhost:4000/customer",
                data: JSON.stringify(customer),
                dataType: "json",
                contentType: "application/json",
                success: function (response) {
                    //  alert("thêm mới thành công");
                    // load lại dữ liệu
                  //  me.loadData();
                  me.loadDataRefresh();
                    // ẩn form chi tiết
                    $("#dlgPopup").hide();
                    
                }
            });

        } else {
            $.ajax({
                type: "PUT",
                url: `http://localhost:4000/customer/${this.CustomerIdSelected}`,
                data: JSON.stringify(customer),
                dataType: "json",
                contentType: "application/json",
                success: function (response) {
                  //  me.loadData();
                  me.loadDataRefresh();
                    // ẩn form chi tiết 
                    $("#dlgPopup").hide();

                }
            });

        }


    }

    /*
     *load dữ liệu
     */
    delete(sender) {
        let me = this;
        // lấy id cua bảng ghi vừa chọn
        let customerId = this.CustomerIdSelected;
        // gọi api thực hiện xóa
        $.ajax({
            type: "DELETE",
            url: `http://localhost:4000/customer/${this.CustomerIdSelected}`,

            success: function (response) {
                $('.m-toast-delete').fadeIn();
                setTimeout(() => {
                    $('.m-toast-delete').fadeOut();
                }, 3000)

              //  alert("xóa thành công")
             //   me.loadData();
             me.loadDataRefresh();
            }
        });


    }
}

function loadEmployeeComboboxData() {
    // Lấy dữ liệu về
    $.ajax({
        type: "GET",
        url: "http://localhost:4000/employee",
        success: function (response) {
            // Buid combobox
            for (const employee of response) {
                
                let optionHTML = `<option value="${employee?.id}">${employee?.name}</option>`
                $("#cbNV").append(optionHTML);
            }
        }
    });
}

function loadCategoryComboboxData() {
    // Lấy dữ liệu về
    $.ajax({
        type: "GET",
        url: "http://localhost:4000/category",
        success: function (response) {
            // Buid combobox
            for (const category of response) {
              
                let optionHTML = `<option value="${category?.id}">${category?.name}</option>`
                $("#cbLoai").append(optionHTML);
            }
        }
    });
}