import contrato from '../contracts/produtos.contract'

describe('Testar endpoints de produtos', () => {
    let token
    
    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => {token = tkn})
    });

    it('Deve validar contrato de produtos', () => {
        cy.request('/produtos').then(response => {
            return contrato.validateAsync(response.body)
        })
    });

    it('Deve listar todos os produtos cadastrados', () => {
        cy.request({
            method: "GET",
            url: "/produtos"
        }).then((response)=> {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(20)
        })
    });

    it('Deve cadastrar um novo produto', () => {
        let produto = `Produto ${Math.floor(Math.random() * 10000 )}`
        cy.cadastrarProduto(token, produto, 1500, "Descrição", 200)
        .then((response)=> {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });

    it('Deve validar mensagem de erro ao cadastrar produto com nome repetido', () => {
       cy.cadastrarProduto(token, "Logitech MX Vertical", 470, "Mouse", 382)
        .then((response)=> {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Já existe produto com esse nome')
        })
    });

    it('Deve editar produto com sucesso', () => {

        let produto = `Produto ${Math.floor(Math.random() * 10000 )}`

        cy.cadastrarProduto(token, produto, 470, "Mouse", 382)
        .then((response)=> {
            let id = response.body._id

            cy.request({
                method: "PUT",
                url: `/produtos/${id}`,
                headers: {authorization: token},
                body: {
                    "nome": produto,
                    "preco": 470,
                    "descricao": "Mouse",
                    "quantidade": 381
                  }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    });

    it('Deve deletar produto com sucesso', () => {
       
        let produto = `Produto ${Math.floor(Math.random() * 10000 )}`
        cy.cadastrarProduto(token, produto, 470, "Mouse", 400)
        .then((response)=> {
            let id = response.body._id

            cy.request({
                method: "DELETE",
                url: `/produtos/${id}`,
                headers: {authorization: token},
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro excluído com sucesso')
            })
        })
    });

});