import sanityClient from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url';

//connect to Sanity
export const client = sanityClient({
    projectId: '7v5pnjln',
    dataset: 'production',
    apiVersion: '2022-12-07',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
})

//generate image urls from Sanity
const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);