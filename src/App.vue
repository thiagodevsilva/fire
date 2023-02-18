<template>
  <div id="app">
    <h1>Firebase</h1>

    <div>

      <div v-if="option == ''">
        <button @click="option = 'areaCadastro'">Novo usuário</button>
        <button @click="option = 'areaLogin'">Fazer login</button>
      </div>

      <div v-else>
        <button @click="option = ''">Voltar</button>
      </div>

      <div v-if="!user && option == 'areaLogin'" style="padding: 15px; margin: 5px; border: .5px solid black;"> 
        <div>
          Fazer login
        </div>
        <label>E-mail: </label>
        <input type="text" v-model="email"><br>
        <label>Senha: </label>
        <input type="text" v-model="senha">
        <br>
        <button @click="logar">Logar</button>
        
      </div>
      <div v-else-if="user">
        <h2>Bem vindo, {{ this.nUser.nome }}!</h2>
        <button @click="sair">Sair</button>
      </div>

      <div v-if="!user && option == 'areaCadastro'" style="padding: 15px; margin: 5px; border: .5px solid black;">
        <div>
          Novo usuário
        </div>
        <label>Nome: </label>
        <input type="text" v-model="nome"><br>
        <label>E-mail: </label>
        <input type="text" v-model="email"><br>
        <label>Senha: </label>
        <input type="text" v-model="senha">
        <br>
        <button @click="cadastrarUsuario">Cadastrar Usuário</button>
      </div>


      <div v-if="user" style="padding: 15px; margin: 5px; border: .5px solid black;">
        <label>Id: </label><input type="text" v-model="idPost"><br>
        <label>Tarefa: </label><input type="text" v-model="tarefa"><br>
        <label>Autor: </label><input type="text" v-model="autor"><br>
        <button @click="cadastrar">Cadastrar</button>
        <button @click="buscarPosts">Buscar Posts</button>
        <button @click="atualizarPost">Atualizar</button>
      </div> 

      <div v-if="user">
        <ul>
          <h4 v-for="post in posts" :key="post.id">
            ID: {{ post.id }} <button @click="excluirPost(post.id)">Excluir</button> <br>
            Tarefa: {{ post.tarefa }} <br>
            Autor: {{ post.autor }} <br>
            
          </h4>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from './services/firebaseConnection'

export default {
  name: 'App',
  data(){
    return{
      idPost: '',
      tarefa: '',
      autor: '',
      posts: [],
      email: '',
      senha: '',
      user: false,
      nome: '',
      option: '',
      nUser: null
    }
  },
  async created() {
    // await firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     this.user = true;
    //     this.email = user.email;
    //   } else {
    //     this.user = false;
    //     this.email = '';
    //   }
    // })

    await firebase.firestore().collection('posts')
    .onSnapshot( (doc) => {
      this.posts = [];

      doc.forEach( (item) => {
        this.posts.push({
          id: item.id,
          tarefa: item.data().tarefa,
          autor: item.data().autor
        });

      });
    })
  },
  methods:{
    async cadastrar(){
      await firebase.firestore().collection('posts')
      //.doc('123')
      .add({
        tarefa: this.tarefa,
        autor: this.autor
      })
      .then( () => {
        this.autor = ''
        this.tarefa = ''
        console.log('Cadastrado com sucesso.')
      })
      .catch( (err) => {
        console.log('Algo deu ruim! ;( Erro: ' + err)
      })
    },

    async buscarPosts(){
      this.posts = [];

      //   await firebase.firestore().collection('posts')
      //   .doc('123')
      //   .get()
      //   .then( (snapshot) => {
      //     this.tarefa = snapshot.data().tarefa
      //     this.autor = snapshot.data().autor
      //   })
      //   .catch( (err) => {
      //     console.log('Algo deu ruim! ;( Erro: ' + err)
      //   })
      // }

      await firebase.firestore().collection('posts')
      .get()
      .then( (snapshot) => {
        snapshot.forEach( (doc) => {
          console.log(doc.data())
          this.posts.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            autor: doc.data().autor,
          });
        })
      })
      .catch( (err) => {
        console.log('Algo deu ruim! ;( Erro: ' + err)
      })
    },

    async atualizarPost() {
      await firebase.firestore().collection('posts').doc(this.idPost)
      .update({
        tarefa: this.tarefa,
        autor: this.autor
      })
      .then(() => {
        console.log('Atualizado com sucesso.');
        this.idPost = '';
        this.tarefa = '';
        this.autor = '';
      })
      .catch( (err) => {
        console.log('Algo deu ruim! ;( Erro: ' + err);
      })
    },
    async excluirPost(id) {
      await firebase.firestore().collection('posts').doc(id)
      .delete()
    },

    async cadastrarUsuario() {
      const { user } = await firebase.auth().createUserWithEmailAndPassword(this.email, this.senha)
      
      await firebase.firestore().collection('users')
      .doc(user.uid)
      .set({
        nome: this.nome
      })
      .then(() => {
        this.nome = '';
        this.email = '';
        this.senha = '';
      })

      // .catch((err) => {
      //   if (err.code == 'auth/weak-password') {
      //     alert('Senha fraca.');
      //   } else if (err.code == 'auth/email-already-in-use') {
      //     alert('E-mail já existe.');
      //   }
      // })
    },

    async sair() {
      await firebase.auth().signOut();
    },

    async logar() {
      const { user } = await firebase.auth().signInWithEmailAndPassword(this.email, this.senha)
      
      await firebase.firestore().collection('users')
      .doc(user.uid)
      .get()
      .then((snapshot) => {
        this.user = true;
        this.email = snapshot.data().email;
        this.nUser = {
          nome: snapshot.data().nome,
          email: snapshot.data().email,
        }
      })
      .catch((err) => {
        console.log(err)
      })

      this.email = '';
      this.senha =  '';
    }

  }
}
</script>

<style>

</style>
