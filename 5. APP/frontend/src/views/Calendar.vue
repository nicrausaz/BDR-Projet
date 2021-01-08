<template>
  <v-container fluid style="max-width: 1500px">
    <div class="fill-height">
      <v-toolbar class="mb-3" flat outlined rounded>
        <v-toolbar-title v-if="ready">
          {{ calendar.title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="prev">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn icon @click="next">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </v-toolbar>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          :event-color="getEventColor"
          :events="events"
          type="month"
          @change="updateRange"
          @click:event="onEvent"
        ></v-calendar>
      </v-sheet>
    </div>
  </v-container>
</template>

<script lang="ts">
import {Component, Ref, Vue} from "vue-property-decorator";
import API from "@/plugins/API";
import CalendarEntry from "@/models/CalendarEntry";

interface ChangeEventInterface {
  start: {
    date: string;
    time: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    weekday: number;
    hasDay: boolean;
    hasTime: boolean;
    past: boolean;
    present: boolean;
    future: boolean;
  };
  end: {
    date: string;
    time: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    weekday: number;
    hasDay: boolean;
    hasTime: boolean;
    past: boolean;
    present: boolean;
    future: boolean;
  };
}

@Component
export default class Calendar extends Vue {
  @Ref("calendar") calendar!: Vue & {
    title: string;
    prev: () => void;
    next: () => void;
    checkChange: () => void;
  };

  private ready = false;
  private focus = "";
  private events: CalendarEntry[] = [];

  mounted() {
    this.calendar?.checkChange();
    this.ready = true;
  }

  getEventColor(event: any) {
    return event.color;
  }

  setToday() {
    this.focus = "";
  }

  prev() {
    this.calendar?.prev();
  }

  next() {
    this.calendar?.next();
  }

  onEvent({event}: {event: CalendarEntry}) {
    switch (event.eventType) {
      case "training":
        break;
      case "game":
        return this.$router.push({name: "GameResult", params: {id: event.uid}});
    }
  }

  async updateRange(e: ChangeEventInterface) {
    const start = e.start.date;
    const end = e.end.date;
    this.events = await API.get<CalendarEntry[]>(CalendarEntry, `my/event/calendar?start=${start}&end=${end}`);
  }
}
</script>
