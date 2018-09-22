# Teste para Desenvolvedor(a) Backend do Woop Sicredi

## Instruções

O sistema foi desenvolvido em NodeJs na versão `v10.6.0` mas deve funcionar na versão `v8.12.0`.<br />
A documentação está localizada na pasta `./docs/swagger.yaml` e pode ser lida pelo site `https://editor.swagger.io/`.

## Requesitos minimos

* NodeJs versão v10.6.x
* MySQL versão 5.6

## Como rodar

Execute o script ./database/database.sql na base de dados para criar a base e suas tabelas.<br />
Após duplique o arquivo `.env.sample` e renomeie ele para `.env`. Nele fica a configuração de conexão para a base de dados.<br />
Concluido a configuração da base de dados, na raiz do projeto execute o comando `npm install` para o npm instalar as dependencias do projeto.<br />
Agora é preciso abrir dois terminais um para rodar a camada de serviços e o outro para rodar a parte de cronjobs.<br />
Para rodar a camada de serviços digite na raiz do projeto `node ./src/app.js`.<br />
Para rodar a camada de cronjobs digite na raiz do projeto `node ./src/worker.js`.<br />
<br />A porta padrão do NodeJs é `3000`.

### Associados

Existe cinco associados pré cadastrados (ID, Nome):
* 1, Henrique
* 2, Roberto
* 3, Fernanda
* 4, Ana
* 5, Lucas

### O porque separo a camada de serviço dos cronjobs?

Como o NodeJs é single thread normalmente utilizo o gerenciador de processos node `pm2` para criar uma instancia de cronjobs e para cada thread uma instancia da cada de serviço assim aproveitando melhor os recursos do servidor. Mais informações sobre o PM2: http://pm2.keymetrics.io/
