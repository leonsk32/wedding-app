<template>
  <div>
    <div style="font-size: 20px; text-align: center; margin-bottom: 30px; margin-top: 30px">ランキング</div>
    <v-data-table
      :headers="headers"
      :items="rankingArray"
      :footer-props="{'items-per-page-options':[15, 30, 50, 100, -1]}"
      id="calls-table"
    >
      <template v-slot:item.playerName="{ item }">
        <div class="data-table-record">{{item.playerName}}
        </div>
      </template>
      <template v-slot:item.score="{ item }">
        <div class="data-table-record">{{item.score}}
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "nuxt-property-decorator"
  import {$firebase} from "~/plugins/firebase"

  @Component({components: {}})
  export default class extends Vue {
    private currentRoundId = ""
    private headers = [
      {
        text: 'プレイヤー名',
        align: 'start',
        value: 'playerName',
        width: '50%',
        class: 'data-table-header',
      },
      {
        text: 'スコア',
        align: 'start',
        value: 'score',
        class: 'data-table-header',
      },
    ]
    private rankingArray: any[] = []

    async created() {
      await $firebase.onRoundChanged(async (data) => {
        this.currentRoundId = data.id
        await $firebase.onRoundUpdated(this.currentRoundId, async (data) => {
          const answers = data.answers ? data.answers as any[] : []
          this.rankingArray = []

          answers.forEach(answer => {
            const existing = this.rankingArray.find(r => r.playerId === answer.playerId)
            if (!!existing) {
              existing.score += answer.point
            } else {
              this.rankingArray.push({
                playerId: answer.playerId,
                playerName: answer.playerName,
                score: answer.point,
              })
            }
          })

          this.rankingArray.sort((a, b) => a.score - b.score)

          console.log(this.rankingArray)
        })
      })
    }
  }
</script>
