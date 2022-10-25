import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./customer.css";

import { CSVLink } from "react-csv";
import { useEffect } from "react";
import { Segmented, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import GetTotalCustomers from "../../api/getTotalCustomers";
import { loadAllCustomer } from "../../redux/actions/customer/getCustomerAction";

function CustomTable({ list, total, status }) {
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
			render: (name, { id }) => <Link to={`/customer/${id}`}>{name}</Link>,
		},
		{
			title: "Phone",
			dataIndex: "phone",
			key: "phone",
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "address",
			responsive: ["md"],
		},
		// {
		//   title: "Due Amount",
		//   dataIndex: "due_amount",
		//   key: "due_amount",
		//   responsive: ["md"],
		// },
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
						dispatch(loadAllCustomer({ page, limit, status }));
					},
				}}
				columns={columns}
				dataSource={list ? addKeys(list) : []}
			/>
		</div>
	);
}

const GetAllCust = (props) => {
	const dispatch = useDispatch();
	const list = useSelector((state) => state.customers.list);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		dispatch(loadAllCustomer({ page: 1, limit: 10 }));
	}, []);

	useEffect(() => {
		GetTotalCustomers().then((res) => setTotal(res));
	}, [list]);

	const [status, setStatus] = useState("true");
	const onChange = (value) => {
		setStatus(value);
		dispatch(loadAllCustomer({ status: value, page: 1, limit: 10 }));
	};

	return (
		<div className='card'>
			<div className='card-body'>
				<h4>Customer List</h4>
				{list && (
					<div className='text-center m-2 d-flex justify-content-end'>
						<div className='me-2' style={{ marginTop: "4px" }}>
							<CSVLink
								data={list}
								className='btn btn-dark btn-sm mb-1'
								filename='customer'>
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

export default GetAllCust;
