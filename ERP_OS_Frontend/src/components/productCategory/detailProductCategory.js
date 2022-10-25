import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Popover, Table } from "antd";
import { Fragment, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DeleteProductCategory } from "../../redux/actions/productCategory/deleteProductCategoryAction";
import { loadSingleProductCategory } from "../../redux/actions/productCategory/detailProductCategoryAction";
import Loader from "../loader/loader";
import PageTitle from "../page-header/PageHeader";
import GenerateBarcodePopUp from "../product/generateBarcodePopUp";

//PopUp

function CustomTable({ list, categoryName }) {
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      render: (imageUrl) => (
        <img style={{ maxWidth: "40px" }} alt="product" src={imageUrl} />
      ),
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, { id }) => <Link to={`/product/${id}`}>{name}</Link>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Purchase price",
      dataIndex: "purchase_price",
      key: "purchase_price",
      responsive: ["md"],
    },
    {
      title: "Sale price",
      dataIndex: "sale_price",
      key: "sale_price",
      responsive: ["md"],
    },
    {
      title: "Unit Type",
      dataIndex: "unit_type",
      key: "unit_type",
    },

    {
      title: "Reorder QTY",
      dataIndex: "reorder_quantity",
      key: "reorder_quantity",
    },
    {
      title: "Action",
      dataIndex: "sku",
      key: "sku",
      render: (sku) => <GenerateBarcodePopUp sku={sku ? sku : 0} />,
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
                filename={`category_${categoryName}`}>
                Download CSV
              </CSVLink>
            </div>
          )}
        </div>

        <Table
          scroll={{ x: true }}
          loading={!list}
          columns={columns}
          dataSource={list ? addKeys(list) : []}
        />
      </div>
    </div>
  );
}

const DetailProductCategory = () => {
  const { id } = useParams();
  let navigate = useNavigate();

  //dispatch
  const dispatch = useDispatch();
  const category = useSelector((state) => state.productCategories.category);

  //Delete Supplier
  const onDelete = () => {
    try {
      dispatch(DeleteProductCategory(id));

      setVisible(false);
      toast.warning(`Product : ${category.name} is removed `);
      return navigate("/product-category");
    } catch (error) {
      console.log(error.message);
    }
  };
  // Delete Supplier PopUp
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  useEffect(() => {
    dispatch(loadSingleProductCategory(id));
  }, [id]);

  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/auth/login"} replace={true} />;
  }

  return (
    <div>
      <PageTitle title=" Back " subtitle=" " />

      <div className="mr-top">
        {category ? (
          <Fragment key={category.id}>
            <Card bordered={false} style={{}}>
              <div
                className="card-header d-flex justify-content-between"
                style={{ padding: 0 }}>
                <div className="w-50">
                  <h5>
                    <i className="bi bi-person-lines-fill"></i>
                    <span className="mr-left">
                      ID : {category.id} | {category.name}
                    </span>
                  </h5>
                </div>
                <div className="text-end w-50">
                  <Link
                    className="me-3 d-inline-block"
                    to={`/product-category/${category.id}/update`}
                    state={{ data: category }}>
                    <Button
                      type="primary"
                      shape="round"
                      icon={<EditOutlined />}></Button>
                  </Link>
                  <Popover
                    content={
                      <a onClick={onDelete}>
                        <Button type="primary" danger>
                          Yes Please !
                        </Button>
                      </a>
                    }
                    title="Are you sure you want to delete ?"
                    trigger="click"
                    visible={visible}
                    onVisibleChange={handleVisibleChange}>
                    <Button
                      type="danger"
                      DetailProductCategory
                      shape="round"
                      icon={<DeleteOutlined />}></Button>
                  </Popover>
                </div>
              </div>

              <div className="my-2 table-responsive">
                <h5 className="text-center mb-2">
                  {" "}
                  Products under <strong>{category.name} </strong>
                </h5>

                <CustomTable
                  list={category?.product}
                  categoryName={category?.name}
                />
              </div>
            </Card>
          </Fragment>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default DetailProductCategory;
