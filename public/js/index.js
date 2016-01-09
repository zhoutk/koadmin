$(function() {
    $('#side-menu').metisMenu();
    initEvent();
    initPara();
    $(window).bind('hashchange', hashchangehandler);
    hashchangehandler();
});


function initEvent() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse')
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse')
        }

        height = (this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    })
}

function hashchangehandler() {
    var hash = window.location.hash || '#pages/home.html';
    hash = hash.replace("#", "");
    divLoadPage(hash);
    scroll(0, 0);
    hash = hash.replace("pages/", "");
    hash = hash.replace(".html", "");
    $('.nav a').removeClass('active');
    $("#" + hash).addClass('active');
}

function onMenuClick(url) {
    location.hash = url;
    if (!+'\v1' && !'1' [0]) {
        hashchangehandler();
    }
}

function divLoadPage(url) {
    $.get(url, function(result) {
        $("#page-wrapper").html(result);
    });
}


function initPara() {
    Messenger.options = {
        extraClasses: 'messenger-fixed messenger-on-bottom',
        theme: 'flat'
    };
    Handlebars.registerHelper("math", function(lvalue, operator, rvalue,
        options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue,
            "idx": (lvalue + 1) + ((currentPageNo - 1) * pageRows)
        }[operator];
    });
    sid = getCookie('sid');
}


function showSuccess(message) {
    Messenger().post({
        message: message,
        type: 'success',
        showCloseButton: true
    });
}

function showError(message) {
    Messenger().post({
        message: message,
        type: 'error',
        showCloseButton: true
    });
}

function buildTable(datas, template, placeholder) {
    var temp = Handlebars.compile($("#" + template).html());
    $("#" + placeholder).html(temp({
        datas: datas.rows
    }));
    buildPaginator('paginator', datas.count);
}

function buildPaginator(paginator, total) {
    var options = {
        currentPage: currentPageNo,
        totalPages: total,
        bootstrapMajorVersion: 3,
        onPageClicked: function(e, originalEvent, type, page) {
            currentPageNo = page;
            queryList();
        }
    };
    $('#'+paginator).bootstrapPaginator(options);
}
