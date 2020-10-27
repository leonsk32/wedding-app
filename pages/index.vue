<template>
  <div>
    <div v-if="status === 'input-name'">
      <div style="text-align: center; font-size: 20px">あなたのお名前を入力してください</div>
      <div style="text-align: center; font-size: 15px">ランキング表示に使用します</div>
      <v-text-field v-model="name" aria-placeholder="お名前" style="width: 100%; text-align: center"></v-text-field>
      <v-btn block color="primary" @click="createPlayer">決定</v-btn>
    </div>
    <div style="text-align: center; font-size: 20px" v-if="status === 'waiting'">
      {{name}}さん<br>クイズが始まるまでお待ち下さい！
    </div>
    <div v-if="status === 'playing'">
      <div style="font-size: 20px; text-align: center; margin-bottom: 30px; margin-top: 30px">{{text}}</div>
      <div v-for="(item, index) in options">
        <v-btn
          color="primary"
          block
          style="margin-bottom: 10px; color: white"
          @click="submitAnswer(index)"
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
    private questionId = ""
    private text = ""
    private name = ""
    private userId = ""
    private options = []
    private answer = -1

    async created() {
      await $firebase.onQuestionChanged(async (data) => {
        this.questionId = data.id
        if (this.questionId === "first") {
          this.status = "input-name"
          return
        }

        const question: any = await $firebase.getQuestion(this.questionId)
        this.text = question.text
        this.options = []
        this.options = question.options
        this.answer = question.answer
        this.status = 'playing'
      })
    }

    async createPlayer() {
      this.userId = await $firebase.createPlayer(this.name)
      this.status = 'waiting'
    }

    async submitAnswer(index: number) {
      await $firebase.answer(
        this.questionId,
        this.userId,
        index,
        this.answer === index ? 1 : 0
      )
    }
  }
</script>
