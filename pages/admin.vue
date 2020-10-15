<template>
  <div>
    <div style="font-size: 20px; text-align: center; margin-bottom: 30px; margin-top: 30px">クイズリスト</div>
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

    select(item: any) {
      $firebase.changeQuestion(item.id)
    }
  }
</script>
