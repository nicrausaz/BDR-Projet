<template>
  <v-container fluid style="max-width: 1000px">
    <v-card class="mx-auto" dark>
      <v-parallax src="https://ysnlive.com/wp-content/uploads/2018/08/football-background.jpg" height="400">
        <v-card color="rgba(0,0,0,0.5)" class="pa-5">
          <v-row align="center" justify="center" no-gutters>
            <v-col class="text-right text-h6 text-md-h4 text-uppercase">
              <v-row align="center" no-gutters>
                <v-col>
                  <v-avatar size="64" tile class="ma-3">
                    <v-img src="https://cdn-csd.swisstxt.ch/images/sport/club/logo/large/2679.png" />
                  </v-avatar>
                </v-col>
                <v-col cols="12">Lucerne</v-col>
              </v-row>
            </v-col>
            <v-col class="text-center text-h2 text-md-h1 font-weight-bold">0:0</v-col>
            <v-col class="text-left text-h6 text-md-h4 text-uppercase">
              <v-row align="center" no-gutters>
                <v-col>
                  <v-avatar size="64" tile class="ma-3">
                    <v-img src="https://cdn-csd.swisstxt.ch/images/sport/club/logo/large/2688.png" />
                  </v-avatar>
                </v-col>
                <v-col cols="12">Zürich</v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col align="center">
              <v-chip>Stade de la Pontaise</v-chip>
            </v-col>
          </v-row>
        </v-card>
      </v-parallax>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class GameResult extends Vue {}
</script>
