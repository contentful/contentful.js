import { createClient, ContentfulClientApi } from "contentful";

export function testFn() {
    const client: ContentfulClientApi = createClient({
        space: "mySpace",
        accessToken: "myAccessToken"
    });
}

export const description = "createClient is correctly typed";
