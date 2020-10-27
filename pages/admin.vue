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
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "nuxt-property-decorator"
  import {$firebase} from "~/plugins/firebase"

  @Component({components: {}})
  export default class extends Vue {
    private questions: any[] = []

    async asyncData() {
      const questions: any[] = []
      await $firebase.onQuestionCreated(questions)
      return {
        questions: questions
      }
    }

    async reset() {
      await $firebase.createRound()
      await $firebase.changeStatus("input-name")
      await $firebase.changeQuestion("first")
    }

    selectQuestion(item: any) {
      $firebase.changeQuestion(item.id)
      $firebase.changeStatus("answering")
    }
  }
</script>
