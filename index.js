const express = require('express')
const app = express()

app.set('view engine','ejs')
app.use(express.static('public')) //se nao tiver no app.get, jogar para a pasta public

console.log(1);

app.get('/',(request,response) => {
    //console.log(new Date())
    //response.send('<h1>Olá Fullstack Lab ' + new Date() + '</h1>') //antes do ejs
    response.render('home',{date: new Date()})
})

app.get('/vaga',(request,response) => {
    //console.log(new Date())
    //response.send('<h1>Olá Fullstack Lab ' + new Date() + '</h1>') //antes do ejs
    response.render('vaga')
})

console.log(2);

app.listen(3000,(err) => {  //Intrucao de I/O - Event Loop - agendamento

    if (err){
        console.log('Não foi possível iniciar o servidor do Jobify')
    } else {
        console.log('Servidor do Jobify rodando')
    }

})

console.log(3);