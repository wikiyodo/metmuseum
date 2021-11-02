import axios from "axios";
import {
  parseApiRoute,
  routeGetDepartments,
  routeGetObject,
  routeGetObjects
} from "../helpers/routes";

export const apiGetObjects = async params => {
  try {
    const res = await axios.get(parseApiRoute(routeGetObjects), { params });
    console.log("I'm getting data", res);
    return res.data;
  } catch (error) {
    console.log(error);
    return {
      status: false
    };
  }
};

export const apiGetObject = async ({ objectID }) => {
  try {
    const res = await axios.get(
      parseApiRoute(routeGetObject, { objectID }),
      {}
    );

    return res.data;
  } catch (error) {
    return {
      status: false
    };
  }
};

export const apiGetDepartments = async () => {
  try {
    const res = await axios.get(parseApiRoute(routeGetDepartments));

    return res.data;
  } catch (error) {
    return {
      status: false
    };
  }
};
