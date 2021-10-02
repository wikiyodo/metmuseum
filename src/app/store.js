import { configureStore } from "@reduxjs/toolkit";
import museumReducer from "../features/metmuseum.store";

export const store = configureStore({
  reducer: {
    museum: museumReducer
  }
});
