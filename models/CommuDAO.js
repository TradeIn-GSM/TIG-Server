var connection = require('./db')


// //로그인
// exports.checkMember = function (body, session, cb) {
//     var inputPwd = body.pwd;
//     connection.query(`SELECT * FROM product;`, function (error, results, fields) {
//         // console.log(results[0].name)
//         if (error) {
//             console.log(error);
//         } else {
//             cb(results[0].name)
//         }
//     });
// }

// //게시글 작성
// exports.writePost = function (body, session, cb) {
//     connection.query(`SELECT * FROM Post where idPost ;`, function (error, results, fields) {
//         // console.log(results[0].name)
//         if (error) {
//             console.log(error);
//         } else {
//             console.log(results.length);
//             var postid = results.length;
//             postid++;
//             sql = 'INSERT INTO Post (idPost, name, title, contents) VALUES(?, ?, ?, ?)';
//             values = [postid, session.name, body.title, body.contents];
//             console.log(values);
//             connection.query(sql, values, function (error, results, fields) {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     cb(results);
//                 }
//             })
//         }
//     });
// }

//유저 조회
exports.checkUser = function (cb) {
    connection.query(`SELECT * FROM user;`, function (error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            console.log(results);
            cb(results)
        }
    });
}
//상품 조회
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

//회원가입
exports.insertMember = function (body,cb) {
    connection.query(`SELECT * FROM user where userid = '${body.userid}';`, function (error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            if (results == '') {
                cb("회원가입 가능");
                // sql = 'INSERT INTO user (userid, username, userpassword, point) VALUES(?, ?, ?, ?)';
                // values = [body.id, body.username, body.userpassword, 0];
                // connection.query(sql, values, function (error, results, fields) {
                //     if (error) {
                //         console.log(error);
                //     } else {
                //         cb(results);
                //     }
                // })
            }
            else {
                cb("회원가입 불가능");
            }
        }
    });


}