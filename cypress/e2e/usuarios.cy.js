import contrato from '../contracts/usuarios.contract';

describe('Testar endpoits de usuários', () => {
    
    it('Deve validar contrato de usuários', () => {
        cy.request('/usuarios').then(response => {
            return contrato.validateAsync(response.body)
        })
    });

    it('Deve listar usuários cadastrados', () => {
        cy.request({
            method: "GET",
            url: "/usuarios"
        }).then((response)=>{
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('usuarios')
            expect(response.body).to.have.property('quantidade')

            const quantidadeUsuarios = response.body.usuarios.length
            const quantidadeInformada = response.body.quantidade
            expect(quantidadeInformada).to.equal(quantidadeUsuarios)
        })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
        let email = `usuario${Math.floor(Math.random() * 10000 )}@teste.com`      
        cy.cadastraUsuario("usuario", email, "123456", "true")
        .then((response)=> {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });

    it('Deve validar um usuário com email inválido', () => {
        cy.cadastraUsuario("usuario", "beltrano@qa.com.br", "123456", "true")
        .then((response)=> {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Este email já está sendo usado')
        })
    });

    it('Deve editar um usuário previamente cadastrado', () => {
        let email = `usuario${Math.floor(Math.random() * 10000 )}@teste.com`      
        cy.cadastraUsuario("usuario", email, "123456", "true")
        .then((response)=> {
            let id = response.body._id

            cy.request({
                method: "PUT",
                url: `/usuarios/${id}`,
                body: {
                    "nome": "usuario",
                    "email": email,
                    "password": "123456",
                    "administrador": "true" 
                }
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
        let email = `usuario${Math.floor(Math.random() * 10000 )}@teste.com`      
        cy.cadastraUsuario("usuario", email, "123456", "true")
        .then((response)=> {
            let id = response.body._id

            cy.request({
                method: "DELETE",
                url: `/usuarios/${id}`,

            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro excluído com sucesso')
            })
        })
    });

});