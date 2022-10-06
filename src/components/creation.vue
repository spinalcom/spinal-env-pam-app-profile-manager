<!--
Copyright 2022 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div class="creationContainer">
    <v-card class="header">
      <div class="leftDiv">
        <div class="back">
          <v-btn rounded
                 outlined
                 color="#14202c"
                 dark
                 @click="goBack">
            <v-icon left>
              mdi-arrow-left-thin
            </v-icon>
            BACK
          </v-btn>
        </div>
        <div class="_title">ajouter un profile d'application</div>
        <div class="description">
          <p>Entrez un nom de profil d'application</p>
          <p>Sélectionnez son périmètre ci-dessous :</p>
        </div>
        <div class="searchDiv">
          <v-text-field solo
                        flat
                        label="nom du profil"
                        hide-details="auto"
                        v-model.trim="profileName"></v-text-field>
        </div>
      </div>

      <div class="rightDiv">
        <v-btn class="button"
               color="#14202c"
               @click="saveProfile">
          <v-icon class="btnIcon">
            mdi-content-save-outline
          </v-icon>

          Enregister le profil
        </v-btn>
      </div>
    </v-card>

    <div class="profileContent">
      <v-card class="tableContent">
        <TableComponent :headers="tableHeader"
                        :items="portofoliosData"
                        childrenKey="apps"
                        title="Applications PAM"
                        ref="portofolioListComponent" />
      </v-card>

      <v-card class="tableContent">
        <TableComponent :headers="tableHeader"
                        :items="apisData"
                        childrenKey="children"
                        title="API's Routes"
                        ref="apisListComponent" />
      </v-card>

      <v-card class="tableContent">
        <TableComponent :headers="tableHeader"
                        :items="bosData"
                        childrenKey="apps"
                        title="Applications BOS"
                        ref="BosListComponent" />
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import TableComponent from "./tableComponent.vue";
import { State } from "vuex-class";

@Component({
  props: {
    edit: { type: Boolean, default: false },
    profileSelected: {},
  },
  components: {
    TableComponent,
  },
})
export default class CreationComponent extends Vue {
  @State portofolios!: any;
  @State bos!: any;
  @State context!: any;
  @State apis!: any;

  profileName = "";
  tableHeader = [
    {
      text: "nom",
      value: "name",
    },
  ];

  portofoliosData = [];
  bosData = [];
  apisData = [];

  oldProfileData: any;

  mounted() {
    console.log("mounted");
  }

  goBack() {
    this._initProfile();
    this.$emit("goBack");
  }

  saveProfile() {
    if (!this.edit) {
      this.$emit("create", this._getProfileDataToCreate());
    } else {
      this.$emit("edit", {
        profileId: this.oldProfileData.id,
        data: this._getDiffBetweenProfile(),
      });
    }

    this._initProfile();
  }

  ///////////////////////////////////////////////////////////
  //                computed function                      //
  ///////////////////////////////////////////////////////////

  get disableSaveButton() {
    if (this.profileName.length === 0) return true;
    const portofolioSelected = this.getItemSelected(
      this.portofoliosData,
      "apps"
    );
    const bosSelected = this.getItemSelected(this.bosData, "apps");

    return portofolioSelected || bosSelected ? false : true;
  }

  getItemSelected(liste: any[], childrenKey = "children") {
    return liste.find((el: any) => {
      if (el.selected) return true;
      const found = el[childrenKey].find((child: any) => child.selected);
      return found ? true : false;
    });
  }

  ///////////////////////////////////////////////////////////
  //                Watch function                         //
  ///////////////////////////////////////////////////////////

  @Watch("portofolios")
  watchApps(newValue: any) {
    this._initPortofolios(newValue);
  }

  @Watch("bos")
  watchBos(newValue: any) {
    this._initBos(newValue);
  }

