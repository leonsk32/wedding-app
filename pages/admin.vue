<template>
  <div>
    <div style="font-size: 20px; text-align: center; margin-bottom: 30px; margin-top: 30px">クイズリスト</div>
    <v-btn
      color="red"
      block
      style="margin-bottom: 100px; color: white"
      @click="reset"
    >
      リセット
    </v-btn>
    <div v-for="item in questions">
      <v-btn
        color="primary"
        block
        style="margin-bottom: 10px; color: white"
        @click="select(item)"
      >{{item.data.text}}</v-btn>
    </div>
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
      await $firebase.clearPlayers()
      await $firebase.changeQuestion("first")
    }

    select(item: any) {
      $firebase.changeQuestion(item.id)
    }
  }
</script>
