const regForm = document.getElementById("registerForm").submit();

regForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const userName = form.elements['userName']; // by name
    const emailAddress = form.elements['emailAddress'];
    const password = form.elements['password'];

    // Insert employee
    app.get('/signup', (req, res) => {
        let post = {userName: userName, emailAddress: emailAddress, pass: password};
        let sql = 'INSERT INTO users SET ?';
        let query = db.query(sql, post, err => {
            if(err) throw err;
            res.send('User added');
        })
    })


});