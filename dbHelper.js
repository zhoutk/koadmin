var config = require('./dbconfig');

var options = {
    'host': config.db_host,
    'port': config.db_port,
    'database': config.db_name,
    'user': config.db_user,
    'password': config.db_passwd,
    'charset': config.db_charset,
    'connectionLimit': config.db_conn_limit,
    'supportBigNumbers': true,
    'bigNumberStrings': true
}

var mysql = require('mysql2');
var pool = mysql.createPool(options);

//执行所有sql语句
function execQuery(sql, values, callback) {
    var errinfo;
    pool.getConnection(function(err, connection) {
        if (err) {
            errinfo = 'DB-获取数据库连接异常！';
            console.log(errinfo);
            throw errinfo;
        } else {
            var querys = connection.query(sql, values, function(err, rows) {
                release(connection);
                if (err) {
                    errinfo = 'DB-SQL语句执行错误:' + err;
                    console.log(errinfo);
                    //throw errinfo;
                    callback(err);
                } else {
                    callback(null,rows);
                }
            });
            console.log(querys.sql);
        }
    });
}

function release(connection) {
    try {
        connection.release(function(error) {
            if (error) {
                console.log('DB-关闭数据库连接异常！');
            }
        });
    } catch (err) {}
}

function execUpdate(sql, values, callback){
    execQuery(sql, values, function(result) {
        if (callback) {
            var affectedRows = 0;
            if (result) {
                affectedRows = result.affectedRows
            }
            callback({
                affectedRows: affectedRows
            });
        }
    });
}

//执行sql语句，返回影响条数
exports.update = function(sql, values, callback) {
    execUpdate(sql, values, callback);
}

//查询分页
exports.queryPage = function(sql, values, page, size, callback) {
    if (page > 0) {
        page--;
    } else {
        page = 0;
    }
    execQuery(sql + ' LIMIT ' + page * size + ',' + size, values, function(rresult) {
        var index = sql.toLocaleUpperCase().lastIndexOf(' FROM');
        sql = 'SELECT COUNT(*) count ' + sql.substring(index);
        execQuery(sql, values, function(cresult) {
            if (callback) {
                var pagenum = cresult[0].count / size;
                if (cresult[0].count % size > 0) {
                    pagenum++;
                }
                callback({
                    count: pagenum,
                    rows: rresult
                });
            }
        });
    });
}

exports.getById = function(tablename, id){
    return new Promise(function(resolve, reject){
        var values = {id:id};
        var sql = 'select * from ?? where ?';
        execQuery(sql,[tablename, values], function(err, rows){
            if(err){
                reject(err);
            }else{
                resolve(rows);
            }
        })
    });
}

//查询对象
exports.getObject = function(tablename, values, callback) {
    var sql = 'SELECT * FROM ?? WHERE ?';
    execQuery(sql, [tablename, values], function(result) {
        if (callback) {
            if (result && result.length > 0) {
                callback(result[0]);
            } else {
                callback(null);
            }
        }
    });
}

//添加一条记录
exports.addObject = function(tablename, values, callback) {
    var sql = 'INSERT INTO ?? SET ?';
    execUpdate(sql, [tablename, values], callback);
}

//更新记录
exports.updateObject = function(tablename, values, id, callback) {
    var sql = 'UPDATE ?? SET ? WHERE ?';
    execUpdate(sql, [tablename,
        values, id
    ], callback);
}

//删除记录
exports.deleteObject = function(tablename, values, callback) {
    var sql = 'DELETE FROM ?? WHERE ?';
    execUpdate(sql, [tablename, values], callback);
}
