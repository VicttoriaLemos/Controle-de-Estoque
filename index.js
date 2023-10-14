const mysql = require('mysql2')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}))

app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vic.24141996',
    database: 'controle_estoque'
});

connection.connect(function(err){
    if(err){
        console.error('Erro: ',err)
        return
    } 
    console.log("Conexão estabelecida com sucesso!")
});

app.get("/estoque", function(req, res){
    res.sendFile(__dirname + "/estoque.html")
})
app.post('/adicionar',(req, res) =>{
    const descricao = req.body.descricao;
    const quantidade_estoque = req.body.quantidade_estoque;
    const valor_unitario = req.body.valor_unitario;
    const peso = req.body.peso;
    const medida = req.body.medida;
    const localizacao_estoque = req.body.localizacao_estoque;

    const values = [descricao, quantidade_estoque, valor_unitario, peso, medida, localizacao_estoque]
    const insert = "INSERT INTO produtos(descricao, quantidade_estoque, valor_unitario, peso, medida, localizacao_estoque) VALUES (?,?,?,?,?,?)"

    connection.query(insert, values, function(err, result){
        if (!err){
            console.log("Dados inseridos com sucesso!");
            res.send("Dados inseridos!");
        } else {
            console.log("Não foi possível inserir os dados ", err);
            res.send("Erro!")
        }
    })

})
app.get("/listar", function(req, res){

    const selectAll = "SELECT * FROM produtos";
   
    connection.query(selectAll, function(err, rows){
        if (!err){
            console.log("Dados inseridos com sucesso!");
            res.send(`
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Relatório de Estoque</title>
                <link rel="stylesheet" type="text/css" href="/estilo.css">
            </head>
            <body>
            <p class="cabeçalho">Relatório de Estoque </p>
                <div id="page-container">
                    <div id="content-wrap">
                        <table>
                            <tr>
                                <th> Descrição </th>
                                <th> Quantidade em estoque </th>
                                <th> Valor Unitario </th>
                                <th> Peso </th>
                                <th> Medida </th>
                                <th> Localização no Estoque </th>
                            </tr>
                            ${rows.map(row => `
                            <tr>
                                <td>${row.descricao}</td>
                                <td>${row.quantidade_estoque}</td>
                                <td>${row.valor_unitario}</td>
                                <td>${row.peso}</td>
                                <td>${row.medida}</td>
                                <td>${row.localizacao_estoque}</td>
                            </tr>
                            `).join('')}
                        </table>
                        </div>
                        <footer id="footer">
                            <a href="http://localhost:8081">Voltar</a>
                        </footer>
                    </div>
                </body>
            </html>
         `);
        } else {
            console.log("Erro no Relatório de Estoque ! ", err);
            res.send("Erro!")
        }
    })
})

