# teste-front-end-toro-investimentos
Teste de desenvolvimento FrontEnd para a Toro Investimentos

## Inicialização

Para realizar a instalação da aplicação, os seguintes passos devem ser seguidos.

IMPORTANTE: O passo 1 é necessário apenas na primeira vez em que for acessar.

### 1) Realizar o build da imagem do docker:

Dentro do diretório raiz do projeto, executar o comando:
<pre>
 docker-compose -f docker-compose.yml build --no-cache quotes
</pre>

### 2) Iniciar o container

Dentro do diretório raiz do projeto, executar o comando:

<pre>
 docker-compose -f docker-compose.yml up -d
</pre>

Conferir o log, utilizando o comando:

<pre>
 docker-compose -f docker-compose.yml logs -f
</pre>

Importante: Na primeira vez, a execução irá demorar um pouco mais, pois o comando de inicialização irá executar automaticamente
o "npm install", para instalar as dependências. 

É importante haver permissão de escrita no diretório.


### 3) Acessar a aplicação

Após aproximadamente 1 min, a aplicação estará disponível no endereço:

http://localhost:9000

A aplicação começará a exibir as ações assim que o servidor "quotesmock" for iniciado. A aplicação se conectará automaticamente.

### 4) Execução dos testes unitários

Para executar os testes, executar o seguinte comando, dentro do direório do projeto, enquanto a aplicação estiver executando:

<pre>
 npm test
</pre>

### 5) Interromper a aplicação

Para interromper a aplicação, executar o seguinte comando, dentro do diretório do projeto:

<pre>
 docker-compose -f docker-compose.yml down
</pre>
