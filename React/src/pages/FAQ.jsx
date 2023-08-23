import { Typography } from '@mui/material';
import React, { useState } from 'react';

//FAQItem is a React component that takes in props qn and ans
const FAQItem = ({ question, answer }) => {
	//default is not open
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className='faq-item'>
			<h4>
				<div
					className='faq-question'
					onClick={() => setIsOpen(!isOpen)}>
					{question}
				</div>
			</h4>
			{/* if isOpen is true, render div witih class faq-answer */}
			{isOpen && <div className='faq-answer'>{answer}</div>}
		</div>
	);
};

//FAQPage is also a React component
const FAQPage = () => {
	return (
		<div className='container'>
			<br></br>
			<Typography variant='h3'>Frequently Asked Questions</Typography>

			<br />

			<FAQItem
				question='How long does delivery take?'
				answer='Delivery typically takes 5-7 business days. Expedited shipping options are available at checkout.'
			/>
			<br />
			<FAQItem
				question='What is your return policy?'
				answer='We offer a 30-day return policy for items in their original condition. Please refer to our Returns page for more details.'
			/>
			<br />
			<FAQItem
				question='Do you ship internationally?'
				answer='Yes, we ship to most countries globally. Additional shipping fees may apply.'
			/>
			<br />
			<FAQItem
				question='How can I track my order?'
				answer="Once your order has been shipped, we will send you a tracking number via email. You can use this number to track your order's progress."
			/>
			<br />
			<FAQItem
				question='What payment methods do you accept'
				answer='We accept major credit cards (Visa, MasterCard, and American Express), PayPal, and Apple Pay.'
			/>
			<br />
			<FAQItem
				question='I received a faulty item. What should I do?'
				answer='We apologize for the inconvenience. Please contact our customer service team with a photo of the faulty item, and we will arrange a replacement or refund for you.'
			/>
			<br />
			<FAQItem
				question='Can I cancel or modify my order?'
				answer="If you wish to cancel or modify your order, please contact us immediately. Once the order has been dispatched, we won't be able to make any changes."
			/>
			<br />
		</div>
	);
};

export default FAQPage;
