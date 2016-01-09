var base_url_role = '/role';

var roles = [];
var operation = "add";
var currentPageNo = 1;
var pageRows = 2;

$(function() {
    queryList();

    $("#btnRoleQuery").click(function() {
        currentPageNo = 1;
        queryList();
    });
});

function queryList() {
    zhget(base_url_role, {
        roleid: $('#tisid').val(),
        rolename: $('#tisname').val(),
        page: currentPageNo,
        size: pageRows
    }, function(result) {
        roles = result.rows;
        buildTable(result, 'role-template', 'role-placeholder');
    });
}

function onRoleAddClick() {
    cleanForm();
    operation = "add";
    $("#roleid").removeAttr("readonly");
    $('#roleModal').modal('show');
}

function onRoleUpdateClick(roleid) {
    fillForm(roleid);
    operation = "modify";
    $("#roleid").attr("readonly", "readonly");
    $('#roleModal').modal('show');
}

function onRoleDeleteClick(roleid) {
    zhdelete(base_url_role + "/" + roleid, null, function(result) {
        if (result && result.affectedRows > 0) {
            queryList();
            showSuccess('删除成功！');
        } else {
            showError('删除失败！');
        }
    });
}

function onRoleSaveClick() {
    var roleid = $("#roleid").val();
    var data = {
        roleid: roleid,
        rolename: $("#rolename").val(),
        remark: $("#remark").val()
    };
    if ($("#roleid").val() && $("#rolename").val()) {
        if (operation == "add") {
            zhpost(base_url_role, data, saveResult);
        } else {
            zhput(base_url_role + "/" + roleid, data, saveResult);
        }
    }
}

function saveResult(result) {
    if (result) {
        if (result.error) {
            for (key in result.error) {
                var ftxt;
                if (key == 'roleid') {
                    ftxt = '角色编号';
                } else if (key == 'rolename') {
                    ftxt = '角色名称';
                }
                showError(ftxt + ':' + result.error[key]);
            }
        } else if (result.affectedRows > 0) {
            $('#roleModal').modal('hide');
            queryList();
            showSuccess('保存成功！');
        }
    } else {
        showError('保存失败！');
    }
}

function fillForm(roleid) {
    var index = 0;
    for (index in roles) {
        var item = roles[index];
        if (item.roleid == roleid) {
            $("#roleid").val(item.roleid);
            $("#rolename").val(item.rolename);
            $("#remark").val(item.remark);
            return;
        }
    }
}

function cleanForm() {
    $("#roleid").val("");
    $("#rolename").val("");
    $("#remark").val("");
}
