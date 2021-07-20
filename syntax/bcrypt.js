const bcrypt = require('bcrypt');
const saltRounds = 10; // 노이즈 
const myPlaintextPassword = '111111'; // 나의 비밀번호를 이거로 가정하자
const someOtherPlaintextPassword = '222222';

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash){
    console.log(hash);
    bcrypt.compare(myPlaintextPassword, hash, function(err, result){
        console.log('my password', result);
    });
    bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result){
        console.log('not my password', result);
    });
});