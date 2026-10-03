import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { Products } from "@/components/kitty/home-sections";
import { companyProducts } from "@/lib/company-server";
import { publishedLaunches } from "@/lib/launches-server";
export const dynamic="force-dynamic";
export const metadata={title:"Products",description:"Explore SecretChat and KITTY CORP’s AI, robotics and software projects."};
export default async function ProductsPage(){const [products,launches]=await Promise.all([companyProducts(),publishedLaunches().catch(()=>[])]);return <><SiteHeader/><main id="main" className="directory-page"><div className="page-heading wrap"><span className="eyebrow">OUR PRODUCTS</span><h1>Software. Systems.<br/>Work in progress.</h1><p>Explore what’s available and what we’re developing. Each product has its own details and development notes.</p></div><Products products={products} launches={launches}/></main><SiteFooter/></>;}
