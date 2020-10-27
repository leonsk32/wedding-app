<template>
  <div>
    <div v-if="currentStatus === 'input-name'">
      <div v-if="isPlayerInfoSet">
        <div style="text-align: center; font-size: 20px">
          {{name}}さん<br>クイズが始まるまでお待ち下さい！
        </div>
      </div>
      <div v-else>
        <div style="text-align: center; font-size: 20px">あなたのお名前を入力してください</div>
        <div style="text-align: center; font-size: 15px">ランキング表示に使用します</div>
        <v-text-field v-model="name" aria-placeholder="お名前" style="width: 100%; text-align: center"></v-text-field>
        <v-btn block color="primary" @click="createPlayer" :disabled="name === ''">決定</v-btn>
      </div>
    </div>
    <div v-if="currentStatus === 'answering'">
      <div style="font-size: 20px; text-align: center; margin-bottom: 30px; margin-top: 30px">{{text}}</div>
      <div v-if="alreadyAnswered">
        <div style="font-size: 20px; text-align: center; margin-bottom: 30px; margin-top: 30px">
          <div>あなたの回答は<br>{{yourAnswer}}<br>です</div>
        </div>
      </div>
      <div v-else>
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
    <div v-if="currentStatus === 'show-answer'">
      <div style="font-size: 20px; text-align: center; margin-bottom: 30px; margin-top: 30px">{{text}}</div>
      <div>
        <div style="font-size: 20px; text-align: center; margin-bottom: 30px; margin-top: 30px">
          <div>あなたの回答は<br>{{yourAnswer}}<br>です</div>
        </div>
        <div style="font-size: 20px; text-align: center; margin-bottom: 30px; margin-top: 30px">
          <div>正解は<br>{{options[answer]}}<br>です</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "nuxt-property-decorator"
  import {$firebase} from "~/plugins/firebase"

  @Component({components: {}})
  export default class extends Vue {
    // current
    private currentStatus = ""
    private currentRoundId = ""
    private currentQuestionId = ""

    // player info
    private name = ""
    private playerId = ""

    // question
    private text = ""
    private options = []
    private yourAnswer = ""
    private answer = -1

    async created() {
      await $firebase.onCurrentChanged(async (data) => {
        this.currentStatus = data.currentStatus
        this.currentRoundId = data.currentRoundId

        if (this.currentStatus === 'input-name') {
          this.playerId = ""
          this.name = ""
        }

        if (this.currentQuestionId !== data.currentQuestionId) {
          this.currentQuestionId = data.currentQuestionId

          const question: any = await $firebase.getQuestion(this.currentQuestionId)
          this.text = question.text
          this.options = []
          this.options = question.options
          this.answer = question.answer
          this.yourAnswer = ""
        }
      })
    }

    get isPlayerInfoSet() {
      return this.playerId !== ""
    }

    async createPlayer() {
      this.playerId = await $firebase.createPlayer(this.currentRoundId, this.name)
    }

    get alreadyAnswered() {
      return this.yourAnswer !== ""
    }

    async submitAnswer(index: number) {
      await $firebase.submitAnswer(
        this.currentRoundId,
        this.currentQuestionId,
        this.playerId,
        this.name,
        index,
        this.answer === index ? 1 : 0
      )

      this.yourAnswer = this.options[index]
    }
  }
</script>