  @Watch("edit")
  watchEditMode(newValue: boolean) {
    this._initProfile();

    if (newValue) {
      this.profileName = this.profileSelected.name;
      this.oldProfileData = Object.assign({}, this.profileSelected);
      this._selectItems(this.profileSelected.authorizedportofolio);
      this._selectItems(this.profileSelected.authorizedBos, false);
      this._selectApis(this.profileSelected.authorizedRoutes);
    }
  }

  @Watch("apis")
  watchApis(newValue: any) {
    this._initApis();
  }

  //////////////////////////////////////////
  //              UTILS                   //
  //////////////////////////////////////////

  _getProfileDataToCreate() {
    return {
      name:
        this.profileName.trim().toLocaleLowerCase() || `Profile-${Date.now()}`,
      authorizePortofolio: this._getPortofolioSelected(this.portofoliosData),
      authorizeBos: this._getBosSelected(this.bosData),
      authorizeApis: this._getRoutesSelected(this.apisData),
    };
  }

  _getDiffBetweenProfile() {
    const data: any = this._getProfileDataToCreate();
    data.unauthorizePortofolio = this._getPortofolioToUnauthorize(
      data.authorizePortofolio
    );

    data.unauthorizeBos = this._getBosToUnauthorize(data.authorizeBos);
    data.unauthorizeApis = this._getRoutesToUnauthorize(data.authorizeApis);
    return data;
  }

  // init
  _initProfile(): boolean {
    this.profileName = "";
    this._initPortofolios();
    this._initBos();
    this._initApis();
  }

  _initPortofolios() {
    this.portofoliosData = this.portofolios.map((el: any) => {
      return {
        selected: false,
        ...el,
        apps: el.apps.map((app: any) => {
          app.selected = false;
          return app;
        }),
      };
    });
  }

  _initBos(bos?: any) {
    this.bosData = this.bos.map((el: any) => {
      return {
        selected: false,
        ...el,
        apps: el.apps.map((app: any) => {
          app.selected = false;
          return app;
        }),
      };
    });
    // if (!bos) {
    //   bos = this.contextsdata.find(
    //     (el) => el.name.toLocaleLowerCase() === "buildings"
    //   );
    // }
    // if (bos)
    //   bos.children = this.bos.map((el: any) => {
    //     const temp = Object.assign({}, el);
    //     temp.selected = false;
    //     return temp;
    //   });
  }

  _initApis() {
    this.apisData = this.apis.reduce((liste: any[], item: any) => {
      let copy_item = Object.assign({}, item);
      copy_item.selected = false;

      let found = liste.find((el) => el.name === item.tag);

      if (!found) {
        found = {
          selected: false,
          id: item.tag,
          name: item.tag,
          children: [],
        };

        liste.push(found);
      }

      found.children.push(copy_item);
      return liste;
    }, []);

    console.log(this.apisData);
  }

  // getSelected
  _getPortofolioSelected(array: any[]): string[] {
    return array.reduce((liste: any, item: any) => {
      const apps = item.selected
        ? item.apps
        : item.apps.filter((el: any) => el.selected);

      if (apps && apps.length > 0) {
        liste.push({
          portofolioId: item.id,
          appsIds: apps.map((el: any) => el.id),
        });
      }
      return liste;
    }, []);
  }

  _getBosSelected(array: any[]): string[] {
    return array.reduce((liste: any, item: any) => {
      const apps = item.selected
        ? item.apps
        : item.apps.filter((el: any) => el.selected);

      if (apps && apps.length > 0) {
        liste.push({
          buildingId: item.id,
          appsIds: apps.map((el: any) => el.id),
        });
      }
      return liste;
    }, []);
  }

  _getRoutesSelected(array: any): string[] {
    return array.reduce((liste: any, item: any) => {
      const routesSelected = item.selected
        ? item.children
        : item.children.filter((el: any) => el.selected);

      liste.push(...routesSelected.map((el: any) => el.id));
      return liste;
    }, []);
  }

