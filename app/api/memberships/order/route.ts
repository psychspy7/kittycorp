import { NextResponse } from "next/server";
export async function POST(){
  return NextResponse.json({error:"KITTY AI memberships have been discontinued."},{status:410,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
}
