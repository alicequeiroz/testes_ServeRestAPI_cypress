Cypress.Commands.add('token', (email, password) => {
    cy.request({
        method: "POST",
        url: "http://localhost:3000/Login/",
        body: {
            "email": email,
            "password": password
          }
    }).then((response) => {
        expect(response.status).to.equal(200)
        return response.body.authorization
    })
});

Cypress.Commands.add('cadastrarProduto', (token, nome, preco, descricao, quantiade)=> {
    cy.request({
        method: "POST",
        url: "/produtos",
        headers: {authorization: token},
        body: {
            "nome": nome,
            "preco": preco,
            "descricao": descricao,
            "quantidade": quantiade
          },
          failOnStatusCode: false
    })
});

Cypress.Commands.add('cadastraUsuario', (nome, email, password, administrador)=>{
    cy.request({
        method: "POST",
        url: "/usuarios",
        body: {
            "nome": nome,
            "email": email,
            "password": password,
            "administrador": administrador
        },
        failOnStatusCode: false
    })
});

Cypress.Commands.add('cancelarCompra', (token)=> {
    cy.request({
        method: "DELETE",
        url: "/carrinhos/cancelar-compra",
        headers: token,
    })
});

Cypress.Commands.add('concluirCompra', (token)=> {
    cy.request({
        method: "DELETE",
        url: "/carrinhos/concluir-compra",
        headers: token,
    })
});

Cypress.Commands.add('addProdutoCarrinho', (token, idProduto, quantidadeProduto)=> {
    cy.request({
        method: "POST",
        url: "/carrinhos",
        headers: token,
        body: {
            "produtos": [
                {
                    "idProduto": idProduto,
                    "quantidade": quantidadeProduto
                }
            ]               
        }
    })
})