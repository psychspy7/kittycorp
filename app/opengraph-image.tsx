/* eslint-disable @next/next/no-img-element -- Satori supports data-URI image assets */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "KITTY CORP — Physical-World Intelligence. AI robotics, AgriYaan, UrjaYaan and Digital Solutions Studio. For a better tomorrow.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/brand/monogram-og-v1.png"));
  const logoData = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    <div style={{ display:"flex", flexDirection:"column", width:"100%", height:"100%", padding:"54px 68px", background:"#050814", color:"#f4f6ff", fontFamily:"Arial, sans-serif", position:"relative", overflow:"hidden" }}>
      <div style={{position:"absolute",inset:0,display:"flex",background:"radial-gradient(ellipse at 77% 38%, rgba(64,111,214,.30) 0%, transparent 36%), radial-gradient(ellipse at 18% 85%, rgba(47,195,211,.12) 0%, transparent 42%), linear-gradient(130deg,#050814 0%,#0a1024 55%,#060912 100%)"}}/>
      <div style={{position:"absolute",right:-110,top:45,width:520,height:520,borderRadius:260,border:"1px solid rgba(126,174,255,.20)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{width:410,height:410,borderRadius:205,border:"1px solid rgba(126,174,255,.16)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:300,height:300,borderRadius:150,background:"radial-gradient(circle at 35% 25%,#9bbcff 0%,#3e68aa 24%,#15294f 54%,#080d1c 75%)",boxShadow:"0 0 80px rgba(81,139,235,.24)",display:"flex"}}/>
        </div>
      </div>
      <div style={{position:"absolute",right:145,top:90,width:8,height:8,borderRadius:4,background:"#c7e6ff",boxShadow:"0 0 16px #9dd5ff"}}/>
      <div style={{position:"absolute",right:410,top:120,width:4,height:4,borderRadius:2,background:"#d7e5ff"}}/>
      <div style={{position:"absolute",right:70,bottom:110,width:5,height:5,borderRadius:3,background:"#9ce9f2"}}/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <img src={logoData} width={58} height={58}/>
          <div style={{display:"flex",flexDirection:"column"}}>
            <span style={{fontSize:25,fontWeight:800,letterSpacing:3}}>KITTY CORP</span>
            <span style={{fontSize:11,letterSpacing:2,color:"#9cc9f6",fontWeight:600}}>PHYSICAL-WORLD INTELLIGENCE</span>
          </div>
        </div>
        <div style={{border:"1px solid rgba(135,196,255,.3)",borderRadius:40,padding:"10px 16px",fontSize:12,letterSpacing:1.5,color:"#a9d9ff",background:"rgba(10,24,50,.5)"}}>INDIA · TECHNOLOGY & R&amp;D</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",marginTop:65,maxWidth:780,zIndex:1}}>
        <span style={{fontSize:66,lineHeight:1.02,letterSpacing:-2,fontWeight:800,color:"#fff"}}>Intelligence for</span>
        <span style={{fontSize:66,lineHeight:1.02,letterSpacing:-2,fontWeight:800,color:"#9edcff",marginTop:5}}>a better tomorrow.</span>
        <span style={{fontSize:22,lineHeight:1.4,color:"#c5cee1",marginTop:24,maxWidth:700}}>AI robotics, Physical-World Intelligence and digital engineering—building toward a future where technology moves beyond the screen.</span>
      </div>
      <div style={{display:"flex",gap:14,marginTop:30,zIndex:1}}>
        {["AGRIYAAN · AUTONOMOUS SYSTEMS","URJAAYAN · SOLAR INTELLIGENCE","KITTY AI · VISION & CONTROL"].map((item)=>(
          <div key={item} style={{border:"1px solid rgba(142,194,255,.24)",borderRadius:10,padding:"11px 14px",background:"rgba(12,21,43,.72)",fontSize:11,color:"#d8e6fa",letterSpacing:.7}}>{item}</div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"auto",paddingTop:18,borderTop:"1px solid rgba(140,174,222,.2)",fontSize:13,color:"#93a7c6",letterSpacing:1.3,zIndex:1}}>
        <span>INTELLIGENCE & ROBOTICS · DIGITAL SOLUTIONS STUDIO</span>
        <span style={{color:"#fff"}}>THEKITTYCORP.COM</span>
      </div>
    </div>,
    size,
  );
}
