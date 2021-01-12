var connection = require('./db')
var money=1000;
var GPIO = require('onoff').Gpio;
var Relay=[new GPIO(24, 'out'), new GPIO(25, 'out'), new GPIO(8, 'out'), new GPIO(7, 'out')];
var Coin = new GPIO(4, 'in', 'falling', { debounceTimeout : 50 });

Coin.watch((err, value) => {
    if (err) throw err;
    money+=1000;
    console.log('투입된 금액:',money);
});

function openCell(cell){
    Relay[cell].write(1);
    setTimeout(() => Relay[cell].write(0), 10000);
}

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

//현재 투입된 잔액 확인
exports.getMoney = function (cb) {
    cb(money)
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
                                                        openCell(parseInt(body.cell)+1);
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
            for(let i =0; i< results.length; i++){
                if(results[i].cell == body.cell){
                    cb(`비어있지 않은 자리`)
                }
            }
            sql = 'INSERT INTO product (idProduct, cell, name, userid,price) VALUES(?, ?, ?, ?, ?)';
            values = [postid, body.cell, body.name, body.userid, body.price];
            console.log(values);
            connection.query(sql, values, function (error, fields) {
                if (error) {
                    console.log(error);
                } else {
                    openCell(parseInt(body.cell)+1);
                    cb("판매");
                }
            })
        }
    });

}