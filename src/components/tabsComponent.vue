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

<template >
  <div class="tabsContent">

    <v-tabs class="portofolioTabs"
            vertical
            v-model="portofolioTab">
      <v-tab v-for="portofolio in portofolios"
             :key="portofolio.id">
        <v-icon left>mdi-office-building-outline</v-icon>
        {{portofolio.name}}
      </v-tab>

      <v-tabs-items v-model="portofolioTab">
        <v-tab-item v-for="(portofolio,index) in portofolios"
                    :key="index">

          <div class="content">
            <div class="empty"
                 v-if="!portofolioSelected">
              Selectionnez un portefolio
            </div>

            <div v-else
                 class="tabs">
              <v-tabs v-model="tab"
                      class="tabsHeader"
                      background-color="transparent"
                      color="primary"
                      grow>
                <v-tab v-for="item in tabItems"
                       :key="item">
                  {{ item }}
                </v-tab>
              </v-tabs>

              <v-tabs-items v-model="tab"
                            class="tabsItems">

                <v-tab-item>
                  <double-table-component :edit="edit"
                                          :title="'selectionnez les routes de portefolio à autoriser'"
                                          :items="portofolio.apis"
                                          :headers="headers"
                                          :childrenKey="'children'"
                                          :itemToSelect="getItemToSelect(portofolio.id)">
                  </double-table-component>
                </v-tab-item>

                <v-tab-item>
                  <div class="buildingTabsDiv"
                       v-if="portofolio.buildings.length > 0">
                    <v-tabs-items v-model="buildingTab"
                                  class="buildingTabItems">
                      <v-tab-item v-for="(building,index) in portofolio.buildings"
                                  :key="index">
                        <double-table-component :edit="edit"
                                                :title="'selectionnez les routes de batiments à authoriser'"
                                                :items="building.apis"
                                                :headers="headers"
                                                :childrenKey="'children'"
                                                :itemToSelect="getItemToSelect(portofolio.id, building.id)">
                        </double-table-component>
                      </v-tab-item>
                    </v-tabs-items>

                    <v-tabs v-model="buildingTab"
                            class="buildingTabs"
                            background-color="transparent"
                            color="primary"
                            grow>
                      <v-tab v-for="item in getPortofolioBuilding"
                             :key="item">
                        {{ item }}
                      </v-tab>
                    </v-tabs>
                  </div>

                  <div class="buildingTabsDiv"
                       v-else>
                    <div class="empty">
                      Auncun batiment dans ce portofolio
                    </div>
                  </div>

                </v-tab-item>

              </v-tabs-items>
            </div>
          </div>
        </v-tab-item>

      </v-tabs-items>
    </v-tabs>

    <!-- <div class="portofolioList">
        <portofolio-list :portofolios="portofoliosCopy"
                         @select="selectPortofolio"></portofolio-list>
      </div>

      <div class="content">
        <div class="empty"
             v-if="!portofolioSelected">
          Selectionnez un portefolio
        </div>

        <div class="tabs"
             v-else>
          <v-tabs v-model="tab"
                  class="tabsHeader"
                  background-color="transparent"
                  color="primary"
                  grow>
            <v-tab v-for="item in tabItems"
                   :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab"
                        class="tabsItems">

            <v-tab-item>
              <double-table-component :edit="edit"
                                      :title="'selectionnez les routes de portefolio à autoriser'"
                                      :items="portofolioSelected.apis"
                                      :headers="headers"
                                      :childrenKey="'children'"
                                      :itemToSelect="getItemToSelect(portofolioSelected.id)">
              </double-table-component>
            </v-tab-item>

            <v-tab-item>
              <div class="buildingTabsDiv"
                   v-if="getPortofolioBuilding.length > 0">
                <v-tabs-items v-model="buildingTab"
                              class="buildingTabItems">
                  <v-tab-item v-for="(item,index) in getPortofolioBuilding"
                              :key="index">
                    <double-table-component :edit="edit"
                                            :title="'selectionnez les routes de batiments à authoriser'"
                                            :items="getBuildingApis"
                                            :headers="headers"
                                            :childrenKey="'children'">
                    </double-table-component>
                  </v-tab-item>
                </v-tabs-items>

                <v-tabs v-model="buildingTab"
                        class="buildingTabs"
                        background-color="transparent"
                        color="primary"
                        grow>
                  <v-tab v-for="item in getPortofolioBuilding"
                         :key="item">
                    {{ item }}
                  </v-tab>
                </v-tabs>
              </div>

              <div class="buildingTabsDiv"
                   v-else>
                <div class="empty">
                  Auncun batiment dans ce portofolio
                </div>
              </div>

            </v-tab-item>

          </v-tabs-items>
        </div>

      </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import DoubleTableComponent from "./tableComponent.vue";
