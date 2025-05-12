import withAuth from "next-auth/middleware";

const allowedRoutes = ["/", "/sign-in", "/sign-up", "/verification", "/api-docs"]
 export default withAuth(
    function middleware(req) {
        console.log(req.nextauth.token)
    },
    {
        callbacks: {
            authorized: ({token, req}) => {
                const {pathname} = req.nextUrl
                if(allowedRoutes.some((route) => pathname.startsWith(route))) {
                    return true
                }
                return Boolean(token)
            },
        },
    }
)

 export const config = {
    matcher: ["/sign-in", "/sign-up", "/dashboard/:path*", "/", "/verification/:path*", "/api-docs", "/create-message", "/view-messages"]
}