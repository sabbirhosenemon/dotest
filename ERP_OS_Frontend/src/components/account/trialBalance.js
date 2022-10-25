import { Card } from "antd";
import React, { useEffect, useState } from "react";

import { getTrailBalance } from "./account.api";

const TrialBalance = () => {
  const [data, setData] = useState([]);

  //make a use effect to get the data from the getTrailBalance function
  useEffect(() => {
    getTrailBalance().then((data) => {
      setData(data);
    });
  }, []);

  return (
    <>
      <Card>
        <div>
          <div className="card-title d-flex justify-content-between">
            <h5>
              <span className="ms-2">Trail Balance</span>
            </h5>
          </div>
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Account</th>
                <th scope="col">Debit</th>
                <th scope="col">Credit</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data?.debits?.map((item, index) => {
                  return (
                    <tr>
                      <td>{item.subAccount}</td>
                      <td>{item.balance}</td>
                      <td></td>
                    </tr>
                  );
                })}
              {data &&
                data?.credits?.map((item, index) => {
                  return (
                    <tr>
                      <td>{item.subAccount}</td>
                      <td></td>
                      <td>{item.balance}</td>
                    </tr>
                  );
                })}

              <tr className="table-active">
                <td>TOTAL</td>
                <td>{data?.totalDebit}</td>
                <td>{data?.totalCredit}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};

export default TrialBalance;
