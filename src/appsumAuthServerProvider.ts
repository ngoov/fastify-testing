import { BaseClient, Issuer } from 'openid-client';

export interface OAuthClaims extends Record<string, any> {
    email: string;
    id: string;
    name: string;
    verified: boolean;
}

const createOpenIdClient = async (
    authServerUri: string
): Promise<BaseClient> => {
    const issuer = await Issuer.discover(authServerUri);
    return new issuer.Client({
        client_id: 'interactive.confidential.short',
        client_secret: 'secret',
        redirect_uris: ['http://localhost:3010/login/callback'],
        post_logout_redirect_uris: ['http://localhost:3010/logout/callback'],
        response_types: ['code'],
    });
};
export default createOpenIdClient;
// const createAppsumAuthServerProvider = <P extends OAuthClaims>(
//     authServerUri: string
// ): OAuthConfig<P> => ({
//     id: 'appsum',
//     clientId: 'interactive.confidential',
//     clientSecret: 'secret',
//     name: 'Appsum OAuth2 & OpenID Connect using Duende IdentityServer',
//     type: 'oauth',
//     wellKnown: `${authServerUri}.well-known/openid-configuration`,
//     authorization: { params: { scope: 'openid profile email' } },
//     checks: ['pkce', 'state'],
//     idToken: true,
//     profile(profile) {
//         return {
//             id: profile.sub,
//             name: profile.name,
//             email: profile.email,
//             image: null,
//         };
//     },
// });
// export default createAppsumAuthServerProvider;
