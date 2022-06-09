fetch('http://127.0.0.1:8000/')
.then(response=> {
    console.log(response)
    return response.json();
})
.then (users => {
    console.log(users);
});