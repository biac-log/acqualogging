<template>
  <div>
    <v-alert :value="errorMessage != ''" type="warning" border="left">{{
      errorMessage
    }}</v-alert>
    <v-card>
      <v-card-title>
        Loggings
        <v-spacer></v-spacer>
        <v-checkbox
          class="mr-4"
          v-model="seeLogInfo"
          label="Afficher les logs informatifs"
        >
        </v-checkbox>
        <v-text-field
          v-model="search"
          @keypress.enter="getDataFromApi"
          append-icon="mdi-search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :footer-props="{
          'items-per-page-options': [10, 25, 50, -1],
        }"
        :items-per-page="25"
        :headers="headers"
        :options.sync="options"
        :items="loggings"
        :loading="loading"
        v-model="selectedItems"
        :server-items-length="totalLoggings"
        @click:row="openLogging"
        class="elevation-1"
        show-select
      >
        <template v-slot:top>
          <v-btn
            color="error"
            v-if="selectedItems.length > 0"
            class="ml-4"
            @click="Supprimer"
            ><v-icon left>mdi-delete</v-icon> Supprimer</v-btn
          >
        </template>
        <template v-slot:item.type="{ item }">
          <v-icon color="orange" v-if="item.type === 0">mdi-alert</v-icon>
          <v-icon color="red" v-if="item.type === 3">mdi-alert</v-icon>
          <v-icon color="orange" v-if="item.type === 1"
            >mdi-alert-circle</v-icon
          >
          <v-icon color="blue" v-if="item.type === 2">mdi-comment-alert</v-icon>
        </template>
        <template v-slot:item.date="{ item }">{{
          item.date.toLocaleString()
        }}</template>
      </v-data-table>
      <v-dialog v-model="dialog" scrollable max-width="1300px">
        <v-card>
          <v-card-title class="headline">Logging</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <h2>Application</h2>
                  {{ selectedLog.application }}
                  {{ selectedLog.applicationVersion }}
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <h2>Date</h2>
                  {{ selectedLog.date.toLocaleString() }}
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <h2>Utilisateur</h2>
                  {{ selectedLog.user }}
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <h2>Fonction</h2>
                  {{ selectedLog.fonction }}
                </v-col>
                <v-col cols="12" sm="6" md="4" v-if="selectedLog.message">
                  <h2>Message</h2>
                  {{ selectedLog.message }}
                </v-col>
                <v-col cols="12" sm="6" md="4" v-if="selectedLog.exceptionType">
                  <h2>Type d'exception</h2>
                  {{ selectedLog.exceptionType }}
                </v-col>
                <v-col cols="12" v-if="selectedLog.descriptionLongue">
                  <h2>Description longue</h2>
                  {{ selectedLog.descriptionLongue }}
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Logging } from "../data/logging";
import { PagedCollection } from "../data/PagedCollection";
import axios from "axios";
import { JsonConvert, ValueCheckingMode } from "json2typescript";

@Component
export default class Loggings extends Vue {
  private loading: boolean = false;
  private search: string = "";
  private seeLogInfo: boolean = false;
  private loggings: Logging[] = [];
  private selectedItems: Logging[] = [];
  private options: any = {};
  private totalLoggings: Number = 0;
  private headers = [
    { text: "Type", value: "type", width: 80 },
    { text: "Date", value: "date", width: 200 },
    { text: "User", value: "user", width: 150 },
    { text: "Application", value: "application", width: 150 },
    { text: "Fonction", value: "fonction" },
    { text: "ExceptionType", value: "exceptionType" },
  ];
  private errorMessage: string = "";
  private dialog: boolean = false;
  private selectedLog: Logging = new Logging();
  private mounted() {
    this.getDataFromApi();
  }

  private getDataFromApi() {
    this.loading = true;
    const { sortBy, sortDesc, page, itemsPerPage } = this.options;
    let baseQuery = this.seeLogInfo
      ? "Logging?Term="
      : "Logging/GetErrors?Term";
    axios
      .get<PagedCollection<Logging>>(
        process.env.VUE_APP_ApiLogging +
          baseQuery +
          this.search +
          "&Page=" +
          page +
          "&Limit=" +
          itemsPerPage
      )
      .then((response) => {
        const jsonConvert: JsonConvert = new JsonConvert();
        jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;
        this.loggings = jsonConvert.deserializeArray(
          response.data.items,
          Logging
        );
        this.totalLoggings = response.data.totalCount;
        this.errorMessage = "";
      })
      .catch((e) => {
        this.errorMessage = e.message;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  private openLogging(logging: Logging) {
    this.selectedLog = logging;
    this.dialog = true;
  }

  @Watch("options")
  onOptionsChanged() {
    this.getDataFromApi();
  }

  private getColor(typeErreur: number) {
    if (typeErreur === 0) return "red";
    else if (typeErreur === 1) return "orange";
    else return "blue";
  }
  private Supprimer() {
    const idsToDelete: Number[] = this.selectedItems.map(({ id }) => id);
    axios
      .delete(process.env.VUE_APP_ApiLogging + "Logging", { data: idsToDelete })
      .then((response) => {
        this.selectedItems.forEach((element) => {
          const index = this.loggings.indexOf(element, 0);
          if (index > -1) {
            this.loggings.splice(index, 1);
          }
        });
      })
      .catch((e) => {
        this.errorMessage = e.message;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
