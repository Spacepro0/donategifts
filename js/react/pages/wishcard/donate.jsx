import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

import { StripeCheckout, PayPalCheckout } from './paymentProviders.jsx';

let stripePromise;

function WishCardDonate({ wishcard, agency, user, extendedPaymentInfo, stripeKey, paypalKey }) {
	const [additionalDonation, setAdditionalDonation] = useState(0);
	const [totalCost, setTotalCost] = useState(parseFloat(extendedPaymentInfo.totalItemCost));

	const paypalOptions = {
		'client-id': paypalKey,
		'disable-funding': 'credit,card',
		currency: 'USD',
	};

	useMemo(() => {
		stripePromise = loadStripe(stripeKey);
	}, []);

	function calculateTotalCost(newAdditionalDonation) {
		return (
			Math.floor(
				(parseFloat(extendedPaymentInfo.totalItemCost) + newAdditionalDonation) * 100,
			) / 100
		);
	}

	function handleAdditionalDonationChange(e) {
		const newAdditionalDonation = Math.floor(e.target.value * 100) / 100;
		setAdditionalDonation(newAdditionalDonation);
		setTotalCost(calculateTotalCost(newAdditionalDonation));
	}

	function handleAdditionalDonationClick(_e) {
		setAdditionalDonation(0);
		setTotalCost(calculateTotalCost(0));
	}

	return (
		<MantineProviderWrapper>
			<div className="bg-light" id="donate">
				<div className="container py-3">
					<h1 className="text-center cool-font text-primary mt-4">
						Wish Item Donation Checkout
					</h1>
					<p className="text-center mb-0 fs-5">
						{wishcard.childFirstName}&apos;s gift will be delivered to our partner
						agency,
						<a
							href="#"
							className="fw-bold mx-1"
							data-bs-toggle="modal"
							data-bs-target="#checkoutHelper"
						>
							{agency.agencyName}
							<i className="fa fa-info-circle ms-1" aria-hidden="true"></i>
						</a>
						<span>, after payment confirmation.</span>
					</p>
					<div className="row">
						<div className="col-md-6 mt-5">
							<div className="card">
								<div className="card-header">
									<span>From this donation, you will receive:</span>
									<div className="mt-1">
										<div className="center-elements justify-content-start">
											<div className="fa fa-heart text-secondary"></div>
											<div className="ms-1">
												Tax-deductible receipt with shipping details
											</div>
										</div>
										<div className="center-elements justify-content-start">
											<div className="fa fa-heart text-secondary"></div>
											<div className="ms-1">
												Notification with a delivery proof
											</div>
										</div>
										<div className="center-elements justify-content-start">
											<div className="fa fa-heart text-secondary"></div>
											<div className="ms-1">
												Message &amp; photo from{' '}
												<span className="fw-bold">
													{wishcard.childFirstName}
												</span>{' '}
												if partner agency permits
											</div>
										</div>
									</div>
								</div>
								<div className="card-body">
									<div className="col-6 mx-auto">
										<img
											className="img-fluid rounded-3"
											alt="wish card kid photo"
											src={wishcard.wishCardImage || wishcard.childImage}
										/>
									</div>
									<div className="py-3">Wish item: {wishcard.wishItemNam}e</div>
									<div className="d-flex justify-content-between">
										<span>Subtotal</span>
										<span>${wishcard.wishItemPrice}.00</span>
									</div>
									<div className="d-flex justify-content-between">
										<span>Shipping</span>
										<span className="fw-bold">
											{extendedPaymentInfo.shipping}
										</span>
									</div>
									<div className="d-flex justify-content-between">
										<span>
											<span>Processing fee</span>
											<a
												className="text-success"
												href="#"
												data-bs-toggle="modal"
												data-bs-target="#checkoutHelper2"
											>
												<div className="fa fa-question-circle ms-1"></div>
											</a>
										</span>
										<span>${extendedPaymentInfo.processingFee}</span>
									</div>
									<div className="d-flex justify-content-between">
										<span>
											Item sales tax
											<a
												className="text-success"
												href="#"
												data-bs-toggle="modal"
												data-bs-target="#checkoutHelper3"
											>
												<div className="fa fa-question-circle ms-1"></div>
											</a>
										</span>
										<span>${extendedPaymentInfo.tax}</span>
									</div>
									<div
										className="d-flex justify-content-between"
										id="user-donation-div"
									>
										<span>Cash donation</span>
										<span id="user-donation">${additionalDonation}</span>
									</div>
									<hr />
									<div className="d-flex justify-content-between fw-bold">
										<span>Total</span>
										<span className="text-success" id="total-cost">
											${totalCost}
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-6 mt-5">
							<div className="card">
								<div className="card-body">
									<div className="pb-1">
										<div className="fw-bold">
											{user.fName}, would you like to support our cause?
										</div>
										<div className="my-3">
											Consider adding a cash donation to sponsor our project
											so that we can help more kids.
											<a
												className="text-success"
												href="#"
												data-bs-toggle="modal"
												data-bs-target="#checkoutHelper4"
											>
												<div className="fa fa-question-circle ms-1"></div>
											</a>
										</div>
										<div className="d-md-flex justify-content-center align-items-center">
											<div className="col-md-3 mb-3 mb-md-0 p-0 p-md-2">
												<input
													className="btn-check col-auto"
													id="button-5"
													type="radio"
													name="additional-donation"
													value={5}
													autoComplete="off"
													checked={additionalDonation === 5}
													onChange={handleAdditionalDonationChange}
													onClick={handleAdditionalDonationClick}
												/>
												<label
													className="btn btn-outline-success py-3 d-flex flex-column justify-content-center"
													htmlFor="button-5"
												>
													$5
												</label>
											</div>
											<div className="col-md-3 mb-3 mb-md-0 p-0 p-md-2">
												<input
													className="btn-check col-auto"
													id="button-10"
													type="radio"
													name="additional-donation"
													value={10}
													autoComplete="off"
													checked={additionalDonation === 10}
													onChange={handleAdditionalDonationChange}
													onClick={handleAdditionalDonationClick}
												/>
												<label
													className="btn btn-outline-success py-3 d-flex flex-column justify-content-center"
													htmlFor="button-10"
												>
													$10
												</label>
											</div>
											<div className="col-md-3 mb-3 mb-md-0 p-0 p-md-2">
												<input
													className="btn-check col-auto"
													id="button-50"
													type="radio"
													name="additional-donation"
													value={50}
													autoComplete="off"
													checked={additionalDonation === 50}
													onChange={handleAdditionalDonationChange}
													onClick={handleAdditionalDonationClick}
												/>
												<label
													className="btn btn-outline-success py-3 d-flex flex-column justify-content-center"
													htmlFor="button-50"
												>
													$50
												</label>
											</div>
											<div className="col-md-3 p-0 p-md-2">
												<input
													className="btn-check col-auto"
													id="button-100"
													type="radio"
													name="additional-donation"
													value={100}
													autoComplete="off"
													checked={additionalDonation === 100}
													onChange={handleAdditionalDonationChange}
													onClick={handleAdditionalDonationClick}
												/>
												<label
													className="btn btn-outline-success py-3 d-flex flex-column justify-content-center"
													htmlFor="button-100"
												>
													$100
												</label>
											</div>
										</div>
									</div>
									<hr />
									<div className="fw-bold">Use credit or debit card</div>
									<Elements stripe={stripePromise}>
										<StripeCheckout
											wishCardId={wishcard._id}
											agencyName={agency.agencyName}
											userDonation={additionalDonation}
											totalCost={totalCost}
										/>
									</Elements>
									<hr />
									<PayPalScriptProvider options={paypalOptions}>
										<PayPalCheckout
											userId={user._id}
											wishcardId={wishcard._id}
											agencyName={agency.agencyName}
											userDonation={additionalDonation}
											totalAmount={totalCost}
										/>
									</PayPalScriptProvider>
								</div>
							</div>
						</div>
					</div>
					<div className="text-center mt-5">
						<div className="fw-bold fs-5">Secure Checkout Guaranteed</div>
						<img
							className="img-fluid checkout-img"
							src="/img/secure-cards.png"
							alt="secure checkout images"
						/>
					</div>
				</div>
			</div>
		</MantineProviderWrapper>
	);
}

WishCardDonate.propTypes = {
	wishcard: PropTypes.object,
	agency: PropTypes.object,
	user: PropTypes.object,
	extendedPaymentInfo: PropTypes.object,
	stripeKey: PropTypes.string,
	paypalKey: PropTypes.string,
};

export default WishCardDonate;
