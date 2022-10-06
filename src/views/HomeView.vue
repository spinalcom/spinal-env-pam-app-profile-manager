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
  <v-container class="applicationContainer"
               fluid>

    <ProfileList v-if="actualState === STATES.home"
                 @create="goToCreationPage"
                 @see="goToProfileDetail"
                 @edit="gotToEditPage"
                 @delete="deleteProfile" />

    <CreationComponent v-show="[STATES.creation, STATES.edit].indexOf(actualState) !== -1"
                       :profileSelected="selectedProfile"
                       :edit="actualState === STATES.edit"
                       @create="createProfile"
                       @goBack="goToHomePage"
                       @edit="editProfile" />

    <ProfileDetail v-show="
                       actualState===STATES.view"
                   :profileSelected="selectedProfile" />

  </v-container>
</template>


<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ProfileList from "../components/profileList.vue";
import CreationComponent from "../components/creation.vue";
import ProfileDetail from "../components/profileDetail.vue";
import { Action } from "vuex-class";

@Component({
  components: {
    ProfileList,
    CreationComponent,
    ProfileDetail,
  },
})
export default class HomeComponent extends Vue {
  selectedProfile: any = null;

  @Action getAllAppProfiles!: any;
  @Action getAllPortofolios!: any;
  @Action getAllBos!: any;
  @Action getAllApis!: any;
  @Action createAppProfile!: any;
  @Action deleteAppProfile!: any;
  @Action editAppProfile!: any;

  STATES = Object.freeze({
    home: 0,
    creation: 1,
    edit: 2,
    view: 3,
  });

  actualState: any = this.STATES.home;

  async mounted() {
    await Promise.all([
      this.getAllAppProfiles(),
      this.getAllPortofolios(),
      this.getAllBos(),
      this.getAllApis(),
    ]);
  }

  async createProfile(profileInfo: any) {
    let isSuccess;
    try {
      await this.createAppProfile(profileInfo);
      isSuccess = true;
    } catch (error) {
      isSuccess = false;
    }

    this.goToHomePage();

    this.$swal({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      icon: isSuccess ? "success" : "error",
      text: isSuccess ? "profil ajouté" : "oups, une erreur s'est produite !",
    });
  }

  async editProfile({ data, profileId }: any) {
    let isSuccess;
    try {
      console.log(data);
      await this.editAppProfile({ profileId, data });
      isSuccess = true;
    } catch (error) {
      isSuccess = false;
    }
    this.goToHomePage();
    this.$swal({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      icon: isSuccess ? "success" : "error",
      text: isSuccess ? "profil modifié" : "oups, une erreur s'est produite !",
    });
  }

  goToCreationPage() {
    this.selectedProfile = undefined;
    this.actualState = this.STATES.creation;
  }

  goToProfileDetail(item: any) {
    this.selectedProfile = item;
    this.actualState = this.STATES.view;
  }

  gotToEditPage(item: any) {
    this.selectedProfile = item;
    this.actualState = this.STATES.edit;
  }

  goToHomePage() {
    this.actualState = this.STATES.home;
  }

  deleteProfile(item: any) {
    return this.$swal({
      title: "Supprimer",
      text: `Êtes-vous sûre de vouloir supprimer ${item.name} ?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "successBtn",
      cancelButtonClass: "errorBtn",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
      buttonsStyling: false,
      icon: "warning",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let isSuccess;
        try {
          await this.deleteAppProfile(item.id);
          isSuccess = true;
        } catch (error) {
          isSuccess = false;
        }

        this.$swal({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          icon: isSuccess ? "success" : "error",
          text: isSuccess
            ? "profil supprimé"
            : "oups, une erreur s'est produite !",
        });
      }
    });
  }
}
</script>

<style  lang="scss" scoped>
$header-height: 60px;
$page-background: #f5f3f3;
$header-margin-bottom: 10px;

.applicationContainer {
  width: 100%;
  height: 100%;
  background: #e6edef;

  .header {
    width: 100%;
    height: $header-height;
    margin-bottom: $header-margin-bottom;
    display: flex;
    justify-content: flex-end;

    .btnCard {
      min-width: 250px;
      height: $header-height;
      border-radius: 7px;
      padding: 10px;
      background-color: $page-background !important;
      display: flex;
      justify-content: center;
      align-items: center;

      .button {
        height: 100%;
        color: #fff;

        .btnIcon {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>

<style>
.successBtn {
  width: 60px !important;
  height: 40px;
  border: 1px solid green;
  color: green;
  border-radius: 5px;
  margin: 5px;
}

.errorBtn {
  width: 75px !important;
  height: 40px;
  border: 1px solid #ff5252;
  color: #ff5252;
  border-radius: 5px;
  margin: 5px;
}
</style>