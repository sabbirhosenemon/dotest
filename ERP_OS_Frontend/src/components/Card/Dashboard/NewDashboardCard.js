import React, { Fragment } from "react";
import "./style.css";

const NewDashboardCard = ({ information }) => {
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
                      <h3 className="dark">
                        {information?.purchase_total
                          ? information?.purchase_total
                          : 0}
                      </h3>
                      <span>Total Purchase</span>
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
                        {information?.sale_total ? information?.sale_total : 0}
                      </h3>
                      <span>Total Sale</span>
                    </div>
                    <div className="align-self-center">
                      <i className="icon-rocket dark font-large-2 float-right"></i>
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
                        {information?.sale_profit
                          ? information?.sale_profit
                          : 0}
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
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="media-body text-left">
                      <h3 className="dark">
                        {information?.purchase_count
                          ? information?.purchase_count
                          : 0}
                      </h3>
                      <span
                        className="strong"
                        style={{ fontSize: "11px", fontWeight: "bold" }}>
                        Purchase Invoice{" "}
                      </span>
                    </div>
                    <div className="media-body text-right">
                      <h3 className="dark">
                        {information?.sale_count ? information?.sale_count : 0}
                      </h3>
                      <span
                        className="strong"
                        style={{ fontSize: "11px", fontWeight: "bold" }}>
                        Sale Invoice{" "}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NewDashboardCard;
