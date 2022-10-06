/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import Vue from 'vue'
import Vuex from 'vuex'
import {
  getAllAppProfilesRequest,
  createAppProfileRequest,
  getAppProfileRequest,
  deleteAppProfileRequest,
  editAppProfileRequest,
  getAllPortofoliosRequest,
  getAllBosRequest,
  getAllApisRequest
} from "../requests";

import {
  SET_PROFILE_LIST,
  DELETE_PROFILE,
  UPDATE_PROFILE,
  ADD_PROFILE,
  SET_APPS,
  SET_BOS,
  SET_APIS
} from "./mutations-constants";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    profiles: [],
    portofolios: null,
    bos: null,
    apis: null,
    context: null
  },
  getters: {
  },
  mutations: {
    [SET_PROFILE_LIST](state: any, playload: any) {
      console.log(playload)
      state.profiles = playload;
    },

    [DELETE_PROFILE](state: any, profileId: string) {
      state.profiles = state.profiles.filter((el: any) => el.id !== profileId);
    },

    [UPDATE_PROFILE](state: any, { data, profileId }: any) {
      const index = state.profiles.findIndex((el: any) => el.id === profileId);
      if (index != -1) state.profiles[index] = data;
    },

    [ADD_PROFILE](state: any, playload: any) {
      state.profiles.push(playload)
    },

    [SET_APPS](state, playload) {
      state.portofolios = playload;
    },
    [SET_BOS](state, playload) {
      state.bos = playload;
    },
    [SET_APIS](state, playload) {
      state.apis = playload;
    }
  },
  actions: {
    async getAllAppProfiles({ commit }: any) {
      const { data } = await getAllAppProfilesRequest();
      commit(SET_PROFILE_LIST, data);
    },

    async createAppProfile({ commit }: any, profileData: any) {
      const { data } = await createAppProfileRequest(profileData);
      commit(ADD_PROFILE, data)
    },

    async getAppProfile({ commit }: any, profileId: string) {
      const response = await getAppProfileRequest(profileId);
      return response.data;
    },

    async deleteAppProfile({ commit }: any, profileId: string) {
      await deleteAppProfileRequest(profileId);
      commit(DELETE_PROFILE, profileId)
    },

    async editAppProfile({ commit }: any, { profileId, data }: any) {
      const response: any = await editAppProfileRequest(profileId, data);
      commit(UPDATE_PROFILE, { data: response.data, profileId });
    },

    async getAllPortofolios({ commit, state }) {
      if (state.portofolios) return state.portofolios;
      const { data } = await getAllPortofoliosRequest();
      commit(SET_APPS, data);
    },

    async getAllBos({ commit, state }) {
      if (state.bos) return state.bos;

      const { data } = await getAllBosRequest();
      commit(SET_BOS, data);
    },

    async getAllApis({ commit, state }) {
      if (state.apis) return state.apis;

      const { data } = await getAllApisRequest();
      commit(SET_APIS, data);
    }

  },
  modules: {
  }
})
