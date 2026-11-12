# Crud-CSACADEMY
CRUD Full-Stack

Como foi fazer o projeto

O que eu fiz

Fiz um CRUD de alunos completo, com back-end e front-end.

No back-end usei NestJS com MongoDB (Mongoose). A API tem todas as rotas que o desafio pedia (listar, buscar um, cadastrar, editar com PUT e PATCH, e excluir), valida os campos obrigatórios, o formato do email e se o email já existe, e devolve os status certos (200, 201, 400 e 404). Os dados ficam salvos no banco, então não se perdem ao reiniciar.

No front-end usei Next.js com Tailwind. Dá pra listar, buscar por nome ou email, ver os detalhes, cadastrar, editar e excluir (com confirmação antes). Os erros e os avisos de sucesso aparecem na tela, e o layout funciona no celular também. O front só conversa com a API, nunca direto com o banco.

Algumas escolhas que fiz:
- Usei UUID como id, já que o enunciado pedia número ou UUID.
- Pra email repetido devolvo 400, porque era o código que estava no enunciado. Sei que 409 seria mais correto, então deixei isso na lista de melhorias.
- Deixei todas as chamadas à API num arquivo só no front (lib/api.ts), pra não espalhar URL e fetch pelas telas.

Onde eu tropecei (e como resolvi)

Ambiente
- O PowerShell bloqueou o npm dizendo que a execução de scripts estava desabilitada. Liberei só pro meu usuário e funcionou.
- Tomei um "not a git repository" porque estava com o terminal na pasta errada. Desde então olho o caminho do terminal antes de rodar qualquer comando.

Banco de dados
- Comecei com SQLite e TypeORM, e deu bastante dor de cabeça. A minha versão do TypeORM não aceitava o tipo sqlite (queria better-sqlite3), e depois o npm bloqueou o script de instalação desse driver, o que causou o erro "Could not locate the bindings file". Consegui destravar autorizando a instalação e reconstruindo o pacote, mas no fim decidi trocar pra MongoDB. Isso me obrigou a refazer a parte de dados: o schema no lugar da entity e os ajustes no service.

NestJS
- Meu projeto Nest usa ESM, que exige o .js no final dos imports de arquivos locais (tipo ./alunos.service.js). Sem isso o editor dizia que não achava o módulo. Passei a seguir o estilo de import que o próprio Nest gera.
- Colei o código do controller no arquivo errado (app.controller.ts em vez de alunos.controller.ts) e isso gerou uma enxurrada de erros. Desfiz com git restore e colei no lugar certo. Aprendi a conferir o caminho da aba antes de editar.
- O controller que o Nest gera converte o id pra número (+id), mas os meus ids são UUID, que é texto. O TypeScript reclamou do tipo, então tirei a conversão e passei o id como string.

Front-end
- Na criação do Next.js aceitei as opções recomendadas sem querer, e elas não criam a pasta src/. Apaguei tudo e refiz escolhendo "customize settings".
- O VS Code junta pastas aninhadas numa linha só (src/app), e por causa disso criei lib e types dentro de app sem perceber. O atalho @/ não achava os arquivos até eu mover as pastas pra dentro de src/.

Testando a API
- No Thunder Client, a primeira resposta que recebi era a mensagem de boas-vindas da própria ferramenta, porque eu tinha deixado a URL de exemplo. Também errei JSON no corpo da requisição e chamei o PATCH sem o id na URL. Depois disso aprendi a ler o erro da API e a copiar o id da resposta do POST.

### Sobre o uso de IA

Usei o Claude como apoio durante o projeto, principalmente na parte da API e na hora de resolver os erros que foram aparecendo.

Eu tentei fazer a API sozinho e fui tentando resolver os erros por conta própria, mas acabei não conseguindo avançar. Foi aí que passei a fazer o projeto com a ajuda dele: ele me passou um passo a passo e eu fui seguindo, etapa por etapa. Também me ajudou a decidir o que usar para construir a API e qual banco de dados escolher, que foram as partes em que eu estava mais perdido.

Mesmo seguindo um passo a passo, tive algumas duvidas e muitos erros, principalmente entender como funciona a parte da API, uma coisa que fiz muito pouco em projetos anteriores, e entender a parte do banco de dados, pois nao sabia que ele criava um banco dentro do proprio codigo. A cada etapa eu testava para ver se funcionava, quando dava erro eu ia atrás de entender o que tinha acontecido, e fui tentando entender como cada parte funciona (o que cada arquivo faz, como o front conversa com a API, como os dados chegam no banco). Sei que ainda estou aprendendo, mas foi assim que consegui chegar no projeto funcionando.

O que eu levo disso

- Ler o erro com calma. O terminal do servidor quase sempre mostra a causa de verdade, e o sublinhado vermelho do editor às vezes fica desatualizado.
- PUT substitui o recurso inteiro e PATCH altera só o que foi enviado.
- O fetch não dá erro em 400 ou 404, então é preciso checar o res.ok e tratar a mensagem que a API devolve.
- Vale commitar uma versão que funciona antes de começar a mexer, pra poder voltar atrás se algo quebrar, pois acabei fazendo uma alteracao que acabou quebrando o codigo e nao achei onde cometi o erro, e precisei acabando fazer do zero o projeto
