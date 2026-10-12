import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
export const alt="KITTY CORP — websites, applications and independent technology";
export const size={width:1200,height:630};
export const contentType="image/png";
export default async function Image(){const logo=await readFile(join(process.cwd(),"public/brand/monogram-og-v1.png"));return new ImageResponse(<div style={{display:"flex",flexDirection:"column",width:"100%",height:"100%",background:"#f8f7f3",color:"#252720",padding:"66px 76px"}}><div style={{display:"flex",alignItems:"center",gap:18,fontSize:25,fontWeight:700,letterSpacing:2}}><img src={`data:image/png;base64,${logo.toString("base64")}`} alt="" width={56} height={56}/>KITTY CORP</div><div style={{display:"flex",flexDirection:"column",marginTop:70,fontSize:78,letterSpacing:-3,lineHeight:1.15,fontWeight:600}}><span>Your business.</span><span style={{color:"#806c47"}}>Better online.</span></div><div style={{display:"flex",justifyContent:"space-between",marginTop:"auto",borderTop:"1px solid #d5d1c4",paddingTop:24,fontSize:19,color:"#5e625a"}}><span>Websites · Web applications · Android apps</span><span>KITTY CORP</span></div></div>,size);}
