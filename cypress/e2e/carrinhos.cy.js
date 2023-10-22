import contrato from '../contracts/carrinhos.contract'

describe('Testar endpoints de carrinhos', () => {
    let token

    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => {token = tkn})
    });

    it('Deve validar contrato de carrinhos', () => {
        cy.request('/carrinhos').then(response=> {
            return contrato.validateAsync(response.body)
        })
    });

    it('Deve listar carrinhos cadastrados', () => {
        cy.request({
            method: "GET",
            url: "/carrinhos"
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('carrinhos')
            expect(response.body).to.have.property('quantidade')

            const quantidade = response.body.quantidade
            const carrinhosQuantidade = response.body.carrinhos.length
            expect(quantidade).to.equal(carrinhosQuantidade)

            const carrinhos = response.body.carrinhos

            carrinhos.forEach(carrinho => {
                let totalEsperado = 0;
                let quantidadeTotal = 0;

                carrinho.produtos.forEach(produto => {
                    totalEsperado += produto.precoUnitario * produto.quantidade;
                    quantidadeTotal += produto.quantidade
                })
                expect(totalEsperado).to.equal(carrinho.precoTotal)
                expect(quantidadeTotal).to.equal(carrinho.quantidadeTotal)
            });
        } )
    });

    it('Deve inserir no carrinho um produto préviamente cadastrado', () => {
        
        let produto = `Produto ${Math.floor(Math.random() * 10000 )}`
        
        cy.cancelarCompra({authorization: token})
        cy.cadastrarProduto(token, produto, 470, "Mouse", 400)
        .then((response) => {

            let id = response.body._id

            cy.addProdutoCarrinho({authorization: token}, id, 2)
            .then((response) => {
                expect(response.body.message).to.equal('Cadastro realizado com sucesso');
            })
        })
    });

    it('Deve concluir compra com sucesso', () => {
        let produto = `Produto ${Math.floor(Math.random() * 10000 )}`
        
        cy.cancelarCompra({authorization: token})
        cy.cadastrarProduto(token, produto, 470, "Mouse", 400)
        .then((response) => {

            let id = response.body._id

            cy.addProdutoCarrinho({authorization: token}, id, 2)
            cy.concluirCompra({authorization: token})
            .then((response) => {
                expect(response.body.message).to.equal('Registro excluído com sucesso')
            })
        })
    });

    it('Deve cancelar compra', () => {
       cy.cancelarCompra({authorization: token})
       .then((response) => {
            expect(response.status).to.equal(200)

            let mensagem = response.body.message;
            if (mensagem === "Registro excluído com sucesso") {
                expect(response.body.message).to.equal('Registro excluído com sucesso')
            }else{
                expect(response.body.message).to.equal('Não foi encontrado carrinho para esse usuário')
            };
        })
    });

});