import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./product.css";

import { Segmented, Table } from "antd";
import { useEffect } from "react";

import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import getTotalProduct from "../../api/getAllApis/getTotalProduct";
import { loadProduct } from "../../redux/actions/product/getAllProductAction";
import GenerateBarcodePopUp from "./generateBarcodePopUp";

function CustomTable({ list, total, status }) {
	const dispatch = useDispatch();

	const columns = [
		{
			title: "Image",
			dataIndex: "imageUrl",
			render: (imageUrl) => (
				<img style={{ maxWidth: "40px" }} alt='product' src={imageUrl} />
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
			title: "Category",
			dataIndex: "product_category",
			key: "product_category",
			render: (product_category) => product_category?.name,
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
			render: (sku, quantity) => <GenerateBarcodePopUp sku={sku ? sku : 0} />,
		},
	];

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

	return (
		<div>
			<Table
				scroll={{ x: true }}
				loading={!list}
				pagination={{
					defaultPageSize: 10,
					pageSizeOptions: [10, 20, 50, 100, 200],
					showSizeChanger: true,
					total: total,

					onChange: (page, limit) => {
						dispatch(loadProduct({ page, limit, status }));
					},
				}}
				columns={columns}
				dataSource={list ? addKeys(list) : []}
			/>
		</div>
	);
}

const GetAllProd = (props) => {
	const dispatch = useDispatch();
	const list = useSelector((state) => state.products.list);
	console.log("list", list);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		dispatch(loadProduct({ status: "true", page: 1, limit: 10 }));
	}, []);

	//TODO :IMPLEMENT TOTAL PROD info
	useEffect(() => {
		getTotalProduct().then((res) => setTotal(res));
	}, [list]);

	const [status, setStatus] = useState("true");
	const onChange = (value) => {
		setStatus(value);
		dispatch(loadProduct({ status: value, page: 1, limit: 10 }));
	};

	const CSVlist = list?.map((i) => ({
		...i,
		product_category: i?.product_category?.name,
	}));

	return (
		<div className='card border'>
			<div className='card-body'>
				<h5>Products List</h5>
				{list && (
					<div className='card-title d-flex justify-content-end'>
						<div className='me-2' style={{ marginTop: "4px" }}>
							<CSVLink
								data={CSVlist}
								className='btn btn-dark btn-sm mb-1'
								filename='products'>
								Download CSV
							</CSVLink>
						</div>
						<div>
							<Segmented
								className='text-center rounded danger'
								size='middle'
								options={[
									{
										label: (
											<span>
												<i className='bi bi-person-lines-fill'></i> Active
											</span>
										),
										value: "true",
									},
									{
										label: (
											<span>
												<i className='bi bi-person-dash-fill'></i> Inactive
											</span>
										),
										value: "false",
									},
								]}
								value={status}
								onChange={onChange}
							/>
						</div>
					</div>
				)}

				<CustomTable list={list} total={total} status={status} />
			</div>
		</div>
	);
};

export default GetAllProd;
