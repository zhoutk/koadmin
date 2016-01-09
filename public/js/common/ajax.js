var sid;

function zhget(url, data, callback) {
    zhajax(url, data, 'GET', callback);
}

function zhpost(url, data, callback) {
    zhajax(url, data, 'POST', callback);
}

function zhput(url, data, callback) {
    zhajax(url, data, 'PUT', callback);
}

function zhdelete(url, data, callback) {
    zhajax(url, data, 'DELETE', callback);
}

function zhajax(url, data, type, callback) {
    $.ajax({
        url: '/rs' + url,
        data: data,
        type: type,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Session-Id", sid);
        },
        success: function(result, textStatus, jqXHR) {
            sid = jqXHR.getResponseHeader("Session-Id");
            setCookie('sid', sid, 1);
            if (callback) {
                callback(result);
            }
        }
    });
}
