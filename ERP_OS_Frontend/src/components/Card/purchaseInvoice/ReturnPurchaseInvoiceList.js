import React from "react";
import { Card, Row, Col, Table } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import ReturnPurchaseInvoiceProductList from "../../popUp/returnPurchaseProductList";

const ReturnPurchaseInvoiceList = ({ list }) => {
	const columns = [
		{
			title: "View Details",
			dataIndex: "returnPurchaseInvoiceProduct",
			key: "returnPurchaseInvoiceProduct",
			render: (returnPurchaseInvoiceProduct) => (
				<ReturnPurchaseInvoiceProductList list={returnPurchaseInvoiceProduct} />
			),
		},
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
			render: (date) => moment(date).format("DD/MM/YYYY"),
		},

		{
			title: "Total Amount",
			dataIndex: "total_amount",
			key: "total_amount",
		},
		{
			title: "Note",
			dataIndex: "note",
			key: "note",
		},
	];

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

	return (
		<Row>
			<Col span={24} className='mt-2'>
				<Card
					className='header-solid h-full'
					bordered={false}
					title={[
						<h6 className='font-semibold m-0 text-center'>
							Return Purchase Information
						</h6>,
					]}
					bodyStyle={{ paddingTop: "0" }}>
					<div className='col-info'>
						<Table
							scroll={{ x: true }}
							loading={!list}
							columns={columns}
							dataSource={list ? addKeys(list) : []}
						/>
					</div>
				</Card>
			</Col>
		</Row>
	);
};

export default ReturnPurchaseInvoiceList;
