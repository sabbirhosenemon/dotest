import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import "./productCategory.css";

import { Table } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { loadAllProductCategory } from "../../redux/actions/productCategory/getProductCategoryAction";

function CustomTable({ list, total }) {
  const dispatch = useDispatch();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, { id }) => (
        <Link to={`/product-category/${id}`}>{name}</Link>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD"),
    },
  ];

  const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

  return (
    <div className="card border">
      <div className="card-body">
        <div className="card-title d-flex justify-content-between">
          <h5>Product List</h5>
          {list && (
            <div>
              <CSVLink
                data={list}
                className="btn btn-dark btn-sm mb-1"
                filename="customer"
              >
                Download CSV
              </CSVLink>
            </div>
          )}
        </div>

        <Table
          scroll={{ x: true }}
          loading={!list}
          pagination={{
            defaultPageSize: 20,
            pageSizeOptions: [10, 20, 50, 100, 200],
            showSizeChanger: true,

            onChange: (page, limit) => {
              dispatch(loadAllProductCategory({ page, limit }));
            },
          }}
          columns={columns}
          dataSource={list ? addKeys(list) : []}
        />
      </div>
    </div>
  );
}

const GetAllProductCategory = (props) => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.productCategories?.list);

  useEffect(() => {
    dispatch(loadAllProductCategory({ page: 1, limit: 10 }));
  }, []);

  // useEffect(() => {
  //   deleteHandler(list, deletedId);
  // }, [deletedId, list]);

  return (
        <CustomTable list={list} />
  );
};

export default GetAllProductCategory;
