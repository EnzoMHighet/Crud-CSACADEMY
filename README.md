# Crud-CSACADEMY

## 1. Tecnologias usadas e por que escolhi

- NestJS (Node.js): foi o que usei no back-end. o NestJS já deixa o código separado em pastas e partes com funções diferentes, o que me ajudou a não me perder.
- MongoDB (com Mongoose): é o banco de dados, onde os alunos ficam guardados. O desafio permitia usar MongoDB. Comecei com outro banco (SQLite), mas tive muito problema e acabei trocando.
- React com Next.js: foi o que usei para fazer as telas. o Next.js já vem com bastante coisa pronta para começar e me ajudou muito.
- Tailwind CSS: para deixar as telas bonitas e funcionando no celular também. e é prático porque o estilo vai direto no código da tela.
- TypeScript: é como o JavaScript, mas avisa dos erros mais cedo. Ajudou a perceber quando eu errava o formato de alguma coisa.
- Thunder Client e MongoDB Compass: não fazem parte do projeto, mas usei para testar a API e para ver os dados gravados no banco.



2. Como rodar o projeto

O que precisa ter instalado

- Node.js (eu usei a versão 26.13.0)
- Git
- MongoDB Community Server, rodando no computador (o MongoDB Compass é opcional, mas ajuda a conferir se o banco está funcionando)

Passo a passo
1. Baixar o projeto
bash
git clone <URL-DO-REPOSITORIO>
cd <NOME-DA-PASTA>


2. Ver se o MongoDB está ligado. No Windows ele costuma ligar sozinho. Se você abrir o Compass e conseguir conectar em mongodb://localhost:27017, está tudo certo. Não precisa criar o banco: ele é criado sozinho (com o nome crud-alunos) na primeira vez que o projeto roda.
3. 
4. Ligar o back-end (a API, na porta 3000)
bash
cd backend
npm install
npm run start:dev

Se aparecer a frase Nest application successfully started, deu certo. Deixe esse terminal aberto.

4. Ligar o front-end (as telas, na porta 3001). Abra outro terminal e rode:
bash
cd frontend
npm install

Antes de continuar, crie um arquivo chamado .env.local dentro da pasta frontend com este conteúdo:

NEXT_PUBLIC_API_URL=http://localhost:3000

Depois rode:
bash
npm run dev -- -p 3001


5. Abrir no navegador: http://localhost:3001

Rotas da API

| Método | Rota | O que faz |
|---|---|---|
| GET | /alunos | Lista todos (dá para filtrar com ?busca=) |
| GET | /alunos/:id | Mostra um aluno |
| POST | /alunos | Cadastra |
| PUT | /alunos/:id | Atualiza o aluno (precisa mandar os campos obrigatórios) |
| PATCH | /alunos/:id | Atualiza só o que for enviado |
| DELETE | /alunos/:id | Exclui |

As respostas usam os códigos 200 (deu certo), 201 (criado), 400 (dados inválidos ou email repetido) e 404 (aluno não encontrado).

---

## 3. Estrutura de pastas

/
├── backend/                       a parte que guarda e organiza os dados (API)
│   ├── src/
│   │   ├── main.ts                liga o servidor e ativa as validações
│   │   ├── app.module.ts          conecta o projeto ao MongoDB
│   │   ├── app.controller.ts      veio pronto do NestJS ("Hello World"), não uso
│   │   ├── app.service.ts         veio pronto do NestJS, não uso
│   │   └── alunos/
│   │       ├── alunos.controller.ts   recebe os pedidos (listar, cadastrar...) e passa para o service
│   │       ├── alunos.service.ts      faz o trabalho: salva, busca, confere se o email já existe
│   │       ├── alunos.module.ts       junta as peças da parte de alunos
│   │       ├── dto/                   regras dos dados (o que é obrigatório, se o email é válido)
│   │       └── schemas/               como o aluno é guardado no banco
│   └── test/                      pasta de testes que veio pronta do NestJS, não usei
│
├── frontend/                      a parte das telas
│   ├── .env.local                 endereço da API (não vai para o GitHub)
│   └── src/
│       ├── app/
│       │   ├── page.tsx           tela principal: lista, busca e botões
│       │   ├── layout.tsx         estrutura comum da página (título da aba, fonte)
│       │   └── globals.css        estilos que valem para o site todo
│       ├── components/
│       │   ├── FormAluno.tsx      formulário usado para cadastrar e editar
│       │   ├── DetalhesAluno.tsx  o que aparece na janela de detalhes
│       │   ├── Modal.tsx          a janela que aparece por cima da tela
│       │   └── Mensagem.tsx       o aviso verde (deu certo) ou vermelho (deu erro)
│       ├── lib/
│       │   └── api.ts             todas as conversas com o back-end ficam aqui
│       └── types/
│           └── aluno.ts           define quais informações um aluno tem
│
├── .gitignore                     arquivos que não devem ir para o GitHub
└── README.md                      este arquivo

---

## 4. O que ficou faltando e o que eu melhoraria

Se eu tivesse mais tempo, faria:

