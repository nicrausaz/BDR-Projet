<template>
  <v-container fluid style="max-width: 1000px" v-if="true">
    <v-card class="mx-auto" dark>
      <v-parallax src="https://ysnlive.com/wp-content/uploads/2018/08/football-background.jpg" height="400">
        <v-card color="rgba(0,0,0,0.5)" class="pa-5 blur">
          <v-row align="center" no-gutters>
            <v-col align="center">
              <v-avatar size="64" tile class="ma-3">
                <v-img src="https://cdn-csd.swisstxt.ch/images/sport/club/logo/large/2679.png" />
              </v-avatar>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-col class="text-center text-h3 text-md-h1 font-weight-bold"> Team</v-col>
          </v-row>
        </v-card>
      </v-parallax>
    </v-card>
    <v-row>
      <v-col cols="12" md="12">
        <v-card>
          <v-card dark>
            <v-card-title class="text-uppercase"> Players </v-card-title>
          </v-card>
          <v-list two-line>
            <v-list-item link v-for="j in 5" :key="j">
              <v-list-item-avatar>
                <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>boby</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip label small>
                    <v-icon small left>mdi-tshirt-crew</v-icon>
                    1
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-card>
          <v-card dark>
            <v-card-title class="text-uppercase"> Events </v-card-title>
          </v-card>
          <v-list two-line>
            <v-list-item link v-for="j in 5" :key="j">
              <v-list-item-avatar>
                <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>boby</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip label small>
                    <v-icon small left>mdi-tshirt-crew</v-icon>
                    1
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
// import {namespace} from "vuex-class";
// import Player from "@/models/Player";
//
// const player = namespace("player");

@Component
export default class Team extends Vue {}
</script>
