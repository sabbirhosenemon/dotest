import { DeleteOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Col, Popover, Row, Typography } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deletePurchase } from "../../redux/actions/purchase/deletePurchaseAction";
import { loadSinglePurchase } from "../../redux/actions/purchase/detailPurchaseAction";
import CardComponent from "../Card/card.components";
import PurchaseProductListCard from "../Card/purchaseInvoice/PurchaseProductListCard";
import ReturnPurchaseInvoiceList from "../Card/purchaseInvoice/ReturnPurchaseInvoiceList";
import TransactionPurchaseList from "../Card/purchaseInvoice/TransactionPurchaseList";
import PurchaseInvoice from "../Invoice/PurchaseInvoice";
import Loader from "../loader/loader";
import PageTitle from "../page-header/PageHeader";

const DetailsPurch = () => {
	const { id } = useParams();
	let navigate = useNavigate();

	//dispatch
	const dispatch = useDispatch();
	const purchase = useSelector((state) => state.purchases.purchase);
	const {
		status,
		totalPaidAmount,
		totalReturnAmount,
		dueAmount,
		singlePurchaseInvoice,
		returnPurchaseInvoice,
		transactions,
	} = purchase ? purchase : {};

	//Delete Supplier
	const onDelete = () => {
		try {
			dispatch(deletePurchase(id));

			setVisible(false);
			toast.warning(`Purchase : ${singlePurchaseInvoice.id} is removed `);
			return navigate("/purchaselist");
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
		dispatch(loadSinglePurchase(id));
	}, [id]);

	const isLogged = Boolean(localStorage.getItem("isLogged"));

	if (!isLogged) {
		return <Navigate to={"/auth/login"} replace={true} />;
	}

	return (
		<div>
			<PageTitle title=' Back ' />
			<div className='mr-top'>
				{singlePurchaseInvoice ? (
					<Fragment key={singlePurchaseInvoice.id}>
						<Card bordered={false} className='criclebox h-full'>
							<div className='card-header d-flex justify-content-between'>
								<h5>
									<i className='bi bi-person-lines-fill'></i>
									<span className='mr-left'>
										ID : {singlePurchaseInvoice.id} |
									</span>
								</h5>
								<div className='card-header d-flex justify-content-between'>
									<div className='me-2'>
										<Link to={`/purchase/return/${id}`}>
											<Button type='primary' shape='round'>
												{" "}
												Return Product{" "}
											</Button>
										</Link>
									</div>
									<div className='me-2'>
										<Popover
											content={
												<a onClick={onDelete}>
													<Button type='primary' danger>
														Yes Please !
													</Button>
												</a>
											}
											title='Are you sure you want to delete ?'
											trigger='click'
											visible={visible}
											onVisibleChange={handleVisibleChange}>
											<Button
												type='danger'
												DetailCust
												shape='round'
												icon={<DeleteOutlined />}></Button>
										</Popover>
									</div>
									<div className={"text-end me-2"}>
										<PurchaseInvoice data={singlePurchaseInvoice} />
									</div>
								</div>
							</div>
							<div className='card-body'>
								<Row justify='space-around'>
									<Col span={11}>
										<Badge.Ribbon
											text={status}
											color={status === "PAID" ? "green" : "red"}>
											<CardComponent title='Purchase Invoice Information '>
												<h5 className='text-center mt-2 mb-2'>
													{" "}
													Initital Invoice Info{" "}
												</h5>
												<p>
													<Typography.Text strong>
														Total Amount :
													</Typography.Text>{" "}
													<strong>{singlePurchaseInvoice.total_amount} </strong>
												</p>

												<p>
													<Typography.Text strong>Due Amount :</Typography.Text>{" "}
													<strong className='text-danger'>
														{" "}
														{singlePurchaseInvoice.due_amount}
													</strong>
												</p>

												<p>
													<Typography.Text strong>
														Paid Amount :
													</Typography.Text>{" "}
													<strong>{singlePurchaseInvoice.paid_amount}</strong>
												</p>

												<p>
													<Typography.Text strong>Discount :</Typography.Text>{" "}
													<strong>{singlePurchaseInvoice.discount}</strong>
												</p>

												<p>
													<Typography.Text strong>
														Purchase Date :
													</Typography.Text>{" "}
													<strong>
														{singlePurchaseInvoice.created_at.slice(0, 10)}
													</strong>
												</p>

												<p>
													<Typography.Text strong>
														Supplier Memo No :
													</Typography.Text>{" "}
													<strong>
														{singlePurchaseInvoice.supplier_memo_no}
													</strong>
												</p>

												<p>
													<Typography.Text strong>Note :</Typography.Text>{" "}
													<strong>{singlePurchaseInvoice.note}</strong>
												</p>

												<div>
													<h5 className='text-center mt-2 mb-2'>
														Update Invoice Info
													</h5>

													<p>
														<Typography.Text strong>
															Total Paid Amount :
														</Typography.Text>{" "}
														<strong>{totalPaidAmount}</strong>
													</p>

													<p>
														<Typography.Text strong>
															Total Return Amount:
														</Typography.Text>{" "}
														<strong>{totalReturnAmount}</strong>
													</p>

													<p>
														<Typography.Text strong>
															Due Amount :
														</Typography.Text>{" "}
														<strong style={{ color: "red" }}>
															{dueAmount}
														</strong>
													</p>
												</div>
											</CardComponent>
										</Badge.Ribbon>
									</Col>
									<Col span={12}>
										<CardComponent title='Supplier Information'>
											<p>
												<Typography.Text strong>
													Supplier Name :
												</Typography.Text>{" "}
												<strong>{singlePurchaseInvoice.supplier.name}</strong>
											</p>

											<p>
												<Typography.Text strong>Due Amount :</Typography.Text>{" "}
												<strong>
													{singlePurchaseInvoice.supplier.due_amount}
												</strong>
											</p>

											<p>
												<Typography.Text strong>Phone :</Typography.Text>{" "}
												<strong>{singlePurchaseInvoice.supplier.phone}</strong>
											</p>

											<p>
												<Typography.Text strong>Address :</Typography.Text>{" "}
												<strong>
													{singlePurchaseInvoice.supplier.address}
												</strong>
											</p>
										</CardComponent>
									</Col>
								</Row>
								<br />

								<PurchaseProductListCard
									list={singlePurchaseInvoice.purchaseInvoiceProduct}
								/>
								<ReturnPurchaseInvoiceList list={returnPurchaseInvoice} />

								<TransactionPurchaseList list={transactions} />
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

export default DetailsPurch;
