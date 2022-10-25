import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./user.css";

import { Segmented, Table } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import GetTotalCustomers from "../../api/getTotalCustomers";
import { loadAllStaff } from "../../redux/actions/user/getStaffAction";

function CustomTable({ list }) {
	const dispatch = useDispatch();
	const [status, setStatus] = useState("true");

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Name",
			dataIndex: "username",
			key: "username",
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
		},
		{
			title: "Created at",
			dataIndex: "createdAt",
			key: "addrcreatedAtess",
			render: (createdAt) => moment(createdAt).format("YYYY-MM-DD"),
		},
		{
			title: "Action",
			dataIndex: "id",
			key: "id",
			render: (id) => (
				<Link to={`/hr/staffs/${id}/`}>
					<button className='btn btn-dark btn-sm'> View</button>
				</Link>
			),
		},
	];

	//make a onChange function
	const onChange = (value) => {
		setStatus(value);
		dispatch(loadAllStaff({ status: value }));
	};

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

	return (
		<div>
			<div className='d-flex my-2'>
				<div className='w-50'>
					<h4>Staff List</h4>
				</div>
				{list && (
					<div className='text-center d-flex justify-content-end w-50'>
						<div className='me-2'>
							<CSVLink
								data={list}
								className='btn btn-dark btn-sm'
								style={{ marginTop: "5px" }}
								filename='staffs'>
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
			</div>
			<Table
				scroll={{ x: true }}
				loading={!list}
				pagination={{
					defaultPageSize: 20,
				}}
				columns={columns}
				dataSource={list ? addKeys(list) : []}
			/>
		</div>
	);
}

const GetAllCust = (props) => {
	const dispatch = useDispatch();
	const list = useSelector((state) => state.users.list);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		dispatch(loadAllStaff({ status: "true" }));
	}, []);

	useEffect(() => {
		GetTotalCustomers().then((res) => setTotal(res));
	}, [list]);

	// useEffect(() => {
	//   deleteHandler(list, deletedId);
	// }, [deletedId, list]);

	return (
		<div className='card'>
			<div className='card-body'>
				<CustomTable list={list} total={total} />
			</div>
		</div>
	);
};

export default GetAllCust;
