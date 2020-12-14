const { post } = require('../app');
var connection = require('./db')
//회원가입
exports.insertMember = function (body, cb) {
    sql = 'INSERT INTO member (email, name, pwd) VALUES(?, ?, ?)';
    values = [body.email, body.name, body.pwd];
    connection.query(sql, values, function (error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            cb(results);
        }
    })
}

//로그인
exports.checkMember = function (body, session, cb) {
    var inputPwd = body.pwd;
    connection.query(`SELECT * FROM product;`, function (error, results, fields) {
        // console.log(results[0].name)
        if (error) {
            console.log(error);
        } else {
            cb(results[0].name)
        }
    });
}

//게시글 작성
exports.writePost = function (body, session, cb) {
    connection.query(`SELECT * FROM Post where idPost ;`, function (error, results, fields) {
        // console.log(results[0].name)
        if (error) {
            console.log(error);
        } else {
            console.log(results.length);
            var postid = results.length;
            postid++;
            sql = 'INSERT INTO Post (idPost, name, title, contents) VALUES(?, ?, ?, ?)';
            values = [postid, session.name, body.title, body.contents];
            console.log(values);
            connection.query(sql, values, function (error, results, fields) {
                if (error) {
                    console.log(error);
                } else {
                    cb(results);
                }
            })
        }
    });
}

//메인페이지 게시글
exports.checkProduct = function (cb) {
    connection.query(`SELECT * FROM product;`, function (error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            console.log(results);
            cb(results)
        }
    });
}