  // To unauthorize
  _getPortofolioToUnauthorize(portofolios: any) {
    return this.oldProfileData.authorizedportofolio.reduce(
      (liste: any[], item: any) => {
        console.log(item);
        const found = portofolios.find(({ portofolioId }: any) => {
          return portofolioId === item.id;
        });

        let apps = [];

        if (!found) {
          apps = item.apps;
        } else {
          apps = item.apps.filter(({ id }: { id: string }) => {
            return !found.appsIds.some((el: string) => el === id);
          });
        }

        if (apps.length > 0) {
          liste.push({
            portofolioId: item.id,
            appsIds: apps.map(({ id }: any) => id),
          });
        }

        return liste;
      },
      []
    );
  }

  _getBosToUnauthorize(bos: any) {
    return this.oldProfileData.authorizedBos.reduce(
      (liste: any[], item: any) => {
        const found = bos.find(({ buildingId }: any) => {
          return buildingId === item.id;
        });

        let apps = [];

        if (!found) {
          apps = item.apps;
        } else {
          apps = item.apps.filter(({ id }: { id: string }) => {
            return !found.appsIds.some((el: string) => el === id);
          });
        }

        if (apps.length > 0) {
          liste.push({
            buildingId: item.id,
            appsIds: apps.map(({ id }: any) => id),
          });
        }

        return liste;
      },
      []
    );
  }

  _getRoutesToUnauthorize(apis: string[]) {
    const data = this.oldProfileData.authorizedRoutes.filter(({ id }: any) => {
      return !apis.includes(id);
    });
    return data.map(({ id }: any) => id);
  }

  // select
  _selectItems(liste: any[], isPortofolio = true) {
    let componentName = isPortofolio
      ? "portofolioListComponent"
      : "BosListComponent";

    let items = isPortofolio ? this.portofoliosData : this.bosData;

    let component: any = this.$refs[componentName];
    if (!component) return;
    if (Array.isArray(component)) component = component[0];
    const obj: any = {};

    for (const item of liste) {
      const category =
        obj[item.id] || items.find((el: any) => el.id === item.id);

      obj[item.id] = category;
      const apps = item.apps;

      for (const { id } of apps) {
        const found = category.apps.find((el: any) => el.id === id);
        if (found) {
          found.selected = true;
          component.selectSubItem(category, found);
        }
      }
    }
  }

  _selectApis(liste: any) {
    let componentName = "apisListComponent";
    let component: any = this.$refs[componentName];
    if (!component) return;

    const obj: any = {};
    for (const item of liste) {
      const category =
        obj[item.tag] || this.apisData.find((el: any) => el.id === item.tag);

      obj[item.tag] = category;

      const found = category.children.find((el: any) => el.id === item.id);

      if (found) {
        found.selected = true;
        component.selectSubItem(category, found);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$header-margin-top: 70px;
$header-height: 190px;
$header-margin-bottom: 10px;

.creationContainer {
  width: 100%;
  height: calc(100% - #{$header-margin-top});
  margin-top: $header-margin-top !important;
  .header {
    height: $header-height !important;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #f9f9f9;
    margin-bottom: $header-margin-bottom;
    .leftDiv {
      width: 35%;

      .back {
        height: 40px;
        margin-bottom: 5px;
      }
      ._title {
        text-transform: uppercase;
        font-size: 0.9em;
        margin-bottom: 15px;
      }

      .description {
        font-size: 0.8em;
        line-height: 5px;
      }
    }

    .rightDiv {
      width: 40%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .button {
        color: #fff;

        .btnIcon {
          margin-right: 5px;
        }
      }
    }
  }

  .profileContent {
    width: 100%;
    height: calc(100% - #{$header-height + $header-margin-bottom});
    display: flex;
    justify-content: space-between;
    .tableContent {
      width: 33%;
      height: 100%;
    }
  }
}
</style>