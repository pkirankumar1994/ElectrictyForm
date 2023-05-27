import { createClient } from "@sanity/client";

export const client = createClient({
    apiVersion: '2023-01-12',
    projectId: '50t8sv5b',
    dataset: 'production',
    token: process.env.REACT_APP_SANITY_TOKEN,
    useCdn: false,
});