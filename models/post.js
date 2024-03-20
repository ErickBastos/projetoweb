const db = require("./banco")

const Cliente = db.sequelize.define('clientes', 
{
    nome: {type: db.Sequelize.STRING},
    telefone: {type: db.Sequelize.STRING},
    origem: {type: db.Sequelize.STRING},
    dt_contato: {type: db.Sequelize.DATEONLY},
    observacao: {type: db.Sequelize.TEXT},
})

// Cliente.sync({force: true})

// Converte o JSON para usar no HTML
function convertCliente(result) 
{
    return {
        id: result.id,
        nome: result.nome,
        telefone: result.telefone,
        dt_contato:  result.dt_contato,
        origem: result.origem,
        observacao: result.observacao
    };
}

// Obtem os detalhes separadamente
Cliente.getClienteDetail = function() 
{
    return Cliente.findAll() // Use o método findAll() do Sequelize para obter todos os clientes
        .then(function(clientes)
        {
            // Mapeia os resultados do banco de dados para objetos Cliente
            return clientes.map((cliente) => convertCliente(cliente.toJSON()));
        })
        .then(function(clientes) 
        {
            // Retorna a lista de objetos Cliente
            return clientes;
        })
        .catch(function(error)
        {
            console.error("Erro ao obter detalhes do cliente:", error);
            throw error; // Propaga o erro para o chamador
        });
}

module.exports = Cliente