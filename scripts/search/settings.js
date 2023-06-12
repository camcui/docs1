const page = require("./page");

// Algolia index settings.
//
// Changes to this file should be made with extreme care.
module.exports = {

    // Attributes for faceting are the properties to use for top-level filtering of results -- for
    // example, whether a given record is returned for a "Docs" query, "Registry" query, and so on.
    // https://www.algolia.com/doc/api-reference/api-parameters/attributesForFaceting/
    getAttributesForFaceting() {
        return [
            "searchable(section)",
        ];
    },

    // Synonyms allow us to surface content that may not directly match users' queries.
    // https://www.algolia.com/doc/api-reference/api-methods/save-synonyms/#save-synonyms
    getSynonyms() {
        return [
            [".NET", "dotnet"],
            ["aws", "aws classic"],
            ["azure", "azure native"],
            ["azuread", "azure ad", "azure active directory"],
            ["c#", "csharp"],
            ["cfn", "cloudformation"],
            ["config", "configuration"],
            ["crossguard", "pac", "policy as code"],
            ["crosswalk", "awsx"],
            ["f#", "fsharp"],
            ["gcp", "google cloud"],
            ["how-to guide", "how to guide", "example"],
            ["k8s", "kube", "kubernetes"],
            ["openid connect", "oidc"],
            ["org", "organization"],
            ["provider", "package"],
            ["pulumi service", "pulumi console", "pulumi cloud"],
            ["rbac", "role based access control"],
            ["saml", "sso"],
            ["stack reference", "stackreference"],
            ["tf", "terraform"],
            ["vm", "virtual machine"],
        ]
        .map((synonyms, i) => {
            return {
                objectID: `synonym-${i}`,
                type: "synonym",
                synonyms,
            };
        });
    },

    // Searchable attributes control the fields that Algolia uses for query matching, as well as how
    // relevant those fields are in relation to one another.
    //
    // The items in this list and their order are extremely significant. Do not adjust this list in
    // any way unless you fully understand the implications of your change *and* you have verified
    // the change on an index that isn't production.
    //
    // https://www.algolia.com/doc/guides/sending-and-managing-data/prepare-your-data/how-to/setting-searchable-attributes/#set-searchable-attributes-with-the-api
    getSearchableAttributes() {
        return [
            "unordered(title)",
            "keywords",
            "href",
            "unordered(tags)",
            "ancestors",
            "description",
            "section",
            "authors",
        ];
    },

    // Custom rankings are the attributes that Algolia uses for determining relative ranking --
    // specifically for breaking ties between records that rank similarly for text matching. Similar
    // to the above, order here is significant as well, so any changes here should be made with
    // equal care.
    //
    // https://www.algolia.com/doc/guides/managing-results/must-do/custom-ranking/how-to/configure-custom-ranking
    getCustomRanking() {
        return [

            // https://www.algolia.com/doc/guides/managing-results/must-do/custom-ranking/how-to/configure-custom-ranking/#configure-custom-ranking-with-the-api
            "desc(rank)",

            // https://www.algolia.com/doc/guides/managing-results/must-do/custom-ranking/how-to/boost-or-penalize-some-records/#using-the-api
            "desc(boosted)",
        ];
    },

    // Rules are explicit instructions that apply fine-grained control over how certain queries are handled.
    // https://www.algolia.com/doc/guides/managing-results/rules/rules-overview/
    getRules() {
        return [

            // When the query is for "cloud", deliver the Pulumi Cloud overview page as the top result.
            {
                objectID: "is-cloud",
                enabled: true,
                conditions: [
                    {
                        anchoring: "is",
                        pattern: "cloud",
                        alternatives: false,
                    },
                ],
                consequence: {
                    promote: [
                        {
                            objectIDs: [
                                page.getObjectID({ href: "/docs/pulumi-cloud/" }),
                            ],
                            position: 0,
                        },
                    ],
                    filterPromotes: true,
                },
            },
        ];
    },
};
