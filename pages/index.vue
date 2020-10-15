<template>
  <div>
    <div v-if="status === 'input-name'">
      <div style="text-align: center; font-size: 20px">あなたのお名前を入力してください</div>
      <div style="text-align: center; font-size: 15px">ランキング表示に使用します</div>
      <v-text-field v-model="name" aria-placeholder="お名前" style="width: 100%; text-align: center"></v-text-field>
      <v-btn block color="primary" @click="status = 'waiting'">決定</v-btn>
    </div>
    <div style="text-align: center; font-size: 20px" v-if="status === 'waiting'">
      {{name}}さん<br>クイズが始まるまでお待ち下さい！
    </div>
    <div v-if="status === 'playing'">
      <div style="font-size: 20px; text-align: center; margin-bottom: 30px; margin-top: 30px">{{text}}</div>
      <div v-for="item in options">
        <v-btn
          color="primary"
          block
          style="margin-bottom: 10px; color: white"
        >{{item}}</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "nuxt-property-decorator"
  import {$firebase} from "~/plugins/firebase"

  @Component({components: {}})
  export default class extends Vue {
    private status = "input-name"
    private text = ""
    private name = ""
    private options = []

    async created() {
      await $firebase.onQuestionChanged(async (data) => {
        if (data.id === "") {
          this.status = "input-name"
        }

        const question: any = await $firebase.getQuestion(data.id)
        this.text = question.text
        this.options = []
        this.options = question.options
        this.status = 'playing'
      })
    }
  }
</script>
