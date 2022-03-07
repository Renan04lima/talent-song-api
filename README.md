# ST IT Cloud -  Talent Song API Test

## Instalação

1. Clonar repositório
2. Criar arquivo `.env` com as variáveis do arquivo `.env.example`
3. Rodar o banco de dados Postgres
  ```sh
   docker-compose up -d
  ```
  4. Instalar depedências
  ```sh
  npm install
  ```
  5. Comando para roda os testes
  ```sh
  npm run test
  ```
6. Fazer o build do projeto
  ```sh
  npm run build
  ```
  7. Roda migrations
  ```sh
  npx typeorm migration:run
  ```
  8. Roda seed para criar um usuário
  ```sh
  npm run seed:user
  ```
  9. Comando para roda a API na porta 5050
  ```sh
  npm run start
  ```
## Caso

Você é um desenvolvedor backend, e precisa construir uma feature nova para o serviço de streaming de música. Essa nova feature é para guardar as músicas favoritas dos usuários e facilitar o acesso.


Para isso, o sistema precisa de uma feature de autenticação também, pois os usuários precisam realizar o login para **cadastrar** as suas músicas. O usuário tem permissão de **visualizar** apenas as músicas que ele **cadastrou** como favorita. Esse usuário pode realizar a **alteração** ou a **deleção** da música, de sua lista de favoritos.


![MODELAGEM](./talent-song-api-test-modelagem.png)
## Documentação das rotas


### **POST /login**

Esse endpoint deve receber os dados de autenticação e deve cruzar com os dados que foram cadastrados na base de dados, na tabela de "users". Caso a combinacão de usuário e senha existam na tabela, o endpoint retorna um token com o identificador do usuário via claims. Caso não exista, deve informar que o acesso não pode ser autorizado.

**Requisição esperada**

```
{
  "email": `<USER_EMAIL>`,
  "password": `<USER_PASSWORD>`
}
```

**Resposta esperada**

```
{
  "token": `<JWT TOKEN>`
}
```


### **POST /favorite-songs**

Esse endpoint deve receber os dados da música a qual deve ser cadastrado como favorita, pelo usuário autenticado. Os dados desse endpoint deve ser guardado na tabela "favorite_songs", e essas músicas que foram guardadas, devem ser vinculadas ao usuário no qual está cadastrando-as.


**Requisição esperada**
```
{
  "songName": `<SONG_NAME>`,
  "artist": `<ARTIST>`,
  "album": `<ALBUM>`
}
```

**Resposta esperada**
```
{
  "favoriteId": `<FAVORITE_ID>`,
  "songName": `<SONG_NAME>`,
  "artist": `<ARTIST>`,
  "album":`<ALBUM>`
}
```


### **GET /favorite-songs**

Esse endpoint deve retornar as músicas que foram cadastradas como favoritas pelo usuário que está autenticado.

Este mesmo endpoint deve possui 3 filtros via query string, **que não devem ser obrigatório na requisição**, que são:

- Filtro pelo "artist"
- Filtro pelo "album"
- filtro pelo "songName"

**Requisição esperada**
- /favorite-songs
- /favorite-songs?artist=`<ARTIST>`
- /favorite-songs?album=`<ALBUM>`
- /favorite-songs?songName=`<SONG_NAME>`
- /favorite-songs?songName=`<SONG_NAME>`&album=`<ALBUM>`&artist=`<ARTIST>`


**Resposta esperada**
```
[
  {
    "favoriteId": `<FAVORITE_ID>`,
    "songName": `<SONG_NAME>`,
    "artist": `<ARTIST>`,
    "album":`<ALBUM>`
  }
]
```


### **PUT /favorite-songs/:favoriteId**

Esse endpoint deve receber as informações da música que você queira realizar a alteração, e via query parameter deve receber o identificador da música favorita.

**Requisição esperada**
- /favorite-songs/`<FAVORITE_ID>`

**Resposta esperada**
```
{
  "songName": `<SONG_NAME>`,
  "artist": `<ARTIST>`,
  "album":`<ALBUM>`
}
```

### **DELETE /favorite-songs/:favoriteId**
Esse endpoint deve receber o identificador da música favorita, para que possa realizar a deleção da lista de favoritos.

**Requisição esperada**
- /favorite-songs/`<FAVORITE_ID>`

