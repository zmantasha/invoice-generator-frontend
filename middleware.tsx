import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
const authPaths=['/account/login', '/account/signup']
// This function can be marked `async` if using `await` inside
export default function middleware(request: NextRequest) {
   try {
   const isAuthenticated= request.cookies.get('isLoggedin')?.value
   const path= request.nextUrl.pathname;

   if(isAuthenticated){
    if(authPaths.includes(path)){
      return NextResponse.redirect(new URL('/user/myinvoice',request.url));
    }
  }
   
   if(!isAuthenticated && !authPaths.includes(path)){
    return NextResponse.redirect(new URL('/account/login', request.url))
   }
   return NextResponse.next()
   
   } catch (error) {
    console.error('Error occurred while checking authentication:', error);
    return NextResponse.error()
   }
  // return NextResponse.redirect(new URL('/home', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/user/:path*','/account/login', '/account/signup']
}