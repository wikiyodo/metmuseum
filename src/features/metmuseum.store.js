import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  apiGetDepartments,
  apiGetObject,
  apiGetObjects
} from "./metmuseum.api";

export const getObjects = createAsyncThunk(
  "museum/objects/get",
  async (loadFirstObject, thunkApi) => {
    const response = await apiGetObjects({
      metadataDate: "2021-05-01"
    });

    if (response.status === false) {
      // retry after 10 seconds
      setTimeout(() => {
        thunkApi.dispatch(getObjects(loadFirstObject));
      }, 10000);

      throw "Unable to reach the server please check connection";
    }

    if (loadFirstObject && (response.objectIDs || []).length > 0) {
      thunkApi.dispatch(
        getObject({
          objectID: response.objectIDs[0]
        })
      );
    }

    return response.objectIDs;
  }
);

export const getObjectsByDepartment = createAsyncThunk(
  "museum/objects/getbydepartment",
  async ({ departmentIds }) => {
    const response = await apiGetObjects({ departmentIds });

    return response.objectIDs;
  }
);

export const getObject = createAsyncThunk(
  "museum/object/get",
  async ({ objectID }, thunkApi) => {
    const response = await apiGetObject({ objectID });

    if (response.status === false) {
      // retry after 10 seconds
      setTimeout(() => {
        thunkApi.dispatch(getObject({ objectID }));
      }, 10000);

      throw "Unable to reach the server please check connection";
    }

    return { data: response, objectID };
  }
);

export const getDepartments = createAsyncThunk(
  "museum/departments/get",
  async ({ objectID }) => {
    const { departments } = await apiGetDepartments({ objectID });

    return departments;
  }
);

const initialState = {
  objects: [],
  objectsDetails: {},
  objectDepartments: [],
  fetchingObjects: false,
  department: null,
  departmentObjects: {},
  galleryQueue: {},
  galleryQueueIndexes: [],
  galleryQueueHeadIndex: 0,
  galleryQueueTailIndex: 0,
  selectedImages: []
};

export const museumSlice = createSlice({
  name: "museum",
  initialState,
  reducers: {
    addNewItem: (state, { payload: oldIndex }) => {
      let selectedIndex = null;

      for (let id of state.objects) {
        if (
          state.galleryQueueIndexes.includes(id) ||
          state.selectedImages.includes(id) ||
          id == oldIndex
        )
          continue;

        selectedIndex = id;
        break;
      }

      if (!selectedIndex) selectedIndex = state.objects[0];

      let newItems = [...state.galleryQueueIndexes].slice(
        1,
        state.galleryQueueIndexes.length
      );

      newItems.push(selectedIndex);

      let sellected = [...state.selectedImages];
      sellected.push(oldIndex);

      state.selectedImages = sellected;
      state.galleryQueueIndexes = newItems;
    }
  },
  extraReducers: {
    [getObjects.pending]: state => {
      state.fetchingObjects = true;

      return state;
    },
    [getObjectsByDepartment.pending]: state => {
      state.fetchingObjects = true;

      return state;
    },
    [getObjects.fulfilled]: (state, { payload }) => {
      state.fetchingObjects = false;
      state.objects = payload;

      // load first five items into the queue
      state.galleryQueueIndexes = payload.slice(0, 5);

      return state;
    },
    [getObject.fulfilled]: (state, { payload: { data, objectID } }) => {
      state.objectsDetails[`_${objectID}`] = data;

      return state;
    },
    [getDepartments.fulfilled]: (state, { payload }) => {
      state.objectDepartments = payload;

      return state;
    },
    [getObjectsByDepartment.fulfilled]: (state, { payload }) => {
      state.departmentObjects = payload;
      state.fetchingObjects = false;

      return state;
    },
    [getObjects.rejected]: state => {
      return state;
    },
    [getObject.rejected]: state => {
      return state;
    }
  }
});

export const { increment, reset, selectDepartment, addNewItem } =
  museumSlice.actions;

export const museumSelector = state => state.museum;

export default museumSlice.reducer;
