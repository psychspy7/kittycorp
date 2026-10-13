import {SiteHeader} from "@/components/kitty/site";
import {SiteFooter} from "@/components/kitty/site-footer";
import CustomerAccount from "@/components/kitty/customer-account";
import "./account.css";
export const metadata={title:"My account",robots:{index:false,follow:false}};
export default function Page(){return <><SiteHeader/><main id="main" className="public-page wrap account-page"><CustomerAccount/></main><SiteFooter/></>;}
