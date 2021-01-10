var connection = require('./db')

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

//로그인
exports.checkMember = function (body, cb) {
    connection.query(`SELECT username, point,userid FROM user where userid = '${body.userid}' AND userpassword = '${body.userpassword}';`, function (error, results, fields) {
        // console.log(results[0].name)
        if (error) {
            cb('nonemail')
        } else {
            if (results.length == 1) {
                cb(results[0])
            } else {
                cb('nonemail')
            }
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
                console.log("회원가입 가능");
                sql = 'INSERT INTO user (userid, username, userpassword, point) VALUES(?, ?, ?, ?)';
                values = [body.userid, body.username, body.userpassword, 0];
                connection.query(sql, values, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    } else {
                        cb(results);
                    }
                })
            }
            else {
                cb("회원가입 불가능");
            }
        }
    });
}

//돈 충전
exports.chargePoint = function (body,cb) {
    connection.query(`update user set point = point+${body.chargePoint} where userid = '${body.userid}' ;`, function (error, fields) {
        if (error) {
            console.log(error);
        } else {
            cb(`${body.chargePoint}원을 ${body.userid}가 충전`);
        }
    });
}

//상품 구매
exports.buyProduct = function (body,cb) {
    connection.query(`SELECT * FROM user where userid = '${body.userid}';`, function (error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            var buyPossible = results[0].point - body.cost;
            console.log(results[0].point);
            if (buyPossible >= 0) {
                console.log("구매 가능");
                connection.query(`update user set point = ${buyPossible} where userid = '${body.userid}' ;`, function (error, fields) {
                    if (error) {
                        console.log(error);
                    } else {
                        cb("구매");
                    }
                });
            }
            else {
                cb("구매 불가능");
            }
        }
    });
}

//상품 등록
exports.sellProduct = function (body, cb) {
    connection.query(`SELECT * FROM product where idProduct ;`, function (error, results, fields) {
        // console.log(results[0].name)
        if (error) {
            console.log(error);
        } else {
            console.log(results.length);
            var postid = results.length;
            postid++;
            sql = 'INSERT INTO product (idProduct, cell, name, userid,price) VALUES(?, ?, ?, ?, ?)';
            values = [postid, body.cell, body.name, body.userid, body.price];
            console.log(values);
            connection.query(sql, values, function (error, fields) {
                if (error) {
                    console.log(error);
                } else {
                    cb("판매");
                }
            })
        }
    });
    
}