import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const cartItems = req.body;
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_options: [
          { shipping_rate: 'shr_1MEXh7EAjCBJt2VjMSqCjxC4' },
          { shipping_rate: 'shr_1MEXi3EAjCBJt2VjOHbQMaq0' }  
        ],
        line_items: cartItems.map((item) => {
            const img = item.image[0].asset._ref;

            //replace img link
            const newImage = img.replace('image-','https://cdn.sanity.io/images/7v5pnjln/production/').replace('-webp','.webp');

           return {
            price_data: {
                currency: 'aud',
                product_data: {
                    name: item.name,
                    images: [newImage]
                },
                unit_amount: item.price.toFixed * 100,
            },
            adjustable_quantity: {
                enabled: true,
                minimum: 1
            },
            quantity: item.quantity
           }
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}