import SimpleTableComponent from "./simpleTable.vue";

@Component({
  components: {
    DoubleTableComponent,
    SimpleTableComponent,
  },
})
class TabsComponent {
  @Prop() portofolios!: any[];
  @Prop() portofolioSelected!: any;
  @Prop() edit!: boolean;
  @Prop() profileSelected!: any;

  tabsObject = Object.freeze({
    Applications: "Apis de Portefolios",
    Batiments: "Batiments",
  });

  tabItems: string[] = Object.values(this.tabsObject);

  headers: any = [
    {
      text: "Route",
      sortable: false,
      value: "route",
    },
  ];

  portofolioTab: any = null;
  tab = this.tabsObject.Applications;
  buildingTab = null;

  mounted() {
    // if (this.edit) this.selectItems();
  }

  selectItems() {
    for (const portofolio of this.portofolios) {
      this._selectPortofolio(portofolio.id, portofolio.apis);
      this._selectPortofolioBuilding(portofolio.id, portofolio.buildings);
    }
  }

  _selectPortofolio(portofolioId: string, apis: any) {
    const itemToSelect = this.getItemToSelect(portofolioId);
    const obj: any = {};
    for (const item of itemToSelect) {
      obj[item.id] = item;
    }

    for (const api of apis) {
      for (const item of api.children) {
        if (obj[item.id]) item.selected = true;
      }
    }
  }

  _selectPortofolioBuilding(portofolioId: string, buildings: any) {
    for (const building of buildings) {
      const itemToSelect = this.getItemToSelect(portofolioId, building.id);
      const obj: any = {};
      for (const item of itemToSelect) {
        obj[item.id] = item;
      }

      for (const api of building.apis) {
        for (const item of api.children) {
          if (obj[item.id]) item.selected = true;
        }
      }
    }
  }

  @Watch("portofolioTab")
  watchTab(index: number) {
    this.$emit("selectPortofolio", this.portofolios[index]);
  }

  @Watch("portofolios")
  watchPortofolios() {
    this.selectItems();
  }

  ///////////////////////////////////////////////////////////
  //                computed function                      //
  ///////////////////////////////////////////////////////////

  get getPortofolioBuilding() {
    return this.portofolioSelected.buildings.map((el: any) => el.name);
  }

  // get getBuildingApis() {
  //   return this.portofolioSelected.buildings[this.buildingTab]?.apis || [];
  // }

  getItemToSelect(portofolioId: string, buildingId?: string) {
    if (!this.edit) return [];

    const found = this.profileSelected.authorized.find(
      (el: any) => el.id === portofolioId
    );

    if (!found) return [];
    if (found && !buildingId) return found.apis;

    const building = found.buildings.find((el: any) => el.id === buildingId);
    if (!building) return [];

    return building.apis;

    // if (!isBuilding) {
    //   const found = this.profileSelected.authorized.find(
    //     (el: any) => el.id === parentId
    //   );

    //   return found ? found.apis : [];
    // }
  }
}

export default TabsComponent;
</script>

<style scoped lang="scss">
.tabsContent {
  width: 100%;
  height: 100%;
  .portofolioTabs {
    width: 100%;
    height: 100%;

    .content {
      width: 100%;
      height: 100%;
      .empty {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.6em;
      }

      .tabs {
        width: 100%;
        height: 100%;

        .tabsHeader {
          width: 100%;
          height: 50px;
        }

        .tabsItems {
          width: 100%;
          //   height: calc(100% - 50px);
          height: 100%;
          overflow: auto;

          // .v-window__container {
          //   height: 100% !important;
          //   background: yellow;
          // }

          .buildingTabsDiv {
            width: 100%;
            height: 100%;
            .empty {
              width: 100%;
              height: 100%;
            }
            .buildingTabItems {
              width: 100%;
              height: 100%;
            }
            .buildingTabs {
              width: 100%;
              height: 50px;
            }
          }
        }
      }
    }
  }
}
</style>