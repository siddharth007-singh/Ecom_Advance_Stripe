// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";


// const publicRoutes = ["/auth/register", "/auth/login"];
// const superAdminRoutes = ["/super-admin", "/super-admin/:path*"];
// const userRoutes = ['/home']


// export async function middleware(request: NextRequest) {
//     //get access token from cookies
//     const accessToken = request.cookies.get("accessToken")?.value;

//     //get pathName also
//     const {pathname} = request.nextUrl;

//     if(accessToken){
//         try {
//             const { payload } = await jwtVerify(accessToken, new TextEncoder().encode(process.env.JWT_SECRET!));
//             const {role} = payload as {role: string};

//             //if user is trying to access public routes, redirect to home  (means user is already logged in)
//             if(publicRoutes.includes(pathname)){
//                 return NextResponse.redirect(new URL(role=== "SUPER_ADMIN" ? "/super-admin" : "/home", request.url));
//             }

//             if(role==="SUPER_ADMIN" && userRoutes.some((route) => pathname.startsWith(route))){
//                 return NextResponse.redirect(new URL("/super-admin", request.url));
//             }

//             if(role !== "SUPER_ADMIN" && superAdminRoutes.some((route) => pathname.startsWith(route))){
//                 return NextResponse.redirect(new URL("/home", request.url));
//             }

//             return NextResponse.next();

//         } catch (error) {
//             console.log("Error verifying token:", error);
//             // the refresh our access token
//             const refreshResponse = await fetch('http://localhost:3000/api/auth/refresh', {
//                 method: 'POST',
//                 credentials: 'include',
//             });

//             if (refreshResponse.ok) {
//                 const res = NextResponse.next();
//                 res.cookies.set("accessToken", refreshResponse.headers.get("Set-Cookie") || "");
//                 return res;
//             }
//             else{
//                 //if token is invalid or expired, redirect to login page
//                 const res = NextResponse.redirect(new URL("/auth/login", request.url));
//                 res.cookies.delete("accessToken");
//                 res.cookies.delete("refreshToken");
//                 return res;
//             }
//         }
//     }
//     //if user is trying to access a protected route, redirect to login
//     if(!publicRoutes.includes(pathname)){
//         return NextResponse.redirect(new URL("/auth/login", request.url));
//     }

//     return NextResponse.next();
// }


// export const config = {
//     matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };



import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = ["/auth/register", "/auth/login"];
const superAdminRoutes = ["/super-admin"];
const userRoutes = ["/home"];

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.JWT_SECRET!)
      );

      const { role } = payload as { role: string };

      if (publicRoutes.includes(pathname)) {
        return NextResponse.redirect(
          new URL(role === "SUPER_ADMIN" ? "/super-admin" : "/home", request.url)
        );
      }

      if (role === "SUPER_ADMIN" && userRoutes.some((r) => pathname.startsWith(r))) {
        return NextResponse.redirect(new URL("/super-admin", request.url));
      }

      if (role !== "SUPER_ADMIN" && superAdminRoutes.some((r) => pathname.startsWith(r))) {
        return NextResponse.redirect(new URL("/home", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.log("Error verifying token:", error);

      // 🔥 FIX: Call BACKEND refresh-token endpoint (3001)
      const refreshResponse = await fetch(
        "http://localhost:3000/api/auth/refresh-token",
        {
          method: "POST",
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
          credentials: "include",
        }
      );

      if (refreshResponse.ok) {
        const res = NextResponse.next();

        // 🔥 FIX: Forward Set-Cookie from backend to browser
        const setCookie = refreshResponse.headers.get("set-cookie");
        if (setCookie) {
          res.headers.append("set-cookie", setCookie);
        }

        return res;
      } else {
        const res = NextResponse.redirect(new URL("/auth/login", request.url));
        res.cookies.delete("accessToken");
        res.cookies.delete("refreshToken");
        return res;
      }
    }
  }

  if (!publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
