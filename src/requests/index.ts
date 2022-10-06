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

import axios from "axios";

const http = axios.create({ baseURL: "http://localhost:8065/api/v1/pam" });


export function getAllAppProfilesRequest() {
    try {
        return http.get("/app_profile/get_all_profile");
    } catch (error) {
        console.error(error);
        return { data: [] }
    }
}

export function createAppProfileRequest(data: any) {
    return http.post("/app_profile/create_profile", data);
}

export function getAppProfileRequest(profileId: string) {
    return http.get(`/app_profile/get_profile/${profileId}`);
}

export function deleteAppProfileRequest(profileId: string) {
    return http.delete(`/app_profile/delete_profile/${profileId}`);
}



export function editAppProfileRequest(profileId: string, newData: any) {
    return http.put(`/app_profile/edit_profile/${profileId}`, newData);
}

export function getAllPortofoliosRequest() {
    try {
        return http.get("/get_all_portofolios_details");
    } catch (error) {
        console.error(error)
        return { data: [] }
    }

}

export function getAllBosRequest() {
    try {
        return http.get("/get_all_buildings_apps");
    } catch (error) {
        console.error(error)
        return { data: [] }
    }
}

export function getAllApisRequest() {
    return http.get("/get_all_api_route");
}

