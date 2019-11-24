# teste-front-end-toro-investimentos
Teste de desenvolvimento FrontEnd para a Toro Investimentos

## 1) Instalação

Para realizar a instalação da aplicação, os seguintes passos devem ser seguidos:

* Clonar o repositório

* Realizar o build da imagem do docker. Para isso, dentro do diretório raiz do projeto, executar o comando:

<pre>
 docker-compose -f docker-compose.yml build --no-cache quotes
</pre>


## 2) Inicialização da aplicação

IMPORTANTE: Antes de inicializar a aplicação, certifique-se dos seguintes pontos:

* de que o serviço "quotesmock" NÃO esteja rodando,
pois o mesmo será inicializado automaticamente através do docker compose.

* Certifique-se de que as portas 8080 e 9000 não estejam alocadas.

* De não executar o comando "npm install", pois as dependências serão instaladas automaticamente.

* Deve haver permissão de escrita no diretório.


Para inicializar a aplicação, dentro do diretório raiz do projeto, executar o comando:

<pre>
 docker-compose -f docker-compose.yml up -d
</pre>

Conferir o log, utilizando o comando:

<pre>
 docker-compose -f docker-compose.yml logs -f
</pre>

Importante: Na primeira vez, a execução irá demorar um pouco mais, pois o comando de inicialização irá executar automaticamente
o "npm install", para instalar as dependências.




#### Acessar a aplicação

Após aproximadamente 1 min, a aplicação estará disponível no endereço:

http://localhost:9000


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
