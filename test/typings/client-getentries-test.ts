import { createClient, ContentfulClientApi, EntryCollection } from "contentful";

export async function testFn() {
    const client: ContentfulClientApi = createClient({
        space: "ezs1swce23xe",
        accessToken: "59fceefbb829023353b4961933b699896e2e5d92078f5e752aaee8d7c2612dfc"
    });
    const entries: EntryCollection<any> = await client.getEntries({
        limit: 1
    });
}

export const description = "client.getEntries() has correct typing";
