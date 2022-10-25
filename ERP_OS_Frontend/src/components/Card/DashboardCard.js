import React, { Fragment } from "react";

import "./card.css";

const DashboardCard = ({ information, count, isCustomer, title }) => {
  return (
    <Fragment>
      <div>
        <div className="row">
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="media-body text-left">
                      <h3 className="dark">{count?.id ? count?.id : 0}</h3>
                      <span>Invoice</span>
                    </div>
                    <div className="align-self-center">
                      <i className="icon-cloud-download dark font-large-2 float-right"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="media-body text-left">
                      <h3 className="dark">
                        {information?.total_amount
                          ? information?.total_amount
                          : 0}
                      </h3>
                      <span>Total Amount</span>
                    </div>
                    <div className="align-self-center">
                      <i className="icon-rocket dark font-large-2 float-right"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isCustomer ? (
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card">
                <div className="card-content">
                  <div className="card-body">
                    <div className="media d-flex">
                      <div className="media-body text-left">
                        <h3 className="dark">
                          {information?.profit ? information?.profit : 0}
                        </h3>
                        <span>Total Profit</span>
                      </div>
                      <div className="align-self-center">
                        <i className="icon-wallet dark font-large-2 float-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card">
                <div className="card-content">
                  <div className="card-body">
                    <div className="media d-flex">
                      <div className="media-body text-left">
                        <h3 className="dark">
                          {information?.paid_amount
                            ? information?.paid_amount
                            : 0}
                        </h3>
                        <span>Paid Amount</span>
                      </div>
                      <div className="align-self-center">
                        <i className="icon-wallet dark font-large-2 float-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isCustomer ? (
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card">
                <div className="card-content">
                  <div className="card-body">
                    <div className="media d-flex">
                      <div className="media-body text-left">
                        <h3 className="dark">
                          {information?.paid_amount
                            ? information?.paid_amount
                            : 0}
                        </h3>
                        <span
                          className="strong"
                          style={{ fontSize: "12px", fontWeight: "bold" }}>
                          Paid Amount{" "}
                        </span>
                      </div>
                      <div className="media-body text-right">
                        <h3 className="dark">
                          {information?.due_amount
                            ? information?.due_amount
                            : 0}
                        </h3>
                        <span
                          className="strong"
                          style={{ fontSize: "12px", fontWeight: "bold" }}>
                          Due Amount{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-xl-3 col-sm-6 col-12">
              <div className="card">
                <div className="card-content">
                  <div className="card-body">
                    <div className="media d-flex">
                      <div className="media-body text-left">
                        <h3 className="dark">
                          {information?.due_amount
                            ? information?.due_amount
                            : 0}
                        </h3>
                        <span>Total Due</span>
                      </div>
                      <div className="align-self-center">
                        <i className="icon-pie-chart dark font-large-2 float-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default DashboardCard;
