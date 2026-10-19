import { EarlyAccess } from "@/components/kitty/early-access";
import { pageMetadata } from "@/lib/site-metadata";
import { SiteHeader } from "@/components/kitty/site";
import { SiteFooter } from "@/components/kitty/site-footer";
import { Products } from "@/components/kitty/home-sections";
import { ShippedWork } from "@/components/kitty/credibility-sections";
import { companyProducts } from "@/lib/company-server";
import { publishedLaunches } from "@/lib/launches-server";
export const dynamic="force-dynamic";
export const metadata=pageMetadata('Products & shipped work','Explore KITTY CORP’s live websites, Android releases and products in development.','/products');
export default async function ProductsPage(){const [products,launches]=await Promise.all([companyProducts(),publishedLaunches().catch(()=>[])]);const experiments=products.filter(product=>!launches.some(launch=>launch.slug===product.slug));return <><SiteHeader/><main id="main" className="directory-page"><div className="page-heading wrap"><span className="eyebrow">OUR PRODUCTS & SHIPPED WORK</span><h1>Built. Released.<br/>Ready to explore.</h1><p>Visit the live websites, try the Android releases and read the details behind each product. Our work in development is here too.</p></div><ShippedWork launches={launches}/>{experiments.length>0&&<Products products={experiments} launches={[]}/>}<EarlyAccess/></main><SiteFooter/></>;}
