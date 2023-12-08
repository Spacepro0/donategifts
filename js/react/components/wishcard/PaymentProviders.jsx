import { usePayPalScriptReducer, PayPalButtons } from '@paypal/react-paypal-js';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

function StripeCheckout({ wishCardId, agencyName, userDonation, totalCost }) {
	const [billingName, setBillingName] = useState('');
	const [cardError, setCardError] = useState('');
	const [showResult, setShowResult] = useState(false);
	const [loading, setLoading] = useState(false);

	const stripe = useStripe();
	const elements = useElements();

	function createPaymentIntent(stripe, card) {
		axios
			.post('/payment/createIntent', {
				wishCardId,
				agencyName,
				userDonation,
			})
			.then((res) => {
				payWithCard(stripe, card, res.clientSecret);
				setLoading(false);
			})
			.catch((err) => {
				console.error('Error:', err);
				new window.DG.Toast().show(
					'An error has occured while processing payment',
					window.DG.Toast.styleMap.danger,
				);
				setLoading(false);
			});
	}

	function payWithCard(stripe, card, clientSecret) {
		setLoading(true);
		stripe.confirmCardPayment(clientSecret, { payment_method: { card } }).then((res) => {
			if (res.error) {
				showError(res.error.message);
			} else {
				setLoading(false);
				setShowResult(true);
				window.location.replace(`/payment/success/${wishCardId}&${totalCost}`);
			}
		});
	}

	function showError(errorMsg) {
		setCardError(errorMsg);
		setTimeout(() => {
			setCardError('');
		}, 4000);
	}

	async function handleSubmit(e) {
		setLoading(true);
		e.preventDefault();

		if (!stripe || !elements) {
			new window.DG.Toast().show(
				'An error has occured while processing payment',
				window.DG.Toast.styleMap.danger,
			);
			setLoading(false);
			return;
		}

		const card = elements.getElement(CardElement);
		const result = await stripe.createToken(card);
		if (result.error) {
			setCardError(result.error.message);
			setLoading(false);
		} else {
			setCardError('');
			createPaymentIntent(stripe, card);
		}
	}

	function handleCardChange(e) {
		if (e.error) {
			setCardError(e.error.message);
		} else {
			setCardError('');
		}
	}

	return (
		<form id="payment-form" onSubmit={handleSubmit}>
			<div className="my-1">
				<label className="form-label" htmlFor="billingName">
					Name on card
				</label>
				<input
					className="form-control"
					id="billingName"
					autoComplete="ccname"
					autoCorrect="off"
					spellCheck="false"
					name="billingName"
					type="text"
					aria-invalid="false"
					value={billingName}
					onChange={(e) => setBillingName(e.target.value)}
				/>
			</div>
			<div className="pt-3">Card information</div>
			<CardElement
				className="form-control"
				options={{
					style: {
						base: {
							fontSize: '16px',
							color: '#00a19a',
						},
					},
				}}
				onChange={handleCardChange}
			/>
			<div className="error-text bold-text" id="card-errors" role="alert">
				{cardError}
			</div>
			<div className="mt-3 col mx-auto">
				<button
					className="btn btn-lg btn-primary w-100 center-elements"
					disabled={loading || showResult}
				>
					<span id="button-text" className={loading ? 'd-none' : ''}>
						Pay
					</span>
					<div
						className={
							'spinner-border spinner-border-sm text-white ms-1' +
							(!loading && ' d-none')
						}
						id="spinner"
						role="status"
					>
						<span className="visually-hidden">Loading...</span>
					</div>
				</button>
			</div>
			<div className={'result-message' + (!showResult && ' d-none')}>Payment succeeded</div>
			<div id="card-errors" role="alert"></div>
		</form>
	);
}

StripeCheckout.propTypes = {
	stripe: PropTypes.object,
	elements: PropTypes.object,
	wishCardId: PropTypes.string,
	agencyName: PropTypes.string,
	userDonation: PropTypes.number,
	totalCost: PropTypes.number,
};

function PayPalCheckout({ userId, wishcardId, agencyName, userDonation, totalAmount }) {
	const [{ isPending }] = usePayPalScriptReducer();

	const onCreateOrder = useCallback(
		(_data, actions) => {
			return actions.order.create({
				application_context: {
					shipping_preference: 'NO_SHIPPING',
				},
				purchase_units: [
					{
						reference_id: `${userId}%${wishcardId}%${userDonation}%${agencyName}`,
						amount: {
							value: parseFloat(totalAmount),
						},
					},
				],
			});
		},
		[totalAmount],
	);

	function onApproveOrder(_data, actions) {
		return actions.order.capture().then((_details) => {
			window.location.replace(`/payment/success/${wishcardId}&${totalAmount}`);
		});
	}

	return (
		<>
			{!isPending ? (
				<PayPalButtons
					style={{ textAlign: 'center', marginTop: '0.25em' }}
					createOrder={onCreateOrder}
					onApprove={onApproveOrder}
					forceReRender={[onCreateOrder]}
				/>
			) : (
				<div className="spinner-border spinner-border-sm text-white ms-1" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			)}
		</>
	);
}

PayPalCheckout.propTypes = {
	userId: PropTypes.string,
	wishcardId: PropTypes.string,
	agencyName: PropTypes.string,
	userDonation: PropTypes.number,
	totalAmount: PropTypes.number,
};

export { StripeCheckout, PayPalCheckout };
