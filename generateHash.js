const bcrypt = require('bcryptjs');

const password = 'doctor123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error('Error generating hash:', err);
        return;
    }
    console.log('Generated hash for password "doctor123":');
    console.log(hash);
});