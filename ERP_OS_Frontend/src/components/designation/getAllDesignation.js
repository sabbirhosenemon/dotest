import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import "./designtaion.css";

import { Table } from "antd";
import { useEffect } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { loadAllDesignation } from "../../redux/actions/designation/getDesignationAction";

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
			render: (name, { id }) => <Link to={`/designation/${id}`}>{name}</Link>,
		},
	];

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

	return (
		<div>
			<div className='text-center my-2 d-flex justify-content-between'>
				<h4>Designation List</h4>
				{list && (
					<div>
						<CSVLink
							data={list}
							className='btn btn-dark btn-sm mb-1'
							filename='designation'>
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
						dispatch(loadAllDesignation({ page, limit }));
					},
				}}
				columns={columns}
				dataSource={list ? addKeys(list) : []}
			/>
		</div>
	);
}

const GetAllDesignation = (props) => {
	const dispatch = useDispatch();
	const list = useSelector((state) => state.designations.list);

	useEffect(() => {
		dispatch(loadAllDesignation({ page: 1, limit: 10 }));
	}, []);

	// useEffect(() => {
	//   deleteHandler(list, deletedId);
	// }, [deletedId, list]);

	return (
		<div className='card'>
			<div className='card-body'>
				<CustomTable list={list} />
			</div>
		</div>
	);
};

export default GetAllDesignation;
