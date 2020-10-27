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
    <div style="text-align: center; font-size: 20px" v-if="status === 'answered'">
      <div style="font-size: 20px; text-align: center; margin-bottom: 30px; margin-top: 30px">{{text}}</div>
      <div>あなたの回答は<br>{{yourAnswer}}<br>です</div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "nuxt-property-decorator"
  import {$firebase} from "~/plugins/firebase"

  @Component({components: {}})
  export default class extends Vue {
    private status = ""
    private currentRoundId = ""
    private currentQuestionId = ""
    private text = ""
    private name = ""
    private playerId = ""
    private options = []
    private yourAnswer = ""
    private answer = -1

    async created() {
      await $firebase.onRoundChanged(async (data) => {
        this.currentRoundId = data.id
      })

      await $firebase.onQuestionChanged(async (data) => {
        this.currentQuestionId = data.id
        if (this.currentQuestionId === "first") {
          this.status = "input-name"
          return
        }

        const question: any = await $firebase.getQuestion(this.currentQuestionId)
        this.text = question.text
        this.options = []
        this.options = question.options
        this.answer = question.answer
        this.status = 'playing'
      })
    }

    async createPlayer() {
      this.playerId = await $firebase.createPlayer(this.currentRoundId, this.name)
      this.status = 'waiting'
    }

    async submitAnswer(index: number) {
      await $firebase.answer(
        this.currentRoundId,
        this.currentQuestionId,
        this.playerId,
        index,
        this.answer === index ? 1 : 0
      )

      this.yourAnswer = this.options[index]
      this.status = 'answered'
    }
  }
</script>