app.get("/", function(req,res){
    res.send(`
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Controle de Estoque</title>
        <link rel="stylesheet" type="text/css" href="/estilo.css">
        <link rel="icon" type="image/x-icon" href="icon.png">
        <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville&family=PT+Sans&family=Playfair+Display&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville&family=PT+Sans&display=swap" rel="stylesheet">
    </head>
    <body>
        <div id="page-container">
            <div id="content-wrap">
                <nav>
                    <ul>
                        <li>
                            <div>
                                <img src="logo1.png"/> 
                            </div>
                        </li>
                        <li>
                            <a href="http://localhost:8081">Home</a>
                        </li>
                        <li>
                            <a href="http://localhost:8081/estoque">Cadastrar Produto</a>
                        </li>
                        <li>
                            <a href="http://localhost:8081/listar">Relatório de Estoque</a>
                        </li>
                    </ul>
                </nav>
               
                <div class="imagem-container">
                    <h2>Atendimento especializado para sua empresa</h2>
                    <p>Atendemos diversos segmentos como: administradoras de condomínios, hotéis,
                        construtoras e muito mais. Priorizamos a otimização do tempo do nosso cliente e a demanda de produtos
                        específicos sob encomenda. Podemos assegurar um atendimento especializado!
                    </p>
                    <h2>Fale Conosco!</h2>
               
                </div>
                <div class="imagem-container">
                    <img  class="imagem1" src="imagem1.png" alt="Sempre que precisar, você pode contar com nosso atendimento especializado para sua empresa.">
                </div>
                <hr>
                <div class="imagem-container2">
                <ol class="imagem-numerada">
                    <li>
                        <img class="imagem2" src="imagem2.png" alt="Fachada loja.">
                    </li>
                    <li>
                        <img id="corredor1" class="imagem2" src="imagem3.jpg" alt="Corredores da loja e produtos.">
                    </li>
                <ol>
            </div>
                <div class="imagem-container2">
                <h2>Nossa História</h2>
                    <p>Desde o seu início modesto em 1985, a "Casa da Construção" tem sido a referência local quando se trata de
                        materiais de construção confiáveis e serviços excepcionais. Fundada por três amigos que compartilhavam uma
                        paixão por construir e um compromisso com a qualidade, a empresa cresceu para se tornar uma das principais
                        lojas de materiais de construção da região.
                    </p>
                    <p>Acreditamos que cada tijolo, cada ferramenta e cada pintura são essenciais para a construção de sonhos.
                        Começamos como uma loja de bairro, focada em atender as necessidades da comunidade com uma ampla gama de
                        produtos de alta qualidade. Ao longo dos anos, nosso compromisso com a satisfação do cliente, a integridade
                        e a excelência no serviço nos ajudou a crescer e a conquistar a confiança de construtores, empreiteiros e DIYers.
                    </p>
                </div>
                <hr>
                <div class="imagem-container3">
                    <h2>Nossos Valores Fundamentais:</h2>
                    <ol class="lista-numerada">
                        <li>
                            <span class="negrito">Qualidade e Confiança:</span><p class="espaçamento"> Comprometemo-nos a fornecer apenas materiais da mais alta qualidade, garantindo
                                que cada projeto seja construído para durar.
                            </p>
                        </li>

                        <li>
                            <span class="negrito">Atendimento Personalizado:</span><p class="espaçamento"> Valorizamos cada cliente e nos esforçamos para entender suas necessidades
                            únicas, oferecendo um atendimento personalizado e soluções sob medida.
                        </li>

                        <li>
                            <span class="negrito">Sustentabilidade:</span><p class="espaçamento"> Nos preocupamos com o meio ambiente e promovemos práticas sustentáveis, incentivando
                            o uso responsável de recursos e produtos eco-friendly.</p>
                        </li>

                        <li>
                        <span class="negrito">Inovação e Progresso:</span><p class="espaçamento"> Mantemo-nos atualizados com as últimas tendências e avanços tecnológicos na
                            indústria da construção, para fornecer soluções modernas e eficientes.
                        </li>

                        <li>  
                            <span class="negrito">Comunidade e Responsabilidade Social:</span><p class="espaçamento"> Acreditamos em retribuir à comunidade que nos apoiou, apoiando
                            projetos locais e promovendo a educação e o desenvolvimento.
                        </li>
                    </ol>
                    <p>Estamos dedicados a continuar servindo nossos clientes, ajudando-os a transformar suas visões em realidade,
                        tijolo por tijolo. Juntos, estamos construindo o futuro, criando espaços que inspiram e histórias que 
                        perduram. Agradecemos a todos que fazem parte dessa jornada conosco.
                    </p>
                </div>
                <div class="imagem-container3">
                    <ol class="imagem-numerada">
                        <li>
                            <img  class="imagem3" src="imagem5.jpg" alt="Itens de materiais de construção.">
                        </li>
                        <li>
                            <img  class="imagem3" src="imagem6.jpg" alt="Corredores da loja e produtos.">
                        </li>
                    <ol>
                </div>
            </div>
                <footer id="footer"></footer>
        </div>
    </body>
    </html>
    
    `);
});

app.listen(8081, function(){
    console.log("Servidor rodando na url http://localhost:8081")
})