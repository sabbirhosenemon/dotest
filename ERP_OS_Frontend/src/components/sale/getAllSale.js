import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, Navigate } from "react-router-dom";
import "./sale.css";

import { DatePicker, Table } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { loadAllSale } from "../../redux/actions/sale/getSaleAction";
import DashboardCard from "../Card/DashboardCard";
import PageTitle from "../page-header/PageHeader";

//Date fucntinalities
let startdate = moment(new Date()).format("YYYY-MM-DD");
let enddate = moment(new Date()).add(1, "day").format("YYYY-MM-DD");

function CustomTable({ list, total, startdate, enddate }) {
	const dispatch = useDispatch();

	const columns = [
		{
			title: "Invoice No",
			dataIndex: "id",
			key: "id",
			render: (name, { id }) => <Link to={`/sale/${id}`}>{id}</Link>,
		},
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
			render: (date) => moment(date).format("ll"),
		},
		{
			title: "Customer Name ",
			dataIndex: `customer`,
			key: "customer_id",
			render: (customer) => customer?.name,
		},

		{
			title: "Total Amount",
			dataIndex: "total_amount",
			key: "total_amount",
		},
		{
			title: "Discount",
			dataIndex: "discount",
			key: "discount",
		},
		{
			title: "Due Amount",
			dataIndex: "due_amount",
			key: "due_amount",
			responsive: ["md"],
		},
		{
			title: "Paid Amount",
			dataIndex: "paid_amount",
			key: "paid_amount",
			responsive: ["md"],
		},

		//Update Supplier Name here

		{
			title: "Profit",
			dataIndex: "profit",
			key: "profit",
			responsive: ["md"],
		},
		{
			title: "Action",
			dataIndex: "id",
			key: "payment",
			render: (id) => (
				<Link to={`/payment/customer/${id}`}>
					<button className='btn btn-dark btn-sm'>Payment</button>
				</Link>
			),
		},
	];

	const addKeys = (arr) => arr.map((i) => ({ ...i, key: i.id }));

	const CSVlist = list?.map((i) => ({
		...i,
		customer: i?.customer?.name,
	}));

	return (
		<div>
			<div className='card-title d-flex justify-content-between'>
				<h5>Sales History</h5>
				{list && (
					<div>
						<CSVLink
							data={CSVlist}
							className='btn btn-dark btn-sm mb-1'
							filename='sales'>
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
					total: total,

					onChange: (page, limit) => {
						dispatch(loadAllSale({ page, limit, startdate, enddate }));
					},
				}}
				columns={columns}
				dataSource={list ? addKeys(list) : []}
			/>
		</div>
	);
}

const GetAllSale = (props) => {
	const dispatch = useDispatch();
	const list = useSelector((state) => state.sales.list);
	const total = useSelector((state) => state.sales.total);

	// const [total, setTotal] = useState(0);
	const { RangePicker } = DatePicker;

	useEffect(() => {
		dispatch(
			loadAllSale({
				page: 1,
				limit: 10,
				startdate: startdate,
				enddate: enddate,
			})
		);
	}, []);

	//Have to IMPLEMENT TOTAL Purchase info
	// useEffect(() => {
	//   GetTotalSale().then((res) => setTotal(res));
	// }, [list]);

	// useEffect(() => {
	//   deleteHandler(list, deletedId);
	// }, [deletedId, list]);

	const onCalendarChange = (dates) => {
		startdate = (dates?.[0]).format("YYYY-MM-DD");
		enddate = (dates?.[1]).format("YYYY-MM-DD");
		dispatch(
			loadAllSale({
				page: 1,
				limit: 10,
				startdate: startdate,
				enddate: enddate,
			})
		);
	};

	const isLogged = Boolean(localStorage.getItem("isLogged"));

	if (!isLogged) {
		return <Navigate to={"/auth/login"} replace={true} />;
	}

	return (
		<>
			<PageTitle title={"Back"} />
			<div className='card mt-1'>
				<div className='card-body'>
					<div className='card-title d-flex flex-column flex-md-row align-items-center justify-content-md-between mt-1 py-2'>
						<h5 className='d-inline-flex'>Sale Invoice List</h5>
						<div>
							<RangePicker
								onCalendarChange={onCalendarChange}
								defaultValue={[moment(startdate), moment(enddate)]}
							/>
						</div>
					</div>
					<DashboardCard
						information={total?._sum}
						count={total?._count}
						isCustomer={true}
					/>
					<br />
					<CustomTable
						list={list}
						total={total?._count?.id}
						startdate={startdate}
						enddate={enddate}
					/>
				</div>
			</div>
		</>
	);
};

export default GetAllSale;
