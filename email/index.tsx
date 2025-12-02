import {Resend} from 'resend';
import { render } from '@react-email/render';
import { SENDER_EMAIL, APP_NAME } from '@/lib/constants';
import { Order } from '@/types';
import PurchaseReceiptEmail from "./purchase-receipt";
import React from 'react';

require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({ order }: { order: Order;}) => {
    const emailHtml = await render(
        React.createElement(PurchaseReceiptEmail, { order })
    );
    
    await resend.emails.send({
        from: `${APP_NAME} <${SENDER_EMAIL}>`,
        to: order.user.email,
        subject: `Order Confirmation ${order.id}`,
        html: emailHtml
    })
}