- Testes automáticos. Eu testei tudo na mão, pelo Thunder Client e pelo navegador, mas não criei testes que rodam sozinhos.
- Fazer a busca direto no banco. Hoje o back-end pega todos os alunos e filtra por nome ou email no próprio código. Funciona, mas ficaria pesado com muitos cadastros.
- Trocar o erro de email repetido para 409. Eu usei 400 porque era o que estava no enunciado, mas pelo que li o 409 seria mais correto para esse caso.
- Paginação.** A lista traz todos os alunos de uma vez.
- Melhorar o visual no celular.** Em telas pequenas a tabela esconde algumas colunas, e eu gostaria de trocar por cartões.
- Fechar a janela de detalhes clicando fora dela ou apertando Esc. Hoje só fecha no X ou no botão cancelar.
- Colocar no ar (deploy), com o banco na nuvem.

Como foi fazer o projeto

O que eu fiz

Fiz um CRUD de alunos completo, com back-end e front-end.

No back-end usei NestJS com MongoDB (Mongoose). A API tem todas as rotas que o desafio pedia (listar, buscar um, cadastrar, editar com PUT e PATCH, e excluir). Ela confere se os campos obrigatórios foram preenchidos, se o email tem formato válido e se o email já existe, e devolve os códigos certos (200, 201, 400 e 404). Os dados ficam salvos no banco, então não se perdem quando o projeto é reiniciado.

No front-end usei Next.js com Tailwind. Dá para listar, buscar por nome ou email, ver os detalhes, cadastrar, editar e excluir (com uma confirmação antes). Os erros e os avisos de sucesso aparecem na tela, e o layout funciona no celular também. O front só conversa com a API, nunca direto com o banco.

Algumas escolhas que fiz:
- Usei UUID como id, já que o enunciado pedia número ou UUID.
- Para email repetido devolvo 400, porque era o código que estava no enunciado. Sei que 409 seria mais correto, então deixei isso na lista de melhorias.
- Deixei todas as chamadas à API num arquivo só no front (lib/api.ts), para não espalhar o endereço e o fetch por todas as telas.

Onde eu tropecei (e como resolvi)

Ambiente
- O PowerShell bloqueou o npm dizendo que a execução de scripts estava desabilitada. Liberei só para o meu usuário e funcionou.
- Tomei um "not a git repository" porque estava com o terminal na pasta errada. Desde então olho o caminho do terminal antes de rodar qualquer comando.

Banco de dados
- Comecei com SQLite e TypeORM, e deu bastante dor de cabeça. A minha versão do TypeORM não aceitava o tipo sqlite (queria better-sqlite3), e depois o npm bloqueou a instalação desse driver, o que causou o erro "Could not locate the bindings file". Consegui destravar autorizando a instalação e reconstruindo o pacote, mas no fim decidi trocar para o MongoDB. Isso me obrigou a refazer a parte de dados: o schema no lugar da entity e os ajustes no service.

NestJS
- Meu projeto Nest usa ESM, que exige o .js no final dos imports de arquivos locais (tipo ./alunos.service.js). Sem isso o editor dizia que não achava o módulo. Passei a seguir o estilo de import que o próprio Nest gera.
- Colei o código do controller no arquivo errado (app.controller.ts em vez de alunos.controller.ts) e isso gerou uma enxurrada de erros. Desfiz com git restore e colei no lugar certo. Aprendi a conferir o caminho da aba antes de editar.
- O controller que o Nest gera converte o id para número (+id), mas os meus ids são UUID, que é texto. O TypeScript reclamou do tipo, então tirei a conversão e passei o id como string.

Front-end
- Na criação do Next.js aceitei as opções recomendadas sem querer, e elas não criam a pasta src/. Apaguei tudo e refiz escolhendo "customize settings".
- O VS Code junta pastas aninhadas numa linha só (src/app), e por causa disso criei lib e types dentro de app sem perceber. O atalho @/ não achava os arquivos até eu mover as pastas para dentro de src/.

**Quando quebrei o código**
- Em um momento fiz uma alteração que quebrou o código e não consegui achar onde tinha errado, então precisei refazer o projeto do zero. Doeu na hora, mas refazendo eu entendi muito melhor cada parte.

Sobre o uso de IA

Usei o Claude como apoio durante o projeto, principalmente na parte da API e na hora de resolver os erros que foram aparecendo.

Eu tentei fazer a API sozinho e fui tentando resolver os erros por conta própria, mas acabei não conseguindo avançar. Foi aí que passei a fazer o projeto com a ajuda dele: ele me passou um passo a passo e eu fui seguindo, etapa por etapa. Também me ajudou a decidir o que usar para construir a API e qual banco de dados escolher, que foram as partes em que eu estava mais perdido.

Mesmo seguindo um passo a passo, tive algumas dúvidas e muitos erros. A maior dificuldade foi entender como funciona a parte da API, uma coisa que fiz muito pouco em projetos anteriores, e também a parte do banco de dados, porque eu não sabia que ele criava um banco dentro do próprio código. A cada etapa eu testava para ver se funcionava, quando dava erro eu ia atrás de entender o que tinha acontecido, e fui tentando entender como cada parte funciona (o que cada arquivo faz, como o front conversa com a API, como os dados chegam no banco). Sei que ainda estou aprendendo, mas foi assim que consegui chegar no projeto funcionando.

O que eu levo disso

- Ler o erro com calma. O terminal do servidor quase sempre mostra a causa de verdade, e o sublinhado vermelho do editor às vezes fica desatualizado.
- PUT substitui o recurso inteiro e PATCH altera só o que foi enviado.
- Vale fazer um commit de uma versão que funciona antes de começar a mexer, para poder voltar atrás se algo quebrar. Eu aprendi isso do jeito difícil: fiz uma alteração que quebrou o código, não achei onde errei e precisei refazer o projeto do zero.
