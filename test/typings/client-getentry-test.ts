import { createClient, ContentfulClientApi, Entry } from "contentful";

export async function testFn() {
    const client: ContentfulClientApi = createClient({
        space: "ezs1swce23xe",
        accessToken: "59fceefbb829023353b4961933b699896e2e5d92078f5e752aaee8d7c2612dfc"
    });
    const entry: Entry<any> = await client.getEntry("6KntaYXaHSyIw8M6eo26OK");
}

export const description = "client.getEntry() has correct typing";
