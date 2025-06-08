const bcrypt = require('bcrypt');

// The password you want to hash
const password = 'riora354';

// Generate a hash
bcrypt.hash(password, 10)
    .then(hash => {
        console.log('Your hashed password:');
        console.log(hash);
        console.log('\nAdd this hash to your .env file as HASHED_PASSWORD=');
    })
    .catch(err => {
        console.error('Error generating hash:', err);
    }); 