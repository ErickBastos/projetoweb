// Import Express   
    const express = require ("express")
    const app = express()

// Import HandleBars
    const handlebars = require("express-handlebars").engine
    app.engine("handlebars", handlebars({defaultLayout: "main"}))
    app.set("view engine", "handlebars")

// Import bodyParser
    const bodyParser = require("body-parser")
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

// Import post
    const post = require("./models/post");

// View PADRÃO (READ ALL)
    app.get("/", function(req,res)
    {
        // Usa uma função da model para converter o JSON recebido em dados mostraveis em HTML
            post.getClienteDetail()

            .then(function(clientes) 
            {
                res.render("index", { clientes: clientes });
            })
            .catch(function(erro) 
            {
                res.send("Falha ao mostrar os dados: " + erro)
            }); 
    })

// View CREATE
    app.get("/create", function(req,res)
    {
        res.render("create")
    })

// Action CREATE
    app.post("/created", function(req, res)
    {
        post.create({
            nome: req.body.nome,
            telefone: req.body.telefone,
            origem: req.body.origem,
            dt_contato: req.body.dt_contato,
            observacao: req.body.observacao
        })
        .then(function()
        {
            res.send("Dados Enviados com Sucesso!")
        })
        .catch(function(erro){
            res.send("Falha ao cadastrar os dados: " + erro)
        })
    })

// ACTION SEARCH 
    app.get("/search", function(req, res) 
    {
        // Obtém o ID do cliente do parâmetro de consulta
            const id = req.query.id; 

        // Verifica se o ID existe
            if (!id) 
            {
                return res.send("Por favor insira um id valido");
            }

        // Acha o cliente via ID
            post.findByPk(id)

        .then(function(cliente) 
        {
            // Se o cliente não existir
                if (!cliente) 
                {
                    throw new Error('cliente não foi encontrado.');
                }

            // Se o cliente existir
                res.render("search", { cliente: cliente });
        })
        .catch(function(erro) 
        {
            res.send("Falha ao mostrar os dados: " + erro);
        });  

    });


// VIEW EDIT
    app.get("/edit/:id", function(req, res) 
    {
        // Obtem o ID do Cliente via URL
            const id = req.params.id; 

        // Acha o cliente via ID
            post.findByPk(id) 

        .then(function(cliente) 
        {
            // Se o cliente não existir
                if (!cliente) 
                {
                    throw new Error('Falha ao tentar encontrar o cliente.');
                }

            // Se ele existir
                res.render("edit", { cliente: cliente });
        })
        .catch(function(erro) 
        {
            res.send("Falha ao mostrar os dados: " + erro);
        });  
    });

// ACTION EDIT
app.post("/edited/:id", function(req, res) 
{
    // Obtem o ID do Cliente via URL
        const id = req.params.id;

    // Obtém os novos dados do cliente dos inputs
        const {nome, telefone, origem, dt_contato, observacao} = req.body; 

    // Usa a função update para alterar
        post.update(
        {
            nome: nome,
            telefone: telefone,
            origem: origem,
            dt_contato: dt_contato,
            observacao: observacao
        }, 

    // Determina que apenas o cliente de id especifico será editado
        {
            
            where: { id: id }
        })

    .then(function(result) 
    {
        // Se editar com sucesso
            if (result[0] === 1) 
            {
                res.send("Dados editados com Sucesso!");
            } 

        // Se não editar com sucesso
            else 
            {
                res.send("Dados não enviados ou encontrados!");
            }
    })
    .catch(function(erro) 
    {
        res.send("Falha ao atualizar o cliente: " + erro);
    });
});

// ACTION DELETE
app.post('/delete/:id', function(req, res) 
{
    // Obtém o ID do Cliente via URL
        const id = req.params.id;

    // Usa a função destroy para deletar o cliente pelo ID
        post.destroy(
        {
            where: { id: id }
        })
    .then(function(result) 
    {
        // Se apagar com sucesso
            if (result === 1) 
            {
                res.send("Cliente deletado com sucesso!");
            } 
        // Se não apagar com sucesso
            else 
            {
                res.send("Cliente não encontrado ou não pôde ser deletado.");
            }
    })
    .catch(function(erro) 
    {
        res.send("Falha ao deletar o cliente: " + erro);
    });
});



app.listen(8081, function(){
    console.log("Servidor Ativo!")
})

