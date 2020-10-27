<template>
  <div>
    <div style="font-size: 20px; text-align: center; margin-bottom: 30px; margin-top: 30px">クイズリスト</div>
    <div v-for="item in questions">
      <v-btn
        color="primary"
        block
        style="margin-bottom: 20px; color: white"
        @click="selectQuestion(item)"
      >{{item.data.text}}</v-btn>
    </div>
    <v-btn
      color="red"
      block
      style="margin-top: 200px; color: white"
      @click="reset"
    >
      リセット
    </v-btn>
    <v-dialog
      v-model="showAnswerDialog"
      max-width="432"
      persistent
      overlay-opacity="0"
    >
      <v-card>
        <v-card-title>{{currentText}}</v-card-title>
        <v-card-actions>
          <v-btn
            color="primary"
            block
            style="color: white"
            @click="showAnswer()"
          >回答を表示する</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
    private showAnswerDialog = false

    // questions
    private questions: any[] = []

    async created() {
      this.questions = []
      await $firebase.onQuestionCreated(data => {
        this.questions.push({
          id: data.id,
          data: data.data(),
        })
      })

      await $firebase.onCurrentChanged(async (data) => {
        this.currentStatus = data.currentStatus
        this.currentRoundId = data.currentRoundId
        this.currentQuestionId = data.currentQuestionId

        this.showAnswerDialog = this.currentStatus === 'answering'
      })
    }

    get currentText() {
      let find = this.questions.find(q => {
        return q.id === this.currentQuestionId
      })

      if (!find) {
        return ""
      }

      console.log(find)
      return find.data.text
    }

    async showAnswer() {
      await $firebase.changeStatus("show-answer")
    }

    async reset() {
      await $firebase.createRound()
      await $firebase.changeStatus("input-name")
      await $firebase.changeQuestion("first")
    }

    async selectQuestion(item: any) {
      await $firebase.changeQuestion(item.id)
      await $firebase.changeStatus("answering")
    }
  }
</script>
