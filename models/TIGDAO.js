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

//돈 삽입
exports.insertMoney = function (body,cb) {
    money+=body.money;
    console.log(money)
    cb(`${money}원 충전`)
}

//돈 충전 완료
exports.chargePoint = function (body,cb) {
    connection.query(`update user set point = point+${money} where userid = '${body.userid}' ;`, function (error, fields) {
        if (error) {
            console.log(error);
        } else {
            cb(`${money}원을 ${body.userid}가 충전`);
            money=0;
        }
    });
}

//상품 구매
exports.buyProduct = function (body,cb) {
    connection.query(`SELECT * FROM user where userid = '${body.userid}';`, function (error, userResults, fields) {//구매자 확인
        if (error) {
            console.log(error);
        } else {
            connection.query(`SELECT * FROM product where cell = '${body.cell}';`, function (error, cellResults, fields) {//빈 공간인지 확인
                if(error){
                    console.log(error);
                } else{
                    if(!cellResults[0]){
                        var jsonstr = "{\"buyProduct\":\"no\"}";
                        cb(JSON.parse(jsonstr))
                    } else {
                        connection.query(`SELECT * FROM user where userid = '${cellResults[0].userid}';`, function (error, sellResults, fields) {
                            console.log("구매 가능")
                            var buyPossible = userResults[0].point - cellResults[0].price;
                            if (buyPossible >= 0) {
                                console.log("구매 가능");
                                connection.query(`update user set point = ${buyPossible} where userid = '${body.userid}' ;`, function (error, fields) {//구매자 포인트 감소
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        connection.query(`update user set point = ${parseInt(cellResults[0].price)+parseInt(sellResults[0].point)} where userid = '${cellResults[0].userid}' ;`, function (error, fields) {//판매자 포인트 증가
                                            if(error){
                                                console.log(error)
                                            }else{
                                                connection.query(`delete from product where cell = '${body.cell}' ;`, function (error, fields) {
                                                    if(error){
                                                        console.log(error)
                                                    }else{
                                                        var jsonstr = "{\"buyProduct\":\"yes\"}";
                                                        cb(JSON.parse(jsonstr));
                                                    }                        
                                                });
                                            }                        
                                        });
                                    }
                                });
                            }
                            else {
                                cb("구매 불가능");
                            }
                        });
                    }
                }
            });
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