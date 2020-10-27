<template>
  <div>
    <div style="font-size: 20px; text-align: center; margin-bottom: 30px; margin-top: 30px">ランキング</div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "nuxt-property-decorator"
  import {$firebase} from "~/plugins/firebase"

  @Component({components: {}})
  export default class extends Vue {
    private currentRoundId = ""

    async created() {
      await $firebase.onRoundChanged(async (data) => {
        this.currentRoundId = data.id
        $firebase.getAllPlayersAndAnswers(this.currentRoundId)
      })
    }
  }
</script>
