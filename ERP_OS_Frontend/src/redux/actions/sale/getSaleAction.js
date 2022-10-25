import { SALES } from "../../types/SaleType";

import axios from "axios";

const getSaleAction = (data) => {
  return {
    type: SALES,
    payload: data,
  };
};

export const loadAllSale = ({ page, limit, startdate, enddate }) => {
  //dispatching with an call back function and returning that
  return async (dispatch) => {
    try {
      const { data } = await axios.get(
        `sale-invoice?page=${page}&count=${limit}&startdate=${startdate}&enddate=${enddate}`
      );

      //dispatching data
      dispatch(getSaleAction(data));
    } catch (error) {
      console.log(error.message);
    }
  };
};
