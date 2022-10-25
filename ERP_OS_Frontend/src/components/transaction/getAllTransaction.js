import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import "./transaction.css";

import { DatePicker, Table } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { loadAllTransaction } from "../../redux/actions/transaction/getTransactionAction";

//Date fucntinalities
let startdate = moment(new Date()).format("YYYY-MM-DD");
let enddate = moment(new Date()).add(1, "day").format("YYYY-MM-DD");

function CustomTable({ list, total }) {
	const dispatch = useDispatch();

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			render: (id) => <Link to={`/transaction/${id}`}>{id}</Link>,
		},
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
			render: (date) => moment(date).format("ll"),
		},

		{
			title: "Debit Account",
			dataIndex: "debit",
			key: "amount",
			render: (debit) => debit?.name,
		},

		{
			title: "Credit Account",
			dataIndex: "credit",
			key: "amount",
			render: (credit) => credit?.name,
		},

		{
			title: "Amount",
			dataIndex: "amount",
			key: "amount",
			responsive: ["md"],
		},
		{
			title: "Particulars",
			dataIndex: "particulars",
			key: "particulars",
		},
	];

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

	const CSVlist = list?.map((i) => ({
		...i,
		debit: i?.debit?.name,
		credit: i?.credit?.name,
	}));

	return (
		<div>
			<div className='text-end'>
				{list && (
					<div>
						<CSVLink
							data={CSVlist}
							className='btn btn-dark btn-sm mb-1'
							filename='transaction'>
							Download CSV
						</CSVLink>
					</div>
				)}
			</div>
			<Table
				scroll={{ x: true }}
				loading={!list}
				pagination={{
					defaultPageSize: 10,
					pageSizeOptions: [10, 20, 50, 100, 200],
					showSizeChanger: true,
					total: total ? total : 0,

					onChange: (page, limit) => {
						dispatch(loadAllTransaction({ page, limit, startdate, enddate }));
					},
				}}
				columns={columns}
				dataSource={list ? addKeys(list) : []}
			/>
		</div>
	);
}

const GetAllTransaction = (props) => {
	const dispatch = useDispatch();
	const list = useSelector((state) => state.transactions.list);

	const total = useSelector((state) => state.transactions.total);

	const { RangePicker } = DatePicker;

	useEffect(() => {
		dispatch(loadAllTransaction({ page: 1, limit: 10, startdate, enddate }));
	}, []);

	const onCalendarChange = (dates) => {
		startdate = (dates?.[0]).format("YYYY-MM-DD");
		enddate = (dates?.[1]).format("YYYY-MM-DD");
		dispatch(
			loadAllTransaction({
				page: 1,
				limit: 10,
				startdate: startdate,
				enddate: enddate,
			})
		);
	};

	return (
		<div className='card'>
			<div className='card-body'>
				<div className='card-title d-sm-flex justify-content-between'>
					<h5 className=''>
						<span>Transaction History 01</span>
					</h5>
					<div>
						<RangePicker
							onCalendarChange={onCalendarChange}
							defaultValue={[moment(startdate), moment(enddate)]}
						/>
					</div>
				</div>
				<CustomTable
					list={list}
					total={total?._count?.id}
					startdate={startdate}
					enddate={enddate}
				/>
			</div>
		</div>
	);
};

export default GetAllTransaction;
