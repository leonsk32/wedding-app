<template>
  <div>
    <div style="font-size: 20px; text-align: center; margin-bottom: 30px; margin-top: 30px">{{text}}</div>
    <div v-for="item in options">
      <v-btn
        color="green"
        block
        style="margin-bottom: 10px;"
      >{{item}}</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "nuxt-property-decorator"
  import {$firebase} from "~/plugins/firebase"

  @Component({components: {}})
  export default class extends Vue {
    private text = ""
    private options = []

    async created() {
      await $firebase.onQuestionChanged(async (data) => {
        console.log(data)
        const question: any = await $firebase.getQuestion(data.id)
        console.log(question)
        this.text = question.text
        this.options = []
        this.options = question.options
      })
    }
  }
</script>
