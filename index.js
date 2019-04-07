const express = require('express')
const app = express()

const sqlite = require('sqlite')
const dbConnection = sqlite.open('banco.sqlite', { Promise })

const bodyParser = require('body-parser')


app.set('view engine','ejs')
app.use(express.static('public')) //se nao tiver no app.get, jogar para a pasta public
app.use(bodyParser.urlencoded({extended:true})) //

console.log(1);

/*app.get('/',(request,response) => {
    //console.log(new Date())
    //response.send('<h1>Olá Fullstack Lab ' + new Date() + '</h1>') //antes do ejs
    response.render('home',{date: new Date()})
})*/

app.get('/',async(request,response) => { 
    const db = await dbConnection
    const categoriasDb = await db.all('select * from categorias;') 
    const vagas = await db.all('select * from vagas;')
    const categorias = categoriasDb.map(cat => {  //Aula 3 - aos 31min  //vai pegar todas as categorias e retornar outro objeto
        return {
            ...cat, //... espread operator (espalhar)
            vagas: vagas.filter( vaga => vaga.categoria === cat.id) //anda no vetor filtrando

        }
    })
    //console.log(categorias)
    response.render('home',{
        categorias
    })
})

app.get('/vaga/:id',async(request,response) => {
    //console.log(new Date())
    //response.send('<h1>Olá Fullstack Lab ' + new Date() + '</h1>') //antes do ejs
    //console.log(request.params)
    const db = await dbConnection
    const vaga = await db.get('select * from vagas where id = '+request.params.id)
    //console.log(vaga)
    response.render('vaga', 
      {
          vaga
      })
})

app.get('/admin',(req,res) => { 
    res.render('admin/home')
})

app.get('/admin/vagas',async(req,res) => { 
    
    const db = await dbConnection
    const vagas = await db.all('select * from vagas;')
    
    res.render('admin/vagas',{ vagas })

})

app.get('/admin/vagas/nova',async(req,res) => { 
    
    //const db = await dbConnection
    //const vagas = await db.all('select * from vagas;')
    
    res.render('admin/nova-vaga')

})


app.get('/admin/vagas/delete/:id',async(req,res) => { 
    
    const db = await dbConnection
    //console.log(req.params.id)    
    await db.run('delete from vagas where id = '+req.params.id)    
    res.redirect('/admin/vagas')

})

app.post('/admin/vagas/nova',async(req,res) => { 
    //res.send(req.body)
    const db = await dbConnection
    const { titulo, descricao, categoria } = req.body;    
    await db.run(`insert into vagas (categoria, titulo, descricao ) values('${categoria}','${titulo}','${descricao}'  )`)    
    res.redirect('/admin/vagas')
})

const init = async() => { //Toda vez que lida com I/O é preciso usar async Promise 
    const db = await dbConnection
    await db.run('create table if not exists categorias (id INTEGER PRIMARY KEY, categoria TEXT); ')
    //const categoria = 'Marketing team'
    //await db.run(`insert into categorias (categoria) values('${categoria}')`)
    await db.run('create table if not exists vagas (id INTEGER PRIMARY KEY, categoria INTEGER, titulo TEXT, descricao TEXT); ')    
    //const vaga = 'Social Media (San Francisco)'
    //const descricao = 'Vaga para Social Media que fez o fullstack lab'
    //await db.run(`insert into vagas (categoria, titulo, descricao ) values(2,'${vaga}','${descricao}'  )`)
     
}

init();

console.log(2);

app.listen(3000,(err) => {  //Intrucao de I/O - Event Loop - agendamento

    if (err){
        console.log('Não foi possível iniciar o servidor do Jobify')
    } else {
        console.log('Servidor do Jobify rodando')
    }

})

console.log(3);